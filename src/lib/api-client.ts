/**
 * Typed API client for the Proof-of-Action frontend.
 *
 * Wraps fetch() with proper typing, error handling, and pagination support.
 * All functions are designed to be called from React components or server actions.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
  };
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ─── Base Fetcher ────────────────────────────────────────────────────────────

async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `API error: ${res.status}`);
  }

  return res.json();
}

// ─── Evidence ────────────────────────────────────────────────────────────────

export interface EvidenceListParams extends PaginationParams {
  status?: string;
  projectId?: string;
  riskLevel?: string;
}

export async function fetchEvidence(params: EvidenceListParams = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.projectId) query.set('projectId', params.projectId);
  if (params.riskLevel) query.set('riskLevel', params.riskLevel);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  return apiFetch(`/api/evidence?${query.toString()}`);
}

export async function fetchEvidenceDetail(id: string) {
  return apiFetch(`/api/evidence/${id}`);
}

export async function uploadEvidence(data: {
  projectId: string;
  stage?: string;
  capturedAt?: string;
  latitude?: number;
  longitude?: number;
  gpsAccuracyMeters?: number;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  objectKey: string;
}) {
  return apiFetch('/api/evidence', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function reAnalyzeEvidence(id: string) {
  return apiFetch(`/api/evidence/${id}/analyze`, { method: 'POST' });
}

export async function searchSimilarEvidence(params: {
  evidenceId?: string;
  sha256?: string;
  pHash?: string;
}) {
  return apiFetch('/api/evidence/similar', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export async function submitReview(
  evidenceId: string,
  data: {
    action: 'APPROVE' | 'REJECT' | 'FLAG' | 'INSPECTION_REQUESTED' | 'OVERRIDE';
    reason: string;
    overrideScore?: number;
    overrideRisk?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }
) {
  return apiFetch(`/api/evidence/${evidenceId}/review`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchReviewQueue(params: PaginationParams & {
  scheme?: string;
  riskLevel?: string;
} = {}) {
  const query = new URLSearchParams();
  if (params.scheme) query.set('scheme', params.scheme);
  if (params.riskLevel) query.set('riskLevel', params.riskLevel);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  return apiFetch(`/api/reviews/queue?${query.toString()}`);
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function fetchProjects(params: PaginationParams & {
  state?: string;
  district?: string;
  scheme?: string;
  status?: string;
} = {}) {
  const query = new URLSearchParams();
  if (params.state) query.set('state', params.state);
  if (params.district) query.set('district', params.district);
  if (params.scheme) query.set('scheme', params.scheme);
  if (params.status) query.set('status', params.status);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  return apiFetch(`/api/projects?${query.toString()}`);
}

export async function fetchProjectDetail(id: string) {
  return apiFetch(`/api/projects/${id}`);
}

export async function createProject(data: {
  id: string;
  name: string;
  scheme: string;
  ministry?: string;
  state: string;
  district: string;
  block: string;
  budgetInr?: number;
  contractor?: string;
  centroidLat: number;
  centroidLng: number;
  geofenceRadiusMeter: number;
  startDate: string;
  endDate: string;
}) {
  return apiFetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Complaints ──────────────────────────────────────────────────────────────

export async function fetchComplaints(params: PaginationParams & {
  citizenId?: string;
  projectId?: string;
  status?: string;
} = {}) {
  const query = new URLSearchParams();
  if (params.citizenId) query.set('citizenId', params.citizenId);
  if (params.projectId) query.set('projectId', params.projectId);
  if (params.status) query.set('status', params.status);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  return apiFetch(`/api/complaints?${query.toString()}`);
}

export async function fileComplaint(data: {
  projectId: string;
  category: string;
  description: string;
  voiceNoteKey?: string;
  photoKey?: string;
}) {
  return apiFetch('/api/complaints', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ─── Audit ───────────────────────────────────────────────────────────────────

export async function fetchAuditEvents(params: PaginationParams & {
  evidenceId?: string;
  actorId?: string;
  action?: string;
  from?: string;
  to?: string;
} = {}) {
  const query = new URLSearchParams();
  if (params.evidenceId) query.set('evidenceId', params.evidenceId);
  if (params.actorId) query.set('actorId', params.actorId);
  if (params.action) query.set('action', params.action);
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  return apiFetch(`/api/audit?${query.toString()}`);
}

// ─── Jobs ────────────────────────────────────────────────────────────────────

export async function fetchJobStatus(jobId: string) {
  return apiFetch(`/api/evidence/jobs/${jobId}`);
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function signupUser(data: {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role: string;
  district?: string;
  state?: string;
  pincode?: string;
  department?: string;
}) {
  return apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
