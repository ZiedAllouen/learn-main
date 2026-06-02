'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiFetch, ApiError } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'
import { useToast, ToastView } from './Toast'

export interface FieldDef {
  name: string
  label: string
  type?: 'text' | 'textarea' | 'date'
}

export interface ResourceConfig {
  path: string // '/articles' | '/events' | '/programs'
  titleField: string // 'title'
  fields: FieldDef[] // editable fields
}

export const RESOURCES: Record<'articles' | 'events' | 'programmes', ResourceConfig> = {
  articles: {
    path: '/articles',
    titleField: 'title',
    fields: [
      { name: 'slug', label: 'Slug' },
      { name: 'title', label: 'Titre' },
      { name: 'excerpt', label: 'Extrait', type: 'textarea' },
      { name: 'status', label: 'Statut (DRAFT / PUBLISHED / ARCHIVED)' },
    ],
  },
  events: {
    path: '/events',
    titleField: 'title',
    fields: [
      { name: 'slug', label: 'Slug' },
      { name: 'title', label: 'Titre' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'eventType', label: 'Type (CONCERT / WORKSHOP / EXHIBITION…)' },
      { name: 'startDate', label: 'Date de début', type: 'date' },
      { name: 'location', label: 'Lieu' },
      { name: 'status', label: 'Statut (DRAFT / PUBLISHED / ARCHIVED)' },
    ],
  },
  programmes: {
    path: '/programs',
    titleField: 'title',
    fields: [
      { name: 'slug', label: 'Slug' },
      { name: 'title', label: 'Titre' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'duration', label: 'Durée' },
      { name: 'priceIndicative', label: 'Prix indicatif' },
      { name: 'status', label: 'Statut (DRAFT / PUBLISHED / FULL / ARCHIVED)' },
    ],
  },
}

type Row = Record<string, unknown>

function str(v: unknown): string {
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v
  return String(v)
}

/** Convert an ISO/date-ish string to a value usable by a datetime-local input. */
function toDateInput(v: unknown): string {
  const s = str(v)
  if (!s) return ''
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return ''
  // datetime-local wants YYYY-MM-DDTHH:mm in local time
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16)
}

export function ContentSection({ config }: { config: ResourceConfig }) {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Row | null>(null) // open form (blank or pre-filled)
  const [editingSlug, setEditingSlug] = useState<string | null>(null) // original slug when editing (null = create)
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast, showToast } = useToast()

  const token = getAccessToken()

  /** Turn any thrown error into a clear, user-facing message. */
  function describeError(e: unknown): string {
    if (e instanceof ApiError) {
      if (e.status === 401) return 'Session expirée — reconnectez-vous.'
      if (e.status === 0) return 'API injoignable — vérifiez que le serveur tourne.'
    }
    return `Échec : ${e instanceof Error ? e.message : 'erreur inconnue'}`
  }

  const load = useCallback(() => {
    if (!token) {
      setRows([])
      setLoading(false)
      return
    }
    setLoading(true)
    apiFetch<{ data: Row[] }>(`${config.path}/admin/all?pageSize=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setRows(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }, [config.path, token])

  useEffect(() => {
    load()
  }, [load])

  function openNew() {
    setError(null)
    setEditing({})
    setEditingSlug(null)
    setForm(Object.fromEntries(config.fields.map(f => [f.name, ''])))
  }

  function openEdit(row: Row) {
    setError(null)
    setEditing(row)
    setEditingSlug(str(row.slug))
    setForm(
      Object.fromEntries(
        config.fields.map(f => [
          f.name,
          f.type === 'date' ? toDateInput(row[f.name]) : str(row[f.name]),
        ]),
      ),
    )
  }

  function closeForm() {
    setEditing(null)
    setEditingSlug(null)
    setForm({})
    setError(null)
  }

  async function save() {
    if (!token) return
    setSaving(true)
    setError(null)

    const isUpdate = editingSlug !== null

    // Build payload from the form's text fields.
    const payload: Record<string, unknown> = {}
    for (const f of config.fields) {
      const raw = form[f.name] ?? ''
      if (f.type === 'date') {
        if (raw) payload[f.name] = new Date(raw).toISOString()
      } else {
        const v = raw.trim()
        if (v) payload[f.name] = v
      }
    }

    // Articles carry a `body` object — set it on both create and update so
    // editing the excerpt also updates the body.
    if (config.path === '/articles') {
      payload.body = { html: form.excerpt?.trim() ?? '' }
    }

    try {
      if (isUpdate) {
        await apiFetch(`${config.path}/${editingSlug}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        })
      } else {
        await apiFetch(config.path, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        })
      }
      closeForm()
      load()
      showToast(isUpdate ? 'Modifications enregistrées.' : 'Élément créé.', 'success')
    } catch (e) {
      const message = describeError(e)
      setError(message)
      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function remove(row: Row) {
    if (!token) return
    const slug = str(row.slug)
    if (!slug || !confirm(`Supprimer « ${str(row[config.titleField]) || slug} » ?`)) return
    try {
      await apiFetch(`${config.path}/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      load()
      showToast('Élément supprimé.', 'success')
    } catch {
      showToast('La suppression a échoué.', 'error')
    }
  }

  const inputClass =
    'w-full bg-[#111] border border-white/10 text-white placeholder-white/25 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30'

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between gap-4">
        <h2 className="font-medium text-bsmk-white">Contenu</h2>
        {!editing && (
          <button
            type="button"
            onClick={openNew}
            className="text-xs tracking-wide uppercase text-bsmk-sand/70 hover:text-bsmk-sand border border-white/10 hover:border-white/25 rounded-lg px-3 py-1.5 transition-colors"
          >
            + Nouveau
          </button>
        )}
      </div>

      {editing ? (
        <div className="px-6 py-6 space-y-4">
          {config.fields.map(f => (
            <div key={f.name}>
              <label className="block text-xs tracking-widest uppercase text-white/25 mb-1.5">
                {f.label}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={form[f.name] ?? ''}
                  onChange={e => setForm(s => ({ ...s, [f.name]: e.target.value }))}
                  className={inputClass}
                  style={{ colorScheme: 'dark' }}
                />
              ) : (
                <input
                  type={f.type === 'date' ? 'datetime-local' : 'text'}
                  value={form[f.name] ?? ''}
                  onChange={e => setForm(s => ({ ...s, [f.name]: e.target.value }))}
                  className={inputClass}
                  style={{ colorScheme: 'dark' }}
                />
              )}
            </div>
          ))}

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={save}
              disabled={saving || !form.slug?.trim() || !form[config.titleField]?.trim()}
              className="text-xs tracking-wide uppercase bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-bsmk-white rounded-lg px-4 py-2 transition-colors"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="text-xs tracking-wide uppercase text-white/40 hover:text-white rounded-lg px-4 py-2 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="px-6 py-16 text-center text-bsmk-white/30 text-sm">Chargement…</div>
      ) : !rows.length ? (
        <div className="px-6 py-16 text-center text-bsmk-white/30 text-sm">Aucun élément.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-white/25 font-normal">Titre</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-white/25 font-normal hidden md:table-cell">Slug</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-white/25 font-normal hidden lg:table-cell">Statut</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={str(row.id) || str(row.slug) || i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-bsmk-white">{str(row[config.titleField]) || '—'}</div>
                  <div className="text-xs text-white/35 md:hidden mt-0.5">{str(row.slug)}</div>
                </td>
                <td className="px-6 py-4 text-white/55 hidden md:table-cell">{str(row.slug)}</td>
                <td className="px-6 py-4 text-white/30 text-xs hidden lg:table-cell">{str(row.status) || '—'}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => openEdit(row)}
                    className="text-xs text-white/40 hover:text-white transition-colors mr-4"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => remove(row)}
                    className="text-xs text-white/20 hover:text-red-400 transition-colors"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ToastView toast={toast} />
    </div>
  )
}
