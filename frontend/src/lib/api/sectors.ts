import { apiFetch } from '@/lib/api'

export interface DisciplineRef {
  id: string
  slug: string
  name: string
  color: string | null
}

export interface Sector {
  id: string
  slug: string
  name: string
  color: string
  description: string | null
  sortOrder: number
  disciplines: DisciplineRef[]
}

export async function getSectors(): Promise<Sector[]> {
  return apiFetch<Sector[]>('/sectors', { next: { revalidate: 3600, tags: ['sectors'] } })
}

export async function getSector(slug: string): Promise<Sector> {
  return apiFetch<Sector>(`/sectors/${slug}`, { next: { revalidate: 3600, tags: ['sectors', `sector-${slug}`] } })
}
