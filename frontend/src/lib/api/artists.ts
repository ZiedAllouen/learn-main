import { apiFetch, type PaginatedResult } from '@/lib/api'

export interface ArtistDiscipline {
  discipline: {
    id: string
    slug: string
    name: string
    color: string | null
  }
}

export interface ArtistWork {
  id: string
  title: string
  description: string | null
  imageUrls: string[]
  year: number | null
  type: string | null
  sortOrder: number
}

export interface Artist {
  id: string
  slug: string
  name: string
  bio: string | null
  statement: string | null
  photoUrl: string | null
  coverUrl: string | null
  city: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  websiteUrl: string | null
  instagramUrl: string | null
  email: string | null
  status: string
  featured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  disciplines: ArtistDiscipline[]
  works: ArtistWork[]
}

export interface ArtistMapPoint {
  id: string
  slug: string
  name: string
  city: string | null
  address: string | null
  latitude: number
  longitude: number
  photoUrl: string | null
}

export interface ListArtistsParams {
  page?: number
  pageSize?: number
  discipline?: string
  sector?: string
  city?: string
  status?: string
  featured?: boolean
}

export async function getArtists(params: ListArtistsParams = {}): Promise<PaginatedResult<Artist>> {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.pageSize) q.set('pageSize', String(params.pageSize))
  if (params.discipline) q.set('discipline', params.discipline)
  if (params.sector) q.set('sector', params.sector)
  if (params.city) q.set('city', params.city)
  if (params.status) q.set('status', params.status)
  if (params.featured !== undefined) q.set('featured', String(params.featured))
  const qs = q.toString()
  return apiFetch<PaginatedResult<Artist>>(`/artists${qs ? `?${qs}` : ''}`, {
    next: { revalidate: 300, tags: ['artists'] },
  })
}

export async function getArtist(slug: string): Promise<Artist> {
  return apiFetch<Artist>(`/artists/${slug}`, {
    next: { revalidate: 300, tags: ['artists', `artist-${slug}`] },
  })
}

export async function getArtistMapPoints(): Promise<ArtistMapPoint[]> {
  return apiFetch<ArtistMapPoint[]>('/artists/map', {
    next: { revalidate: 300, tags: ['artists'] },
  })
}
