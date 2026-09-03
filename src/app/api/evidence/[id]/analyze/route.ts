/**
 * POST /api/evidence/[id]/analyze — Re-trigger analysis pipeline
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { enqueueEvidenceAnalysis } from '@/lib/workers/evidence-pipeline';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['REVIEWER', 'PROGRAM_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;
    const evidence = await prisma.evidence.findUnique({ where: { id } });
    if (!evidence) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 });
    }

    try {
      const jobId = await enqueueEvidenceAnalysis(id, session.user.id);
      return NextResponse.json(
        { data: { message: 'Analysis re-queued', jobId } },
        { status: 202 }
      );
    } catch {
      return NextResponse.json(
        { error: 'Analysis queue unavailable — try again later' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('[POST /api/evidence/[id]/analyze]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
