import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { artists, getArtistBySlug, getArtistsByDiscipline } from '@/data/artists'
import { getDisciplineBySlug, disciplines } from '@/data/disciplines'
import { HeroText, ScaleIn, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return artists.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const artist = getArtistBySlug(slug)
  if (!artist) return { title: 'Artiste introuvable | VetrinArt' }
  return {
    title: `${artist.name} — ${artist.city} | VetrinArt BSMK`,
    description: artist.bio.slice(0, 160),
  }
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params
  const artist = getArtistBySlug(slug)

  if (!artist) notFound()

  // "More artists" — same primary discipline, exclude current
  const primarySlug = artist.disciplineSlugs[0]
  const moreArtists = getArtistsByDiscipline(primarySlug)
    .filter(a => a.slug !== artist.slug)
    .slice(0, 3)

  const primaryDiscipline = getDisciplineBySlug(primarySlug)

  // Encode artist name for URL
  const encodedName = encodeURIComponent(`Collaboration avec ${artist.name}`)

  return (
    <main className="bg-bsmk-white min-h-screen">

      {/* ── Hero header ── */}
      <section className="bg-bsmk-black text-bsmk-white">
        <Container className="py-16 lg:py-24">

          {/* Breadcrumb */}
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

            {/* Left: 2/3 — text content */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Location + member since */}
              <HeroText delay={0}>
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-sans text-sm tracking-widest uppercase text-bsmk-sand/60">
                  {artist.city}, {artist.country}
                </p>
                <span className="text-bsmk-white/20">·</span>
                <Badge variant="dark">Membre depuis {artist.memberSince}</Badge>
                {artist.availableForCollaboration && (
                  <span className="inline-flex items-center gap-1.5 font-sans text-xs text-bsmk-olive">
                    <span className="w-1.5 h-1.5 bg-bsmk-olive inline-block" />
                    Disponible pour collaboration
                  </span>
                )}
              </div>
              </HeroText>

              {/* Name */}
              <HeroText delay={0.1}>
              <h1 className="font-display text-5xl lg:text-7xl xl:text-8xl text-bsmk-white leading-none">
                {artist.name}
              </h1>
              </HeroText>

              {/* Discipline badges */}
              <HeroText delay={0.25}>
              <div className="flex flex-wrap gap-2">
                {artist.disciplineSlugs.map((ds) => {
                  const d = disciplines.find(d => d.slug === ds)
                  return d ? (
                    <Badge key={ds} variant="terracotta">{d.name}</Badge>
                  ) : null
                })}
              </div>
              </HeroText>

              {/* Statement */}
              <HeroText delay={0.4}>
              <blockquote className="border-l-2 border-page-accent pl-6 mt-2">
                <p className="font-display text-xl lg:text-2xl text-bsmk-sand italic leading-snug">
                  « {artist.statement} »
                </p>
              </blockquote>
              </HeroText>
            </div>

            {/* Right: 1/3 — portrait */}
            <div className="lg:col-span-1">
              <ScaleIn>
              <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
                <Image
                  src={artist.photoUrl}
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

      {/* ── Bio section ── */}
      <section className="bg-bsmk-white py-16 lg:py-20 border-b border-bsmk-black/10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

            {/* Bio text */}
            <FadeUp className="lg:col-span-2">
              <p className="font-sans text-xs tracking-widest uppercase text-page-accent mb-6">
                Biographie
              </p>
              <p className="font-sans text-lg text-bsmk-black/80 leading-relaxed">
                {artist.bio}
              </p>

              {/* Specialties */}
              <div className="mt-8">
                <p className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 mb-3">
                  Spécialités
                </p>
                <div className="flex flex-wrap gap-2">
                  {artist.specialties.map((s) => (
                    <span
                      key={s}
                      className="font-sans text-sm text-bsmk-black border border-bsmk-black/20 px-3 py-1 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Links sidebar */}
            <div className="lg:col-span-1">
              <p className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 mb-6">
                Liens & Réseaux
              </p>
              <div className="flex flex-col gap-3">
                {artist.website && (
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-bsmk-black hover:text-page-accent transition-colors flex items-center gap-2"
                  >
                    <span className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 w-20">
                      Site web
                    </span>
                    <span className="underline underline-offset-4">{artist.website.replace('https://', '')}</span>
                  </a>
                )}
                {artist.social.instagram && (
                  <div className="font-sans text-sm text-bsmk-black flex items-center gap-2">
                    <span className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 w-20">
                      Instagram
                    </span>
                    <span>{artist.social.instagram}</span>
                  </div>
                )}
                {artist.social.facebook && (
                  <div className="font-sans text-sm text-bsmk-black flex items-center gap-2">
                    <span className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 w-20">
                      Facebook
                    </span>
                    <span>{artist.social.facebook}</span>
                  </div>
                )}
                {artist.social.youtube && (
                  <div className="font-sans text-sm text-bsmk-black flex items-center gap-2">
                    <span className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 w-20">
                      YouTube
                    </span>
                    <span>{artist.social.youtube}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ── Portfolio gallery ── */}
      <section className="py-16 lg:py-20 border-b border-bsmk-black/10">
        <Container>
          <p className="font-sans text-xs tracking-widest uppercase text-page-accent mb-3">
            Travaux
          </p>
          <h2 className="font-display text-3xl lg:text-4xl text-bsmk-black mb-10">
            Portfolio
          </h2>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {artist.portfolioImages.map((url, idx) => (
              <StaggerItem key={idx}>
              <div className="relative overflow-hidden bg-bsmk-sand/20 rounded-lg" style={{ aspectRatio: '4/3' }}>
                <Image
                  src={url}
                  alt={`${artist.name} — œuvre ${idx + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ── Disciplines ── */}
      <section className="py-16 lg:py-20 border-b border-bsmk-black/10 bg-bsmk-black/3">
        <Container>
          <p className="font-sans text-xs tracking-widest uppercase text-page-accent mb-3">
            Pratiques
          </p>
          <h2 className="font-display text-3xl lg:text-4xl text-bsmk-black mb-10">
            Disciplines pratiquées
          </h2>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artist.disciplineSlugs.map((ds) => {
              const d = getDisciplineBySlug(ds)
              if (!d) return null
              return (
                <StaggerItem key={ds}>
                <Link
                  href={`/disciplines/${d.slug}`}
                  className="group flex gap-0 border border-bsmk-black/10 hover:border-page-accent transition-colors rounded-xl overflow-hidden"
                >
                  <div
                    className="w-2 shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <div className="p-6">
                    <h3 className="font-display text-xl text-bsmk-black group-hover:text-page-accent transition-colors mb-2">
                      {d.name}
                    </h3>
                    <p className="font-sans text-sm text-bsmk-black/60 leading-relaxed">
                      {d.description}
                    </p>
                    <p className="font-sans text-xs tracking-widest uppercase text-bsmk-black/30 mt-4 group-hover:text-page-accent transition-colors">
                      Explorer la discipline →
                    </p>
                  </div>
                </Link>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </Container>
      </section>

      {/* ── Collab CTA ── */}
      {artist.availableForCollaboration && (
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
                Envoyer un message →
              </Button>
            </div>
            </FadeUp>
          </Container>
        </section>
      )}

      {/* ── More artists ── */}
      {moreArtists.length > 0 && (
        <section className="py-16 lg:py-20">
          <Container>
            <div className="flex items-baseline justify-between mb-10">
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-page-accent mb-3">
                  {primaryDiscipline?.shortName ?? 'Même discipline'}
                </p>
                <h2 className="font-display text-3xl text-bsmk-black">
                  Découvrir d'autres artistes
                </h2>
              </div>
              <Link
                href="/vetrinart"
                className="font-sans text-sm text-bsmk-black/40 hover:text-page-accent transition-colors"
              >
                Tout l'annuaire →
              </Link>
            </div>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {moreArtists.map((other) => {
                const otherPrimary = disciplines.find(d => d.slug === other.disciplineSlugs[0])
                return (
                  <StaggerItem key={other.id}>
                  <Link
                    href={`/vetrinart/${other.slug}`}
                    className="group block"
                  >
                    {/* Square photo */}
                    <div className="relative aspect-square overflow-hidden bg-bsmk-sand/20 mb-4 rounded-lg">
                      <Image
                        src={other.photoUrl}
                        alt={other.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-display text-lg text-bsmk-black group-hover:text-page-accent transition-colors mb-1">
                      {other.name}
                    </h3>
                    <p className="font-sans text-xs text-bsmk-black/50 mb-2">
                      {other.city} · {other.country}
                    </p>
                    {otherPrimary && (
                      <Badge variant="default">{otherPrimary.shortName}</Badge>
                    )}
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
