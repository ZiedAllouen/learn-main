'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser, getAccessToken, logout } from '@/lib/auth'
import { RequestsSection } from './sections/RequestsSection'
import { ContentSection, RESOURCES } from './sections/ContentSection'

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
  createdAt: string
}

interface PaginatedUsers {
  data: User[]
  total: number
  page: number
  totalPages: number
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: '#C0392B',
  EDITOR: '#2D5F99',
  ARTIST: '#7A2E73',
  USER: '#5C8A3A',
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
        className="flex items-center gap-1.5 border border-white/10 rounded-lg px-2.5 py-1 text-xs bg-transparent disabled:opacity-40 disabled:cursor-not-allowed hover:border-white/25 transition-colors"
        style={{ color: ROLE_COLORS[value] ?? '#fff' }}
      >
        {ROLE_LABELS[value] ?? value}
        {!disabled && <span className="opacity-40 text-[10px]">▾</span>}
      </button>
      {open && !disabled && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-[#111] border border-white/15 rounded-xl shadow-2xl overflow-hidden min-w-[110px]">
          {Object.entries(ROLE_LABELS).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => { onChange(val); setOpen(false) }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-white/8 transition-colors flex items-center gap-2"
              style={{ color: ROLE_COLORS[val] ?? '#fff' }}
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
  const [section, setSection] = useState<'users' | 'requests' | 'articles' | 'events' | 'programmes'>('users')
  const [stats, setStats] = useState<UserStats | null>(null)
  const [users, setUsers] = useState<PaginatedUsers | null>(null)
  const [page, setPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

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
      .then(r => r.json())
      .then(setStats)
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
      .then(r => r.json())
      .then(setUsers)
      .finally(() => setLoadingUsers(false))
  }, [token, page, roleFilter, search])

  async function changeRole(id: string, role: string) {
    if (!token) return
    setUpdatingId(id)
    setUsers(prev =>
      prev
        ? { ...prev, data: prev.data.map(u => (u.id === id ? { ...u, role } : u)) }
        : prev,
    )
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role }),
    })
    setUpdatingId(null)
  }

  async function deleteUser(id: string) {
    if (!token || !confirm('Supprimer cet utilisateur ?')) return
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setUsers(prev =>
      prev ? { ...prev, data: prev.data.filter(u => u.id !== id), total: prev.total - 1 } : prev,
    )
  }

  function handleLogout() {
    logout()
    router.push('/login')
  }

  if (!user || user.role !== 'ADMIN') return null

  const statCards = [
    { label: 'Utilisateurs total', value: stats?.total ?? '—' },
    { label: 'Inscrits (30j)', value: stats?.recent ?? '—' },
    { label: 'Admins', value: stats?.byRole.find(r => r.role === 'ADMIN')?._count._all ?? 0 },
    { label: 'Artistes', value: stats?.byRole.find(r => r.role === 'ARTIST')?._count._all ?? 0 },
  ]

  return (
    <div className="min-h-screen bg-bsmk-black text-bsmk-white">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-bsmk-black/95 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs tracking-widest uppercase text-bsmk-sand/60 hover:text-bsmk-sand transition-colors">
              ← Site public
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-sm font-medium text-bsmk-white">Dashboard Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-bsmk-white/40">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-bsmk-white/40 hover:text-bsmk-white transition-colors tracking-wide uppercase"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Section color bar */}
        <div className="flex gap-1 mb-8">
          {['#C0392B', '#2D5F99', '#7A2E73', '#5C8A3A', '#147070', '#C99A2E'].map(c => (
            <div key={c} className="h-0.5 flex-1 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>

        <h1 className="font-display text-3xl font-bold mb-2">Administration</h1>
        <p className="text-sm text-bsmk-white/40 mb-8">Gestion des utilisateurs et accès plateforme BSMK</p>

        {/* Section nav */}
        <div className="flex gap-2 mb-10 border-b border-white/10">
          {([
            { key: 'users', label: 'Utilisateurs' },
            { key: 'requests', label: 'Demandes' },
            { key: 'articles', label: 'Articles' },
            { key: 'events', label: 'Événements' },
            { key: 'programmes', label: 'Programmes' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSection(tab.key)}
              className={`relative px-4 py-2.5 text-sm tracking-wide transition-colors ${
                section === tab.key
                  ? 'text-bsmk-white'
                  : 'text-bsmk-white/40 hover:text-bsmk-white/70'
              }`}
            >
              {tab.label}
              {section === tab.key && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-bsmk-sand rounded-full" />
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
        ) : (
          <>
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map(card => (
            <div key={card.label} className="border border-white/10 rounded-xl p-5 bg-white/3">
              <p className="text-xs tracking-widest uppercase text-bsmk-white/30 mb-2">{card.label}</p>
              <p className="font-display text-3xl font-bold text-bsmk-white">
                {loadingStats ? <span className="opacity-30">…</span> : card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Articles', href: '/magazine', color: '#7A2E73' },
            { label: 'Événements', href: '/agenda', color: '#C0392B' },
            { label: 'Programmes', href: '/programmes', color: '#2D5F99' },
            { label: 'Espaces', href: '/espaces', color: '#5C8A3A' },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="border border-white/10 rounded-xl p-4 hover:border-white/30 transition-colors group flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-bsmk-white/60 group-hover:text-bsmk-white transition-colors">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Users table */}
        <div className="border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="font-medium text-bsmk-white">Utilisateurs</h2>
            <div className="flex gap-3 flex-wrap">
              {/* Search */}
              <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1) }} className="flex gap-2">
                <input
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Rechercher…"
                  className="bg-white/5 border border-white/10 text-white placeholder-white/25 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-white/30 w-44"
                />
                <button type="submit" className="text-xs text-bsmk-white/50 hover:text-white transition-colors px-2">→</button>
              </form>
              {/* Role filter */}
              <select
                value={roleFilter}
                onChange={e => { setRoleFilter(e.target.value); setPage(1) }}
                className="bg-[#111] border border-white/10 text-white/70 rounded-lg px-3 py-1.5 text-sm focus:outline-none appearance-none cursor-pointer"
                style={{ colorScheme: 'dark' }}
              >
                <option value="" style={{ background: '#111' }}>Tous les rôles</option>
                <option value="ADMIN" style={{ background: '#111' }}>Admin</option>
                <option value="EDITOR" style={{ background: '#111' }}>Éditeur</option>
                <option value="ARTIST" style={{ background: '#111' }}>Artiste</option>
                <option value="USER" style={{ background: '#111' }}>Membre</option>
              </select>
            </div>
          </div>

          {loadingUsers ? (
            <div className="px-6 py-16 text-center text-bsmk-white/30 text-sm">Chargement…</div>
          ) : !users?.data.length ? (
            <div className="px-6 py-16 text-center text-bsmk-white/30 text-sm">Aucun utilisateur trouvé</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-white/25 font-normal">Nom</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-white/25 font-normal hidden md:table-cell">Email</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-white/25 font-normal">Rôle</th>
                  <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-white/25 font-normal hidden lg:table-cell">Inscrit</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {users.data.map(u => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-bsmk-white">
                        {u.firstName || u.lastName ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() : '—'}
                      </div>
                      <div className="text-xs text-white/35 md:hidden mt-0.5">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 text-white/55 hidden md:table-cell">{u.email}</td>
                    <td className="px-6 py-4">
                      <RoleSelect
                        value={u.role}
                        disabled={u.id === user.id || updatingId === u.id}
                        onChange={role => changeRole(u.id, role)}
                      />
                    </td>
                    <td className="px-6 py-4 text-white/30 text-xs hidden lg:table-cell">
                      {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.id !== user.id && (
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="text-xs text-white/20 hover:text-red-400 transition-colors"
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
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-white/30">{users.total} utilisateurs</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-xs text-white/40 hover:text-white disabled:opacity-20 transition-colors px-2 py-1"
                >
                  ← Précédent
                </button>
                <span className="text-xs text-white/25 px-2 py-1">{page} / {users.totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(users.totalPages, p + 1))}
                  disabled={page === users.totalPages}
                  className="text-xs text-white/40 hover:text-white disabled:opacity-20 transition-colors px-2 py-1"
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
    </div>
  )
}
