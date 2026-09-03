export const EVIDENCE_UPLOAD_LIMIT_BYTES = 50 * 1024 * 1024;

export const ACCEPTED_EVIDENCE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'application/pdf',
  'application/json',
]);

export type EvidenceUploadRequest = {
  projectId: string;
  activityName?: string;
  stage?: 'before' | 'during' | 'after' | 'completion_doc';
  capturedAt?: string;
  latitude?: number;
  longitude?: number;
  gpsAccuracyMeters?: number;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

export function validateEvidenceUpload(input: EvidenceUploadRequest) {
  const errors: string[] = [];
  if (!input.projectId.trim()) errors.push('projectId is required');
  if (!input.fileName.trim()) errors.push('fileName is required');
  if (!ACCEPTED_EVIDENCE_TYPES.has(input.mimeType)) errors.push('Unsupported evidence type');
  if (!Number.isInteger(input.sizeBytes) || input.sizeBytes <= 0 || input.sizeBytes > EVIDENCE_UPLOAD_LIMIT_BYTES) {
    errors.push('File size must be between 1 byte and 50 MB');
  }
  if (input.latitude !== undefined && (input.latitude < -90 || input.latitude > 90)) errors.push('Invalid latitude');
  if (input.longitude !== undefined && (input.longitude < -180 || input.longitude > 180)) errors.push('Invalid longitude');
  return errors;
}
