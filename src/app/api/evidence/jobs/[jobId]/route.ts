/**
 * GET /api/evidence/jobs/[jobId] — Check processing status of an evidence item
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    // Check if an analysis result with this jobId already exists
    const analysis = await prisma.analysisResult.findFirst({
      where: { jobId },
      include: {
        evidence: {
          select: {
            id: true,
            status: true,
            integrityScore: true,
            riskLevel: true,
            projectId: true,
          },
        },
      },
    });

    if (analysis) {
      return NextResponse.json({
        data: {
          jobId,
          status: 'COMPLETED',
          evidenceId: analysis.evidenceId,
          evidence: analysis.evidence,
          scores: {
            integrityScore: analysis.overallIntegrity,
            riskScore: analysis.riskScore,
            gpsScore: analysis.gpsScore,
            temporalScore: analysis.temporalScore,
            duplicateRisk: analysis.duplicateRisk,
            metadataScore: analysis.metadataScore,
          },
          explanations: analysis.explanations,
          createdAt: analysis.createdAt,
        },
      });
    }

    return NextResponse.json({
      data: {
        jobId,
        status: 'PROCESSING',
        steps: [
          'VALIDATE_UPLOAD',
          'EXTRACT_METADATA',
          'GEO_CHECK',
          'TEMPORAL_CHECK',
          'DUPLICATE_CHECK',
          'FUSION_SCORING',
        ],
      },
    });
  } catch (error) {
    console.error('[GET /api/evidence/jobs/[jobId]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
