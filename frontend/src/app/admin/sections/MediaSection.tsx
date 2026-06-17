'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'
import { useToast, ToastView } from './Toast'
import { ConfirmModal } from './ConfirmModal'

interface MediaItem {
  id: string
  slug: string
  title: string
  type: 'VIDEO' | 'PHOTO'
  description: string | null
  url: string | null
  thumbnailUrl: string | null
  imageUrls: string[]
  status: string
  featured: boolean
  publishedAt: string | null
  createdAt: string
}

const TYPE_COLORS: Record<string, string> = {
  VIDEO: '#E07A5F',
  PHOTO: '#2F66FC',
}

const TYPE_LABELS: Record<string, string> = {
  VIDEO: 'Vidéo',
  PHOTO: 'Photo',
}

const MAX_TOTAL = 10
const MAX_PER_TYPE = 5

export function MediaSection() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<MediaItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [form, setForm] = useState({
    title: '',
    type: 'VIDEO' as 'VIDEO' | 'PHOTO',
    description: '',
    url: '',
    publishedAt: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(null)
  const { toast, showToast } = useToast()

  const token = getAccessToken()

  const load = useCallback(() => {
    if (!token) return
    setLoading(true)
    apiFetch<{ data: MediaItem[] }>(`/media/admin/all?pageSize=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [token])

  useEffect(() => { load() }, [load])

  const videoCount = items.filter(i => i.type === 'VIDEO').length
  const photoCount = items.filter(i => i.type === 'PHOTO').length
  const canAddVideo = videoCount < MAX_PER_TYPE
  const canAddPhoto = photoCount < MAX_PER_TYPE
  const canAdd = items.length < MAX_TOTAL && (canAddVideo || canAddPhoto)

  function openNew(type: 'VIDEO' | 'PHOTO') {
    setError(null)
    setEditing(null)
    setIsCreating(true)
    setForm({ title: '', type, description: '', url: '', publishedAt: '' })
  }

  function openEdit(item: MediaItem) {
    setError(null)
    setIsCreating(false)
    setEditing(item)
    setForm({
      title: item.title,
      type: item.type,
      description: item.description ?? '',
      url: item.url ?? '',
      publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 16) : '',
    })
  }

  function closeForm() {
    setEditing(null)
    setIsCreating(false)
    setForm({ title: '', type: 'VIDEO', description: '', url: '', publishedAt: '' })
    setError(null)
  }

  function slugify(s: string) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'media'
  }

  async function save() {
    if (!token) return
    setSaving(true)
    setError(null)

    const payload: Record<string, unknown> = {
      slug: slugify(form.title),
      title: form.title.trim(),
      type: form.type,
      status: 'PUBLISHED',
    }
    if (form.description.trim()) payload.description = form.description.trim()
    if (form.url.trim()) payload.url = form.url.trim()
    if (form.publishedAt) payload.publishedAt = new Date(form.publishedAt).toISOString()

    try {
      if (editing) {
        await apiFetch(`/media/${editing.slug}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        })
        showToast('Média modifié.', 'success')
      } else {
        await apiFetch('/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        })
        showToast('Média créé.', 'success')
      }
      closeForm()
      load()
    } catch (e) {
      const msg = `Échec : ${e instanceof Error ? e.message : 'erreur inconnue'}`
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!token || !pendingDelete) return
    try {
      await apiFetch(`/media/${pendingDelete.slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setPendingDelete(null)
      load()
      showToast('Média supprimé.', 'success')
    } catch {
      setPendingDelete(null)
      showToast('La suppression a échoué.', 'error')
    }
  }

  const inputClass = 'w-full bg-white border border-bsmk-black/15 text-bsmk-black placeholder-bsmk-black/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-page-accent'

  return (
    <div className="border border-bsmk-black/10 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-bsmk-black/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-medium text-bsmk-black">Médias ({items.length}/{MAX_TOTAL})</h2>
          <p className="text-xs text-bsmk-black/40 mt-1">
            Vidéos : {videoCount}/{MAX_PER_TYPE} · Photos : {photoCount}/{MAX_PER_TYPE}
          </p>
        </div>
        {canAdd && !editing && !isCreating && (
          <div className="flex gap-2">
            {canAddVideo && (
              <button
                onClick={() => openNew('VIDEO')}
                className="text-xs tracking-wide uppercase border border-bsmk-black/15 hover:border-bsmk-black/30 rounded-lg px-3 py-1.5 transition-colors"
                style={{ color: TYPE_COLORS.VIDEO }}
              >
                + Vidéo
              </button>
            )}
            {canAddPhoto && (
              <button
                onClick={() => openNew('PHOTO')}
                className="text-xs tracking-wide uppercase border border-bsmk-black/15 hover:border-bsmk-black/30 rounded-lg px-3 py-1.5 transition-colors"
                style={{ color: TYPE_COLORS.PHOTO }}
              >
                + Photo
              </button>
            )}
          </div>
        )}
      </div>

      {(editing || isCreating) && (
        <div className="px-6 py-6 space-y-4 border-b border-bsmk-black/10">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-lg border"
              style={{
                color: TYPE_COLORS[form.type],
                borderColor: TYPE_COLORS[form.type] + '40',
                backgroundColor: TYPE_COLORS[form.type] + '10',
              }}
            >
              {TYPE_LABELS[form.type]}
            </span>
            <span className="text-xs text-bsmk-black/40">
              {editing ? 'Modifier' : 'Ajouter'} une {TYPE_LABELS[form.type].toLowerCase()}
            </span>
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-bsmk-black/40 mb-1.5">Titre *</label>
            <input
              value={form.title}
              onChange={e => setForm(s => ({ ...s, title: e.target.value }))}
              placeholder={form.type === 'VIDEO' ? 'Ex: Présentation BSMK' : 'Ex: Vernissage 2025'}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-bsmk-black/40 mb-1.5">
              Lien {form.type === 'VIDEO' ? 'YouTube' : 'image'} *
            </label>
            <input
              value={form.url}
              onChange={e => setForm(s => ({ ...s, url: e.target.value }))}
              placeholder={form.type === 'VIDEO' ? 'https://youtube.com/watch?v=...' : 'https://example.com/photo.jpg'}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-bsmk-black/40 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={e => setForm(s => ({ ...s, description: e.target.value }))}
              placeholder="Description courte du média…"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-bsmk-black/40 mb-1.5">Date de publication</label>
            <input
              type="datetime-local"
              value={form.publishedAt}
              onChange={e => setForm(s => ({ ...s, publishedAt: e.target.value }))}
              className={inputClass}
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={save}
              disabled={saving || !form.title.trim() || !form.url.trim()}
              className="text-xs tracking-wide uppercase bg-page-accent hover:bg-page-accent/90 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button
              onClick={closeForm}
              className="text-xs tracking-wide uppercase text-bsmk-black/50 hover:text-bsmk-black rounded-lg px-4 py-2 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="px-6 py-16 text-center text-bsmk-black/40 text-sm">Chargement…</div>
      ) : !items.length ? (
        <div className="px-6 py-16 text-center text-bsmk-black/40 text-sm">
          Aucun média. Ajoutez des vidéos ou des photos pour les afficher sur le site.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {items.map(item => (
            <div
              key={item.id}
              className="group border border-bsmk-black/10 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Thumbnail / embed preview */}
              <div className="relative aspect-video bg-bsmk-black/5">
                {item.type === 'VIDEO' && item.url ? (
                  <iframe
                    src={item.url.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={item.title}
                  />
                ) : item.thumbnailUrl || (item.imageUrls && item.imageUrls.length > 0) ? (
                  <img
                    src={item.thumbnailUrl || item.imageUrls[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-bsmk-black/20 text-3xl">
                    {item.type === 'VIDEO' ? '▶' : '◼'}
                  </div>
                )}
                {/* Type badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                    style={{
                      color: 'white',
                      backgroundColor: TYPE_COLORS[item.type],
                    }}
                  >
                    {TYPE_LABELS[item.type]}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-medium text-bsmk-black text-sm mb-1 line-clamp-1">{item.title}</h3>
                {item.description && (
                  <p className="text-xs text-bsmk-black/50 line-clamp-2 mb-2">{item.description}</p>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-page-accent hover:underline line-clamp-1 block mb-3"
                  >
                    {item.url}
                  </a>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-bsmk-black/30">
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString('fr-FR')
                      : new Date(item.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEdit(item)}
                      className="text-xs text-bsmk-black/40 hover:text-bsmk-black transition-colors"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => setPendingDelete(item)}
                      className="text-xs text-bsmk-black/30 hover:text-red-600 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastView toast={toast} />

      <ConfirmModal
        open={!!pendingDelete}
        destructive
        title="Supprimer ce média ?"
        message={pendingDelete ? `« ${pendingDelete.title} » sera définitivement supprimé.` : ''}
        confirmLabel="Supprimer"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
