import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { disciplines, getDisciplinesBySector } from '@/data/disciplines'
import { getSectors } from '@/lib/api/sectors'
import { HeroText, StaggerContainer, StaggerItem, FadeUp } from '@/components/ui/Motion'

export const metadata: Metadata = {
  title: 'Disciplines | BSMK',
  description: 'Les disciplines artistiques du BSMK — créer, se former, produire et diffuser en Méditerranée.',
}

export default async function DisciplinesPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>
}) {
  const { sector: activeSector } = await searchParams

  // Load sectors from API for the filter strip (graceful fallback)
  let sectors: Awaited<ReturnType<typeof getSectors>> = []
  try {
    sectors = await getSectors()
  } catch {
    // API unavailable — show all disciplines ungrouped
  }

  const filtered = activeSector
    ? getDisciplinesBySector(activeSector)
    : disciplines

  return (
    <main className="bg-bsmk-white min-h-screen">
      {/* Hero */}
      <section className="bg-bsmk-black text-bsmk-white py-20 lg:py-28">
        <Container>
          <HeroText delay={0}>
            <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-4 font-sans">
              BSMK — Pratiques artistiques
            </p>
          </HeroText>
          <HeroText delay={0.1}>
            <h1 className="font-display text-5xl lg:text-7xl text-bsmk-white mb-6 leading-none">
              Nos disciplines
            </h1>
          </HeroText>
          <HeroText delay={0.25}>
            <p className="font-sans text-lg text-bsmk-white/70 max-w-xl leading-relaxed">
              Des univers artistiques pour créer, se former, produire et diffuser
            </p>
          </HeroText>
        </Container>
      </section>

      {/* Sector filter strip */}
      {sectors.length > 0 && (
        <section className="border-b border-bsmk-black/10 bg-bsmk-white sticky top-0 z-20 shadow-sm">
          <Container>
            <div className="py-4 flex flex-wrap gap-2 items-center">
              <Link
                href="/disciplines"
                className={`px-3 py-1.5 text-xs tracking-widest uppercase rounded-full border transition-colors ${
                  !activeSector
                    ? 'bg-bsmk-black text-white border-bsmk-black'
                    : 'border-bsmk-black/20 text-bsmk-black/60 hover:border-bsmk-black hover:text-bsmk-black'
                }`}
              >
                Toutes
              </Link>
              {sectors.map((s) => (
                <Link
                  key={s.slug}
                  href={`/disciplines?sector=${s.slug}`}
                  className="px-3 py-1.5 text-xs tracking-widest uppercase rounded-full border transition-all hover:text-white"
                  style={{
                    borderColor: activeSector === s.slug ? s.color : `${s.color}60`,
                    color: activeSector === s.slug ? 'white' : s.color,
                    backgroundColor: activeSector === s.slug ? s.color : 'transparent',
                  }}
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Disciplines grid */}
      <section className="py-16 lg:py-20">
        <Container>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((discipline, idx) => (
              <StaggerItem key={discipline.id}>
              <Link
                href={`/disciplines/${discipline.slug}`}
                className="group block relative overflow-hidden rounded-xl"
              >
                <div className="relative aspect-[3/4] bg-bsmk-black overflow-hidden rounded-xl">
                  <Image
                    src={discipline.coverUrl}
                    alt={discipline.name}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700"
                  />
                  {/* Vivid sector color gradient at bottom */}
                  <div
                    className="absolute inset-0 opacity-70"
                    style={{
                      background: `linear-gradient(to top, ${discipline.sectorColor}cc 0%, transparent 60%)`,
                    }}
                  />
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    {/* Sector badge */}
                    <span
                      className="self-start text-[10px] tracking-widest uppercase px-2 py-0.5 rounded mb-2 font-sans"
                      style={{
                        backgroundColor: `${discipline.sectorColor}40`,
                        color: 'white',
                        borderLeft: `3px solid ${discipline.sectorColor}`,
                      }}
                    >
                      {discipline.sectorSlug.replace(/-/g, ' ')}
                    </span>
                    <p className="font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                      0{idx + 1}
                    </p>
                    <h2 className="font-display text-2xl text-white leading-tight mb-2">
                      {discipline.name}
                    </h2>
                    <p className="font-sans text-sm text-white/70 leading-snug line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {discipline.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="font-sans text-xs text-white/60 tracking-widest uppercase">
                        Explorer
                      </span>
                      <span className="text-white/60">→</span>
                    </div>
                  </div>
                </div>
              </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* CTA strip */}
      <section className="bg-bsmk-terracotta py-12">
        <Container>
          <FadeUp className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="font-display text-xl lg:text-2xl text-white text-center sm:text-left leading-snug">
              Vous ne savez pas par où commencer ?<br />
              <span className="text-white/80 font-sans text-base font-normal">
                Explorez tous nos programmes et trouvez votre voie artistique.
              </span>
            </p>
            <Button href="/programmes" variant="secondary" size="lg" className="shrink-0">
              Tous les programmes →
            </Button>
          </FadeUp>
        </Container>
      </section>
    </main>
  )
}
