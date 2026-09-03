/**
 * Explainability Engine — Human-Readable Anomaly Explanations
 *
 * Transforms engine outputs into natural language explanations,
 * a summary, and a recommended human-review action.
 */

import type { GeoResult } from './geo-engine';
import type { TemporalResult } from './temporal-engine';
import type { DuplicateResult } from './duplicate-engine';
import type { MetadataResult } from './metadata-engine';
import type { FusionResult } from './fusion-engine';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ExplainInput {
  geoResult: GeoResult;
  temporalResult: TemporalResult;
  duplicateResult: DuplicateResult;
  metadataResult: MetadataResult;
  fusionResult: FusionResult;
}

export interface ExplainResult {
  summary: string;
  flagReasons: string[];
  recommendedAction: 'AUTO_APPROVE' | 'MANUAL_REVIEW' | 'FIELD_INSPECTION' | 'IMMEDIATE_ESCALATION';
  confidence: number;
}

// ─── Engine ──────────────────────────────────────────────────────────────────

export function generateExplanations(params: ExplainInput): ExplainResult {
  const flagReasons: string[] = [];

  // Collect anomaly descriptions from all engines
  const allAnomalies = [
    ...params.geoResult.anomalies,
    ...params.temporalResult.anomalies,
    ...params.duplicateResult.anomalies,
    ...params.metadataResult.anomalies,
  ];

  // Prioritize by severity
  const criticals = allAnomalies.filter((a) => a.severity === 'CRITICAL');
  const highs = allAnomalies.filter((a) => a.severity === 'HIGH');
  const mediums = allAnomalies.filter((a) => a.severity === 'MEDIUM');

  // Build flag reasons (deduplicated, severity-ordered)
  for (const anomaly of [...criticals, ...highs, ...mediums]) {
    if (!flagReasons.includes(anomaly.description)) {
      flagReasons.push(anomaly.description);
    }
  }

  // Add specific context
  if (params.geoResult.distanceFromCentroidM != null && !params.geoResult.isInsideGeofence) {
    const km = (params.geoResult.distanceFromCentroidM / 1000).toFixed(1);
    const reason = `GPS location is ${km} km from registered project site.`;
    if (!flagReasons.includes(reason)) flagReasons.unshift(reason);
  }

  if (params.duplicateResult.exactDuplicates.length > 0) {
    const ids = params.duplicateResult.exactDuplicates.map((d) => d.evidenceId).join(', ');
    const reason = `Exact file duplicate found: ${ids}`;
    if (!flagReasons.includes(reason)) flagReasons.unshift(reason);
  }

  if (params.duplicateResult.nearDuplicates.length > 0) {
    const top = params.duplicateResult.nearDuplicates[0];
    const reason = `${top.similarity}% visual similarity with evidence ${top.evidenceId}${top.projectId !== '' ? ` from project ${top.projectId}` : ''}.`;
    if (!flagReasons.includes(reason)) flagReasons.unshift(reason);
  }

  // Recommended action based on integrity score
  const score = params.fusionResult.integrityScore;
  let recommendedAction: ExplainResult['recommendedAction'];
  if (score >= 85) recommendedAction = 'AUTO_APPROVE';
  else if (score >= 65) recommendedAction = 'MANUAL_REVIEW';
  else if (score >= 40) recommendedAction = 'FIELD_INSPECTION';
  else recommendedAction = 'IMMEDIATE_ESCALATION';

  // Override: any CRITICAL anomaly forces escalation
  if (criticals.length > 0 && recommendedAction === 'AUTO_APPROVE') {
    recommendedAction = 'MANUAL_REVIEW';
  }
  if (criticals.length >= 2) {
    recommendedAction = 'IMMEDIATE_ESCALATION';
  }

  // Confidence: based on how many signals we have (more signals = higher confidence)
  const signalCount = Object.values(params.fusionResult.breakdown).filter((b) => b.score > 0).length;
  const confidence = Math.min(100, Math.round((signalCount / 7) * 100));

  // Summary
  let summary: string;
  if (flagReasons.length === 0) {
    summary = `Evidence integrity score is ${score}/100 (${params.fusionResult.riskLevel} risk). All verification signals are consistent — no anomalies detected.`;
  } else if (params.fusionResult.riskLevel === 'CRITICAL') {
    summary = `Evidence integrity score is ${score}/100 (CRITICAL risk). ${flagReasons.length} anomalies detected requiring immediate attention.`;
  } else if (params.fusionResult.riskLevel === 'HIGH') {
    summary = `Evidence integrity score is ${score}/100 (HIGH risk). ${flagReasons.length} anomalies detected — manual review or field inspection recommended.`;
  } else {
    summary = `Evidence integrity score is ${score}/100 (${params.fusionResult.riskLevel} risk). ${flagReasons.length} anomaly/anomalies detected.`;
  }

  return { summary, flagReasons, recommendedAction, confidence };
}
