import { apiFetch, type PaginatedResult } from '@/lib/api'

export type MediaType = 'VIDEO' | 'PHOTO' | 'EDITO' | 'MAGAZINE' | 'PUBLICATION'

export const mediaTypeLabels: Record<MediaType, string> = {
  VIDEO: 'Vidéo',
  PHOTO: 'Photo',
  EDITO: 'Éditorial',
  MAGAZINE: 'Magazine',
  PUBLICATION: 'Publication',
}

export interface MediaDiscipline {
  discipline: {
    id: string
    slug: string
    name: string
    color: string | null
  }
}

export interface MediaItem {
  id: string
  slug: string
  title: string
  type: MediaType
  description: string | null
  url: string | null
  thumbnailUrl: string | null
  imageUrls: string[]
  status: string
  featured: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  disciplines: MediaDiscipline[]
}

export interface ListMediaParams {
  page?: number
  pageSize?: number
  type?: MediaType
  discipline?: string
  status?: string
  featured?: boolean
}

export async function getMedia(params: ListMediaParams = {}): Promise<PaginatedResult<MediaItem>> {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.pageSize) q.set('pageSize', String(params.pageSize))
  if (params.type) q.set('type', params.type)
  if (params.discipline) q.set('discipline', params.discipline)
  if (params.status) q.set('status', params.status)
  if (params.featured !== undefined) q.set('featured', String(params.featured))
  const qs = q.toString()
  return apiFetch<PaginatedResult<MediaItem>>(`/media${qs ? `?${qs}` : ''}`, {
    next: { revalidate: 300, tags: ['media'] },
  })
}

export async function getMediaItem(slug: string): Promise<MediaItem> {
  return apiFetch<MediaItem>(`/media/${slug}`, {
    next: { revalidate: 300, tags: ['media', `media-${slug}`] },
  })
}
