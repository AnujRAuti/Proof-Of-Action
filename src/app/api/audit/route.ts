/**
 * GET /api/audit — Paginated immutable audit trail events
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const evidenceId = searchParams.get('evidenceId');
    const actorId = searchParams.get('actorId');
    const action = searchParams.get('action');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25')));

    const where: Record<string, unknown> = {};
    if (evidenceId) where.evidenceId = evidenceId;
    if (actorId) where.actorId = actorId;
    if (action) where.action = action;

    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) dateFilter.gte = new Date(from);
      if (to) dateFilter.lte = new Date(to);
      where.createdAt = dateFilter;
    }

    const [events, total] = await Promise.all([
      prisma.auditEvent.findMany({
        where,
        include: {
          actor: { select: { id: true, name: true, role: true, department: true } },
          evidence: {
            select: { id: true, projectId: true, project: { select: { name: true, scheme: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditEvent.count({ where }),
    ]);

    return NextResponse.json({
      data: events,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('[GET /api/audit]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

