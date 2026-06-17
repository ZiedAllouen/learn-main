import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { getSpaces, type Space } from '@/lib/api/spaces'
import { ApiError } from '@/lib/api'
import { UnavailableNotice } from '@/components/ui/UnavailableNotice'
import { disciplines } from '@/data/disciplines'
import { HeroText, StaggerContainer, StaggerItem, FadeIn, CountUp } from '@/components/ui/Motion'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Espaces | BSMK',
  description: 'Dix espaces polyvalents dédiés à la création artistique au cœur de Tunis.',
}

export default async function EspacesPage({
  searchParams,
}: {
  searchParams: Promise<{ discipline?: string }>
}) {
  const { discipline } = await searchParams

  let spaces: Space[] = []
  let unavailable = false
  try {
    spaces = await getSpaces()
  } catch (err) {
    if (err instanceof ApiError) {
      unavailable = true
    } else {
      throw err
    }
  }

  const totalSurface = spaces.reduce((acc, s) => acc + (s.surfaceSqm ?? 0), 0)
  // Collect all unique discipline slugs referenced by spaces (from API shape)
  const uniqueDisciplineSlugs = Array.from(
    new Set(spaces.flatMap((s) => s.disciplines.map((d) => d.discipline.slug))),
  )
  const disciplineFilters = disciplines.filter((d) => uniqueDisciplineSlugs.includes(d.slug))
  const filteredSpaces = discipline
    ? spaces.filter((s) => s.disciplines.some((d) => d.discipline.slug === discipline))
    : spaces

  return (
    <main className="bg-bsmk-white min-h-screen">
      {/* Hero */}
      <section className="bg-bsmk-black text-bsmk-white py-20 lg:py-28">
        <Container>
          <HeroText delay={0}>
            <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-4 font-sans">
              BSMK — Infrastructure
            </p>
          </HeroText>
          <HeroText delay={0.1}>
            <h1 className="font-display text-5xl lg:text-7xl text-bsmk-white mb-6 leading-none">
              Nos espaces
            </h1>
          </HeroText>
          <HeroText delay={0.25}>
            <p className="font-sans text-lg text-bsmk-white/70 max-w-xl leading-relaxed">
              Dix espaces polyvalents dédiés à la création artistique au cœur de Tunis
            </p>
          </HeroText>
        </Container>
      </section>

      {/* Stats bar */}
      <section className="bg-page-accent py-8">
        <Container>
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-white/20">
            <StaggerItem className="text-center lg:px-6">
              <CountUp value={spaces.length} className="font-display text-4xl lg:text-5xl text-white" />
              <p className="font-sans text-sm text-white/70 mt-1 tracking-wide">Espaces disponibles</p>
            </StaggerItem>
            <StaggerItem className="text-center lg:px-6">
              <CountUp value={totalSurface} className="font-display text-4xl lg:text-5xl text-white" />
              <p className="font-sans text-sm text-white/70 mt-1 tracking-wide">m² de surface totale</p>
            </StaggerItem>
            <StaggerItem className="text-center lg:px-6">
              <CountUp value={disciplineFilters.length} className="font-display text-4xl lg:text-5xl text-white" />
              <p className="font-sans text-sm text-white/70 mt-1 tracking-wide">Disciplines couvertes</p>
            </StaggerItem>
            <StaggerItem className="text-center lg:px-6">
              <p className="font-display text-4xl lg:text-5xl text-white">7j/7</p>
              <p className="font-sans text-sm text-white/70 mt-1 tracking-wide">Accès sur réservation</p>
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </section>

      {/* Filter chips */}
      <section className="border-b border-bsmk-black/10 bg-bsmk-white">
        <Container>
          <FadeIn>
          <div className="flex items-center gap-1 overflow-x-auto py-4">
            <Link
              href="/espaces"
              className={`shrink-0 px-4 py-2 text-xs font-medium tracking-widest uppercase font-sans transition-colors rounded-full ${
                !discipline ? 'bg-bsmk-black text-bsmk-white' : 'text-bsmk-black/60 hover:bg-bsmk-black hover:text-bsmk-white'
              }`}
            >
              Tous
            </Link>
            {disciplineFilters.map((d) => (
              <Link
                key={d.slug}
                href={`/espaces?discipline=${d.slug}`}
                className={`shrink-0 px-4 py-2 text-xs font-medium tracking-widest uppercase font-sans transition-colors rounded-full ${
                  discipline === d.slug ? 'bg-bsmk-black text-bsmk-white' : 'text-bsmk-black/60 hover:bg-bsmk-black hover:text-bsmk-white'
                }`}
              >
                {d.shortName}
              </Link>
            ))}
          </div>
          </FadeIn>
        </Container>
      </section>

      {/* Spaces grid */}
      <section className="py-16 lg:py-20">
        <Container>
          <StaggerContainer key={discipline ?? 'all'} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredSpaces.map((space) => {
              const spaceDisciplineSlugs = space.disciplines.map((d) => d.discipline.slug)
              const spaceDisciplines = disciplines.filter((d) =>
                spaceDisciplineSlugs.includes(d.slug),
              )
              const visibleEquipment = space.equipment.slice(0, 3)
              const extraEquipment = space.equipment.length - 3

              return (
                <StaggerItem key={space.id}>
                <Link
                  href={`/espaces/${space.slug}`}
                  className="group block border border-bsmk-black/10 hover:border-page-accent transition-colors rounded-xl overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-bsmk-sand/20">
                    <Image
                      src={space.imageUrls[0] ?? '/assets/images/techivation.jpg'}
                      alt={space.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {space.floor && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="dark">{space.floor}</Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="font-display text-xl lg:text-2xl text-bsmk-black group-hover:text-page-accent transition-colors mb-3">
                      {space.name}
                    </h2>

                    {/* Capacity + Surface badges */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      {space.capacity != null && (
                        <Badge variant="blue">{space.capacity} personnes max.</Badge>
                      )}
                      {space.surfaceSqm != null && (
                        <Badge variant="olive">{space.surfaceSqm} m²</Badge>
                      )}
                    </div>

                    <p className="font-sans text-sm text-bsmk-black/60 leading-relaxed line-clamp-2 mb-4">
                      {space.description}
                    </p>

                    {/* Equipment tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {visibleEquipment.map((item) => (
                        <span
                          key={item}
                          className="font-sans text-xs text-bsmk-black/50 bg-bsmk-sand/20 px-2 py-1 rounded"
                        >
                          {item}
                        </span>
                      ))}
                      {extraEquipment > 0 && (
                        <span className="font-sans text-xs text-bsmk-black/40 bg-bsmk-sand/10 px-2 py-1 rounded">
                          +{extraEquipment}
                        </span>
                      )}
                    </div>

                    {/* Discipline links */}
                    {spaceDisciplines.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-bsmk-black/10">
                        {spaceDisciplines.map((d) => (
                          <Badge key={d.slug} variant="default">
                            {d.shortName}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
          {unavailable && (
            <UnavailableNotice label="Les espaces" />
          )}
          {!unavailable && filteredSpaces.length === 0 && (
            <div className="border border-bsmk-black/10 bg-bsmk-sand/20 p-8 text-center rounded-xl">
              <h2 className="font-display text-2xl text-bsmk-black mb-2">
                Aucun espace pour le moment.
              </h2>
              <p className="font-sans text-sm text-bsmk-black/60">
                Revenez bientôt ou contactez-nous pour en savoir plus sur nos espaces.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="bg-bsmk-sand/30 py-12 border-t border-bsmk-black/10">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl text-bsmk-black mb-1">
                Réserver un espace
              </h2>
              <p className="font-sans text-sm text-bsmk-black/60">
                Disponible à la demi-journée, à la journée ou à la semaine selon l'espace.
              </p>
            </div>
            <Link
              href="/contact?sujet=Réservation+espace"
              className="shrink-0 inline-flex items-center justify-center h-11 px-6 text-sm font-medium tracking-wide bg-page-accent text-white hover:bg-page-accent/90 transition-colors rounded-lg"
            >
              Nous contacter →
            </Link>
          </div>
        </Container>
      </section>
    </main>
  )
}
