import { apiFetch, type PaginatedResult } from '@/lib/api'

export type RequestType = 'ENROLLMENT' | 'BOOKING' | 'PROJECT' | 'PARTNERSHIP' | 'OPPORTUNITY'
export type RequestStatus = 'NEW' | 'REVIEWING' | 'ACCEPTED' | 'DECLINED'

export interface SubmitRequestInput {
  type: RequestType
  name: string
  email: string
  phone?: string
  message?: string
  details?: Record<string, unknown>
  programId?: string
  spaceId?: string
}

export interface RequestRecord {
  id: string
  type: RequestType
  status: RequestStatus
  name: string
  email: string
  phone: string | null
  message: string | null
  adminNote: string | null
  createdAt: string
  program: { id: string; slug: string; title: string } | null
  space: { id: string; slug: string; name: string } | null
}

export async function submitRequest(input: SubmitRequestInput): Promise<{ id: string; message: string }> {
  // No custom `headers` here, so apiFetch's default `Content-Type: application/json` is preserved.
  return apiFetch('/requests', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function listRequests(
  token: string,
  params: { page?: number; type?: RequestType; status?: RequestStatus } = {},
): Promise<PaginatedResult<RequestRecord>> {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.type) q.set('type', params.type)
  if (params.status) q.set('status', params.status)
  const qs = q.toString()
  // apiFetch shallow-spreads `options`, so passing `headers` replaces the default
  // ones entirely. No body here, but keep Content-Type for consistency.
  return apiFetch(`/requests${qs ? `?${qs}` : ''}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
}

export async function updateRequest(
  token: string,
  id: string,
  patch: { status?: RequestStatus; adminNote?: string },
): Promise<RequestRecord> {
  // apiFetch shallow-spreads `options`; passing `headers` overwrites the default
  // `Content-Type: application/json`. Re-add it so Nest parses the JSON body.
  return apiFetch(`/requests/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(patch),
  })
}
