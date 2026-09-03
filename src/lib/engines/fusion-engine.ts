/**
 * Fusion Engine — Weighted Multi-Signal Score Combination
 *
 * Combines individual engine scores into a final Evidence Integrity Score
 * and determines the Risk Level. This is the core differentiator of PoA.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FusionInput {
  gpsScore: number;
  temporalScore: number;
  duplicateRisk: number;      // 0-100, higher = worse (inverted before fusion)
  visualScore: number;        // default 80 for MVP
  authenticityScore: number;  // from metadata manipulation risk (inverted)
  claimMatch: number;         // default 75 for MVP
  completeness: number;
}

export interface ScoreBreakdown {
  weight: number;
  score: number;
  weighted: number;
}

export interface FusionResult {
  integrityScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  breakdown: Record<string, ScoreBreakdown>;
}

// ─── Configurable weights ────────────────────────────────────────────────────

const WEIGHTS: Record<string, number> = {
  gps: 0.15,
  temporal: 0.10,
  duplicate: 0.20,
  visual: 0.20,
  authenticity: 0.15,
  claimMatch: 0.15,
  completeness: 0.05,
};

// ─── Engine ──────────────────────────────────────────────────────────────────

export function fuseScores(params: FusionInput): FusionResult {
  // Invert risk scores: duplicate risk and manipulation risk are
  // "higher = worse", so we convert them to "higher = better" for fusion
  const scores: Record<string, number> = {
    gps: params.gpsScore,
    temporal: params.temporalScore,
    duplicate: 100 - params.duplicateRisk,
    visual: params.visualScore,
    authenticity: 100 - params.authenticityScore,
    claimMatch: params.claimMatch,
    completeness: params.completeness,
  };

  const breakdown: Record<string, ScoreBreakdown> = {};
  let integrityScore = 0;

  for (const [signal, weight] of Object.entries(WEIGHTS)) {
    const score = Math.max(0, Math.min(100, scores[signal] ?? 0));
    const weighted = score * weight;
    breakdown[signal] = { weight, score, weighted };
    integrityScore += weighted;
  }

  integrityScore = Math.max(0, Math.min(100, Math.round(integrityScore)));

  // Risk level determination
  let riskLevel: FusionResult['riskLevel'];
  if (integrityScore >= 85) riskLevel = 'LOW';
  else if (integrityScore >= 65) riskLevel = 'MEDIUM';
  else if (integrityScore >= 40) riskLevel = 'HIGH';
  else riskLevel = 'CRITICAL';

  return { integrityScore, riskLevel, breakdown };
}
