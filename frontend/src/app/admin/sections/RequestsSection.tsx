'use client'

import { useEffect, useState } from 'react'
import { getAccessToken } from '@/lib/auth'
import {
  listRequests,
  updateRequest,
  type RequestRecord,
  type RequestStatus,
  type RequestType,
} from '@/lib/api/requests'

const STATUS_OPTIONS: RequestStatus[] = ['NEW', 'REVIEWING', 'ACCEPTED', 'DECLINED']

const STATUS_LABELS: Record<RequestStatus, string> = {
  NEW: 'Nouveau',
  REVIEWING: 'En cours',
  ACCEPTED: 'Accepté',
  DECLINED: 'Refusé',
}

const TYPE_LABELS: Record<RequestType, string> = {
  ENROLLMENT: 'Inscription',
  BOOKING: 'Réservation',
  PROJECT: 'Projet',
  PARTNERSHIP: 'Partenariat',
  OPPORTUNITY: 'Opportunité',
}

function objet(r: RequestRecord): string {
  return (
    r.program?.title ??
    r.space?.name ??
    (typeof r.details?.eventTitle === 'string' ? (r.details.eventTitle as string) : undefined) ??
    '—'
  )
}

export function RequestsSection() {
  const [requests, setRequests] = useState<RequestRecord[]>([])
  const [statusFilter, setStatusFilter] = useState<'' | RequestStatus>('')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const token = getAccessToken()

  useEffect(() => {
    if (!token) return
    let cancelled = false
    setLoading(true)
    listRequests(token, statusFilter ? { status: statusFilter } : {})
      .then(res => {
        if (!cancelled) setRequests(res.data)
      })
      .catch(() => {
        if (!cancelled) setRequests([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [token, statusFilter])

  async function changeStatus(id: string, status: RequestStatus) {
    if (!token) return
    setUpdatingId(id)
    setRequests(prev => prev.map(r => (r.id === id ? { ...r, status } : r)))
    try {
      await updateRequest(token, id, { status })
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="font-medium text-bsmk-white">Demandes</h2>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as '' | RequestStatus)}
          className="bg-[#111] border border-white/10 text-white/70 rounded-lg px-3 py-1.5 text-sm focus:outline-none appearance-none cursor-pointer"
          style={{ colorScheme: 'dark' }}
        >
          <option value="" style={{ background: '#111' }}>Tous les statuts</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s} style={{ background: '#111' }}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="px-6 py-16 text-center text-bsmk-white/30 text-sm">Chargement…</div>
      ) : !requests.length ? (
        <div className="px-6 py-16 text-center text-bsmk-white/30 text-sm">Aucune demande.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-white/25 font-normal">Type</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-white/25 font-normal">Nom</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-white/25 font-normal hidden md:table-cell">Email</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-white/25 font-normal hidden lg:table-cell">Objet</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-white/25 font-normal hidden lg:table-cell">Date</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-white/25 font-normal">Statut</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-6 py-4 text-white/55">{TYPE_LABELS[r.type] ?? r.type}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-bsmk-white">{r.name}</div>
                  <div className="text-xs text-white/35 md:hidden mt-0.5">{r.email}</div>
                  {r.message && (
                    <div className="text-xs text-white/30 mt-1 max-w-xs truncate" title={r.message}>
                      {r.message}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-white/55 hidden md:table-cell">{r.email}</td>
                <td className="px-6 py-4 text-white/55 hidden lg:table-cell">{objet(r)}</td>
                <td className="px-6 py-4 text-white/30 text-xs hidden lg:table-cell">
                  {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={r.status}
                    disabled={updatingId === r.id}
                    onChange={e => changeStatus(r.id, e.target.value as RequestStatus)}
                    className="bg-[#111] border border-white/10 text-white/70 rounded-lg px-3 py-1.5 text-sm focus:outline-none appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ colorScheme: 'dark' }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s} style={{ background: '#111' }}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
