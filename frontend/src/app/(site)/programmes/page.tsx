import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { programTypes, audienceTypes } from '@/data/programs'
import { disciplines } from '@/data/disciplines'
import { getPrograms } from '@/lib/api/programs'
import { HeroText, FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

export const dynamic = 'force-dynamic'

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

function buildHref(
  current: { discipline?: string; public?: string; type?: string },
  clearKey?: keyof typeof current,
) {
  const params = new URLSearchParams()

  // Keep all current filters except the one being cleared
  if (current.discipline && clearKey !== 'discipline') params.set('discipline', current.discipline)
  if (current.public && clearKey !== 'public') params.set('public', current.public)
  if (current.type && clearKey !== 'type') params.set('type', current.type)

  const query = params.toString()
  return query ? `/programmes?${query}` : '/programmes'
}

function buildHrefWithUpdate(
  current: { discipline?: string; public?: string; type?: string },
  update: { discipline?: string; public?: string; type?: string },
) {
  const merged = { ...current, ...update }
  const params = new URLSearchParams()
  if (merged.discipline) params.set('discipline', merged.discipline)
  if (merged.public) params.set('public', merged.public)
  if (merged.type) params.set('type', merged.type)
  const query = params.toString()
  return query ? `/programmes?${query}` : '/programmes'
}

export default async function ProgrammesPage({
  searchParams,
}: {
  searchParams: Promise<{ discipline?: string; public?: string; type?: string }>
}) {
  const filters = await searchParams
  const { data: programs } = await getPrograms({ pageSize: 100 })

  const featured = programs.filter((p) => p.featured).slice(0, 3)
  const filteredPrograms = programs.filter((program) => {
    const disciplineSlugs = program.disciplines.map((d) => d.discipline.slug)
    const audienceSlugs = program.audiences.map((a) => a.audienceType.slug)
    if (filters.discipline && !disciplineSlugs.includes(filters.discipline)) return false
    if (filters.public && !audienceSlugs.includes(filters.public)) return false
    if (filters.type && program.programType?.slug !== filters.type) return false
    return true
  })

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
              <div className="flex flex-wrap gap-2 items-center">
                <Link
                  href="/programmes"
                  className={`px-3 py-1 text-xs tracking-widest uppercase border rounded-full transition-colors ${!filters.discipline && !filters.public && !filters.type
                      ? 'bg-page-accent text-white border-page-accent'
                      : 'border-page-accent text-page-accent hover:bg-page-accent hover:text-white'
                    }`}
                >
                  Tous les programmes
                </Link>
              </div>

              {/* By discipline */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs tracking-widest uppercase text-bsmk-black/40 mr-1">
                  Discipline
                </span>
                <Link
                  href={buildHref(filters, 'discipline')}
                  className={`px-3 py-1 text-xs tracking-widest uppercase border rounded-full transition-colors ${!filters.discipline
                      ? 'bg-bsmk-black text-bsmk-white border-bsmk-black'
                      : 'border-bsmk-black/20 text-bsmk-black/60 hover:bg-bsmk-black hover:text-bsmk-white'
                    }`}
                >
                  Tous
                </Link>
                {disciplines.map((d) => (
                  <Link
                    key={d.slug}
                    href={buildHrefWithUpdate(filters, { discipline: d.slug })}
                    className={`px-3 py-1 text-xs tracking-widest uppercase border rounded-full transition-colors ${filters.discipline === d.slug
                        ? 'bg-bsmk-black text-bsmk-white border-bsmk-black'
                        : 'border-bsmk-black/20 text-bsmk-black/60 hover:bg-bsmk-black hover:text-bsmk-white'
                      }`}
                  >
                    {d.shortName}
                  </Link>
                ))}
              </div>

              {/* By audience */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs tracking-widest uppercase text-bsmk-black/40 mr-1">
                  Public
                </span>
                <Link
                  href={buildHref(filters, 'public')}
                  className={`px-3 py-1 text-xs tracking-widest uppercase border rounded-full transition-colors ${!filters.public
                      ? 'bg-bsmk-black text-bsmk-white border-bsmk-black'
                      : 'border-bsmk-black/20 text-bsmk-black/60 hover:bg-bsmk-black hover:text-bsmk-white'
                    }`}
                >
                  Tous
                </Link>
                {audienceTypes.map((audience) => (
                  <Link
                    key={audience.slug}
                    href={buildHrefWithUpdate(filters, { public: audience.slug })}
                    className={`px-3 py-1 text-xs tracking-widest uppercase border rounded-full transition-colors ${filters.public === audience.slug
                        ? 'bg-bsmk-black text-bsmk-white border-bsmk-black'
                        : 'border-bsmk-black/20 text-bsmk-black/60 hover:bg-bsmk-black hover:text-bsmk-white'
                      }`}
                  >
                    {audience.name}
                  </Link>
                ))}
              </div>

              {/* By type */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs tracking-widest uppercase text-bsmk-black/40 mr-1">
                  Type
                </span>
                <Link
                  href={buildHref(filters, 'type')}
                  className={`px-3 py-1 text-xs tracking-widest uppercase border rounded-full transition-colors ${!filters.type
                      ? 'bg-bsmk-black text-bsmk-white border-bsmk-black'
                      : 'border-bsmk-black/20 text-bsmk-black/60 hover:bg-bsmk-black hover:text-bsmk-white'
                    }`}
                >
                  Tous
                </Link>
                {programTypes.map((t) => (
                  <Link
                    key={t.slug}
                    href={buildHrefWithUpdate(filters, { type: t.slug })}
                    className={`px-3 py-1 text-xs tracking-widest uppercase border rounded-full transition-colors ${filters.type === t.slug
                        ? 'bg-bsmk-black text-bsmk-white border-bsmk-black'
                        : 'border-bsmk-black/20 text-bsmk-black/60 hover:bg-bsmk-black hover:text-bsmk-white'
                      }`}
                  >
                    {t.name}
                  </Link>
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
                  className="group bg-bsmk-white border border-bsmk-black/10 flex flex-col h-full hover:border-page-accent transition-colors rounded-xl overflow-hidden"
                >
                  {/* Cover */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={program.coverUrl ?? `https://picsum.photos/seed/prog-${program.slug}/800/450`}
                      alt={program.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bsmk-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="dark">{program.programType?.name}</Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display text-xl font-bold mb-3 group-hover:text-page-accent transition-colors">
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
                        {program.priceIndicative &&
                        program.priceIndicative.toLowerCase().startsWith('gratuit')
                          ? 'Gratuit'
                          : program.priceIndicative
                            ? `À partir de ${program.priceIndicative.split(' ')[0]}`
                            : ''}
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-bsmk-black/10 flex items-center justify-between">
                      <span className="text-xs text-bsmk-black/40">{program.duration}</span>
                      <span className="text-xs tracking-widest uppercase text-page-accent group-hover:translate-x-1 transition-transform inline-block">
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
              {filteredPrograms.length} programme{filteredPrograms.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPrograms.map((program, index) => (
              <div key={program.id}>
                <Link
                  href={`/programmes/${program.slug}`}
                  className="group flex bg-bsmk-white border border-bsmk-black/10 hover:border-page-accent transition-colors rounded-xl overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative w-40 shrink-0 overflow-hidden">
                    <Image
                      src={program.coverUrl ?? `https://picsum.photos/seed/prog-${program.slug}/800/450`}
                      alt={program.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1 min-w-0">
                    <p className="text-xs tracking-widest uppercase text-page-accent mb-1">
                      {program.programType?.name}
                    </p>
                    <h3 className="font-display text-lg font-bold leading-tight mb-2 group-hover:text-page-accent transition-colors line-clamp-2">
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
                      <span className="text-xs tracking-widest uppercase text-page-accent opacity-0 group-hover:opacity-100 transition-opacity">
                        Voir →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {filteredPrograms.length === 0 && (
            <div className="border border-bsmk-black/10 bg-bsmk-sand/20 p-8 text-center rounded-xl">
              <h3 className="font-display text-2xl font-bold mb-2">
                {programs.length === 0
                  ? 'Aucun programme pour le moment.'
                  : 'Aucun programme pour ce filtre'}
              </h3>
              <p className="text-sm text-bsmk-black/60 mb-6">
                Essayez une autre discipline, un autre public ou proposez-nous un besoin spécifique.
              </p>
              <Link
                href="/participer"
                className="inline-flex items-center h-11 px-6 bg-page-accent text-white text-sm font-medium tracking-wide hover:bg-page-accent/90 transition-colors rounded-lg"
              >
                Proposer un projet
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* ── CTA band ─────────────────────────────────────────── */}
      <section className="bg-page-accent text-bsmk-white py-16">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs tracking-widest uppercase text-bsmk-white/70 mb-2">
                Questions sur nos programmes ?
              </p>
              <h2 className="font-display text-3xl font-bold">
                Contactez notre équipe pédagogique
              </h2>
            </div>
            <Link
              href="/contact?sujet=Programmes"
              className="shrink-0 inline-flex items-center h-14 px-8 bg-bsmk-white text-bsmk-black text-sm font-medium tracking-wide hover:bg-bsmk-sand transition-colors rounded-lg"
            >
              Nous écrire
            </Link>
          </div>
        </Container>
      </section>
    </main>
  )
}
