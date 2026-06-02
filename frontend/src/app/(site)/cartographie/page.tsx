import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { artists } from '@/data/artists'
import { events } from '@/data/events'
import { spaces } from '@/data/spaces'
import { HeroText, StaggerContainer, StaggerItem, FadeUp } from '@/components/ui/Motion'

export const metadata: Metadata = {
  title: 'Cartographie culturelle | BSMK',
  description:
    'Prototype de cartographie culturelle pour connecter lieux, artistes, collectifs et projets actifs autour de BSMK × VetrinArt.',
}

const mapPoints = [
  { label: 'Lieux culturels', count: spaces.length, tone: 'terracotta' as const },
  { label: 'Artistes', count: artists.length, tone: 'olive' as const },
  { label: 'Projets actifs', count: events.length, tone: 'blue' as const },
  { label: 'Collectifs', count: 8, tone: 'default' as const },
]

const districts = [
  'Médina de Tunis',
  'Bab Bhar',
  'La Marsa',
  'Carthage',
  'Sidi Bou Saïd',
  'Ariana',
  'Sousse',
  'Méditerranée élargie',
]

export default function CartographiePage() {
  return (
    <main className="bg-bsmk-white text-bsmk-black">
      <section className="bg-bsmk-black text-bsmk-white pt-32 pb-20">
        <Container>
          <HeroText delay={0}>
            <p className="text-xs tracking-widest uppercase text-page-accent mb-5">
              Phase 2 · Connexion culturelle
            </p>
          </HeroText>
          <HeroText delay={0.1}>
            <h1 className="font-display text-5xl lg:text-7xl font-bold leading-none mb-6">
              Cartographie
            </h1>
          </HeroText>
          <HeroText delay={0.25}>
            <p className="max-w-2xl text-lg text-bsmk-sand/75 leading-relaxed">
              Un prototype éditorial pour préparer la future carte interactive :
              lieux culturels, artistes, collectifs et projets actifs.
            </p>
          </HeroText>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-8 min-h-[520px] bg-bsmk-sand/20 border border-bsmk-black/10 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute inset-6 border border-bsmk-black/10 rounded-full" />
              <div className="absolute left-[18%] top-[25%] h-3 w-3 rounded-full bg-page-accent" />
              <div className="absolute left-[48%] top-[36%] h-3 w-3 rounded-full bg-bsmk-olive" />
              <div className="absolute left-[62%] top-[58%] h-3 w-3 rounded-full bg-bsmk-blue" />
              <div className="absolute left-[34%] top-[68%] h-3 w-3 rounded-full bg-bsmk-black" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <Badge variant="outline">Prototype MVP</Badge>
                </div>
                <div>
                  <h2 className="font-display text-4xl font-bold mb-3">
                    Carte interactive en préparation
                  </h2>
                  <p className="max-w-lg text-bsmk-black/60 leading-relaxed">
                    Cette zone simule la future carte. Pour le MVP frontend, elle clarifie
                    la promesse sans dépendre d’un moteur cartographique ou d’un backend.
                  </p>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-4">
              {mapPoints.map((point) => (
                <div key={point.label} className="border border-bsmk-black/10 p-5 rounded-xl">
                  <Badge variant={point.tone}>{point.label}</Badge>
                  <p className="font-display text-5xl font-bold mt-4">{point.count}</p>
                </div>
              ))}
            </aside>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-bsmk-black text-bsmk-white">
        <Container>
          <FadeUp>
            <p className="text-xs tracking-widest uppercase text-page-accent mb-3">
              Zones et réseaux
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-8">
              Premières zones de connexion
            </h2>
          </FadeUp>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
            {districts.map((district) => (
              <StaggerItem key={district}>
                <div className="bg-bsmk-black p-5 min-h-24 flex items-end">
                  <p className="text-sm text-bsmk-white/70">{district}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="mt-10">
            <Link href="/communaute" className="text-sm text-page-accent hover:underline">
              Voir la communauté →
            </Link>
          </div>
        </Container>
      </section>
    </main>
  )
}
