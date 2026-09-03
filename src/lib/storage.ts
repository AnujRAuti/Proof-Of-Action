import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * S3-compatible object storage client for evidence files.
 * Connects to MinIO in development, S3/R2/GCS in production.
 */

const ENDPOINT = process.env.OBJECT_STORAGE_ENDPOINT || 'http://localhost:9000';
const BUCKET = process.env.OBJECT_STORAGE_BUCKET || 'evidence';
const ACCESS_KEY = process.env.OBJECT_STORAGE_ACCESS_KEY || 'poa-local';
const SECRET_KEY = process.env.OBJECT_STORAGE_SECRET_KEY || 'poa-local-secret';

export const s3 = new S3Client({
  endpoint: ENDPOINT,
  region: 'us-east-1', // MinIO ignores this but the SDK requires it
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
  forcePathStyle: true, // Required for MinIO
});

/**
 * Upload a file to evidence storage.
 * Returns the object key used for retrieval.
 */
export async function uploadEvidence(params: {
  key: string;
  body: Buffer | ReadableStream | Uint8Array;
  contentType: string;
  metadata?: Record<string, string>;
}): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      Metadata: params.metadata,
    })
  );
  return params.key;
}

/**
 * Get a time-limited signed URL for evidence download.
 * Default expiry: 1 hour.
 */
export async function getEvidenceUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3, command, { expiresIn });
}

/**
 * Get the raw evidence file as a readable stream.
 */
export async function getEvidenceStream(key: string) {
  const response = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: key })
  );
  return response.Body;
}

/**
 * Delete an evidence file from storage.
 */
export async function deleteEvidence(key: string): Promise<void> {
  await s3.send(
    new DeleteObjectCommand({ Bucket: BUCKET, Key: key })
  );
}

/**
 * Generate a deterministic object key for evidence files.
 * Format: evidence/{projectId}/{evidenceId}/{filename}
 */
export function generateObjectKey(projectId: string, evidenceId: string, filename: string): string {
  return `evidence/${projectId}/${evidenceId}/${filename}`;
}
