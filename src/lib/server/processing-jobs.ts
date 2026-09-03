export type ProcessingJobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type ProcessingJob = {
  id: string;
  evidenceId?: string;
  status: ProcessingJobStatus;
  steps: string[];
  createdAt: string;
  updatedAt: string;
  error?: string;
};

// Development adapter. Replace this map with Redis/BullMQ in production;
// keeping the contract stable lets the UI migrate without another rewrite.
const jobs = new Map<string, ProcessingJob>();

export function createProcessingJob(evidenceId?: string) {
  const now = new Date().toISOString();
  const job: ProcessingJob = {
    id: `job_${crypto.randomUUID()}`,
    evidenceId,
    status: 'QUEUED',
    steps: ['VALIDATE_UPLOAD', 'EXTRACT_METADATA', 'ANALYZE_SIGNALS', 'FUSE_SCORES'],
    createdAt: now,
    updatedAt: now,
  };
  jobs.set(job.id, job);

  // Adapter lifecycle for local development. A worker will own this transition later.
  setTimeout(() => updateProcessingJob(job.id, { status: 'PROCESSING' }), 50);
  setTimeout(() => updateProcessingJob(job.id, { status: 'COMPLETED' }), 400);
  return job;
}

export function getProcessingJob(id: string) {
  return jobs.get(id);
}

function updateProcessingJob(id: string, update: Partial<ProcessingJob>) {
  const existing = jobs.get(id);
  if (!existing) return;
  jobs.set(id, { ...existing, ...update, updatedAt: new Date().toISOString() });
}
