/**
 * GET /api/projects — List projects with evidence summary statistics
 * POST /api/projects — Create a new project with geofence bounds
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

const projectCreateSchema = z.object({
  id: z.string().min(3),
  name: z.string().min(3),
  scheme: z.string().min(2),
  ministry: z.string().optional(),
  state: z.string().min(2),
  district: z.string().min(2),
  block: z.string().min(2),
  budgetInr: z.number().nonnegative().optional(),
  contractor: z.string().optional(),
  centroidLat: z.number().min(-90).max(90),
  centroidLng: z.number().min(-180).max(180),
  geofenceRadiusMeter: z.number().int().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  imageUrl: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const district = searchParams.get('district');
    const scheme = searchParams.get('scheme');
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    const where: Record<string, unknown> = {};
    if (state) where.state = state;
    if (district) where.district = district;
    if (scheme) where.scheme = scheme;
    if (status) where.status = status;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          _count: {
            select: {
              evidence: true,
              activities: true,
              complaints: true,
            },
          },
          evidence: {
            select: {
              status: true,
              integrityScore: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    const formatted = projects.map((p) => {
      const flaggedCount = p.evidence.filter((e) => e.status === 'FLAGGED').length;
      const scores = p.evidence
        .map((e) => e.integrityScore)
        .filter((s): s is number => s !== null);
      const avgScore = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 85;

      return {
        id: p.id,
        name: p.name,
        scheme: p.scheme,
        ministry: p.ministry,
        state: p.state,
        district: p.district,
        block: p.block,
        budgetInr: p.budgetInr ? Number(p.budgetInr) : null,
        contractor: p.contractor,
        centroid: { lat: Number(p.centroidLat), lng: Number(p.centroidLng) },
        geofenceRadiusMeters: p.geofenceRadiusMeter,
        startDate: p.startDate.toISOString(),
        endDate: p.endDate.toISOString(),
        status: p.status,
        imageUrl: p.imageUrl || '/images/projects/road-pothole.jpg',
        evidenceHealthScore: avgScore,
        totalSubmissions: p._count.evidence,
        flaggedCount,
      };
    });

    return NextResponse.json({
      data: formatted,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('[GET /api/projects]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['REVIEWER', 'PROGRAM_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = projectCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const project = await prisma.project.create({
      data: {
        id: data.id,
        name: data.name,
        scheme: data.scheme,
        ministry: data.ministry,
        state: data.state,
        district: data.district,
        block: data.block,
        budgetInr: data.budgetInr,
        contractor: data.contractor,
        centroidLat: data.centroidLat,
        centroidLng: data.centroidLng,
        geofenceRadiusMeter: data.geofenceRadiusMeter,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        imageUrl: data.imageUrl,
      },
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/projects]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

