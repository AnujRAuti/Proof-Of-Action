/**
 * Metadata Engine — EXIF & File Integrity Analysis
 *
 * Evaluates metadata completeness, detects signs of image manipulation,
 * and validates file characteristics.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MetadataInput {
  hasGps: boolean;
  hasTimestamp: boolean;
  hasCameraInfo: boolean;
  softwareTag: string | null;
  imageDimensions: { width: number; height: number } | null;
  mimeType: string;
  sizeBytes: number;
}

export interface MetadataAnomaly {
  type: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface MetadataResult {
  score: number;
  completeness: number;
  manipulationRisk: number;
  anomalies: MetadataAnomaly[];
}

// Known image editing software
const EDITING_SOFTWARE = [
  'photoshop', 'gimp', 'snapseed', 'lightroom', 'pixlr',
  'canva', 'afterlight', 'vsco', 'faceapp', 'facetune',
  'picsart', 'inshot', 'remini', 'photoeditor',
];

// ─── Engine ──────────────────────────────────────────────────────────────────

export async function analyzeMetadata(params: MetadataInput): Promise<MetadataResult> {
  const anomalies: MetadataAnomaly[] = [];

  // Completeness: how much expected metadata is present
  const fields = [params.hasGps, params.hasTimestamp, params.hasCameraInfo];
  const presentCount = fields.filter(Boolean).length;
  const completeness = Math.round((presentCount / fields.length) * 100);

  if (!params.hasGps) {
    anomalies.push({
      type: 'INCOMPLETE_EVIDENCE',
      description: 'GPS/location data missing from image EXIF metadata.',
      severity: 'MEDIUM',
    });
  }

  if (!params.hasTimestamp) {
    anomalies.push({
      type: 'INCOMPLETE_EVIDENCE',
      description: 'Capture timestamp missing from image EXIF metadata.',
      severity: 'MEDIUM',
    });
  }

  if (!params.hasCameraInfo) {
    anomalies.push({
      type: 'METADATA_ANOMALY',
      description: 'Camera make/model information missing — may indicate a screenshot or transferred file.',
      severity: 'LOW',
    });
  }

  // Manipulation risk: check for editing software
  let manipulationRisk = 0;

  if (params.softwareTag) {
    const softwareLower = params.softwareTag.toLowerCase();
    const isEditor = EDITING_SOFTWARE.some((sw) => softwareLower.includes(sw));

    if (isEditor) {
      manipulationRisk += 60;
      anomalies.push({
        type: 'IMAGE_MANIPULATION_RISK',
        description: `Image metadata indicates editing with "${params.softwareTag}".`,
        severity: 'HIGH',
      });
    }
  }

  // Image dimensions check
  if (params.imageDimensions) {
    const { width, height } = params.imageDimensions;

    if (width < 640 || height < 480) {
      manipulationRisk += 15;
      anomalies.push({
        type: 'METADATA_ANOMALY',
        description: `Image resolution is very low (${width}×${height}) — may be a cropped or heavily compressed copy.`,
        severity: 'MEDIUM',
      });
    }

    if (width > 8000 || height > 8000) {
      anomalies.push({
        type: 'METADATA_ANOMALY',
        description: `Image resolution is unusually high (${width}×${height}) — may indicate stitching or upscaling.`,
        severity: 'LOW',
      });
    }
  }

  // File size anomalies
  const isImage = params.mimeType.startsWith('image/');
  if (isImage) {
    if (params.sizeBytes < 10_000) {
      manipulationRisk += 10;
      anomalies.push({
        type: 'METADATA_ANOMALY',
        description: `Image file is suspiciously small (${(params.sizeBytes / 1024).toFixed(1)} KB) — may be a thumbnail or heavily compressed.`,
        severity: 'LOW',
      });
    }

    if (params.sizeBytes > 25_000_000) {
      anomalies.push({
        type: 'METADATA_ANOMALY',
        description: `Image file is unusually large (${(params.sizeBytes / 1_000_000).toFixed(1)} MB).`,
        severity: 'LOW',
      });
    }
  }

  // All metadata stripped = suspicious
  if (!params.hasGps && !params.hasTimestamp && !params.hasCameraInfo) {
    manipulationRisk += 25;
    anomalies.push({
      type: 'IMAGE_MANIPULATION_RISK',
      description: 'All EXIF metadata has been stripped — this is common in edited or screenshot-transferred images.',
      severity: 'HIGH',
    });
  }

  manipulationRisk = Math.min(100, manipulationRisk);

  // Score: high completeness + low manipulation risk = high score
  const score = Math.round(completeness * 0.6 + (100 - manipulationRisk) * 0.4);

  return {
    score: Math.max(0, Math.min(100, score)),
    completeness,
    manipulationRisk,
    anomalies,
  };
}
