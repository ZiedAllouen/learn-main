'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'
import { useToast, ToastView } from './Toast'
import { ConfirmModal } from './ConfirmModal'

interface Artist {
  id: string
  slug: string
  name: string
  email?: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  featured: boolean
  photoUrl?: string | null
  city?: string | null
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#1E96FF',
  PUBLISHED: '#00E00E',
  ARCHIVED: '#999',
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publié',
  ARCHIVED: 'Archivé',
}

export function ArtistsSection() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [pendingDelete, setPendingDelete] = useState<Artist | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const { toast, showToast } = useToast()

  const token = getAccessToken()

  const load = useCallback(() => {
    if (!token) return
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), pageSize: '20' })
    if (statusFilter) params.set('status', statusFilter)
    if (search) params.set('search', search)
    apiFetch<{ data: Artist[]; total: number; totalPages: number }>(
      `/artists/admin/all?${params}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
      .then(res => {
        setArtists(Array.isArray(res.data) ? res.data : [])
        setTotal(res.total)
        setTotalPages(res.totalPages)
      })
      .catch(() => { setArtists([]); setTotal(0) })
      .finally(() => setLoading(false))
  }, [token, page, statusFilter, search])

  useEffect(() => { load() }, [load])

  async function toggleStatus(artist: Artist) {
    if (!token) return
    const nextStatus = artist.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    setUpdatingId(artist.id)
    const prev = artists
    setArtists(a => a.map(x => x.id === artist.id ? { ...x, status: nextStatus } : x))
    try {
      await apiFetch(`/artists/${artist.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: nextStatus }),
      })
      showToast(`Artiste ${nextStatus === 'PUBLISHED' ? 'publié' : 'déspublié'}.`, 'success')
    } catch {
      setArtists(prev)
      showToast('Échec de la mise à jour.', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  async function toggleFeatured(artist: Artist) {
    if (!token) return
    const next = !artist.featured
    setUpdatingId(artist.id)
    const prev = artists
    setArtists(a => a.map(x => x.id === artist.id ? { ...x, featured: next } : x))
    try {
      await apiFetch(`/artists/${artist.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ featured: next }),
      })
      showToast(next ? 'Artiste mis en avant.' : 'Artiste retiré de la mise en avant.', 'success')
    } catch {
      setArtists(prev)
      showToast('Échec de la mise à jour.', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  async function confirmDelete() {
    if (!token || !pendingDelete) return
    try {
      await apiFetch(`/artists/${pendingDelete.slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setPendingDelete(null)
      load()
      showToast('Artiste supprimé.', 'success')
    } catch {
      setPendingDelete(null)
      showToast('La suppression a échoué.', 'error')
    }
  }

  return (
    <div className="border border-bsmk-black/10 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-bsmk-black/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="font-medium text-bsmk-black">Artistes ({total})</h2>
        <div className="flex gap-3 flex-wrap">
          <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1) }} className="flex gap-2">
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Rechercher…"
              className="bg-white border border-bsmk-black/15 text-bsmk-black placeholder-bsmk-black/30 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-page-accent w-44"
            />
            <button type="submit" className="text-xs text-bsmk-black/50 hover:text-bsmk-black transition-colors px-2">→</button>
          </form>
          {(search || statusFilter) && (
            <button
              onClick={() => { setSearch(''); setSearchInput(''); setStatusFilter(''); setPage(1) }}
              className="text-xs text-bsmk-black/40 hover:text-red-500 transition-colors px-2 py-1.5"
            >
              Réinitialiser
            </button>
          )}
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="bg-white border border-bsmk-black/15 text-bsmk-black/70 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-page-accent appearance-none cursor-pointer"
          >
            <option value="">Tous les statuts</option>
            <option value="DRAFT">Brouillon</option>
            <option value="PUBLISHED">Publié</option>
            <option value="ARCHIVED">Archivé</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="px-6 py-16 text-center text-bsmk-black/40 text-sm">Chargement…</div>
      ) : !artists.length ? (
        <div className="px-6 py-16 text-center text-bsmk-black/40 text-sm">Aucun artiste trouvé.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-bsmk-black/5">
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal">Nom</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal hidden md:table-cell">Email</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal hidden lg:table-cell">Ville</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal">Statut</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal hidden lg:table-cell">En avant</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {artists.map(a => (
              <tr key={a.id} className="border-b border-bsmk-black/5 hover:bg-black/[0.03] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {a.photoUrl ? (
                      <img src={a.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-bsmk-black/5 flex items-center justify-center text-xs text-bsmk-black/40 uppercase">
                        {a.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-bsmk-black">{a.name}</div>
                      <div className="text-xs text-bsmk-black/50 md:hidden">{a.email ?? '—'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-bsmk-black/60 hidden md:table-cell">{a.email ?? '—'}</td>
                <td className="px-6 py-4 text-bsmk-black/50 hidden lg:table-cell">{a.city ?? '—'}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(a)}
                    disabled={updatingId === a.id}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-40"
                    style={{
                      color: STATUS_COLORS[a.status],
                      borderColor: STATUS_COLORS[a.status] + '40',
                      backgroundColor: STATUS_COLORS[a.status] + '10',
                    }}
                  >
                    {STATUS_LABELS[a.status]}
                  </button>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <button
                    onClick={() => toggleFeatured(a)}
                    disabled={updatingId === a.id}
                    className="text-xs transition-colors disabled:opacity-40"
                    style={{ color: a.featured ? '#2F66FC' : '#ccc' }}
                  >
                    {a.featured ? '★' : '☆'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setPendingDelete(a)}
                    className="text-xs text-bsmk-black/40 hover:text-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-bsmk-black/5 flex items-center justify-between">
          <span className="text-xs text-bsmk-black/40">{total} artistes</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-xs text-bsmk-black/50 hover:text-bsmk-black disabled:opacity-20 transition-colors px-2 py-1"
            >
              ← Précédent
            </button>
            <span className="text-xs text-bsmk-black/40 px-2 py-1">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-xs text-bsmk-black/50 hover:text-bsmk-black disabled:opacity-20 transition-colors px-2 py-1"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      <ToastView toast={toast} />

      <ConfirmModal
        open={!!pendingDelete}
        destructive
        title="Supprimer cet artiste ?"
        message={pendingDelete ? `« ${pendingDelete.name} » sera définitivement supprimé.` : ''}
        confirmLabel="Supprimer"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
