'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiFetch, ApiError } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'
import { useToast, ToastView } from './Toast'
import { ConfirmModal } from './ConfirmModal'

export interface SelectOption {
  value: string
  label: string
}

export interface FieldDef {
  name: string
  label: string
  type?: 'text' | 'textarea' | 'date' | 'select'
  options?: SelectOption[]
  default?: string // optional default value for new items
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
      {
        name: 'status',
        label: 'Statut',
        type: 'select',
        default: 'DRAFT',
        options: [
          { value: 'DRAFT', label: 'Brouillon' },
          { value: 'PUBLISHED', label: 'Publié' },
          { value: 'ARCHIVED', label: 'Archivé' },
        ],
      },
    ],
  },
  events: {
    path: '/events',
    titleField: 'title',
    fields: [
      { name: 'slug', label: 'Slug' },
      { name: 'title', label: 'Titre' },
      { name: 'description', label: 'Description', type: 'textarea' },
      {
        name: 'eventType',
        label: 'Type',
        type: 'select',
        default: 'OTHER',
        options: [
          { value: 'CONCERT', label: 'Concert' },
          { value: 'EXHIBITION', label: 'Exposition' },
          { value: 'WORKSHOP', label: 'Atelier' },
          { value: 'RESIDENCY', label: 'Résidence' },
          { value: 'SCREENING', label: 'Projection' },
          { value: 'CONFERENCE', label: 'Conférence' },
          { value: 'FESTIVAL', label: 'Festival' },
          { value: 'OTHER', label: 'Autre' },
        ],
      },
      { name: 'startDate', label: 'Date de début', type: 'date' },
      { name: 'location', label: 'Lieu' },
      {
        name: 'status',
        label: 'Statut',
        type: 'select',
        default: 'DRAFT',
        options: [
          { value: 'DRAFT', label: 'Brouillon' },
          { value: 'PUBLISHED', label: 'Publié' },
          { value: 'ARCHIVED', label: 'Archivé' },
        ],
      },
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
      {
        name: 'status',
        label: 'Statut',
        type: 'select',
        default: 'DRAFT',
        options: [
          { value: 'DRAFT', label: 'Brouillon' },
          { value: 'PUBLISHED', label: 'Publié' },
          { value: 'FULL', label: 'Complet' },
          { value: 'ARCHIVED', label: 'Archivé' },
        ],
      },
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
  const [pendingDelete, setPendingDelete] = useState<Row | null>(null)
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
    setForm(Object.fromEntries(config.fields.map(f => [f.name, f.default ?? ''])))
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

  async function confirmDelete() {
    if (!token || !pendingDelete) return
    const slug = str(pendingDelete.slug)
    if (!slug) {
      setPendingDelete(null)
      return
    }
    try {
      await apiFetch(`${config.path}/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setPendingDelete(null)
      load()
      showToast('Élément supprimé.', 'success')
    } catch {
      setPendingDelete(null)
      showToast('La suppression a échoué.', 'error')
    }
  }

  const inputClass =
    'w-full bg-white border border-bsmk-black/15 text-bsmk-black placeholder-bsmk-black/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-page-accent'

  return (
    <div className="border border-bsmk-black/10 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-bsmk-black/10 flex items-center justify-between gap-4">
        <h2 className="font-medium text-bsmk-black">Contenu</h2>
        {!editing && (
          <button
            type="button"
            onClick={openNew}
            className="text-xs tracking-wide uppercase text-page-accent hover:text-bsmk-black border border-bsmk-black/15 hover:border-bsmk-black/30 rounded-lg px-3 py-1.5 transition-colors"
          >
            + Nouveau
          </button>
        )}
      </div>

      {editing ? (
        <div className="px-6 py-6 space-y-4">
          {config.fields.map(f => (
            <div key={f.name}>
              <label className="block text-xs tracking-widest uppercase text-bsmk-black/40 mb-1.5">
                {f.label}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={form[f.name] ?? ''}
                  onChange={e => setForm(s => ({ ...s, [f.name]: e.target.value }))}
                  className={inputClass}
                />
              ) : f.type === 'select' ? (
                <select
                  value={form[f.name] ?? ''}
                  onChange={e => setForm(s => ({ ...s, [f.name]: e.target.value }))}
                  className={inputClass}
                >
                  {(f.options ?? []).map(o => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type === 'date' ? 'datetime-local' : 'text'}
                  value={form[f.name] ?? ''}
                  onChange={e => setForm(s => ({ ...s, [f.name]: e.target.value }))}
                  className={inputClass}
                />
              )}
            </div>
          ))}

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={save}
              disabled={saving || !form.slug?.trim() || !form[config.titleField]?.trim()}
              className="text-xs tracking-wide uppercase bg-page-accent hover:bg-page-accent/90 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="text-xs tracking-wide uppercase text-bsmk-black/50 hover:text-bsmk-black rounded-lg px-4 py-2 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="px-6 py-16 text-center text-bsmk-black/40 text-sm">Chargement…</div>
      ) : !rows.length ? (
        <div className="px-6 py-16 text-center text-bsmk-black/40 text-sm">Aucun élément.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-bsmk-black/5">
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal">Titre</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal hidden md:table-cell">Slug</th>
              <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal hidden lg:table-cell">Statut</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={str(row.id) || str(row.slug) || i} className="border-b border-bsmk-black/5 hover:bg-black/[0.03] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-bsmk-black">{str(row[config.titleField]) || '—'}</div>
                  <div className="text-xs text-bsmk-black/50 md:hidden mt-0.5">{str(row.slug)}</div>
                </td>
                <td className="px-6 py-4 text-bsmk-black/60 hidden md:table-cell">{str(row.slug)}</td>
                <td className="px-6 py-4 text-bsmk-black/40 text-xs hidden lg:table-cell">{str(row.status) || '—'}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => openEdit(row)}
                    className="text-xs text-bsmk-black/50 hover:text-bsmk-black transition-colors mr-4"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => setPendingDelete(row)}
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

      <ToastView toast={toast} />

      <ConfirmModal
        open={!!pendingDelete}
        destructive
        title="Supprimer cet élément ?"
        message={
          pendingDelete
            ? `« ${str(pendingDelete[config.titleField]) || str(pendingDelete.slug)} » sera définitivement supprimé.`
            : ''
        }
        confirmLabel="Supprimer"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
