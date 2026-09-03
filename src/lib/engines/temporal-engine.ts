/**
 * Temporal Engine — Timeline & Sequence Validation
 *
 * Validates whether evidence timestamps are consistent with the project
 * timeline and whether multiple evidence items follow a logical sequence.
 */

import { haversineDistance } from './geo-engine';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TemporalInput {
  capturedAt: Date | null;
  projectStartDate: Date;
  projectEndDate: Date;
  evidenceStage: 'before' | 'during' | 'after' | 'completion_doc';
  otherEvidence?: {
    capturedAt: Date;
    stage: string;
    lat?: number;
    lng?: number;
    id: string;
  }[];
}

export interface TemporalAnomaly {
  type: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface TemporalResult {
  score: number;
  isWithinProjectPeriod: boolean | null;
  sequenceValid: boolean | null;
  duplicateTimestamps: string[];
  impossibleTravel: {
    evidenceId: string;
    distanceKm: number;
    timeDiffMinutes: number;
  }[];
  anomalies: TemporalAnomaly[];
}

// ─── Stage ordering ──────────────────────────────────────────────────────────

const STAGE_ORDER: Record<string, number> = {
  before: 0,
  during: 1,
  after: 2,
  completion_doc: 3,
};

// ─── Engine ──────────────────────────────────────────────────────────────────

export async function analyzeTemporal(params: TemporalInput): Promise<TemporalResult> {
  const anomalies: TemporalAnomaly[] = [];
  const duplicateTimestamps: string[] = [];
  const impossibleTravel: TemporalResult['impossibleTravel'] = [];

  // No timestamp
  if (!params.capturedAt) {
    anomalies.push({
      type: 'TEMPORAL_MISMATCH',
      description: 'Evidence has no capture timestamp — temporal consistency cannot be verified.',
      severity: 'HIGH',
    });
    return {
      score: 0,
      isWithinProjectPeriod: null,
      sequenceValid: null,
      duplicateTimestamps: [],
      impossibleTravel: [],
      anomalies,
    };
  }

  const capturedMs = params.capturedAt.getTime();

  // Date range check
  const isWithinProjectPeriod =
    capturedMs >= params.projectStartDate.getTime() &&
    capturedMs <= params.projectEndDate.getTime();

  if (!isWithinProjectPeriod) {
    const capturedStr = params.capturedAt.toISOString().split('T')[0];
    const startStr = params.projectStartDate.toISOString().split('T')[0];
    const endStr = params.projectEndDate.toISOString().split('T')[0];
    anomalies.push({
      type: 'TEMPORAL_MISMATCH',
      description: `Capture date (${capturedStr}) falls outside project period (${startStr} to ${endStr}).`,
      severity: 'HIGH',
    });
  }

  // Sequence validation + duplicate timestamps + impossible travel
  let sequenceValid: boolean | null = null;

  if (params.otherEvidence && params.otherEvidence.length > 0) {
    const currentOrder = STAGE_ORDER[params.evidenceStage] ?? 1;

    for (const other of params.otherEvidence) {
      const otherMs = other.capturedAt.getTime();
      const otherOrder = STAGE_ORDER[other.stage] ?? 1;

      // Duplicate timestamp (within 1 second)
      if (Math.abs(capturedMs - otherMs) < 1000) {
        duplicateTimestamps.push(other.id);
      }

      // Sequence: if this evidence is a later stage, it should have a later timestamp
      if (currentOrder > otherOrder && capturedMs < otherMs) {
        sequenceValid = false;
        anomalies.push({
          type: 'TEMPORAL_MISMATCH',
          description: `"${params.evidenceStage}" evidence was captured before "${other.stage}" evidence (${other.id}) — sequence is illogical.`,
          severity: 'MEDIUM',
        });
      } else if (sequenceValid === null) {
        sequenceValid = true;
      }

      // Impossible travel: >100km in <30 minutes
      if (other.lat != null && other.lng != null) {
        const timeDiffMs = Math.abs(capturedMs - otherMs);
        const timeDiffMinutes = timeDiffMs / 60_000;

        if (timeDiffMinutes > 0 && timeDiffMinutes < 30) {
          // We need current evidence lat/lng — not available in TemporalInput directly
          // This check is only possible if other evidence has location data
          // For now, track it if both locations are in otherEvidence
        }
      }
    }

    // Duplicate timestamp anomaly
    if (duplicateTimestamps.length > 0) {
      anomalies.push({
        type: 'TEMPORAL_MISMATCH',
        description: `Evidence shares identical timestamp (±1s) with ${duplicateTimestamps.length} other submission(s): ${duplicateTimestamps.join(', ')}.`,
        severity: 'MEDIUM',
      });
    }

    // Cross-check impossible travel between OTHER evidence pairs
    // (more useful in the full pipeline where we have all locations)
    for (let i = 0; i < params.otherEvidence.length; i++) {
      const a = params.otherEvidence[i];
      if (a.lat == null || a.lng == null) continue;

      for (let j = i + 1; j < params.otherEvidence.length; j++) {
        const b = params.otherEvidence[j];
        if (b.lat == null || b.lng == null) continue;

        const timeDiffMs = Math.abs(a.capturedAt.getTime() - b.capturedAt.getTime());
        const timeDiffMinutes = timeDiffMs / 60_000;
        const distM = haversineDistance(a.lat, a.lng, b.lat, b.lng);
        const distKm = distM / 1000;

        if (timeDiffMinutes > 0 && timeDiffMinutes < 30 && distKm > 100) {
          impossibleTravel.push({
            evidenceId: b.id,
            distanceKm: Math.round(distKm * 10) / 10,
            timeDiffMinutes: Math.round(timeDiffMinutes),
          });
          anomalies.push({
            type: 'IMPOSSIBLE_TRAVEL',
            description: `Evidence ${a.id} and ${b.id} are ${distKm.toFixed(1)} km apart but captured only ${Math.round(timeDiffMinutes)} minutes apart — physically impossible.`,
            severity: 'CRITICAL',
          });
        }
      }
    }
  }

  // Score calculation
  let score = 100;

  if (!isWithinProjectPeriod) score -= 40;
  if (sequenceValid === false) score -= 25;
  if (duplicateTimestamps.length > 0) score -= 15;
  if (impossibleTravel.length > 0) score -= 30;

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    isWithinProjectPeriod,
    sequenceValid,
    duplicateTimestamps,
    impossibleTravel,
    anomalies,
  };
}
