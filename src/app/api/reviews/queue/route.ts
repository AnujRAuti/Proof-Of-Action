/**
 * GET /api/reviews/queue — Review queue of pending and flagged evidence items
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const scheme = searchParams.get('scheme');
    const riskLevel = searchParams.get('riskLevel');
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25')));

    const where: Record<string, unknown> = {
      status: status ? status : { in: ['PENDING', 'FLAGGED', 'OVERRIDDEN'] },
    };

    if (scheme) {
      where.project = { scheme };
    }
    if (riskLevel) {
      where.riskLevel = riskLevel;
    }

    const [items, total] = await Promise.all([
      prisma.evidence.findMany({
        where,
        include: {
          project: {
            select: { id: true, name: true, scheme: true, state: true, district: true },
          },
          uploadedBy: {
            select: { id: true, name: true, role: true, department: true },
          },
          anomalies: {
            select: { id: true, type: true, severity: true, title: true, description: true },
          },
          analyses: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              overallIntegrity: true,
              riskScore: true,
              explanations: true,
              duplicateRisk: true,
              gpsScore: true,
              temporalScore: true,
              metadataScore: true,
            },
          },
        },
        orderBy: [
          { riskLevel: 'desc' },
          { createdAt: 'asc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.evidence.count({ where }),
    ]);

    return NextResponse.json({
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[GET /api/reviews/queue]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

