import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { disciplines } from '@/data/disciplines'
import { getSectors } from '@/lib/api/sectors'
import { getArtists } from '@/lib/api/artists'
import { HeroText, StaggerContainer, StaggerItem, FadeIn, FadeUp, CountUp } from '@/components/ui/Motion'

export const metadata: Metadata = {
  title: 'Vitrinart — Annuaire des artistes | BSMK',
  description: 'Découvrez les artistes méditerranéens référencés par le BSMK : musiciens, danseurs, plasticiens, cinéastes et créateurs de toute la Méditerranée.',
}

export const dynamic = 'force-dynamic'

function buildHref(
  current: { discipline?: string; sector?: string; city?: string },
  clearKey?: keyof typeof current,
) {
  const params = new URLSearchParams()
  if (current.discipline && clearKey !== 'discipline') params.set('discipline', current.discipline)
  if (current.sector && clearKey !== 'sector') params.set('sector', current.sector)
  if (current.city && clearKey !== 'city') params.set('city', current.city)
  const query = params.toString()
  return query ? `/vetrinart?${query}` : '/vetrinart'
}

function buildHrefWithUpdate(
  current: { discipline?: string; sector?: string; city?: string },
  update: Partial<{ discipline: string | undefined; sector: string | undefined; city: string | undefined }>,
) {
  const merged = { ...current, ...update }
  const params = new URLSearchParams()
  if (merged.discipline) params.set('discipline', merged.discipline)
  if (merged.sector) params.set('sector', merged.sector)
  if (merged.city) params.set('city', merged.city)
  const query = params.toString()
  return query ? `/vetrinart?${query}` : '/vetrinart'
}

export default async function VetrinArtPage({
  searchParams,
}: {
  searchParams: Promise<{ discipline?: string; sector?: string; city?: string; page?: string }>
}) {
  const filters = await searchParams
  const page = Number(filters.page ?? 1)

  const [featuredResult, allResult, sectorsData] = await Promise.allSettled([
    getArtists({ featured: true, status: 'PUBLISHED', pageSize: 4 }),
    getArtists({
      status: 'PUBLISHED',
      discipline: filters.discipline,
      sector: filters.sector,
      city: filters.city,
      page,
      pageSize: 24,
    }),
    getSectors(),
  ])

  const featured = featuredResult.status === 'fulfilled' ? featuredResult.value.data : []
  const allArtists = allResult.status === 'fulfilled' ? allResult.value : { data: [], total: 0, totalPages: 1, page: 1, pageSize: 24 }
  const sectors = sectorsData.status === 'fulfilled' ? sectorsData.value : []

  const cities = Array.from(new Set(allArtists.data.map(a => a.city).filter(Boolean) as string[])).sort()

  return (
    <main className="bg-bsmk-white min-h-screen">

      {/* ── Hero ── */}
      <section className="bg-bsmk-black text-bsmk-white py-24 lg:py-36">
        <Container>
          <HeroText delay={0}>
            <p className="font-sans text-xs tracking-widest uppercase text-page-accent mb-6">
              BSMK · Réseau artistique
            </p>
          </HeroText>
          <HeroText delay={0.1}>
            <h1 className="font-display text-6xl lg:text-8xl xl:text-9xl text-bsmk-white leading-none mb-6">
              Vitrinart
            </h1>
          </HeroText>
          <HeroText delay={0.25}>
            <p className="font-sans text-lg lg:text-xl text-bsmk-white/70 max-w-2xl leading-relaxed mb-8">
              L'annuaire des artistes méditerranéens · Découvrez, collaborez, inspirez-vous
            </p>
          </HeroText>
          <HeroText delay={0.4}>
            <p className="font-sans text-sm text-bsmk-sand/60 max-w-xl leading-relaxed">
              Vitrinart est le répertoire professionnel du BSMK : un espace pour rendre visible les créateurs
              du pourtour méditerranéen, faciliter les rencontres et encourager les collaborations
              artistiques transnationales.
            </p>
          </HeroText>
        </Container>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-page-accent py-6">
        <Container>
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-white text-center">
            <StaggerItem>
              <CountUp value={allArtists.total || 0} className="font-display text-3xl lg:text-4xl" />
              <p className="font-sans text-xs tracking-widest uppercase mt-1 text-white/70">artistes référencés</p>
            </StaggerItem>
            <StaggerItem>
              <CountUp value={disciplines.length} className="font-display text-3xl lg:text-4xl" />
              <p className="font-sans text-xs tracking-widest uppercase mt-1 text-white/70">disciplines représentées</p>
            </StaggerItem>
            <StaggerItem>
              <CountUp value={sectors.length} className="font-display text-3xl lg:text-4xl" />
              <p className="font-sans text-xs tracking-widest uppercase mt-1 text-white/70">secteurs artistiques</p>
            </StaggerItem>
            <StaggerItem>
              <p className="font-display text-3xl lg:text-4xl">∞</p>
              <p className="font-sans text-xs tracking-widest uppercase mt-1 text-white/70">en croissance continue</p>
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </section>

      {/* ── Featured artists ── */}
      {featured.length > 0 && (
        <section className="py-20 lg:py-28 border-b border-bsmk-black/10">
          <Container>
            <div className="flex items-baseline justify-between mb-12">
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-page-accent mb-3">
                  Sélection
                </p>
                <h2 className="font-display text-4xl lg:text-5xl text-bsmk-black">
                  Artistes à la une
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featured.map((artist) => {
                const primaryDiscipline = artist.disciplines[0]?.discipline
                return (
                  <div key={artist.id}>
                    <Link
                      href={`/vetrinart/${artist.slug}`}
                      className="group flex gap-0 bg-bsmk-black overflow-hidden hover:bg-bsmk-black/90 transition-colors rounded-xl"
                    >
                      <div className="relative w-48 lg:w-56 shrink-0 aspect-[3/4]">
                        <Image
                          src={artist.photoUrl ?? 'https://picsum.photos/seed/artist/400/600'}
                          alt={artist.name}
                          fill
                          className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                        {primaryDiscipline?.color && (
                          <div
                            className="absolute inset-0 opacity-25"
                            style={{
                              background: `linear-gradient(to right, ${primaryDiscipline.color}80, transparent)`,
                            }}
                          />
                        )}
                      </div>

                      <div className="flex flex-col justify-between p-6 flex-1 min-w-0">
                        <div>
                          <p className="font-sans text-xs tracking-widest uppercase text-bsmk-sand/50 mb-3">
                            {artist.city ?? '—'}
                          </p>
                          <h3 className="font-display text-2xl lg:text-3xl text-bsmk-white leading-tight mb-3 group-hover:text-bsmk-sand transition-colors">
                            {artist.name}
                          </h3>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {artist.disciplines.map(({ discipline: d }) => (
                              <span
                                key={d.id}
                                className="inline-flex items-center gap-1.5 text-xs text-bsmk-white/70 border border-white/10 px-2 py-0.5 rounded-full"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: d.color ?? '#888' }}
                                />
                                {d.name}
                              </span>
                            ))}
                          </div>

                          <p className="font-sans text-sm text-bsmk-white/60 leading-relaxed line-clamp-2 mb-4">
                            {artist.bio}
                          </p>
                        </div>

                        <div className="flex items-center justify-end">
                          <span className="font-sans text-xs text-bsmk-white/30 tracking-widest uppercase ml-auto group-hover:text-bsmk-sand transition-colors">
                            Voir le profil →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </Container>
        </section>
      )}

      {/* ── Filter bar ── */}
      <section className="sticky top-16 lg:top-20 z-30 border-b border-bsmk-black/10 bg-bsmk-white/95 py-4 shadow-sm backdrop-blur">
        <Container>
          <FadeIn>
            <div className="flex flex-wrap items-center gap-3">
              {/* Sector filters */}
              {sectors.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 shrink-0">Secteur</span>
                  <div className="flex flex-wrap gap-1.5">
                    <Link
                      href={buildHref(filters, 'sector')}
                      scroll={false}
                      className={`font-sans text-xs tracking-widest uppercase px-2.5 py-1 rounded-full transition-colors ${
                        !filters.sector
                          ? 'bg-bsmk-black text-bsmk-white'
                          : 'border border-bsmk-black/20 text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white'
                      }`}
                    >
                      Tous
                    </Link>
                    {sectors.map((s) => (
                      <Link
                        key={s.slug}
                        href={buildHrefWithUpdate(filters, { sector: s.slug })}
                        scroll={false}
                        className="font-sans text-xs tracking-widest uppercase px-2.5 py-1 rounded-full border transition-all"
                        style={{
                          borderColor: filters.sector === s.slug ? s.color : `${s.color}60`,
                          color: filters.sector === s.slug ? 'white' : s.color,
                          backgroundColor: filters.sector === s.slug ? s.color : 'transparent',
                        }}
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                  <span className="text-bsmk-black/15">|</span>
                </div>
              )}

              {/* Discipline filters */}
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 shrink-0">Discipline</span>
                <div className="flex flex-wrap gap-1.5">
                  <Link
                    href={buildHref(filters, 'discipline')}
                    scroll={false}
                    className={`font-sans text-xs tracking-widest uppercase px-2.5 py-1 transition-colors ${
                      !filters.discipline
                        ? 'bg-bsmk-black text-bsmk-white'
                        : 'border border-bsmk-black/20 text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white'
                    }`}
                  >
                    Toutes
                  </Link>
                  {disciplines.map((d) => (
                    <Link
                      key={d.slug}
                      href={buildHrefWithUpdate(filters, { discipline: d.slug })}
                      scroll={false}
                      className={`font-sans text-xs tracking-widest uppercase px-2.5 py-1 border transition-colors ${
                        filters.discipline === d.slug
                          ? 'bg-bsmk-black text-bsmk-white border-bsmk-black'
                          : 'border-bsmk-black/20 text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white'
                      }`}
                    >
                      {d.shortName}
                    </Link>
                  ))}
                </div>
                {cities.length > 0 && <span className="text-bsmk-black/15">|</span>}
              </div>

              {/* City filter */}
              {cities.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 shrink-0">Ville</span>
                  <div className="flex flex-wrap gap-1.5">
                    <Link
                      href={buildHref(filters, 'city')}
                      scroll={false}
                      className={`font-sans text-xs tracking-widest uppercase px-2.5 py-1 transition-colors ${
                        !filters.city
                          ? 'bg-bsmk-black text-bsmk-white'
                          : 'border border-bsmk-black/20 text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white'
                      }`}
                    >
                      Toutes
                    </Link>
                    {cities.map((city) => (
                      <Link
                        key={city}
                        href={buildHrefWithUpdate(filters, { city })}
                        scroll={false}
                        className={`font-sans text-xs tracking-widest uppercase px-2.5 py-1 border transition-colors ${
                          filters.city === city
                            ? 'bg-bsmk-black text-bsmk-white border-bsmk-black'
                            : 'border-bsmk-black/20 text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white'
                        }`}
                      >
                        {city}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ── Full artist directory ── */}
      <section className="py-16 lg:py-20">
        <Container>
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-display text-3xl text-bsmk-black">
              Tous les artistes
            </h2>
            <p className="font-sans text-sm text-bsmk-black/40">
              {allArtists.total} artiste{allArtists.total > 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {allArtists.data.map((artist) => {
              const primaryDiscipline = artist.disciplines[0]?.discipline
              return (
                <div key={artist.id}>
                  <Link href={`/vetrinart/${artist.slug}`} className="group block">
                    <div
                      className="relative aspect-square overflow-hidden mb-3 rounded-lg"
                      style={{ backgroundColor: primaryDiscipline?.color ?? '#D4C5A9' }}
                    >
                      <Image
                        src={artist.photoUrl ?? 'https://picsum.photos/seed/artist/400/400'}
                        alt={artist.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      {artist.featured && (
                        <div className="absolute top-2 right-2">
                          <span className="font-sans text-xs tracking-widest uppercase bg-page-accent text-white px-2 py-0.5">
                            À la une
                          </span>
                        </div>
                      )}
                      {primaryDiscipline?.color && (
                        <div
                          className="absolute bottom-0 inset-x-0 h-1"
                          style={{ backgroundColor: primaryDiscipline.color }}
                        />
                      )}
                    </div>

                    <h3 className="font-display text-base lg:text-lg text-bsmk-black group-hover:text-page-accent transition-colors leading-tight mb-1">
                      {artist.name}
                    </h3>
                    <p className="font-sans text-xs text-bsmk-black/50 mb-2">
                      {artist.city ?? '—'}
                    </p>
                    {primaryDiscipline && (
                      <Badge variant="default">{primaryDiscipline.name}</Badge>
                    )}
                  </Link>
                </div>
              )
            })}
          </div>

          {allArtists.data.length === 0 && (
            <div className="border border-bsmk-black/10 bg-bsmk-sand/20 p-8 text-center rounded-xl">
              <h3 className="font-display text-2xl text-bsmk-black mb-2">Aucun profil pour ce filtre</h3>
              <p className="font-sans text-sm text-bsmk-black/60 mb-6">
                La base Vitrinart est pensée pour grandir avec le réseau.
              </p>
              <Link
                href="/vetrinart"
                scroll={false}
                className="inline-flex items-center h-11 px-6 bg-page-accent text-white text-sm font-medium tracking-wide hover:bg-page-accent/90 transition-colors rounded-lg"
              >
                Réinitialiser les filtres
              </Link>
            </div>
          )}

          {allArtists.totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: allArtists.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/vetrinart?page=${p}${filters.discipline ? `&discipline=${filters.discipline}` : ''}${filters.sector ? `&sector=${filters.sector}` : ''}${filters.city ? `&city=${filters.city}` : ''}`}
                  className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors rounded ${
                    p === allArtists.page
                      ? 'bg-bsmk-black text-white border-bsmk-black'
                      : 'border-bsmk-black/20 text-bsmk-black hover:bg-bsmk-black hover:text-white'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ── Join CTA ── */}
      <section className="bg-page-accent py-20 lg:py-28">
        <Container>
          <FadeUp>
            <div className="max-w-2xl mx-auto text-center">
              <p className="font-sans text-xs tracking-widest uppercase text-bsmk-white/70 mb-6">
                Rejoindre Vitrinart
              </p>
              <h2 className="font-display text-4xl lg:text-5xl text-bsmk-white mb-6 leading-tight">
                Vous êtes artiste ? Rejoignez Vitrinart.
              </h2>
              <p className="font-sans text-bsmk-white/60 leading-relaxed mb-8 max-w-lg mx-auto">
                Vitrinart vous offre une vitrine professionnelle au cœur du réseau BSMK.
                Valorisez votre travail, trouvez des collaborateurs, accédez à des opportunités
                de résidences et de diffusion dans toute la Méditerranée.
              </p>
              <Button href="/contact?sujet=Inscription+Vitrinart" variant="secondary" size="lg">
                Soumettre mon profil →
              </Button>
            </div>
          </FadeUp>
        </Container>
      </section>

    </main>
  )
}
