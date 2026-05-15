import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { artists, getFeaturedArtists } from '@/data/artists'
import { disciplines } from '@/data/disciplines'
import { HeroText, StaggerContainer, StaggerItem, FadeIn, FadeUp, CountUp } from '@/components/ui/Motion'

export const metadata: Metadata = {
  title: 'VetrinArt — Annuaire des artistes | BSMK',
  description: 'Découvrez les artistes méditerranéens référencés par le BSMK : musiciens, danseurs, plasticiens, cinéastes et créateurs de toute la Méditerranée.',
}

export const dynamic = 'force-dynamic'

const countries = Array.from(new Set(artists.map(a => a.country))).sort()

function buildHref(
  current: { discipline?: string; pays?: string; collaboration?: string },
  clearKey?: keyof typeof current,
) {
  const params = new URLSearchParams()
  if (current.discipline && clearKey !== 'discipline') params.set('discipline', current.discipline)
  if (current.pays && clearKey !== 'pays') params.set('pays', current.pays)
  if (current.collaboration && clearKey !== 'collaboration') params.set('collaboration', current.collaboration)
  const query = params.toString()
  return query ? `/vetrinart?${query}` : '/vetrinart'
}

function buildHrefWithUpdate(
  current: { discipline?: string; pays?: string; collaboration?: string },
  update: { discipline?: string; pays?: string; collaboration?: string },
) {
  const merged = { ...current, ...update }
  const params = new URLSearchParams()
  if (merged.discipline) params.set('discipline', merged.discipline)
  if (merged.pays) params.set('pays', merged.pays)
  if (merged.collaboration) params.set('collaboration', merged.collaboration)
  const query = params.toString()
  return query ? `/vetrinart?${query}` : '/vetrinart'
}

export default async function VetrinArtPage({
  searchParams,
}: {
  searchParams: Promise<{ discipline?: string; pays?: string; collaboration?: string }>
}) {
  const filters = await searchParams
  const featured = getFeaturedArtists()
  const filteredArtists = artists.filter((artist) => {
    if (filters.discipline && !artist.disciplineSlugs.includes(filters.discipline)) return false
    if (filters.pays && artist.country !== filters.pays) return false
    if (filters.collaboration && !artist.availableForCollaboration) return false
    return true
  })

  return (
    <main className="bg-bsmk-white min-h-screen">

      {/* ── Hero ── */}
      <section className="bg-bsmk-black text-bsmk-white py-24 lg:py-36">
        <Container>
          <HeroText delay={0}>
            <p className="font-sans text-xs tracking-widest uppercase text-bsmk-terracotta mb-6">
              BSMK · Réseau artistique
            </p>
          </HeroText>
          <HeroText delay={0.1}>
            <h1 className="font-display text-6xl lg:text-8xl xl:text-9xl text-bsmk-white leading-none mb-6">
              VetrinArt
            </h1>
          </HeroText>
          <HeroText delay={0.25}>
            <p className="font-sans text-lg lg:text-xl text-bsmk-white/70 max-w-2xl leading-relaxed mb-8">
              L'annuaire des artistes méditerranéens · Découvrez, collaborez, inspirez-vous
            </p>
          </HeroText>
          <HeroText delay={0.4}>
            <p className="font-sans text-sm text-bsmk-sand/60 max-w-xl leading-relaxed">
              VetrinArt est le répertoire professionnel du BSMK : un espace pour rendre visible les créateurs
              du pourtour méditerranéen, faciliter les rencontres et encourager les collaborations
              artistiques transnationales.
            </p>
          </HeroText>
        </Container>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-bsmk-terracotta py-6">
        <Container>
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-white text-center">
            <StaggerItem>
              <CountUp value={12} className="font-display text-3xl lg:text-4xl" />
              <p className="font-sans text-xs tracking-widest uppercase mt-1 text-white/70">artistes référencés</p>
            </StaggerItem>
            <StaggerItem>
              <CountUp value={7} className="font-display text-3xl lg:text-4xl" />
              <p className="font-sans text-xs tracking-widest uppercase mt-1 text-white/70">disciplines représentées</p>
            </StaggerItem>
            <StaggerItem>
              <CountUp value={6} className="font-display text-3xl lg:text-4xl" />
              <p className="font-sans text-xs tracking-widest uppercase mt-1 text-white/70">pays méditerranéens</p>
            </StaggerItem>
            <StaggerItem>
              <p className="font-display text-3xl lg:text-4xl">∞</p>
              <p className="font-sans text-xs tracking-widest uppercase mt-1 text-white/70">en croissance continue</p>
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </section>

      {/* ── Featured artists ── */}
      <section className="py-20 lg:py-28 border-b border-bsmk-black/10">
        <Container>
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-bsmk-terracotta mb-3">
                Sélection
              </p>
              <h2 className="font-display text-4xl lg:text-5xl text-bsmk-black">
                Artistes à la une
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featured.map((artist) => (
              <div key={artist.id}>
              <Link
                href={`/vetrinart/${artist.slug}`}
                className="group flex gap-0 bg-bsmk-black overflow-hidden hover:bg-bsmk-black/90 transition-colors rounded-xl"
              >
                {/* Photo */}
                <div className="relative w-48 lg:w-56 shrink-0 aspect-[3/4]">
                  <Image
                    src={artist.photoUrl}
                    alt={artist.name}
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between p-6 flex-1 min-w-0">
                  <div>
                    <p className="font-sans text-xs tracking-widest uppercase text-bsmk-sand/50 mb-3">
                      {artist.city}, {artist.country}
                    </p>
                    <h3 className="font-display text-2xl lg:text-3xl text-bsmk-white leading-tight mb-3 group-hover:text-bsmk-sand transition-colors">
                      {artist.name}
                    </h3>

                    {/* Disciplines */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {artist.disciplineSlugs.map((slug) => {
                        const d = disciplines.find(d => d.slug === slug)
                        return d ? (
                          <Badge key={slug} variant="dark">{d.shortName}</Badge>
                        ) : null
                      })}
                    </div>

                    {/* Bio excerpt */}
                    <p className="font-sans text-sm text-bsmk-white/60 leading-relaxed line-clamp-2 mb-4">
                      {artist.bio}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {artist.specialties.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="font-sans text-xs text-bsmk-sand/50 border border-bsmk-white/10 px-2 py-0.5 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {artist.availableForCollaboration && (
                      <span className="inline-flex items-center gap-1.5 font-sans text-xs text-bsmk-olive">
                        <span className="w-1.5 h-1.5 bg-bsmk-olive inline-block" />
                        Disponible pour collaboration
                      </span>
                    )}
                    <span className="font-sans text-xs text-bsmk-white/30 tracking-widest uppercase ml-auto group-hover:text-bsmk-sand transition-colors">
                      Voir le profil →
                    </span>
                  </div>
                </div>
              </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Filter bar (static) ── */}
      <section className="py-10 border-b border-bsmk-black/10 bg-bsmk-white sticky top-0 z-10 shadow-sm">
        <Container>
          <FadeIn>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
            {/* Discipline filters */}
            <div className="flex-1">
              <p className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 mb-3">
                Filtrer par discipline
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={buildHref(filters, 'discipline')}
                  scroll={false}
                  className={`font-sans text-xs tracking-widest uppercase px-3 py-1.5 transition-colors ${
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
                    className={`font-sans text-xs tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                      filters.discipline === d.slug
                        ? 'bg-bsmk-black text-bsmk-white border-bsmk-black'
                        : 'border-bsmk-black/20 text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white'
                    }`}
                  >
                    {d.shortName}
                  </Link>
                ))}
              </div>
            </div>

            {/* Country filters */}
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 mb-3">
                Par pays
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={buildHref(filters, 'pays')}
                  scroll={false}
                  className={`font-sans text-xs tracking-widest uppercase px-3 py-1.5 transition-colors ${
                    !filters.pays
                      ? 'bg-bsmk-black text-bsmk-white'
                      : 'border border-bsmk-black/20 text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white'
                  }`}
                >
                  Tous
                </Link>
                {countries.map((country) => (
                  <Link
                    key={country}
                    href={buildHrefWithUpdate(filters, { pays: country })}
                    scroll={false}
                    className={`font-sans text-xs tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                      filters.pays === country
                        ? 'bg-bsmk-black text-bsmk-white border-bsmk-black'
                        : 'border-bsmk-black/20 text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white'
                    }`}
                  >
                    {country}
                  </Link>
                ))}
              </div>
            </div>

            {/* Collaboration filter */}
            <div className="shrink-0">
              <p className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 mb-3">
                Disponibilité
              </p>
              <Link
                href={buildHrefWithUpdate(filters, { collaboration: filters.collaboration ? undefined : '1' })}
                scroll={false}
                className={`inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-3 py-1.5 border transition-colors rounded-md ${
                  filters.collaboration
                    ? 'border-bsmk-olive bg-bsmk-olive text-white'
                    : 'border-bsmk-olive text-bsmk-olive hover:bg-bsmk-olive hover:text-white'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 inline-block ${
                    filters.collaboration ? 'bg-white' : 'bg-bsmk-olive'
                  }`}
                />
                Disponible pour collaboration
              </Link>
            </div>
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
              {filteredArtists.length} artiste{filteredArtists.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredArtists.map((artist) => {
              const primaryDiscipline = disciplines.find(d => d.slug === artist.disciplineSlugs[0])
              return (
                <div key={artist.id}>
                <Link
                  href={`/vetrinart/${artist.slug}`}
                  className="group block"
                >
                  {/* Square photo */}
                  <div className="relative aspect-square overflow-hidden bg-bsmk-sand/20 mb-3 rounded-lg">
                    <Image
                      src={artist.photoUrl}
                      alt={artist.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Featured indicator */}
                    {artist.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="font-sans text-xs tracking-widest uppercase bg-bsmk-terracotta text-white px-2 py-0.5">
                          À la une
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="font-display text-base lg:text-lg text-bsmk-black group-hover:text-bsmk-terracotta transition-colors leading-tight mb-1">
                    {artist.name}
                  </h3>
                  <p className="font-sans text-xs text-bsmk-black/50 mb-2">
                    {artist.city} · {artist.country}
                  </p>
                  {primaryDiscipline && (
                    <Badge variant="default">{primaryDiscipline.shortName}</Badge>
                  )}
                  {artist.availableForCollaboration && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 bg-bsmk-olive inline-block shrink-0" />
                      <span className="font-sans text-xs text-bsmk-olive">Disponible</span>
                    </div>
                  )}
                </Link>
                </div>
              )
            })}
          </div>
          {filteredArtists.length === 0 && (
            <div className="border border-bsmk-black/10 bg-bsmk-sand/20 p-8 text-center rounded-xl">
              <h3 className="font-display text-2xl text-bsmk-black mb-2">Aucun profil pour ce filtre</h3>
              <p className="font-sans text-sm text-bsmk-black/60 mb-6">
                La base VetrinArt est pensée pour grandir avec le réseau.
              </p>
              <Link
                href="/vetrinart"
                scroll={false}
                className="inline-flex items-center h-11 px-6 bg-bsmk-terracotta text-white text-sm font-medium tracking-wide hover:bg-bsmk-terracotta/90 transition-colors rounded-lg"
              >
                Réinitialiser les filtres
              </Link>
            </div>
          )}
        </Container>
      </section>

      {/* ── Join CTA ── */}
      <section className="bg-bsmk-blue py-20 lg:py-28">
        <Container>
          <FadeUp>
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-sans text-xs tracking-widest uppercase text-bsmk-sand/50 mb-6">
              Rejoindre VetrinArt
            </p>
            <h2 className="font-display text-4xl lg:text-5xl text-bsmk-white mb-6 leading-tight">
              Vous êtes artiste ? Rejoignez VetrinArt.
            </h2>
            <p className="font-sans text-bsmk-white/60 leading-relaxed mb-8 max-w-lg mx-auto">
              VetrinArt vous offre une vitrine professionnelle au cœur du réseau BSMK.
              Valorisez votre travail, trouvez des collaborateurs, accédez à des opportunités
              de résidences et de diffusion dans toute la Méditerranée. L'inscription est gratuite
              pour les artistes accompagnés par le BSMK.
            </p>
            <Button href="/contact?sujet=Inscription+VetrinArt" variant="primary" size="lg">
              Soumettre mon profil →
            </Button>
          </div>
          </FadeUp>
        </Container>
      </section>

    </main>
  )
}
