/**
 * GET /api/projects/[id] — Detailed project dossier with activities, claims, and evidence
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        activities: {
          include: {
            claims: true,
            evidence: {
              select: { id: true, stage: true, status: true, integrityScore: true },
            },
          },
        },
        evidence: {
          include: {
            uploadedBy: { select: { id: true, name: true } },
            analyses: { orderBy: { createdAt: 'desc' }, take: 1 },
            anomalies: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        complaints: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { evidence: true, complaints: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const flaggedCount = project.evidence.filter((e) => e.status === 'FLAGGED').length;
    const scores = project.evidence
      .map((e) => e.integrityScore)
      .filter((s): s is number => s !== null);
    const averageIntegrity = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 85;

    return NextResponse.json({
      data: {
        project: {
          ...project,
          centroid: {
            lat: Number(project.centroidLat),
            lng: Number(project.centroidLng),
          },
          budgetInr: project.budgetInr ? Number(project.budgetInr) : null,
        },
        summary: {
          totalSubmissions: project._count.evidence,
          flaggedCount,
          averageIntegrity,
          complaintsCount: project._count.complaints,
        },
      },
    });
  } catch (error) {
    console.error('[GET /api/projects/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

