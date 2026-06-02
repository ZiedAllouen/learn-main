const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

/** True when the API returned 404 — the resource genuinely does not exist. */
export function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404
}

/** True when the API was unreachable (network error / timeout) — status 0. */
export function isUnreachable(error: unknown): boolean {
  return error instanceof ApiError && error.status === 0
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    })

    if (!res.ok) {
      // On the client, a 401 means the session expired — clear tokens and
      // redirect to login so the user isn't left staring at broken UI.
      // Skip auth endpoints (a wrong-password login is a legit 401, not an
      // expired session) and skip when already on /login to avoid loops.
      if (
        res.status === 401 &&
        typeof window !== 'undefined' &&
        !path.includes('/auth/login') &&
        !path.includes('/auth/refresh') &&
        !path.includes('/auth/register') &&
        !window.location.pathname.startsWith('/login')
      ) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        const here = window.location.pathname + window.location.search
        window.location.href = `/login?redirect=${encodeURIComponent(here)}`
      }
      throw new ApiError(res.status, `API ${path} → ${res.status}`)
    }

    return (await res.json()) as T
  } catch (error) {
    // HTTP errors already typed — pass through.
    if (error instanceof ApiError) {
      throw error
    }
    // Aborted request (our timeout) — surface as unreachable.
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(0, `API ${path} unreachable: request timeout`)
    }
    // Network failure (backend down, DNS, connection refused) — fetch throws TypeError.
    if (error instanceof TypeError) {
      throw new ApiError(0, `API ${path} unreachable: ${error.message}`)
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
