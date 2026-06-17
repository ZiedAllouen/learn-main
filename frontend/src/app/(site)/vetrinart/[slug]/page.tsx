import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getArtist, getArtists } from '@/lib/api/artists'
import { HeroText, ScaleIn, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

function formatProductLabel(type: string) {
  return type
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const artist = await getArtist(slug)
    return {
      title: `${artist.name} - ${artist.city ?? ''} | VetrinArt BSMK`,
      description: (artist.bio ?? '').slice(0, 160),
    }
  } catch {
    return { title: 'Artiste introuvable | VetrinArt' }
  }
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params

  let artist
  try {
    artist = await getArtist(slug)
  } catch {
    notFound()
  }

  const primaryDiscipline = artist.disciplines[0]?.discipline
  const productCategories = Array.from(
    new Set(artist.works.map(work => work.type?.trim()).filter((type): type is string => Boolean(type))),
  )

  let moreArtists: Awaited<ReturnType<typeof getArtists>>['data'] = []
  try {
    if (primaryDiscipline?.slug) {
      const more = await getArtists({ discipline: primaryDiscipline.slug, status: 'PUBLISHED', pageSize: 4 })
      moreArtists = more.data.filter(a => a.id !== artist.id).slice(0, 3)
    }
  } catch {
    // ignore
  }

  const encodedName = encodeURIComponent(`Collaboration avec ${artist.name}`)

  return (
    <main className="bg-bsmk-white min-h-screen">
      <section className="bg-bsmk-black text-bsmk-white">
        <Container className="py-16 lg:py-24">
          <nav className="mb-10">
            <ol className="flex items-center gap-2 font-sans text-xs text-bsmk-white/40 tracking-widest uppercase">
              <li>
                <Link href="/vetrinart" className="hover:text-bsmk-white transition-colors">
                  VetrinArt
                </Link>
              </li>
              <li className="text-bsmk-white/20">/</li>
              <li className="text-bsmk-white/70">{artist.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <HeroText delay={0}>
                <div className="flex flex-wrap items-center gap-3">
                  {artist.city && (
                    <p className="font-sans text-sm tracking-widest uppercase text-bsmk-sand/60">
                      {artist.city}
                    </p>
                  )}
                  {artist.email && (
                    <>
                      <span className="text-bsmk-white/20">·</span>
                      <span className="font-sans text-sm text-bsmk-white/40">{artist.email}</span>
                    </>
                  )}
                </div>
              </HeroText>

              <HeroText delay={0.1}>
                <h1 className="font-display text-5xl lg:text-7xl xl:text-8xl text-bsmk-white leading-none">
                  {artist.name}
                </h1>
              </HeroText>

              <HeroText delay={0.25}>
                <div className="flex flex-wrap gap-2">
                  {artist.disciplines.map(({ discipline }) => (
                    <Badge key={discipline.id} variant="terracotta">{discipline.name}</Badge>
                  ))}
                  {productCategories.map((category) => (
                    <Badge key={category} variant="outline">{formatProductLabel(category)}</Badge>
                  ))}
                </div>
              </HeroText>

              {artist.statement && (
                <HeroText delay={0.4}>
                  <blockquote className="border-l-2 border-page-accent pl-6 mt-2">
                    <p className="font-display text-xl lg:text-2xl text-bsmk-sand italic leading-snug">
                      "{artist.statement}"
                    </p>
                  </blockquote>
                </HeroText>
              )}
            </div>

            <div className="lg:col-span-1">
              <ScaleIn>
                <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
                  <Image
                    src={artist.photoUrl ?? '/assets/images/happy-face.jpg'}
                    alt={artist.name}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </ScaleIn>
            </div>
          </div>
        </Container>
      </section>

      {artist.bio && (
        <section className="bg-bsmk-white py-16 lg:py-20 border-b border-bsmk-black/10">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              <FadeUp className="lg:col-span-2">
                <p className="font-sans text-xs tracking-widest uppercase text-page-accent mb-6">
                  Biographie
                </p>
                <p className="font-sans text-lg text-bsmk-black/80 leading-relaxed">
                  {artist.bio}
                </p>
              </FadeUp>

              <div className="lg:col-span-1">
                <p className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 mb-6">
                  Liens & Reseaux
                </p>
                <div className="flex flex-col gap-3">
                  {artist.websiteUrl && (
                    <a
                      href={artist.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-sm text-bsmk-black hover:text-page-accent transition-colors flex items-center gap-2"
                    >
                      <span className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 w-20">
                        Site web
                      </span>
                      <span className="underline underline-offset-4">{artist.websiteUrl.replace('https://', '')}</span>
                    </a>
                  )}
                  {artist.instagramUrl && (
                    <div className="font-sans text-sm text-bsmk-black flex items-center gap-2">
                      <span className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 w-20">
                        Instagram
                      </span>
                      <span>{artist.instagramUrl}</span>
                    </div>
                  )}
                  {artist.email && (
                    <div className="font-sans text-sm text-bsmk-black flex items-center gap-2">
                      <span className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 w-20">
                        Email
                      </span>
                      <span>{artist.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {artist.works.length > 0 && (
        <section className="py-16 lg:py-20 border-b border-bsmk-black/10">
          <Container>
            <p className="font-sans text-xs tracking-widest uppercase text-page-accent mb-3">
              Travaux
            </p>
            <h2 className="font-display text-3xl lg:text-4xl text-bsmk-black mb-10">
              Portfolio
            </h2>
            {productCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {productCategories.map((category) => (
                  <Badge key={category} variant="outline">{formatProductLabel(category)}</Badge>
                ))}
              </div>
            )}
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {artist.works.map((work) => (
                <StaggerItem key={work.id}>
                  <div className="relative overflow-hidden bg-bsmk-sand/20 rounded-lg" style={{ aspectRatio: '4/3' }}>
                    {work.imageUrls[0] ? (
                      <Image
                        src={work.imageUrls[0]}
                        alt={work.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <p className="font-sans text-sm text-bsmk-black/40 text-center">{work.title}</p>
                      </div>
                    )}
                  </div>
                  <p className="font-sans text-sm text-bsmk-black mt-2">{work.title}</p>
                  {work.type && (
                    <p className="font-sans text-xs text-page-accent mt-1 uppercase tracking-widest">
                      {formatProductLabel(work.type)}
                    </p>
                  )}
                  {work.year && <p className="font-sans text-xs text-bsmk-black/40">{work.year}</p>}
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      )}

      {artist.disciplines.length > 0 && (
        <section className="py-16 lg:py-20 border-b border-bsmk-black/10 bg-bsmk-black/3">
          <Container>
            <p className="font-sans text-xs tracking-widest uppercase text-page-accent mb-3">
              Pratiques
            </p>
            <h2 className="font-display text-3xl lg:text-4xl text-bsmk-black mb-10">
              Disciplines pratiquees
            </h2>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artist.disciplines.map(({ discipline }) => (
                <StaggerItem key={discipline.id}>
                  <Link
                    href={`/disciplines/${discipline.slug}`}
                    className="group flex gap-0 border border-bsmk-black/10 hover:border-page-accent transition-colors rounded-xl overflow-hidden"
                  >
                    <div
                      className="w-2 shrink-0"
                      style={{ backgroundColor: discipline.color ?? '#888' }}
                    />
                    <div className="p-6">
                      <h3 className="font-display text-xl text-bsmk-black group-hover:text-page-accent transition-colors mb-2">
                        {discipline.name}
                      </h3>
                      <p className="font-sans text-xs tracking-widest uppercase text-bsmk-black/30 mt-4 group-hover:text-page-accent transition-colors">
                        Explorer la discipline -&gt;
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      )}

      {artist.email && (
        <section className="bg-page-accent py-16 lg:py-20">
          <Container>
            <FadeUp>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-white/60 mb-4">
                    Collaboration
                  </p>
                  <h2 className="font-display text-3xl lg:text-4xl text-white mb-3 leading-tight">
                    Collaborer avec {artist.name}
                  </h2>
                  <p className="font-sans text-white/70 leading-relaxed max-w-lg">
                    {artist.name} est ouvert·e aux propositions de collaboration artistique.
                    Envoyez un message via BSMK pour initier le contact.
                  </p>
                </div>
                <Button
                  href={`/contact?sujet=${encodedName}`}
                  variant="secondary"
                  size="lg"
                  className="shrink-0"
                >
                  Envoyer un message -&gt;
                </Button>
              </div>
            </FadeUp>
          </Container>
        </section>
      )}

      {moreArtists.length > 0 && (
        <section className="py-16 lg:py-20">
          <Container>
            <div className="flex items-baseline justify-between mb-10">
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-page-accent mb-3">
                  {primaryDiscipline?.name ?? 'Meme discipline'}
                </p>
                <h2 className="font-display text-3xl text-bsmk-black">
                  Decouvrir d&apos;autres artistes
                </h2>
              </div>
              <Link
                href="/vetrinart"
                className="font-sans text-sm text-bsmk-black/40 hover:text-page-accent transition-colors"
              >
                Tout l&apos;annuaire -&gt;
              </Link>
            </div>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {moreArtists.map((other) => {
                const otherPrimary = other.disciplines[0]?.discipline
                const otherProduct = other.works.find(work => work.type?.trim())?.type?.trim()

                return (
                  <StaggerItem key={other.id}>
                    <Link
                      href={`/vetrinart/${other.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-square overflow-hidden bg-bsmk-sand/20 mb-4 rounded-lg">
                        <Image
                          src={other.photoUrl ?? '/assets/images/happy-face.jpg'}
                          alt={other.name}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="font-display text-lg text-bsmk-black group-hover:text-page-accent transition-colors mb-1">
                        {other.name}
                      </h3>
                      <p className="font-sans text-xs text-bsmk-black/50 mb-2">
                        {other.city ?? '-'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {otherPrimary && <Badge variant="default">{otherPrimary.name}</Badge>}
                        {otherProduct && <Badge variant="outline">{formatProductLabel(otherProduct)}</Badge>}
                      </div>
                    </Link>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </Container>
        </section>
      )}
    </main>
  )
}
