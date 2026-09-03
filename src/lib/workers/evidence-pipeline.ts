/**
 * Evidence Processing Pipeline — BullMQ Worker
 *
 * Orchestrates the full evidence analysis pipeline:
 * Validate → Hash → Extract Metadata → Geo Check → Temporal Check →
 * Duplicate Check → Fusion Score → Explainability → Update DB
 */

import { Queue, Worker } from 'bullmq';
import { Prisma } from '@prisma/client';
import { createRedisConnection } from '@/lib/redis';
import { prisma } from '@/lib/db';
import { analyzeGeo } from '@/lib/engines/geo-engine';
import { analyzeTemporal } from '@/lib/engines/temporal-engine';
import { analyzeDuplicates } from '@/lib/engines/duplicate-engine';
import { analyzeMetadata } from '@/lib/engines/metadata-engine';
import { fuseScores } from '@/lib/engines/fusion-engine';
import { generateExplanations } from '@/lib/engines/explainability';

// ─── Constants ───────────────────────────────────────────────────────────────

export const EVIDENCE_QUEUE_NAME = 'evidence-analysis';
const MODEL_VERSION = 'eiil-mvp-v1.0';

// ─── Job Types ───────────────────────────────────────────────────────────────

export interface EvidenceJobData {
  evidenceId: string;
  triggeredBy?: string;
}

// ─── Queue Factory ───────────────────────────────────────────────────────────

let _queue: Queue | null = null;

export function createEvidenceQueue(): Queue {
  if (!_queue) {
    _queue = new Queue(EVIDENCE_QUEUE_NAME, {
      connection: createRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 500 },
      },
    });
  }
  return _queue;
}

/** Enqueue an evidence item for analysis. */
export async function enqueueEvidenceAnalysis(
  evidenceId: string,
  triggeredBy?: string
): Promise<string> {
  const queue = createEvidenceQueue();
  const job = await queue.add(
    'analyze',
    { evidenceId, triggeredBy } satisfies EvidenceJobData,
    { jobId: `analyze-${evidenceId}-${Date.now()}` }
  );
  return job.id ?? evidenceId;
}

// ─── Worker ──────────────────────────────────────────────────────────────────

export function startEvidenceWorker(): Worker {
  const worker = new Worker<EvidenceJobData>(
    EVIDENCE_QUEUE_NAME,
    async (job) => {
      const { evidenceId, triggeredBy } = job.data;
      console.log(`[evidence-pipeline] Processing ${evidenceId}`);

      try {
        // 1. Load evidence + project
        const evidence = await prisma.evidence.findUnique({
          where: { id: evidenceId },
          include: { project: true },
        });

        if (!evidence) {
          throw new Error(`Evidence ${evidenceId} not found`);
        }

        const project = evidence.project;

        // 2. Load other evidence from same project for cross-checks
        const otherEvidence = await prisma.evidence.findMany({
          where: { projectId: evidence.projectId, id: { not: evidenceId } },
          select: {
            id: true,
            capturedAt: true,
            stage: true,
            latitude: true,
            longitude: true,
          },
          take: 100,
        });

        // 3. Geo Engine
        const geoResult = await analyzeGeo({
          evidenceLat: evidence.latitude ? Number(evidence.latitude) : null,
          evidenceLng: evidence.longitude ? Number(evidence.longitude) : null,
          gpsAccuracyM: evidence.gpsAccuracyM ? Number(evidence.gpsAccuracyM) : null,
          projectCentroidLat: Number(project.centroidLat),
          projectCentroidLng: Number(project.centroidLng),
          geofenceRadiusM: project.geofenceRadiusMeter,
          otherEvidenceLocations: otherEvidence
            .filter((e) => e.latitude && e.longitude)
            .map((e) => ({
              lat: Number(e.latitude),
              lng: Number(e.longitude),
              id: e.id,
            })),
        });

        // 4. Temporal Engine
        const temporalResult = await analyzeTemporal({
          capturedAt: evidence.capturedAt,
          projectStartDate: project.startDate,
          projectEndDate: project.endDate,
          evidenceStage: evidence.stage,
          otherEvidence: otherEvidence
            .filter((e) => e.capturedAt)
            .map((e) => ({
              capturedAt: e.capturedAt!,
              stage: e.stage,
              lat: e.latitude ? Number(e.latitude) : undefined,
              lng: e.longitude ? Number(e.longitude) : undefined,
              id: e.id,
            })),
        });

        // 5. Duplicate Engine
        const duplicateResult = await analyzeDuplicates({
          sha256: evidence.sha256,
          pHash: evidence.pHash,
          evidenceId: evidence.id,
          projectId: evidence.projectId,
        });

        // 6. Metadata Engine
        const metadataResult = await analyzeMetadata({
          hasGps: evidence.latitude != null && evidence.longitude != null,
          hasTimestamp: evidence.capturedAt != null,
          hasCameraInfo: true, // MVP: assume present if uploaded from camera
          softwareTag: null, // TODO: extract from EXIF in future
          imageDimensions: null, // TODO: extract via Sharp in future
          mimeType: evidence.mimeType,
          sizeBytes: evidence.sizeBytes,
        });

        // 7. Fusion Engine
        const fusionResult = fuseScores({
          gpsScore: geoResult.score,
          temporalScore: temporalResult.score,
          duplicateRisk: duplicateResult.riskScore,
          visualScore: 80, // MVP default — no vision model yet
          authenticityScore: metadataResult.manipulationRisk,
          claimMatch: 75, // MVP default — no claim matching yet
          completeness: metadataResult.completeness,
        });

        // 8. Explainability
        const explainResult = generateExplanations({
          geoResult,
          temporalResult,
          duplicateResult,
          metadataResult,
          fusionResult,
        });

        // 9. Create AnalysisResult
        const jobId = job.id ?? `job-${evidenceId}`;
        await prisma.analysisResult.create({
          data: {
            evidenceId,
            jobId,
            gpsScore: geoResult.score,
            temporalScore: temporalResult.score,
            duplicateRisk: duplicateResult.riskScore,
            visualScore: 80,
            authenticityScore: 100 - metadataResult.manipulationRisk,
            claimMatch: 75,
            metadataScore: metadataResult.score,
            completeness: metadataResult.completeness,
            overallIntegrity: fusionResult.integrityScore,
            riskScore: fusionResult.integrityScore,
            explanations: JSON.stringify({
              summary: explainResult.summary,
              flagReasons: explainResult.flagReasons,
              recommendedAction: explainResult.recommendedAction,
              confidence: explainResult.confidence,
              breakdown: fusionResult.breakdown,
            }),
            rawResult: JSON.stringify({
              geo: geoResult,
              temporal: temporalResult,
              duplicate: {
                riskScore: duplicateResult.riskScore,
                exactCount: duplicateResult.exactDuplicates.length,
                nearCount: duplicateResult.nearDuplicates.length,
                crossProjectCount: duplicateResult.crossProjectMatches.length,
              },
              metadata: metadataResult,
            }),
          },
        });

        // 10. Create Anomaly records
        const allAnomalies = [
          ...geoResult.anomalies,
          ...temporalResult.anomalies,
          ...duplicateResult.anomalies,
          ...metadataResult.anomalies,
        ];

        if (allAnomalies.length > 0) {
          await prisma.anomaly.createMany({
            data: allAnomalies.map((a) => ({
              evidenceId,
              type: a.type as 'LOCATION_MISMATCH' | 'TEMPORAL_MISMATCH' | 'DUPLICATE_EVIDENCE' | 'CROSS_PROJECT_DUPLICATE' | 'METADATA_ANOMALY' | 'IMAGE_MANIPULATION_RISK' | 'CLAIM_MISMATCH' | 'INCOMPLETE_EVIDENCE' | 'VISUAL_INCONSISTENCY' | 'QUANTITY_UNSUPPORTED' | 'IMPOSSIBLE_TRAVEL',
              severity: a.severity as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
              confidence: 85, // MVP default confidence
              title: a.type.replace(/_/g, ' '),
              description: a.description,
            })),
          });
        }

        // 11. Update Evidence status
        const newStatus =
          explainResult.recommendedAction === 'IMMEDIATE_ESCALATION'
            ? ('FLAGGED' as const)
            : ('PENDING' as const);

        await prisma.evidence.update({
          where: { id: evidenceId },
          data: {
            integrityScore: fusionResult.integrityScore,
            riskLevel: fusionResult.riskLevel,
            status: newStatus,
            modelVersion: MODEL_VERSION,
          },
        });

        // 12. Audit event
        await prisma.auditEvent.create({
          data: {
            evidenceId,
            actorId: triggeredBy ?? 'system',
            action: 'AI_FUSION_ANALYSIS',
            previousState: 'PENDING',
            newState: `${newStatus} (Score: ${fusionResult.integrityScore}, Risk: ${fusionResult.riskLevel})`,
            reason: explainResult.summary,
            metadata: JSON.stringify({
              modelVersion: MODEL_VERSION,
              anomalyCount: allAnomalies.length,
              recommendedAction: explainResult.recommendedAction,
            }),
          },
        });

        console.log(
          `[evidence-pipeline] ✓ ${evidenceId}: Score=${fusionResult.integrityScore}, Risk=${fusionResult.riskLevel}, Anomalies=${allAnomalies.length}`
        );

        return {
          integrityScore: fusionResult.integrityScore,
          riskLevel: fusionResult.riskLevel,
          anomalyCount: allAnomalies.length,
        };
      } catch (error) {
        console.error(`[evidence-pipeline] ✗ ${evidenceId}:`, error);
        // Don't lose the evidence — keep it PENDING for retry
        throw error;
      }
    },
    {
      connection: createRedisConnection(),
      concurrency: 5,
      limiter: { max: 10, duration: 1000 },
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`[evidence-pipeline] Job ${job?.id} failed:`, err.message);
  });

  worker.on('completed', (job) => {
    console.log(`[evidence-pipeline] Job ${job.id} completed`);
  });

  return worker;
}
