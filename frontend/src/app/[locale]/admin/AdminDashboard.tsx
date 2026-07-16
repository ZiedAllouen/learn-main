'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser, getAccessToken, logout } from '@/lib/auth'
import { RequestsSection } from './sections/RequestsSection'
import { ContentSection, RESOURCES } from './sections/ContentSection'
import { ArtistsSection } from './sections/ArtistsSection'
import { MediaSection } from './sections/MediaSection'
import { ConfirmModal } from './sections/ConfirmModal'
import { useToast, ToastView } from './sections/Toast'

interface UserStats {
  total: number
  byRole: { role: string; _count: { _all: number } }[]
  recent: number
}

interface User {
  id: string
  email: string
  role: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  createdAt: string
}

interface PaginatedUsers {
  data: User[]
  total: number
  page: number
  totalPages: number
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: '#2F66FC',
  EDITOR: '#1E96FF',
  ARTIST: '#00E00E',
  USER: '#2F66FC',
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  EDITOR: 'Éditeur',
  ARTIST: 'Artiste',
  USER: 'Membre',
}

function RoleSelect({
  value,
  disabled,
  onChange,
}: {
  value: string
  disabled: boolean
  onChange: (role: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 border border-bsmk-black/15 rounded-lg px-2.5 py-1 text-xs bg-transparent disabled:opacity-40 disabled:cursor-not-allowed hover:border-bsmk-black/30 transition-colors"
        style={{ color: ROLE_COLORS[value] ?? '#0A0A0A' }}
      >
        {ROLE_LABELS[value] ?? value}
        {!disabled && <span className="opacity-40 text-[10px]">▾</span>}
      </button>
      {open && !disabled && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-bsmk-black/15 rounded-xl shadow-xl overflow-hidden min-w-[110px]">
          {Object.entries(ROLE_LABELS).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => { onChange(val); setOpen(false) }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-black/[0.04] transition-colors flex items-center gap-2"
              style={{ color: ROLE_COLORS[val] ?? '#0A0A0A' }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: ROLE_COLORS[val] }} />
              {label}
              {val === value && <span className="ml-auto opacity-40">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function AdminDashboard() {
  const router = useRouter()

  // Centralised 401 handler for raw fetch calls in this component.
  // apiFetch already handles 401 for itself; this covers the two direct fetches below.
  function handleAdminFetch(r: Response): Promise<unknown> | null {
    if (r.status === 401) {
      logout()
      router.replace('/login')
      return null
    }
    return r.ok ? r.json() : null
  }
  const [section, setSection] = useState<'users' | 'requests' | 'articles' | 'events' | 'programmes' | 'spaces' | 'artists' | 'media'>('users')
  const [stats, setStats] = useState<UserStats | null>(null)
  const [users, setUsers] = useState<PaginatedUsers | null>(null)
  const [page, setPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [pendingDeleteUser, setPendingDeleteUser] = useState<User | null>(null)
  const { toast, showToast } = useToast()

  const user = getAuthUser()
  const token = getAccessToken()

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.replace('/')
    }
  }, [user, router])

  useEffect(() => {
    if (!token) return
    setLoadingStats(true)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => handleAdminFetch(r))
      .then(data => setStats(data && Array.isArray((data as UserStats).byRole) ? (data as UserStats) : null))
      .catch(() => setStats(null))
      .finally(() => setLoadingStats(false))
  }, [token])

  useEffect(() => {
    if (!token) return
    setLoadingUsers(true)
    const params = new URLSearchParams({ page: String(page), pageSize: '15' })
    if (roleFilter) params.set('role', roleFilter)
    if (search) params.set('search', search)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => handleAdminFetch(r))
      .then(data => setUsers(data && Array.isArray((data as PaginatedUsers).data) ? (data as PaginatedUsers) : null))
      .catch(() => setUsers(null))
      .finally(() => setLoadingUsers(false))
  }, [token, page, roleFilter, search])

  async function changeRole(id: string, role: string) {
    if (!token) return
    setUpdatingId(id)
    const prev = users
    setUsers(p =>
      p ? { ...p, data: p.data.map(u => (u.id === id ? { ...u, role } : u)) } : p,
    )
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role }),
      })
      if (!res.ok) throw new Error(String(res.status))
      showToast('Rôle mis à jour.', 'success')
    } catch {
      setUsers(prev) // roll back
      showToast('Échec de la mise à jour du rôle.', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  async function confirmDeleteUser() {
    if (!token || !pendingDeleteUser) return
    const id = pendingDeleteUser.id
    const email = pendingDeleteUser.email
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(String(res.status))
      setUsers(p =>
        p ? { ...p, data: p.data.filter(u => u.id !== id), total: p.total - 1 } : p,
      )
      showToast(`Utilisateur ${email} supprimé.`, 'success')
    } catch {
      showToast('La suppression a échoué.', 'error')
    } finally {
      setPendingDeleteUser(null)
    }
  }

  function handleLogout() {
    logout()
    router.push('/login')
  }

  if (!user || user.role !== 'ADMIN') return null

  const statCards = [
    { label: 'Utilisateurs total', value: stats?.total ?? '—' },
    { label: 'Inscrits (30j)', value: stats?.recent ?? '—' },
    { label: 'Admins', value: (stats?.byRole ?? []).find(r => r.role === 'ADMIN')?._count._all ?? 0 },
    { label: 'Artistes', value: (stats?.byRole ?? []).find(r => r.role === 'ARTIST')?._count._all ?? 0 },
  ]

  return (
    <div className="min-h-screen bg-bsmk-white text-bsmk-black">
      {/* Top bar */}
      <div className="border-b border-bsmk-black/10 bg-bsmk-white/95 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs tracking-widest uppercase text-page-accent hover:text-bsmk-black transition-colors">
              ← Site public
            </Link>
            <span className="text-bsmk-black/20">|</span>
            <span className="text-sm font-medium text-bsmk-black">Dashboard Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-bsmk-black/50">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-bsmk-black/50 hover:text-bsmk-black transition-colors tracking-wide uppercase"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Section color bar */}
        <div className="flex gap-1 mb-8">
          {['#2D5F99', '#C0392B', '#7A2E73', '#5C8A3A', '#147070', '#C99A2E', '#8A8F7A'].map((c, i) => (
            <div key={i} className="h-0.5 flex-1 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>

        <h1 className="font-display text-3xl font-bold mb-2">Administration</h1>
        <p className="text-sm text-bsmk-black/50 mb-8">Gestion des utilisateurs et accès plateforme BSMK</p>

        {/* Section nav */}
        <div className="flex gap-2 mb-10 border-b border-bsmk-black/10">
          {([
            { key: 'users', label: 'Utilisateurs' },
            { key: 'artists', label: 'Artistes' },
            { key: 'requests', label: 'Demandes' },
            { key: 'articles', label: 'Articles' },
            { key: 'events', label: 'Événements' },
            { key: 'programmes', label: 'Programmes' },
            { key: 'spaces', label: 'Espaces' },
            { key: 'media', label: 'Médias' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSection(tab.key)}
              className={`relative px-4 py-2.5 text-sm tracking-wide transition-colors ${
                section === tab.key
                  ? 'text-bsmk-black'
                  : 'text-bsmk-black/40 hover:text-bsmk-black'
              }`}
            >
              {tab.label}
              {section === tab.key && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-page-accent rounded-full" />
              )}
            </button>
          ))}
        </div>

        {section === 'requests' ? (
          <RequestsSection />
        ) : section === 'articles' ? (
          <ContentSection config={RESOURCES.articles} />
        ) : section === 'events' ? (
          <ContentSection config={RESOURCES.events} />
        ) : section === 'programmes' ? (
          <ContentSection config={RESOURCES.programmes} />
        ) : section === 'spaces' ? (
          <ContentSection config={RESOURCES.spaces} />
        ) : section === 'media' ? (
          <MediaSection />
        ) : section === 'artists' ? (
          <ArtistsSection />
        ) : (
          <>
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map(card => (
            <div key={card.label} className="border border-bsmk-black/10 rounded-xl p-5 bg-black/[0.02]">
              <p className="text-xs tracking-widest uppercase text-bsmk-black/40 mb-2">{card.label}</p>
              <p className="font-display text-3xl font-bold text-bsmk-black">
                {loadingStats ? <span className="opacity-30">…</span> : card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Articles', href: '/magazine', color: '#1E96FF' },
            { label: 'Événements', href: '/agenda', color: '#2F66FC' },
            { label: 'Programmes', href: '/programmes', color: '#2F66FC' },
            { label: 'Espaces', href: '/espaces', color: '#00E00E' },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="border border-bsmk-black/10 rounded-xl p-4 hover:border-bsmk-black/30 transition-colors group flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-bsmk-black/60 group-hover:text-bsmk-black transition-colors">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Users table — no overflow-hidden so the RoleSelect dropdown can escape the card */}
        <div className="border border-bsmk-black/10 rounded-2xl">
          <div className="px-6 py-5 border-b border-bsmk-black/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="font-medium text-bsmk-black">Utilisateurs</h2>
            <div className="flex gap-3 flex-wrap">
              {/* Search */}
              <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1) }} className="flex gap-2">
                <input
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Rechercher…"
                  className="bg-white border border-bsmk-black/15 text-bsmk-black placeholder-bsmk-black/30 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-page-accent w-44"
                />
                <button type="submit" className="text-xs text-bsmk-black/50 hover:text-bsmk-black transition-colors px-2">→</button>
              </form>
              {(search || roleFilter) && (
                <button
                  onClick={() => { setSearch(''); setSearchInput(''); setRoleFilter(''); setPage(1) }}
                  className="text-xs text-bsmk-black/40 hover:text-red-500 transition-colors px-2 py-1.5"
                >
                  Réinitialiser
                </button>
              )}
              {/* Role filter */}
              <select
                value={roleFilter}
                onChange={e => { setRoleFilter(e.target.value); setPage(1) }}
                className="bg-white border border-bsmk-black/15 text-bsmk-black/70 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-page-accent appearance-none cursor-pointer"
              >
                <option value="">Tous les rôles</option>
                <option value="ADMIN">Admin</option>
                <option value="EDITOR">Éditeur</option>
                <option value="ARTIST">Artiste</option>
                <option value="USER">Membre</option>
              </select>
            </div>
          </div>

          {loadingUsers ? (
            <div className="px-6 py-16 text-center text-bsmk-black/40 text-sm">Chargement…</div>
          ) : !users?.data?.length ? (
            <div className="px-6 py-16 text-center text-bsmk-black/40 text-sm">Aucun utilisateur trouvé</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bsmk-black/5">
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal">Nom</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal hidden md:table-cell">Email</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal hidden xl:table-cell">Téléphone</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal">Rôle</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal hidden lg:table-cell">Inscrit</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {users.data.map(u => (
                  <tr key={u.id} className="border-b border-bsmk-black/5 hover:bg-black/[0.03] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-bsmk-black">
                        {u.firstName || u.lastName ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() : '—'}
                      </div>
                      <div className="text-xs text-bsmk-black/50 md:hidden mt-0.5">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 text-bsmk-black/60 hidden md:table-cell">{u.email}</td>
                    <td className="px-6 py-4 text-bsmk-black/60 hidden xl:table-cell">{u.phone || '—'}</td>
                    <td className="px-6 py-4">
                      <RoleSelect
                        value={u.role}
                        disabled={u.id === user.id || updatingId === u.id}
                        onChange={role => changeRole(u.id, role)}
                      />
                    </td>
                    <td className="px-6 py-4 text-bsmk-black/40 text-xs hidden lg:table-cell">
                      {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.id !== user.id && (
                        <button
                          onClick={() => setPendingDeleteUser(u)}
                          className="text-xs text-bsmk-black/40 hover:text-red-600 transition-colors"
                        >
                          Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {users && users.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-bsmk-black/5 flex items-center justify-between">
              <span className="text-xs text-bsmk-black/40">{users.total} utilisateurs</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-xs text-bsmk-black/50 hover:text-bsmk-black disabled:opacity-20 transition-colors px-2 py-1"
                >
                  ← Précédent
                </button>
                <span className="text-xs text-bsmk-black/40 px-2 py-1">{page} / {users.totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(users.totalPages, p + 1))}
                  disabled={page === users.totalPages}
                  className="text-xs text-bsmk-black/50 hover:text-bsmk-black disabled:opacity-20 transition-colors px-2 py-1"
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}
        </div>
          </>
        )}
      </div>

      <ConfirmModal
        open={!!pendingDeleteUser}
        destructive
        title="Supprimer cet utilisateur ?"
        message={pendingDeleteUser ? `${pendingDeleteUser.email} sera supprimé définitivement.` : ''}
        confirmLabel="Supprimer"
        onConfirm={confirmDeleteUser}
        onCancel={() => setPendingDeleteUser(null)}
      />

      <ToastView toast={toast} />
    </div>
  )
}
