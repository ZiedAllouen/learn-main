'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiFetch, ApiError } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'
import { useToast, ToastView } from '@/app/[locale]/admin/sections/Toast'
import type { ArtistProfile } from '@/lib/artist'

interface AdminArtistList {
  data: ArtistProfile[]
}

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publié',
  ARCHIVED: 'Archivé',
}

export function ArtistsModeration() {
  const token = getAccessToken()
  const [artists, setArtists] = useState<ArtistProfile[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [busySlug, setBusySlug] = useState<string | null>(null)
  const { toast, showToast } = useToast()

  const load = useCallback(() => {
    if (!token) return
    setLoading(true)
    apiFetch<AdminArtistList>('/artists/admin/all?pageSize=100', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setArtists(res.data ?? []))
      .catch(() => setArtists(null))
      .finally(() => setLoading(false))
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  async function setStatus(slug: string, status: 'DRAFT' | 'PUBLISHED') {
    if (!token) return
    setBusySlug(slug)
    const prev = artists
    setArtists(a => (a ? a.map(x => (x.slug === slug ? { ...x, status } : x)) : a))
    try {
      await apiFetch(`/artists/${slug}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      })
      showToast(status === 'PUBLISHED' ? 'Profil publié.' : 'Profil repassé en brouillon.', 'success')
    } catch (e) {
      setArtists(prev)
      showToast(e instanceof ApiError ? 'Action refusée.' : 'Échec de la mise à jour.', 'error')
    } finally {
      setBusySlug(null)
    }
  }

  if (loading) return <div className="px-6 py-16 text-center text-bsmk-black/40 text-sm">Chargement…</div>
  if (!artists?.length) return <div className="px-6 py-16 text-center text-bsmk-black/40 text-sm">Aucun profil artiste</div>

  return (
    <div className="border border-bsmk-black/10 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-bsmk-black/5">
            <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal">Artiste</th>
            <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal hidden md:table-cell">Ville</th>
            <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal">Statut</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {artists.map(a => (
            <tr key={a.id} className="border-b border-bsmk-black/5 hover:bg-black/[0.03] transition-colors">
              <td className="px-6 py-4 font-medium text-bsmk-black">{a.name}</td>
              <td className="px-6 py-4 text-bsmk-black/60 hidden md:table-cell">{a.city ?? '—'}</td>
              <td className="px-6 py-4 text-bsmk-black/60">{STATUS_LABEL[a.status] ?? a.status}</td>
              <td className="px-6 py-4 text-right">
                {a.status === 'PUBLISHED' ? (
                  <button
                    disabled={busySlug === a.slug}
                    onClick={() => setStatus(a.slug, 'DRAFT')}
                    className="text-xs text-bsmk-black/40 hover:text-bsmk-black transition-colors disabled:opacity-40"
                  >
                    Dépublier
                  </button>
                ) : (
                  <button
                    disabled={busySlug === a.slug}
                    onClick={() => setStatus(a.slug, 'PUBLISHED')}
                    className="text-xs text-page-accent hover:opacity-80 transition-opacity disabled:opacity-40"
                  >
                    Publier
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastView toast={toast} />
    </div>
  )
}
