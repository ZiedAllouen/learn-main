import { apiFetch } from '@/lib/api'

export interface SpaceDiscipline {
  discipline: {
    id: string
    slug: string
    name: string
  }
}

export interface Space {
  id: string
  slug: string
  name: string
  description: string | null
  address: string | null
  floor: string | null
  surfaceSqm: number | null
  capacity: number | null
  equipment: string[]
  imageUrls: string[]
  status: string
  sortOrder: number
  disciplines: SpaceDiscipline[]
}

// The spaces endpoint returns a bare array, not a paginated envelope.
export async function getSpaces(): Promise<Space[]> {
  return apiFetch<Space[]>('/spaces', {
    cache: 'no-store',
  })
}

export async function getSpace(slug: string): Promise<Space> {
  return apiFetch<Space>(`/spaces/${slug}`, {
    cache: 'no-store',
  })
}
