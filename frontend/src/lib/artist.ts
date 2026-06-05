import { apiFetch } from './api'
import { getAccessToken } from './auth'

export interface ArtistWork {
  id?: string
  title: string
  description?: string
  imageUrls?: string[]
  year?: number
  type?: string
  sortOrder?: number
}

export interface ArtistDisciplineLink {
  discipline: { id: string; slug: string; name: string; color?: string }
}

export interface ArtistProfile {
  id: string
  slug: string
  name: string
  bio?: string | null
  statement?: string | null
  photoUrl?: string | null
  coverUrl?: string | null
  city?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  websiteUrl?: string | null
  instagramUrl?: string | null
  email?: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  featured: boolean
  disciplines: ArtistDisciplineLink[]
  works: ArtistWork[]
}

export interface UpsertArtistPayload {
  name: string
  bio?: string
  statement?: string
  photoUrl?: string
  coverUrl?: string
  city?: string
  address?: string
  latitude?: number
  longitude?: number
  websiteUrl?: string
  instagramUrl?: string
  email?: string
  disciplineIds?: string[]
  works?: ArtistWork[]
}

export interface DisciplineOption {
  id: string
  slug: string
  name: string
  color?: string
}

function authHeaders(): Record<string, string> {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/** Returns the logged-in user's artist profile, or null if they have none yet. */
export async function getMyArtist(): Promise<ArtistProfile | null> {
  return apiFetch<ArtistProfile | null>('/artists/me', { headers: authHeaders() })
}

export async function saveMyArtist(payload: UpsertArtistPayload): Promise<ArtistProfile> {
  return apiFetch<ArtistProfile>('/artists/me', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
}

export async function listDisciplines(): Promise<DisciplineOption[]> {
  return apiFetch<DisciplineOption[]>('/disciplines')
}
