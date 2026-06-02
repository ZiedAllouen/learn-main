import { apiFetch, type PaginatedResult } from '@/lib/api'

export interface ProgramType {
  id: string
  slug: string
  name: string
}

export interface ProgramDiscipline {
  discipline: {
    id: string
    slug: string
    name: string
  }
}

export interface ProgramAudience {
  audienceType: {
    id: string
    slug: string
    name: string
  }
}

export interface Program {
  id: string
  slug: string
  title: string
  description: string | null
  body: unknown | null
  coverUrl: string | null
  programTypeId: string | null
  modality: 'IN_PERSON' | 'ONLINE' | 'HYBRID'
  duration: string | null
  priceIndicative: string | null
  featured: boolean
  status: string
  createdAt: string
  updatedAt: string
  programType: ProgramType | null
  disciplines: ProgramDiscipline[]
  audiences: ProgramAudience[]
}

export interface ListProgramsParams {
  page?: number
  pageSize?: number
  discipline?: string
  audience?: string
  modality?: string
  status?: string
  featured?: boolean
}

export async function getPrograms(
  params: ListProgramsParams = {},
): Promise<PaginatedResult<Program>> {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.pageSize) q.set('pageSize', String(params.pageSize))
  if (params.discipline) q.set('discipline', params.discipline)
  if (params.audience) q.set('audience', params.audience)
  if (params.modality) q.set('modality', params.modality)
  if (params.status) q.set('status', params.status)
  if (params.featured !== undefined) q.set('featured', String(params.featured))
  const qs = q.toString()
  return apiFetch<PaginatedResult<Program>>(`/programs${qs ? `?${qs}` : ''}`, {
    cache: 'no-store',
  })
}

export async function getProgram(slug: string): Promise<Program> {
  return apiFetch<Program>(`/programs/${slug}`, {
    cache: 'no-store',
  })
}
