/**
 * Duplicate Engine — SHA-256 & pHash Near-Duplicate Detection
 *
 * Detects exact duplicates (SHA-256) and near-duplicates (perceptual hash)
 * across the evidence database, including cross-project matches.
 */

import { prisma } from '@/lib/db';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DuplicateInput {
  sha256: string;
  pHash: string | null;
  evidenceId: string;
  projectId: string;
}

export interface DuplicateAnomaly {
  type: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface DuplicateResult {
  riskScore: number;
  exactDuplicates: { evidenceId: string; projectId: string }[];
  nearDuplicates: { evidenceId: string; projectId: string; similarity: number; method: string }[];
  crossProjectMatches: { evidenceId: string; projectId: string; similarity: number }[];
  anomalies: DuplicateAnomaly[];
}

// ─── Hamming distance for hex-encoded pHash ──────────────────────────────────

export function hammingDistance(hash1: string, hash2: string): number {
  if (hash1.length !== hash2.length) return 1;
  let diff = 0;
  let total = 0;
  for (let i = 0; i < hash1.length; i++) {
    const a = parseInt(hash1[i], 16);
    const b = parseInt(hash2[i], 16);
    let xor = a ^ b;
    while (xor) {
      diff += xor & 1;
      xor >>= 1;
      total++;
    }
    total += 4 - (total % 4 === 0 ? 4 : total % 4); // each hex = 4 bits
  }
  // Correct total to hash length * 4 bits
  const totalBits = hash1.length * 4;
  return 1 - diff / totalBits; // 1.0 = identical, 0.0 = completely different
}

/** Convert hamming similarity (0-1) to percentage (0-100). */
function similarityPercent(hash1: string, hash2: string): number {
  return Math.round(hammingDistance(hash1, hash2) * 1000) / 10;
}

// ─── Engine ──────────────────────────────────────────────────────────────────

export async function analyzeDuplicates(params: DuplicateInput): Promise<DuplicateResult> {
  const anomalies: DuplicateAnomaly[] = [];
  const exactDuplicates: DuplicateResult['exactDuplicates'] = [];
  const nearDuplicates: DuplicateResult['nearDuplicates'] = [];
  const crossProjectMatches: DuplicateResult['crossProjectMatches'] = [];

  try {
    // 1. SHA-256 exact match
    const exactMatches = await prisma.evidence.findMany({
      where: {
        sha256: params.sha256,
        id: { not: params.evidenceId },
      },
      select: { id: true, projectId: true },
    });

    for (const match of exactMatches) {
      exactDuplicates.push({ evidenceId: match.id, projectId: match.projectId });

      const isCrossProject = match.projectId !== params.projectId;
      if (isCrossProject) {
        crossProjectMatches.push({
          evidenceId: match.id,
          projectId: match.projectId,
          similarity: 100,
        });
        anomalies.push({
          type: 'CROSS_PROJECT_DUPLICATE',
          description: `Exact duplicate (SHA-256) found in different project ${match.projectId} (evidence ${match.id}).`,
          severity: 'CRITICAL',
        });
      } else {
        anomalies.push({
          type: 'DUPLICATE_EVIDENCE',
          description: `Exact duplicate (SHA-256) found: evidence ${match.id} in same project.`,
          severity: 'HIGH',
        });
      }
    }

    // 2. pHash near-duplicate search
    if (params.pHash) {
      const candidates = await prisma.evidence.findMany({
        where: {
          id: { not: params.evidenceId },
          pHash: { not: null },
        },
        select: { id: true, projectId: true, pHash: true },
        take: 500, // Limit for performance
      });

      for (const candidate of candidates) {
        if (!candidate.pHash) continue;
        const sim = similarityPercent(params.pHash, candidate.pHash);

        if (sim >= 85) {
          nearDuplicates.push({
            evidenceId: candidate.id,
            projectId: candidate.projectId,
            similarity: sim,
            method: 'pHash',
          });

          const isCrossProject = candidate.projectId !== params.projectId;
          if (isCrossProject) {
            crossProjectMatches.push({
              evidenceId: candidate.id,
              projectId: candidate.projectId,
              similarity: sim,
            });
          }

          if (sim >= 95) {
            anomalies.push({
              type: isCrossProject ? 'CROSS_PROJECT_DUPLICATE' : 'DUPLICATE_EVIDENCE',
              description: `${sim}% perceptual similarity with evidence ${candidate.id}${isCrossProject ? ` from project ${candidate.projectId}` : ''}.`,
              severity: isCrossProject ? 'CRITICAL' : 'HIGH',
            });
          } else if (sim >= 90) {
            anomalies.push({
              type: 'DUPLICATE_EVIDENCE',
              description: `${sim}% perceptual similarity with evidence ${candidate.id} — may be a resized/compressed copy.`,
              severity: 'MEDIUM',
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('[duplicate-engine] Database query error:', error);
  }

  // Risk score: 0 = no risk, 100 = definite duplicate
  let riskScore = 0;
  if (exactDuplicates.length > 0) riskScore = 100;
  else if (nearDuplicates.length > 0) {
    const maxSim = Math.max(...nearDuplicates.map((d) => d.similarity));
    riskScore = Math.round(maxSim);
  }
  if (crossProjectMatches.length > 0) riskScore = Math.max(riskScore, 95);

  return { riskScore, exactDuplicates, nearDuplicates, crossProjectMatches, anomalies };
}
