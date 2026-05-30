'use client'

export interface AuthUser {
  id: string
  email: string
  role: 'ADMIN' | 'EDITOR' | 'ARTIST' | 'USER'
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

export function getAuthUser(): AuthUser | null {
  const token = getAccessToken()
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { id: payload.sub, email: payload.email, role: payload.role }
  } catch {
    return null
  }
}

export function isAdmin(): boolean {
  return getAuthUser()?.role === 'ADMIN'
}

export function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}
