import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { programs, programTypes, getFeaturedPrograms } from '@/data/programs'
import { disciplines } from '@/data/disciplines'
import { HeroText, FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

export const metadata: Metadata = {
  title: 'Programmes | BSMK',
  description:
    'Formations, ateliers, résidences et programmes de mentorat du Beit Sakia — centre des arts de Tunis.',
}

const modalityLabels: Record<string, string> = {
  IN_PERSON: 'En présentiel',
  ONLINE: 'En ligne',
  HYBRID: 'Hybride',
}

const modalityVariant: Record<string, 'terracotta' | 'olive' | 'blue'> = {
  IN_PERSON: 'terracotta',
  ONLINE: 'blue',
  HYBRID: 'olive',
}

export default function ProgrammesPage() {
  const featured = getFeaturedPrograms(3)

  return (
    <main className="bg-bsmk-white text-bsmk-black">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-bsmk-black text-bsmk-white pt-24 pb-20">
        <Container>
          <HeroText delay={0}>
            <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-4">
              Apprendre · Créer · Transmettre
            </p>
          </HeroText>
          <HeroText delay={0.1}>
            <h1 className="font-display text-6xl lg:text-8xl font-bold leading-none mb-6">
              Programmes
            </h1>
          </HeroText>
          <HeroText delay={0.25}>
            <p className="font-sans text-lg text-bsmk-sand max-w-2xl leading-relaxed">
              Du studio au plateau, de l'atelier à la résidence — le BSMK propose des programmes
              pour tous les niveaux et toutes les disciplines. Formations longues, stages intensifs,
              mentorat individuel et résidences artistiques : trouvez le parcours qui correspond à
              votre projet.
            </p>
          </HeroText>
        </Container>
      </section>

      {/* ── Filter bar ───────────────────────────────────────── */}
      <section className="border-b border-bsmk-black/10 bg-bsmk-white sticky top-0 z-20">
        <Container>
          <FadeIn>
          <div className="py-4 flex flex-wrap gap-6 items-start">
            {/* By discipline */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs tracking-widest uppercase text-bsmk-black/40 mr-1">
                Discipline
              </span>
              {disciplines.map((d) => (
                <span
                  key={d.slug}
                  className="px-3 py-1 text-xs tracking-widest uppercase border border-bsmk-black/20 text-bsmk-black/60 cursor-default rounded-full"
                >
                  {d.shortName}
                </span>
              ))}
            </div>

            {/* By modality */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs tracking-widest uppercase text-bsmk-black/40 mr-1">
                Modalité
              </span>
              {(['IN_PERSON', 'ONLINE', 'HYBRID'] as const).map((m) => (
                <span
                  key={m}
                  className="px-3 py-1 text-xs tracking-widest uppercase border border-bsmk-black/20 text-bsmk-black/60 cursor-default rounded-full"
                >
                  {modalityLabels[m]}
                </span>
              ))}
            </div>

            {/* By type */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs tracking-widest uppercase text-bsmk-black/40 mr-1">
                Type
              </span>
              {programTypes.map((t) => (
                <span
                  key={t.slug}
                  className="px-3 py-1 text-xs tracking-widest uppercase border border-bsmk-black/20 text-bsmk-black/60 cursor-default rounded-full"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>
          </FadeIn>
        </Container>
      </section>

      {/* ── Featured programmes ──────────────────────────────── */}
      <section className="py-16 bg-bsmk-sand/20">
        <Container>
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-display text-3xl font-bold">Programmes à la une</h2>
            <span className="text-xs tracking-widest uppercase text-bsmk-black/40">
              Sélection
            </span>
          </div>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featured.map((program) => (
              <StaggerItem key={program.id} className="h-full">
              <Link
                href={`/programmes/${program.slug}`}
                className="group bg-bsmk-white border border-bsmk-black/10 flex flex-col h-full hover:border-bsmk-terracotta transition-colors rounded-xl overflow-hidden"
              >
                {/* Cover */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={program.coverUrl}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bsmk-black/40 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="dark">{program.programType}</Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl font-bold mb-3 group-hover:text-bsmk-terracotta transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-sm text-bsmk-black/60 leading-relaxed mb-4 line-clamp-2">
                    {program.description}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2 items-center justify-between">
                    <Badge variant={modalityVariant[program.modality]}>
                      {modalityLabels[program.modality]}
                    </Badge>
                    <span className="text-sm font-medium text-bsmk-black/70">
                      {program.priceIndicative.toLowerCase().startsWith('gratuit')
                        ? 'Gratuit'
                        : `À partir de ${program.priceIndicative.split(' ')[0]}`}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-bsmk-black/10 flex items-center justify-between">
                    <span className="text-xs text-bsmk-black/40">{program.duration}</span>
                    <span className="text-xs tracking-widest uppercase text-bsmk-terracotta group-hover:translate-x-1 transition-transform inline-block">
                      En savoir plus →
                    </span>
                  </div>
                </div>
              </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ── All programmes ───────────────────────────────────── */}
      <section className="py-16">
        <Container>
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-display text-3xl font-bold">Tous les programmes</h2>
            <span className="text-xs tracking-widest uppercase text-bsmk-black/40">
              {programs.length} programmes
            </span>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((program) => (
              <StaggerItem key={program.id}>
              <Link
                href={`/programmes/${program.slug}`}
                className="group flex bg-bsmk-white border border-bsmk-black/10 hover:border-bsmk-terracotta transition-colors rounded-xl overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative w-40 shrink-0 overflow-hidden">
                  <Image
                    src={program.coverUrl}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 min-w-0">
                  <p className="text-xs tracking-widest uppercase text-bsmk-terracotta mb-1">
                    {program.programType}
                  </p>
                  <h3 className="font-display text-lg font-bold leading-tight mb-2 group-hover:text-bsmk-terracotta transition-colors line-clamp-2">
                    {program.title}
                  </h3>
                  <p className="text-xs text-bsmk-black/60 leading-relaxed mb-3 line-clamp-2">
                    {program.description}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2 items-center">
                    <Badge variant={modalityVariant[program.modality]} className="text-[10px]">
                      {modalityLabels[program.modality]}
                    </Badge>
                    <span className="text-xs text-bsmk-black/40">{program.duration}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-bsmk-black">
                      {program.priceIndicative}
                    </span>
                    <span className="text-xs tracking-widest uppercase text-bsmk-terracotta opacity-0 group-hover:opacity-100 transition-opacity">
                      Voir →
                    </span>
                  </div>
                </div>
              </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ── CTA band ─────────────────────────────────────────── */}
      <section className="bg-bsmk-blue text-bsmk-white py-16">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-2">
                Questions sur nos programmes ?
              </p>
              <h2 className="font-display text-3xl font-bold">
                Contactez notre équipe pédagogique
              </h2>
            </div>
            <Link
              href="/contact?sujet=Programmes"
              className="shrink-0 inline-flex items-center h-14 px-8 bg-bsmk-terracotta text-white text-sm font-medium tracking-wide hover:bg-bsmk-terracotta/90 transition-colors rounded-lg"
            >
              Nous écrire
            </Link>
          </div>
        </Container>
      </section>
    </main>
  )
}
