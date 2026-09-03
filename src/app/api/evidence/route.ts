/**
 * GET /api/evidence — Paginated evidence list with filters
 * POST /api/evidence — Create evidence record + enqueue analysis
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import crypto from 'crypto';
import path from 'path';
import sharp from 'sharp';
import type { Metadata as SharpMetadata } from 'sharp';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { deleteEvidence, generateObjectKey, uploadEvidence as storeEvidence } from '@/lib/storage';
import { enqueueEvidenceAnalysis } from '@/lib/workers/evidence-pipeline';

const uploadMetadataSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  stage: z.enum(['before', 'during', 'after', 'completion_doc']).optional().default('after'),
  capturedAt: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  gpsAccuracyMeters: z.coerce.number().positive().optional(),
});
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const projectId = searchParams.get('projectId');
    const riskLevel = searchParams.get('riskLevel');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (projectId) where.projectId = projectId;
    if (riskLevel) where.riskLevel = riskLevel;

    const [items, total] = await Promise.all([
      prisma.evidence.findMany({
        where,
        include: {
          project: { select: { id: true, name: true, scheme: true } },
          uploadedBy: { select: { id: true, name: true } },
          _count: { select: { anomalies: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.evidence.count({ where }),
    ]);

    return NextResponse.json({
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('[GET /api/evidence]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;

    // If no NextAuth session, try reading header or fallback to default supervisor
    if (!userId) {
      const defaultUser = await prisma.user.findFirst({
        where: { role: 'SUPERVISOR' },
        select: { id: true },
      });
      userId = defaultUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const formData = await request.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: 'No evidence image was provided.' }, { status: 400 });
    }

    const file = formData.get('file');
    if (!(file instanceof File) || file.size <= 0) {
      return NextResponse.json({ error: 'No evidence image was provided.' }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'Invalid image file. Please provide an image up to 10 MB.' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    let imageMetadata: SharpMetadata;
    try {
      imageMetadata = await sharp(fileBuffer).metadata();
    } catch {
      return NextResponse.json(
        { error: 'Invalid image file.' },
        { status: 400 }
      );
    }

    const supportedFormats = new Set(['jpeg', 'png', 'webp']);
    if (!imageMetadata.format || !supportedFormats.has(imageMetadata.format) || fileBuffer.length > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: 'Invalid image file. Please provide a JPEG, PNG, or WebP image up to 10 MB.' },
        { status: 400 }
      );
    }

    const parsed = uploadMetadataSchema.safeParse({
      projectId: formData.get('projectId'),
      stage: formData.get('stage') || undefined,
      capturedAt: formData.get('capturedAt') || undefined,
      latitude: formData.get('latitude') || undefined,
      longitude: formData.get('longitude') || undefined,
      gpsAccuracyMeters: formData.get('gpsAccuracyMeters') || undefined,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const evidenceId = `EVD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const fileName = path.basename(file.name || `evidence.${imageMetadata.format}`);
    const objectKey = generateObjectKey(data.projectId, evidenceId, fileName);
    const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    await storeEvidence({
      key: objectKey,
      body: fileBuffer,
      contentType: `image/${imageMetadata.format}`,
      metadata: { originalFilename: fileName },
    });

    let capturedDate: Date | null = null;
    if (data.capturedAt) {
      const d = new Date(data.capturedAt);
      if (!isNaN(d.getTime())) {
        capturedDate = d;
      }
    }

    let evidence;
    try {
      evidence = await prisma.evidence.create({
        data: {
          id: evidenceId,
          projectId: data.projectId,
          uploadedById: userId,
          objectKey,
          mimeType: `image/${imageMetadata.format}`,
          sizeBytes: fileBuffer.length,
          sha256,
          stage: data.stage,
          capturedAt: capturedDate,
          latitude: data.latitude,
          longitude: data.longitude,
          gpsAccuracyM: data.gpsAccuracyMeters,
          status: 'PENDING',
        },
      });
    } catch (error) {
      await deleteEvidence(objectKey).catch(() => undefined);
      throw error;
    }

    // Enqueue for async analysis (gracefully handles when Redis is offline)
    try {
      await enqueueEvidenceAnalysis(evidenceId, userId);
    } catch {
      console.warn('[POST /api/evidence] Redis queue unavailable — analysis deferred');
    }

    // Audit event
    try {
      await prisma.auditEvent.create({
        data: {
          evidenceId,
          actorId: userId,
          action: 'UPLOAD',
          newState: 'PENDING',
          reason: `Evidence uploaded: ${fileName}`,
        },
      });
    } catch {}

    return NextResponse.json({ data: { id: evidence.id, status: evidence.status } }, { status: 202 });
  } catch (error) {
    console.error('[POST /api/evidence]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
