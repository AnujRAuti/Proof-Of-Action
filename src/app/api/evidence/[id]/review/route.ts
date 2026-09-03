/**
 * POST /api/evidence/[id]/review — Submit review decision
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

const reviewSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT', 'FLAG', 'INSPECTION_REQUESTED', 'OVERRIDE']),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  overrideScore: z.number().int().min(0).max(100).optional(),
  overrideRisk: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
});

const STATUS_MAP: Record<string, string> = {
  APPROVE: 'APPROVED',
  REJECT: 'REJECTED',
  FLAG: 'FLAGGED',
  INSPECTION_REQUESTED: 'FLAGGED',
  OVERRIDE: 'OVERRIDDEN',
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = session.user.role;
    if (!['REVIEWER', 'PROGRAM_ADMIN', 'AUDITOR'].includes(role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const evidence = await prisma.evidence.findUnique({ where: { id } });
    if (!evidence) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 });
    }

    const { action, reason, overrideScore, overrideRisk } = parsed.data;
    const newStatus = STATUS_MAP[action] || 'PENDING';
    const previousStatus = evidence.status;

    // Create review decision
    const review = await prisma.reviewDecision.create({
      data: {
        evidenceId: id,
        reviewerId: session.user.id,
        action,
        reason,
      },
    });

    // Update evidence status
    const updateData: Record<string, unknown> = { status: newStatus };
    if (action === 'OVERRIDE') {
      if (overrideScore != null) updateData.integrityScore = overrideScore;
      if (overrideRisk) updateData.riskLevel = overrideRisk;
    }

    await prisma.evidence.update({ where: { id }, data: updateData });

    // Audit event
    await prisma.auditEvent.create({
      data: {
        evidenceId: id,
        actorId: session.user.id,
        action,
        previousState: previousStatus,
        newState: newStatus,
        reason,
        metadata: action === 'OVERRIDE' ? JSON.stringify({ overrideScore, overrideRisk }) : null,
      },
    });

    return NextResponse.json({ data: review }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/evidence/[id]/review]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
