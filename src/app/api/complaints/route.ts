/**
 * GET /api/complaints — List citizen complaints / grievances
 * POST /api/complaints — File a new citizen grievance
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

const complaintSchema = z.object({
  projectId: z.string().min(1),
  category: z.string().min(2),
  description: z.string().min(10),
  voiceNoteKey: z.string().optional(),
  photoKey: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const citizenId = searchParams.get('citizenId');
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    const where: Record<string, unknown> = {};
    if (citizenId) where.citizenId = citizenId;
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        include: {
          project: { select: { id: true, name: true, scheme: true, state: true, district: true } },
          citizen: { select: { id: true, name: true, phone: true, isAadhaarVerified: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.complaint.count({ where }),
    ]);

    return NextResponse.json({
      data: complaints,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('[GET /api/complaints]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = complaintSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { projectId, category, description, voiceNoteKey, photoKey } = parsed.data;
    const trackingId = `GRV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const complaint = await prisma.complaint.create({
      data: {
        trackingId,
        projectId,
        citizenId: session.user.id,
        category,
        description,
        voiceNoteKey,
        photoKey,
        status: 'RECEIVED',
        statusLabel: 'Received by Department (शिकायत प्राप्त हुई)',
      },
      include: {
        project: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ data: complaint }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/complaints]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

