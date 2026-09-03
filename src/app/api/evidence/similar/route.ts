/**
 * POST /api/evidence/similar — Search for visually/perceptually similar evidence
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { hammingDistance } from '@/lib/engines/duplicate-engine';

const searchSchema = z.object({
  evidenceId: z.string().optional(),
  sha256: z.string().optional(),
  pHash: z.string().optional(),
}).refine(
  (data) => data.evidenceId || data.sha256 || data.pHash,
  { message: 'At least one of evidenceId, sha256, or pHash must be provided' }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = searchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    let targetSha = parsed.data.sha256;
    let targetPHash = parsed.data.pHash;
    let currentEvidenceId = parsed.data.evidenceId;
    let currentProjectId = '';

    if (currentEvidenceId) {
      const ev = await prisma.evidence.findUnique({
        where: { id: currentEvidenceId },
        select: { id: true, sha256: true, pHash: true, projectId: true },
      });
      if (ev) {
        targetSha = targetSha || ev.sha256;
        targetPHash = targetPHash || ev.pHash || undefined;
        currentProjectId = ev.projectId;
      }
    }

    const exactMatches: Array<{
      evidenceId: string;
      projectId: string;
      similarity: number;
      method: string;
    }> = [];

    const nearMatches: Array<{
      evidenceId: string;
      projectId: string;
      similarity: number;
      method: string;
    }> = [];

    const crossProjectMatches: Array<{
      evidenceId: string;
      projectId: string;
      similarity: number;
      method: string;
    }> = [];

    // 1. Exact SHA-256 match
    if (targetSha) {
      const shaMatches = await prisma.evidence.findMany({
        where: {
          sha256: targetSha,
          ...(currentEvidenceId ? { id: { not: currentEvidenceId } } : {}),
        },
        select: { id: true, projectId: true },
      });

      for (const m of shaMatches) {
        const item = {
          evidenceId: m.id,
          projectId: m.projectId,
          similarity: 100,
          method: 'sha256_exact',
        };
        exactMatches.push(item);
        if (currentProjectId && m.projectId !== currentProjectId) {
          crossProjectMatches.push(item);
        }
      }
    }

    // 2. pHash similarity search
    if (targetPHash) {
      const candidates = await prisma.evidence.findMany({
        where: {
          pHash: { not: null },
          ...(currentEvidenceId ? { id: { not: currentEvidenceId } } : {}),
        },
        select: { id: true, projectId: true, pHash: true },
        take: 300,
      });

      for (const cand of candidates) {
        if (!cand.pHash) continue;
        const sim = Math.round(hammingDistance(targetPHash, cand.pHash) * 1000) / 10;
        if (sim >= 85) {
          const matchItem = {
            evidenceId: cand.id,
            projectId: cand.projectId,
            similarity: sim,
            method: 'pHash',
          };
          nearMatches.push(matchItem);
          if (currentProjectId && cand.projectId !== currentProjectId) {
            crossProjectMatches.push(matchItem);
          }
        }
      }
    }

    return NextResponse.json({
      data: {
        exactMatches,
        nearMatches: nearMatches.sort((a, b) => b.similarity - a.similarity),
        crossProjectMatches: crossProjectMatches.sort((a, b) => b.similarity - a.similarity),
      },
    });
  } catch (error) {
    console.error('[POST /api/evidence/similar]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

