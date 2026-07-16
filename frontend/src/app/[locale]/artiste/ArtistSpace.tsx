'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser, logout } from '@/lib/auth'
import { ApiError } from '@/lib/api'
import {
  getMyArtist,
  saveMyArtist,
  listDisciplines,
  type ArtistProfile,
  type DisciplineOption,
  type UpsertArtistPayload,
} from '@/lib/artist'
import { useToast, ToastView } from '@/app/[locale]/admin/sections/Toast'
import { ConfirmModal } from '@/app/[locale]/admin/sections/ConfirmModal'

/** Roles allowed to access the artist self-service space. */
const ALLOWED_ROLES = new Set(['ADMIN', 'EDITOR', 'ARTIST'])

/** Editable form shape for a portfolio work — imageUrls is held as raw text. */
interface WorkForm {
  title: string
  type: string
  year: string
  description: string
  imageUrlsText: string
}

/** Editable form shape for the whole profile. */
interface ProfileForm {
  name: string
  city: string
  address: string
  websiteUrl: string
  instagramUrl: string
  email: string
  bio: string
  statement: string
  photoUrl: string
  coverUrl: string
  latitude: string
  longitude: string
}

const EMPTY_FORM: ProfileForm = {
  name: '',
  city: '',
  address: '',
  websiteUrl: '',
  instagramUrl: '',
  email: '',
  bio: '',
  statement: '',
  photoUrl: '',
  coverUrl: '',
  latitude: '',
  longitude: '',
}

function str(v: string | number | null | undefined): string {
  return v === null || v === undefined ? '' : String(v)
}

function profileToForm(p: ArtistProfile): ProfileForm {
  return {
    name: str(p.name),
    city: str(p.city),
    address: str(p.address),
    websiteUrl: str(p.websiteUrl),
    instagramUrl: str(p.instagramUrl),
    email: str(p.email),
    bio: str(p.bio),
    statement: str(p.statement),
    photoUrl: str(p.photoUrl),
    coverUrl: str(p.coverUrl),
    latitude: str(p.latitude),
    longitude: str(p.longitude),
  }
}

function worksToForms(works: ArtistProfile['works']): WorkForm[] {
  return works.map(w => ({
    title: str(w.title),
    type: str(w.type),
    year: str(w.year),
    description: str(w.description),
    imageUrlsText: (w.imageUrls ?? []).join(', '),
  }))
}

const EMPTY_WORK: WorkForm = { title: '', type: '', year: '', description: '', imageUrlsText: '' }

// ── Reusable themed field primitives ───────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs tracking-widest uppercase text-bsmk-black/40 mb-1.5">
      {children}
    </label>
  )
}

const INPUT_CLS =
  'w-full bg-white border border-bsmk-black/15 text-bsmk-black placeholder-bsmk-black/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-page-accent transition-colors'

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <FieldLabel>
        {label}
        {required && <span className="text-page-accent ml-0.5">*</span>}
      </FieldLabel>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className={INPUT_CLS}
      />
    </div>
  )
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className={`${INPUT_CLS} resize-y leading-relaxed`}
      />
    </div>
  )
}

function SectionCard({
  index,
  kicker,
  title,
  description,
  children,
}: {
  index: string
  kicker: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="border border-bsmk-black/10 rounded-2xl bg-black/[0.015] overflow-hidden">
      <header className="px-6 sm:px-8 pt-7 pb-5 border-b border-bsmk-black/10 flex items-start gap-4">
        <span
          className="font-display text-2xl leading-none text-page-accent/70 select-none mt-0.5"
          aria-hidden
        >
          {index}
        </span>
        <div>
          <p className="text-xs tracking-widest uppercase text-bsmk-black/40">{kicker}</p>
          <h2 className="font-display text-2xl text-bsmk-black mt-0.5">{title}</h2>
          {description && <p className="text-sm text-bsmk-black/50 mt-1.5">{description}</p>}
        </div>
      </header>
      <div className="px-6 sm:px-8 py-7">{children}</div>
    </section>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export function ArtistSpace() {
  const router = useRouter()
  const { toast, showToast } = useToast()

  // Role gate. Resolve once on mount; `null` = not yet checked.
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ArtistProfile | null>(null)
  // Has the user opened the editor? Always true when a profile exists; for a
  // brand-new artist it starts false so we can show the empty state first.
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM)
  const [works, setWorks] = useState<WorkForm[]>([])
  const [disciplines, setDisciplines] = useState<DisciplineOption[]>([])
  const [selectedDisciplineIds, setSelectedDisciplineIds] = useState<string[]>([])

  // Pending work deletion awaiting confirmation (work has a title).
  const [pendingDeleteWork, setPendingDeleteWork] = useState<number | null>(null)

  function setField<K extends keyof ProfileForm>(key: K, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  // 1. Role gate.
  useEffect(() => {
    const user = getAuthUser()
    if (!user) {
      router.replace('/login?redirect=/artiste')
      return
    }
    if (!ALLOWED_ROLES.has(user.role)) {
      router.replace('/')
      return
    }
    setEmail(user.email)
    setAllowed(true)
  }, [router])

  // 2. Load profile + disciplines once the gate passes.
  useEffect(() => {
    if (allowed !== true) return
    let cancelled = false
    setLoading(true)
    Promise.all([getMyArtist(), listDisciplines()])
      .then(([myArtist, disc]) => {
        if (cancelled) return
        setDisciplines(disc)
        if (myArtist) {
          hydrateFromProfile(myArtist)
          setEditing(true)
        } else {
          setProfile(null)
          setEditing(false)
        }
      })
      .catch(() => {
        if (!cancelled) showToast('Impossible de charger votre profil.', 'error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // showToast is stable (useCallback); hydrateFromProfile is a local closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed])

  function hydrateFromProfile(p: ArtistProfile) {
    setProfile(p)
    setForm(profileToForm(p))
    setWorks(worksToForms(p.works))
    setSelectedDisciplineIds(p.disciplines.map(d => d.discipline.id))
  }

  function toggleDiscipline(id: string) {
    setSelectedDisciplineIds(ids =>
      ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id],
    )
  }

  // ── Works editing ──
  function updateWork<K extends keyof WorkForm>(index: number, key: K, value: string) {
    setWorks(ws => ws.map((w, i) => (i === index ? { ...w, [key]: value } : w)))
  }

  function addWork() {
    setWorks(ws => [...ws, { ...EMPTY_WORK }])
  }

  function removeWorkAt(index: number) {
    setWorks(ws => ws.filter((_, i) => i !== index))
  }

  function requestRemoveWork(index: number) {
    const w = works[index]
    if (w && w.title.trim()) {
      setPendingDeleteWork(index)
    } else {
      removeWorkAt(index)
    }
  }

  function moveWork(index: number, dir: -1 | 1) {
    setWorks(ws => {
      const target = index + dir
      if (target < 0 || target >= ws.length) return ws
      const next = [...ws]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  // ── Save ──
  function buildPayload(): UpsertArtistPayload {
    const clean = (v: string) => {
      const t = v.trim()
      return t === '' ? undefined : t
    }
    const num = (v: string) => {
      const n = Number(v)
      return Number.isFinite(n) && v.trim() !== '' ? n : undefined
    }

    const builtWorks = works
      .filter(w => w.title.trim() !== '')
      .map((w, index) => {
        const year = w.year.trim() !== '' ? Number(w.year) : undefined
        return {
          title: w.title.trim(),
          description: clean(w.description),
          type: clean(w.type),
          year: year !== undefined && Number.isFinite(year) ? year : undefined,
          imageUrls: w.imageUrlsText
            .split(',')
            .map(s => s.trim())
            .filter(s => s !== ''),
          sortOrder: index,
        }
      })

    return {
      name: form.name.trim(),
      bio: clean(form.bio),
      statement: clean(form.statement),
      photoUrl: clean(form.photoUrl),
      coverUrl: clean(form.coverUrl),
      city: clean(form.city),
      address: clean(form.address),
      websiteUrl: clean(form.websiteUrl),
      instagramUrl: clean(form.instagramUrl),
      email: clean(form.email),
      latitude: num(form.latitude),
      longitude: num(form.longitude),
      disciplineIds: selectedDisciplineIds,
      works: builtWorks,
    }
  }

  async function handleSave() {
    if (!form.name.trim()) {
      showToast('Le nom est requis.', 'error')
      return
    }
    setSaving(true)
    try {
      const saved = await saveMyArtist(buildPayload())
      hydrateFromProfile(saved)
      showToast('Profil enregistré.', 'success')
    } catch (err) {
      // ApiError (and anything else) surfaces the same user-facing message.
      void (err instanceof ApiError)
      showToast("Échec de l'enregistrement.", 'error')
    } finally {
      setSaving(false)
    }
  }

  function handleLogout() {
    logout()
    router.push('/login')
  }

  // Render nothing until the role gate resolves.
  if (allowed !== true) return null

  const emailLocalPart = email.includes('@') ? email.split('@')[0] : email
  const status = profile?.status ?? 'DRAFT'

  return (
    <div className="min-h-screen bg-bsmk-white text-bsmk-black">
      {/* Top bar — mirrors the admin dashboard */}
      <div className="border-b border-bsmk-black/10 bg-bsmk-white/95 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs tracking-widest uppercase text-page-accent hover:text-bsmk-black transition-colors"
            >
              ← Site public
            </Link>
            <span className="text-bsmk-black/20">|</span>
            <span className="text-sm font-medium text-bsmk-black">Espace Artiste</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-bsmk-black/50 hidden sm:inline">{email}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-bsmk-black/50 hover:text-bsmk-black transition-colors tracking-wide uppercase"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Decorative discipline-color stripe */}
        <div className="flex gap-1 mb-8">
          {['#B8C8D8', '#D4B8A8', '#C8D4B0', '#C8B8D4', '#B8D4C8', '#D4C4B0'].map(c => (
            <div key={c} className="h-0.5 flex-1 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>

        <p className="text-xs tracking-widest uppercase text-bsmk-black/40">Membre · VetrinArt</p>
        <h1 className="font-display text-4xl font-bold mt-1.5 mb-2">Mon profil artiste</h1>
        <p className="text-sm text-bsmk-black/50 mb-10 max-w-xl">
          Gérez votre présentation publique, votre portfolio et vos informations de contact sur la
          plateforme.
        </p>

        {loading ? (
          <div className="border border-bsmk-black/10 rounded-2xl px-6 py-20 text-center text-bsmk-black/40 text-sm">
            Chargement…
          </div>
        ) : !profile && !editing ? (
          /* ── EMPTY STATE ── */
          <div className="border border-bsmk-black/10 rounded-2xl bg-black/[0.015] px-8 py-16 text-center">
            <div className="mx-auto mb-6 w-12 h-12 rounded-full border border-page-accent/40 flex items-center justify-center text-page-accent font-display text-xl">
              +
            </div>
            <h2 className="font-display text-2xl text-bsmk-black">Créez votre profil artiste</h2>
            <p className="text-sm text-bsmk-black/55 mt-3 max-w-md mx-auto leading-relaxed">
              Vous n&apos;avez pas encore de profil. Renseignez votre biographie, vos disciplines et
              vos œuvres pour rejoindre la galerie VetrinArt. Votre profil sera relu par
              l&apos;équipe avant publication.
            </p>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="mt-8 inline-flex items-center gap-2 bg-page-accent hover:bg-page-accent-hover text-white text-sm tracking-wide px-6 py-2.5 rounded-lg transition-colors"
            >
              Commencer
            </button>
          </div>
        ) : (
          /* ── EDITOR ── */
          <div className="space-y-8">
            {/* c. Status banner */}
            <StatusBanner status={status} slug={profile?.slug} />

            {/* a. Profil */}
            <SectionCard
              index="01"
              kicker="Identité"
              title="Profil"
              description="Les informations qui apparaîtront sur votre page publique."
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <TextField
                    label="Nom d'artiste"
                    required
                    value={form.name}
                    onChange={v => setField('name', v)}
                    placeholder={emailLocalPart}
                  />
                </div>
                <TextField label="Ville" value={form.city} onChange={v => setField('city', v)} />
                <TextField
                  label="Adresse"
                  value={form.address}
                  onChange={v => setField('address', v)}
                />
                <TextField
                  label="Site web"
                  type="url"
                  value={form.websiteUrl}
                  onChange={v => setField('websiteUrl', v)}
                  placeholder="https://"
                />
                <TextField
                  label="Instagram"
                  type="url"
                  value={form.instagramUrl}
                  onChange={v => setField('instagramUrl', v)}
                  placeholder="https://instagram.com/…"
                />
                <TextField
                  label="Email de contact"
                  type="email"
                  value={form.email}
                  onChange={v => setField('email', v)}
                />
                <TextField
                  label="Photo (URL)"
                  type="url"
                  value={form.photoUrl}
                  onChange={v => setField('photoUrl', v)}
                  placeholder="https://"
                />
                <div className="sm:col-span-2">
                  <TextField
                    label="Image de couverture (URL)"
                    type="url"
                    value={form.coverUrl}
                    onChange={v => setField('coverUrl', v)}
                    placeholder="https://"
                  />
                </div>
                <div className="sm:col-span-2">
                  <TextArea
                    label="Biographie"
                    value={form.bio}
                    rows={4}
                    onChange={v => setField('bio', v)}
                    placeholder="Quelques lignes sur votre parcours…"
                  />
                </div>
                <div className="sm:col-span-2">
                  <TextArea
                    label="Démarche artistique"
                    value={form.statement}
                    rows={4}
                    onChange={v => setField('statement', v)}
                    placeholder="Votre intention, votre univers…"
                  />
                </div>
                <TextField
                  label="Latitude"
                  type="number"
                  value={form.latitude}
                  onChange={v => setField('latitude', v)}
                />
                <TextField
                  label="Longitude"
                  type="number"
                  value={form.longitude}
                  onChange={v => setField('longitude', v)}
                />
              </div>

              {/* Disciplines as toggle chips */}
              <div className="mt-7 pt-6 border-t border-bsmk-black/10">
                <FieldLabel>Disciplines</FieldLabel>
                {disciplines.length === 0 ? (
                  <p className="text-sm text-bsmk-black/40">Aucune discipline disponible.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {disciplines.map(d => {
                      const active = selectedDisciplineIds.includes(d.id)
                      return (
                        <button
                          key={d.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleDiscipline(d.id)}
                          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm border transition-colors ${
                            active
                              ? 'bg-page-accent text-white border-page-accent'
                              : 'bg-white text-bsmk-black/70 border-bsmk-black/15 hover:border-bsmk-black/35'
                          }`}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{
                              backgroundColor: active ? 'rgba(255,255,255,0.8)' : d.color ?? '#0A0A0A',
                            }}
                          />
                          {d.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </SectionCard>

            {/* b. Portfolio */}
            <SectionCard
              index="02"
              kicker="Œuvres"
              title="Portfolio"
              description="Présentez vos réalisations. Réorganisez-les avec les flèches."
            >
              {works.length === 0 ? (
                <p className="text-sm text-bsmk-black/40 mb-5">
                  Aucune œuvre pour le moment.
                </p>
              ) : (
                <div className="space-y-5">
                  {works.map((w, i) => (
                    <div
                      key={i}
                      className="border border-bsmk-black/10 rounded-xl bg-white px-5 py-5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs tracking-widest uppercase text-bsmk-black/40">
                          Œuvre {i + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveWork(i, -1)}
                            disabled={i === 0}
                            aria-label="Monter"
                            className="w-7 h-7 rounded-lg border border-bsmk-black/15 text-bsmk-black/50 hover:text-bsmk-black hover:border-bsmk-black/35 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveWork(i, 1)}
                            disabled={i === works.length - 1}
                            aria-label="Descendre"
                            className="w-7 h-7 rounded-lg border border-bsmk-black/15 text-bsmk-black/50 hover:text-bsmk-black hover:border-bsmk-black/35 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => requestRemoveWork(i)}
                            className="ml-2 text-xs text-bsmk-black/40 hover:text-red-600 transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <TextField
                            label="Titre"
                            required
                            value={w.title}
                            onChange={v => updateWork(i, 'title', v)}
                          />
                        </div>
                        <TextField
                          label="Type"
                          value={w.type}
                          onChange={v => updateWork(i, 'type', v)}
                          placeholder="Peinture, sculpture…"
                        />
                        <TextField
                          label="Année"
                          type="number"
                          value={w.year}
                          onChange={v => updateWork(i, 'year', v)}
                        />
                        <div className="sm:col-span-2">
                          <TextArea
                            label="Description"
                            value={w.description}
                            rows={3}
                            onChange={v => updateWork(i, 'description', v)}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <TextField
                            label="Images (URLs séparées par des virgules)"
                            value={w.imageUrlsText}
                            onChange={v => updateWork(i, 'imageUrlsText', v)}
                            placeholder="https://…, https://…"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={addWork}
                className="mt-6 inline-flex items-center gap-2 border border-dashed border-bsmk-black/25 text-bsmk-black/60 hover:text-bsmk-black hover:border-page-accent text-sm px-4 py-2.5 rounded-lg transition-colors"
              >
                + Ajouter une œuvre
              </button>
            </SectionCard>

            {/* Save bar */}
            <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-bsmk-white/95 backdrop-blur border-t border-bsmk-black/10 flex items-center justify-end gap-4">
              <span className="text-xs text-bsmk-black/40 mr-auto hidden sm:inline">
                Vos modifications ne sont visibles qu&apos;après enregistrement.
              </span>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-page-accent hover:bg-page-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm tracking-wide px-7 py-2.5 rounded-lg transition-colors"
              >
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={pendingDeleteWork !== null}
        destructive
        title="Supprimer cette œuvre ?"
        message={
          pendingDeleteWork !== null && works[pendingDeleteWork]
            ? `« ${works[pendingDeleteWork].title} » sera retirée de votre portfolio.`
            : undefined
        }
        confirmLabel="Supprimer"
        onConfirm={() => {
          if (pendingDeleteWork !== null) removeWorkAt(pendingDeleteWork)
          setPendingDeleteWork(null)
        }}
        onCancel={() => setPendingDeleteWork(null)}
      />

      <ToastView toast={toast} />
    </div>
  )
}

// ── Status banner ─────────────────────────────────────────────────────────

function StatusBanner({
  status,
  slug,
}: {
  status: ArtistProfile['status']
  slug?: string
}) {
  if (status === 'PUBLISHED') {
    return (
      <div className="rounded-2xl border border-bsmk-olive/30 bg-bsmk-olive/10 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest uppercase text-bsmk-olive">Profil publié</p>
          <p className="text-sm text-bsmk-black/70 mt-1">
            Votre page est visible sur la galerie VetrinArt.
          </p>
        </div>
        {slug && (
          <Link
            href={`/vetrinart/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-bsmk-olive hover:underline whitespace-nowrap"
          >
            Voir ma page publique →
          </Link>
        )}
      </div>
    )
  }

  // DRAFT (and any non-published, e.g. brand-new profile).
  return (
    <div className="rounded-2xl border border-bsmk-sand bg-bsmk-sand/25 px-6 py-5">
      <p className="text-xs tracking-widest uppercase text-bsmk-terracotta">Brouillon</p>
      <p className="text-sm text-bsmk-black/70 mt-1">
        Profil en brouillon — en attente de validation par l&apos;équipe.
      </p>
    </div>
  )
}
