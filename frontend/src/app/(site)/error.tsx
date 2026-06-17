'use client'

import { useEffect } from 'react'
import { Container } from '@/components/ui/Container'
import { FadeUp } from '@/components/ui/Motion'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function SiteError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log for debugging; the raw error never reaches the user.
    console.error('Site error:', error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center bg-bsmk-white">
      <Container narrow>
        <div className="text-center space-y-8 py-20">
          <FadeUp delay={0}>
            <div className="space-y-4">
              <p className="text-page-accent text-xs tracking-widest uppercase">
                Erreur temporaire
              </p>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-bsmk-black">
                Contenu momentanément indisponible
              </h1>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p className="text-bsmk-black/60 text-lg leading-relaxed max-w-xl mx-auto">
              Nous rencontrons actuellement des difficultés pour charger cette page.
              Veuillez réessayer dans quelques instants.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center px-8 py-3 bg-page-accent hover:bg-page-accent/90 text-bsmk-white font-medium text-sm tracking-wide uppercase transition-colors duration-200 rounded-lg focus:outline-2 focus:outline-offset-2 focus:outline-page-accent"
            >
              Réessayer
            </button>
          </FadeUp>

          <FadeUp delay={0.45}>
            <p className="text-bsmk-black/40 text-xs">
              Si le problème persiste, contactez-nous à{' '}
              <a href="mailto:urban.whyz@gmail.com" className="text-page-accent hover:underline">
                urban.whyz@gmail.com
              </a>
            </p>
          </FadeUp>
        </div>
      </Container>
    </main>
  )
}
