'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser, logout } from '@/lib/auth'
import { ContentSection, RESOURCES } from '@/app/admin/sections/ContentSection'
import { RequestsSection } from '@/app/admin/sections/RequestsSection'
import { ArtistsModeration } from './ArtistsModeration'

type Section =
  | 'articles'
  | 'events'
  | 'programmes'
  | 'spaces'
  | 'requests'
  | 'artistes'

const TABS: { key: Section; label: string }[] = [
  { key: 'articles', label: 'Articles' },
  { key: 'events', label: 'Événements' },
  { key: 'programmes', label: 'Programmes' },
  { key: 'spaces', label: 'Espaces' },
  { key: 'requests', label: 'Demandes' },
  { key: 'artistes', label: 'Artistes' },
]

export function EditorDashboard() {
  const router = useRouter()
  const [section, setSection] = useState<Section>('articles')

  const user = getAuthUser()

  useEffect(() => {
    if (!user) {
      router.replace('/login?redirect=/editor')
      return
    }
    if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
      router.replace('/')
    }
  }, [user, router])

  function handleLogout() {
    logout()
    router.push('/login')
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) return null

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
            <span className="text-sm font-medium text-bsmk-black">Espace Éditeur</span>
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
          {['#2F66FC', '#1E96FF', '#00E00E', '#2F66FC', '#1E96FF', '#00E00E'].map(c => (
            <div key={c} className="h-0.5 flex-1 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Intro header */}
        <p className="text-xs tracking-widest uppercase text-bsmk-black/40 mb-3">
          Espace de gestion · Éditeur
        </p>
        <h1 className="font-display text-3xl font-bold mb-2">Édition du contenu</h1>
        <p className="text-sm text-bsmk-black/50 mb-8">
          Publiez et modérez les articles, événements, programmes, espaces et profils artistes de la plateforme BSMK.
        </p>

        {/* Section nav */}
        <div className="flex gap-2 mb-10 border-b border-bsmk-black/10 flex-wrap">
          {TABS.map(tab => (
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

        {/* Body */}
        {section === 'articles' ? (
          <ContentSection config={RESOURCES.articles} />
        ) : section === 'events' ? (
          <ContentSection config={RESOURCES.events} />
        ) : section === 'programmes' ? (
          <ContentSection config={RESOURCES.programmes} />
        ) : section === 'spaces' ? (
          <ContentSection config={RESOURCES.spaces} />
        ) : section === 'requests' ? (
          <RequestsSection />
        ) : (
          <ArtistsModeration />
        )}
      </div>
    </div>
  )
}
