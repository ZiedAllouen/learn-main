import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { disciplines } from '@/data/disciplines'
import { getSectors } from '@/lib/api/sectors'
import { getArtists, type Artist } from '@/lib/api/artists'
import { HeroText, StaggerContainer, StaggerItem, FadeIn, FadeUp, CountUp } from '@/components/ui/Motion'

export const metadata: Metadata = {
  title: 'Vitrinart - Annuaire des artistes | BSMK',
  description:
    "Decouvrez les artistes references par le BSMK en Tunisie, avec une ouverture vers d'autres territoires et collaborations a venir.",
}

export const dynamic = 'force-dynamic'

type Filters = {
  discipline?: string
  sector?: string
  city?: string
  sort?: string
  product?: string
}

const collator = new Intl.Collator('fr', { sensitivity: 'base' })

function buildHref(current: Filters, clearKey?: keyof Filters) {
  const params = new URLSearchParams()
  if (current.discipline && clearKey !== 'discipline') params.set('discipline', current.discipline)
  if (current.sector && clearKey !== 'sector') params.set('sector', current.sector)
  if (current.city && clearKey !== 'city') params.set('city', current.city)
  if (current.sort && clearKey !== 'sort') params.set('sort', current.sort)
  if (current.product && clearKey !== 'product') params.set('product', current.product)
  const query = params.toString()
  return query ? `/vetrinart?${query}` : '/vetrinart'
}

function buildHrefWithUpdate(current: Filters, update: Partial<Filters>) {
  const merged = { ...current, ...update }
  const params = new URLSearchParams()
  if (merged.discipline) params.set('discipline', merged.discipline)
  if (merged.sector) params.set('sector', merged.sector)
  if (merged.city) params.set('city', merged.city)
  if (merged.sort) params.set('sort', merged.sort)
  if (merged.product) params.set('product', merged.product)
  const query = params.toString()
  return query ? `/vetrinart?${query}` : '/vetrinart'
}

function formatProductLabel(type: string) {
  return type
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function ArtistCard({ artist }: { artist: Artist }) {
  const primaryDiscipline = artist.disciplines[0]?.discipline
  const primaryProduct = artist.works.find(work => work.type?.trim())?.type?.trim()

  return (
    <div>
      <Link href={`/vetrinart/${artist.slug}`} className="group block">
        <div
          className="relative aspect-square overflow-hidden mb-3 rounded-lg"
          style={{ backgroundColor: primaryDiscipline?.color ?? '#D4C5A9' }}
        >
          <Image
            src={artist.photoUrl ?? '/assets/images/happy-face.jpg'}
            alt={artist.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          {artist.featured && (
            <div className="absolute top-2 right-2">
              <span className="font-sans text-xs tracking-widest uppercase bg-page-accent text-white px-2 py-0.5">
                A la une
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
          {artist.city ?? '-'}
        </p>
        <div className="flex flex-wrap gap-2">
          {primaryDiscipline && <Badge variant="default">{primaryDiscipline.name}</Badge>}
          {primaryProduct && <Badge variant="outline">{formatProductLabel(primaryProduct)}</Badge>}
        </div>
      </Link>
    </div>
  )
}

export default async function VetrinArtPage({
  searchParams,
}: {
  searchParams: Promise<Filters>
}) {
  const filters = await searchParams
  const sortMode = filters.sort === 'discipline' ? 'discipline' : 'alphabetical'

  const [featuredResult, directoryResult, sectorsData] = await Promise.allSettled([
    getArtists({ featured: true, status: 'PUBLISHED', pageSize: 4 }),
    getArtists({
      status: 'PUBLISHED',
      discipline: filters.discipline,
      sector: filters.sector,
      city: filters.city,
      pageSize: 200,
    }),
    getSectors(),
  ])

  const featured = featuredResult.status === 'fulfilled' ? featuredResult.value.data : []
  const directory = directoryResult.status === 'fulfilled' ? directoryResult.value.data : []
  const sectors = sectorsData.status === 'fulfilled' ? sectorsData.value : []

  const productCategories = Array.from(
    new Set(
      directory
        .flatMap(artist => artist.works.map(work => work.type?.trim()))
        .filter((type): type is string => Boolean(type)),
    ),
  ).sort(collator.compare)

  const filteredArtists = filters.product
    ? directory.filter(artist => artist.works.some(work => work.type?.trim() === filters.product))
    : directory

  const cities = Array.from(
    new Set(filteredArtists.map(artist => artist.city).filter(Boolean) as string[]),
  ).sort(collator.compare)

  const alphabeticalArtists = [...filteredArtists].sort((a, b) => collator.compare(a.name, b.name))

  const artistsByDiscipline = disciplines
    .map((discipline) => ({
      discipline,
      artists: alphabeticalArtists.filter((artist) =>
        artist.disciplines.some(({ discipline: artistDiscipline }) => artistDiscipline.slug === discipline.slug),
      ),
    }))
    .filter(group => group.artists.length > 0)
    .sort((a, b) => collator.compare(a.discipline.name, b.discipline.name))

  const allWorks = directory
    .flatMap(artist =>
      artist.works.map(work => ({
        id: work.id,
        title: work.title,
        description: work.description,
        imageUrl: work.imageUrls[0] ?? null,
        type: work.type,
        year: work.year,
        artistName: artist.name,
        artistSlug: artist.slug,
      })),
    )
    .filter(work => work.title)
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))

  return (
    <main className="bg-bsmk-white min-h-screen">
      <section className="bg-bsmk-black text-bsmk-white py-24 lg:py-36">
        <Container>
          <HeroText delay={0}>
            <p className="font-sans text-xs tracking-widest uppercase text-page-accent mb-6">
              BSMK · Reseau artistique
            </p>
          </HeroText>
          <HeroText delay={0.1}>
            <h1 className="font-display text-6xl lg:text-8xl xl:text-9xl text-bsmk-white leading-none mb-6">
              Vitrinart
            </h1>
          </HeroText>
          <HeroText delay={0.25}>
            <p className="font-sans text-lg lg:text-xl text-bsmk-white/70 max-w-2xl leading-relaxed mb-8">
              L&apos;annuaire des artistes de Tunisie, avec une ouverture vers d&apos;autres territoires
            </p>
          </HeroText>
          <HeroText delay={0.4}>
            <p className="font-sans text-sm text-bsmk-sand/60 max-w-xl leading-relaxed">
              Vitrinart est le repertoire professionnel du BSMK : un espace pour rendre visibles les
              artistes de toute la Tunisie, faciliter les rencontres, puis accueillir progressivement
              d&apos;autres profils et collaborations venus d&apos;ailleurs.
            </p>
          </HeroText>
        </Container>
      </section>

      <section className="bg-page-accent py-6">
        <Container>
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-white text-center">
            <StaggerItem>
              <CountUp value={filteredArtists.length} className="font-display text-3xl lg:text-4xl" />
              <p className="font-sans text-xs tracking-widest uppercase mt-1 text-white/70">artistes references</p>
            </StaggerItem>
            <StaggerItem>
              <CountUp value={disciplines.length} className="font-display text-3xl lg:text-4xl" />
              <p className="font-sans text-xs tracking-widest uppercase mt-1 text-white/70">disciplines representees</p>
            </StaggerItem>
            <StaggerItem>
              <CountUp value={sectors.length} className="font-display text-3xl lg:text-4xl" />
              <p className="font-sans text-xs tracking-widest uppercase mt-1 text-white/70">secteurs artistiques</p>
            </StaggerItem>
            <StaggerItem>
              <p className="font-display text-3xl lg:text-4xl">TN+</p>
              <p className="font-sans text-xs tracking-widest uppercase mt-1 text-white/70">Tunisie d&apos;abord, ouvert ensuite</p>
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </section>

      {featured.length > 0 && (
        <section className="py-20 lg:py-28 border-b border-bsmk-black/10">
          <Container>
            <div className="flex items-baseline justify-between mb-12">
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-page-accent mb-3">
                  Selection
                </p>
                <h2 className="font-display text-4xl lg:text-5xl text-bsmk-black">
                  Artistes a la une
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featured.map((artist) => {
                const primaryDiscipline = artist.disciplines[0]?.discipline
                const primaryProduct = artist.works.find(work => work.type?.trim())?.type?.trim()

                return (
                  <div key={artist.id}>
                    <Link
                      href={`/vetrinart/${artist.slug}`}
                      className="group flex gap-0 bg-bsmk-black overflow-hidden hover:bg-bsmk-black/90 transition-colors rounded-xl"
                    >
                      <div className="relative w-48 lg:w-56 shrink-0 aspect-[3/4]">
                        <Image
                          src={artist.photoUrl ?? '/assets/images/happy-face.jpg'}
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
                            {artist.city ?? '-'}
                          </p>
                          <h3 className="font-display text-2xl lg:text-3xl text-bsmk-white leading-tight mb-3 group-hover:text-bsmk-sand transition-colors">
                            {artist.name}
                          </h3>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {artist.disciplines.map(({ discipline: discipline }) => (
                              <span
                                key={discipline.id}
                                className="inline-flex items-center gap-1.5 text-xs text-bsmk-white/70 border border-white/10 px-2 py-0.5 rounded-full"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: discipline.color ?? '#888' }}
                                />
                                {discipline.name}
                              </span>
                            ))}
                            {primaryProduct && (
                              <span className="inline-flex items-center gap-1.5 text-xs text-bsmk-sand border border-bsmk-sand/20 px-2 py-0.5 rounded-full">
                                {formatProductLabel(primaryProduct)}
                              </span>
                            )}
                          </div>

                          <p className="font-sans text-sm text-bsmk-white/60 leading-relaxed line-clamp-2 mb-4">
                            {artist.bio}
                          </p>
                        </div>

                        <div className="flex items-center justify-end">
                          <span className="font-sans text-xs text-bsmk-white/30 tracking-widest uppercase ml-auto group-hover:text-bsmk-sand transition-colors">
                            Voir le profil -&gt;
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

      {allWorks.length > 0 && (
        <section className="py-20 lg:py-28 border-b border-bsmk-black/10">
          <Container>
            <div className="flex items-baseline justify-between mb-12">
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-page-accent mb-3">
                  Oeuvres &amp; Produits
                </p>
                <h2 className="font-display text-4xl lg:text-5xl text-bsmk-black">
                  Creations du reseau
                </h2>
              </div>
              <p className="font-sans text-sm text-bsmk-black/40">
                {allWorks.length} oeuvre{allWorks.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {allWorks.map((work) => (
                <Link
                  key={work.id}
                  href={`/vetrinart/${work.artistSlug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-3 bg-bsmk-sand/20">
                    {work.imageUrl ? (
                      <Image
                        src={work.imageUrl}
                        alt={work.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-page-accent/10">
                        <span className="font-display text-4xl text-page-accent/30">
                          {work.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    {work.type && (
                      <div className="absolute top-2 left-2">
                        <span className="font-sans text-[10px] tracking-widest uppercase bg-bsmk-black/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {formatProductLabel(work.type)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-sans text-sm font-medium text-bsmk-black group-hover:text-page-accent transition-colors leading-tight mb-1">
                    {work.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="font-sans text-xs text-bsmk-black/50">
                      {work.artistName}
                    </p>
                    {work.year && (
                      <span className="font-sans text-xs text-bsmk-black/30">
                        · {work.year}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="sticky top-16 lg:top-20 z-30 border-b border-bsmk-black/10 bg-bsmk-white/95 py-4 shadow-sm backdrop-blur">
        <Container>
          <FadeIn>
            <div className="flex flex-wrap items-center gap-3">
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
                    {sectors.map((sector) => (
                      <Link
                        key={sector.slug}
                        href={buildHrefWithUpdate(filters, { sector: sector.slug })}
                        scroll={false}
                        className="font-sans text-xs tracking-widest uppercase px-2.5 py-1 rounded-full border transition-all"
                        style={{
                          borderColor: filters.sector === sector.slug ? sector.color : `${sector.color}60`,
                          color: filters.sector === sector.slug ? 'white' : sector.color,
                          backgroundColor: filters.sector === sector.slug ? sector.color : 'transparent',
                        }}
                      >
                        {sector.name}
                      </Link>
                    ))}
                  </div>
                  <span className="text-bsmk-black/15">|</span>
                </div>
              )}

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
                  {disciplines.map((discipline) => (
                    <Link
                      key={discipline.slug}
                      href={buildHrefWithUpdate(filters, { discipline: discipline.slug })}
                      scroll={false}
                      className={`font-sans text-xs tracking-widest uppercase px-2.5 py-1 border transition-colors ${
                        filters.discipline === discipline.slug
                          ? 'bg-bsmk-black text-bsmk-white border-bsmk-black'
                          : 'border-bsmk-black/20 text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white'
                      }`}
                    >
                      {discipline.shortName}
                    </Link>
                  ))}
                </div>
                <span className="text-bsmk-black/15">|</span>
              </div>

              {productCategories.length > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 shrink-0">Categorie produit</span>
                    <div className="flex flex-wrap gap-1.5">
                      <Link
                        href={buildHref(filters, 'product')}
                        scroll={false}
                        className={`font-sans text-xs tracking-widest uppercase px-2.5 py-1 transition-colors ${
                          !filters.product
                            ? 'bg-bsmk-black text-bsmk-white'
                            : 'border border-bsmk-black/20 text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white'
                        }`}
                      >
                        Toutes
                      </Link>
                      {productCategories.map((product) => (
                        <Link
                          key={product}
                          href={buildHrefWithUpdate(filters, { product })}
                          scroll={false}
                          className={`font-sans text-xs tracking-widest uppercase px-2.5 py-1 border transition-colors ${
                            filters.product === product
                              ? 'bg-bsmk-black text-bsmk-white border-bsmk-black'
                              : 'border-bsmk-black/20 text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white'
                          }`}
                        >
                          {formatProductLabel(product)}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <span className="text-bsmk-black/15">|</span>
                </>
              )}

              {cities.length > 0 && (
                <>
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
                  <span className="text-bsmk-black/15">|</span>
                </>
              )}

              <div className="flex items-center gap-2">
                <span className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 shrink-0">Tri</span>
                <div className="flex flex-wrap gap-1.5">
                  <Link
                    href={buildHrefWithUpdate(filters, { sort: 'alphabetical' })}
                    scroll={false}
                    className={`font-sans text-xs tracking-widest uppercase px-2.5 py-1 transition-colors ${
                      sortMode === 'alphabetical'
                        ? 'bg-bsmk-black text-bsmk-white'
                        : 'border border-bsmk-black/20 text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white'
                    }`}
                  >
                    Alphabetique
                  </Link>
                  <Link
                    href={buildHrefWithUpdate(filters, { sort: 'discipline' })}
                    scroll={false}
                    className={`font-sans text-xs tracking-widest uppercase px-2.5 py-1 transition-colors ${
                      sortMode === 'discipline'
                        ? 'bg-bsmk-black text-bsmk-white'
                        : 'border border-bsmk-black/20 text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white'
                    }`}
                  >
                    Par discipline
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

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

          {sortMode === 'discipline' ? (
            <div className="space-y-12">
              {artistsByDiscipline.map(({ discipline, artists }) => (
                <div key={discipline.slug}>
                  <div className="flex items-baseline justify-between gap-4 mb-5">
                    <div>
                      <p className="font-sans text-xs tracking-widest uppercase text-page-accent mb-2">
                        Discipline
                      </p>
                      <h3 className="font-display text-2xl lg:text-3xl text-bsmk-black">
                        {discipline.name}
                      </h3>
                    </div>
                    <p className="font-sans text-sm text-bsmk-black/40">
                      {artists.length} profil{artists.length > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                    {artists.map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {alphabeticalArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}

          {filteredArtists.length === 0 && (
            <div className="border border-bsmk-black/10 bg-bsmk-sand/20 p-8 text-center rounded-xl">
              <h3 className="font-display text-2xl text-bsmk-black mb-2">Aucun profil pour ce filtre</h3>
              <p className="font-sans text-sm text-bsmk-black/60 mb-6">
                La base Vitrinart est pensee pour grandir avec le reseau.
              </p>
              <Link
                href="/vetrinart"
                scroll={false}
                className="inline-flex items-center h-11 px-6 bg-page-accent text-white text-sm font-medium tracking-wide hover:bg-page-accent/90 transition-colors rounded-lg"
              >
                Reinitialiser les filtres
              </Link>
            </div>
          )}
        </Container>
      </section>

      <section className="bg-page-accent py-20 lg:py-28">
        <Container>
          <FadeUp>
            <div className="max-w-2xl mx-auto text-center">
              <p className="font-sans text-xs tracking-widest uppercase text-bsmk-white/70 mb-6">
                Rejoindre Vitrinart
              </p>
              <h2 className="font-display text-4xl lg:text-5xl text-bsmk-white mb-6 leading-tight">
                Vous etes artiste ? Rejoignez Vitrinart.
              </h2>
              <p className="font-sans text-bsmk-white/60 leading-relaxed mb-8 max-w-lg mx-auto">
                Vitrinart vous offre une vitrine professionnelle au coeur du reseau BSMK.
                Valorisez votre travail, trouvez des collaborateurs et rejoignez un annuaire
                pense d&apos;abord pour la Tunisie, puis pour des ouvertures plus larges.
              </p>
              <Button href="/contact?sujet=Inscription+Vitrinart" variant="secondary" size="lg">
                Soumettre mon profil -&gt;
              </Button>
            </div>
          </FadeUp>
        </Container>
      </section>
    </main>
  )
}
