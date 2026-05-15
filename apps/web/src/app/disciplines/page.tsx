import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { disciplines } from '@/data/disciplines'
import { HeroText, StaggerContainer, StaggerItem, FadeUp } from '@/components/ui/Motion'

export const metadata: Metadata = {
  title: 'Disciplines | BSMK',
  description: 'Sept univers artistiques pour créer, se former, s’entraîner et diffuser au BSMK, centre culturel tunisien.',
}

export default function DisciplinesPage() {
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
              Sept univers artistiques pour créer, se former, s’entraîner et diffuser
            </p>
          </HeroText>
        </Container>
      </section>

      {/* Disciplines grid */}
      <section className="py-16 lg:py-20">
        <Container>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {disciplines.map((discipline, idx) => (
              <StaggerItem key={discipline.id}>
              <Link
                href={`/disciplines/${discipline.slug}`}
                className="group block relative overflow-hidden rounded-xl"
              >
                {/* Card container with image + overlay */}
                <div className="relative aspect-[3/4] bg-bsmk-black overflow-hidden rounded-xl">
                  <Image
                    src={discipline.coverUrl}
                    alt={discipline.name}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700"
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      background: `linear-gradient(to top, ${discipline.color}ee 0%, transparent 60%)`,
                    }}
                  />
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
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
