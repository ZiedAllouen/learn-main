import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { HeroText } from '@/components/ui/Motion'

export const metadata = {
  title: '404 — Page introuvable',
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bsmk-black flex items-center justify-center">
      <Container className="text-center py-32">
        <HeroText delay={0}>
          <p className="text-page-accent text-xs tracking-widest uppercase mb-8">
            Erreur 404
          </p>
        </HeroText>
        <HeroText delay={0.1}>
          <div className="text-[clamp(6rem,20vw,16rem)] font-display font-bold text-page-accent leading-none mb-6 select-none">
            404
          </div>
        </HeroText>
        <HeroText delay={0.25}>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-bsmk-white mb-6">
            Page introuvable
          </h1>
        </HeroText>
        <HeroText delay={0.35}>
          <p className="text-bsmk-white/50 text-lg max-w-md mx-auto mb-12 leading-relaxed">
            La page que vous cherchez n'existe pas ou a été déplacée. Retournez à l'accueil ou explorez nos programmes et événements.
          </p>
        </HeroText>
        <HeroText delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/" variant="secondary" size="lg">
              ← Retour à l'accueil
            </Button>
            <Button href="/programmes" variant="outline" size="lg" className="text-bsmk-white border-bsmk-white/40">
              Voir nos programmes
            </Button>
          </div>
        </HeroText>
      </Container>
    </main>
  )
}
