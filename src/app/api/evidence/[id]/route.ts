/**
 * GET /api/evidence/[id] — Full evidence detail with analyses, anomalies, reviews
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const evidence = await prisma.evidence.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true, scheme: true, district: true, state: true, centroidLat: true, centroidLng: true, geofenceRadiusMeter: true } },
        uploadedBy: { select: { id: true, name: true, role: true } },
        analyses: { orderBy: { createdAt: 'desc' }, take: 1 },
        anomalies: { orderBy: { severity: 'desc' } },
        reviews: {
          include: { reviewer: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'desc' },
        },
        matches: {
          include: { matchedEvidence: { select: { id: true, projectId: true, objectKey: true } } },
        },
        matchedBy: {
          include: { sourceEvidence: { select: { id: true, projectId: true, objectKey: true } } },
        },
      },
    });

    if (!evidence) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 });
    }

    return NextResponse.json({ data: evidence });
  } catch (error) {
    console.error('[GET /api/evidence/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
