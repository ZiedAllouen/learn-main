import { apiFetch, type PaginatedResult } from '@/lib/api'

export interface ApiEvent {
  id: string
  slug: string
  title: string
  description: string | null
  eventType: string
  startDate: string
  endDate: string | null
  location: string | null
  coverUrl: string | null
  ticketUrl: string | null
  status: string
  disciplines: { discipline: { id: string; slug: string; name: string } }[]
}

export async function getEvents(
  params: { eventType?: string; from?: string; to?: string; pageSize?: number } = {},
): Promise<PaginatedResult<ApiEvent>> {
  const q = new URLSearchParams()
  if (params.eventType) q.set('eventType', params.eventType)
  if (params.from) q.set('from', params.from)
  if (params.to) q.set('to', params.to)
  q.set('pageSize', String(params.pageSize ?? 100))
  return apiFetch(`/events?${q.toString()}`, { cache: 'no-store' })
}

export async function getEvent(slug: string): Promise<ApiEvent> {
  return apiFetch(`/events/${slug}`, { cache: 'no-store' })
}
