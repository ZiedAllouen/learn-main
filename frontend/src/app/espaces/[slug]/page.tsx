import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { spaces, getSpaceBySlug } from '@/data/spaces'
import { disciplines } from '@/data/disciplines'
import { ScaleIn, StaggerContainer, StaggerItem, FadeUp } from '@/components/ui/Motion'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return spaces.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const space = getSpaceBySlug(slug)
  if (!space) return { title: 'Espace introuvable | BSMK' }
  return {
    title: `${space.name} | Espaces BSMK`,
    description: space.description,
  }
}

export default async function EspacePage({ params }: Props) {
  const { slug } = await params
  const space = getSpaceBySlug(slug)

  if (!space) notFound()

  const spaceDisciplines = disciplines.filter((d) =>
    space.disciplineSlugs.includes(d.slug),
  )

  const heroImage = space.imageUrls[0]
  const thumbImages = space.imageUrls.slice(1, 3)

  const contactUrl = `/contact?sujet=${encodeURIComponent(`Réservation espace ${space.name}`)}`

  return (
    <main className="bg-bsmk-white min-h-screen">
      {/* Hero image gallery */}
      <section className="bg-bsmk-black">
        {/* Main hero image */}
        <ScaleIn>
        <div className="relative h-[60vh] min-h-[380px] overflow-hidden">
          <Image
            src={heroImage}
            alt={space.name}
            fill
            priority
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bsmk-black/60 via-transparent to-transparent" />
          {/* Floor badge */}
          <div className="absolute top-6 left-6">
            <Badge variant="dark">{space.floor}</Badge>
          </div>
        </div>
        </ScaleIn>

        {/* Thumbnails */}
        {thumbImages.length > 0 && (
          <StaggerContainer className={`grid gap-1 ${thumbImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {thumbImages.map((url, i) => (
              <StaggerItem key={i}>
              <div className="relative h-40 lg:h-56 overflow-hidden rounded-lg">
                <Image
                  src={url}
                  alt={`${space.name} — vue ${i + 2}`}
                  fill
                  className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      {/* Info header */}
      <section className="py-10 border-b border-bsmk-black/10">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-bsmk-terracotta mb-3 font-medium">
                BSMK — {space.floor}
              </p>
              <h1 className="font-display text-4xl lg:text-5xl text-bsmk-black leading-none mb-4">
                {space.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="blue">{space.capacity} personnes max.</Badge>
                <Badge variant="olive">{space.surfaceSqm} m²</Badge>
                {space.featured && <Badge variant="terracotta">Espace phare</Badge>}
              </div>
            </div>
            <div className="shrink-0">
              <Button href={contactUrl} variant="primary" size="lg">
                Réserver cet espace
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Description */}
      <section className="py-12 border-b border-bsmk-black/10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            <div className="lg:col-span-2">
              <p className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 mb-4 font-medium">
                Description
              </p>
              <p className="font-sans text-lg text-bsmk-black/80 leading-relaxed">
                {space.description}
              </p>
            </div>
            {/* Quick info */}
            <div className="lg:col-span-1">
              <p className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 mb-4 font-medium">
                Informations pratiques
              </p>
              <dl className="space-y-4 font-sans text-sm">
                <div className="flex justify-between border-b border-bsmk-black/10 pb-3">
                  <dt className="text-bsmk-black/50">Niveau</dt>
                  <dd className="text-bsmk-black font-medium">{space.floor}</dd>
                </div>
                <div className="flex justify-between border-b border-bsmk-black/10 pb-3">
                  <dt className="text-bsmk-black/50">Surface</dt>
                  <dd className="text-bsmk-black font-medium">{space.surfaceSqm} m²</dd>
                </div>
                <div className="flex justify-between border-b border-bsmk-black/10 pb-3">
                  <dt className="text-bsmk-black/50">Capacité</dt>
                  <dd className="text-bsmk-black font-medium">{space.capacity} personnes</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-bsmk-black/50">Disponibilité</dt>
                  <dd className="text-bsmk-black font-medium">Sur réservation</dd>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* Equipment */}
      <section className="py-12 border-b border-bsmk-black/10">
        <Container>
          <h2 className="font-display text-2xl text-bsmk-black mb-8">Équipements</h2>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {space.equipment.map((item) => (
              <StaggerItem key={item}>
              <div
                className="flex items-center gap-3 bg-bsmk-sand/20 px-4 py-3 rounded-lg"
              >
                <span className="text-bsmk-terracotta font-bold text-sm shrink-0">✓</span>
                <span className="font-sans text-sm text-bsmk-black">{item}</span>
              </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* Disciplines */}
      {spaceDisciplines.length > 0 && (
        <section className="py-12 border-b border-bsmk-black/10">
          <Container>
            <FadeUp>
            <h2 className="font-display text-2xl text-bsmk-black mb-8">Disciplines associées</h2>
            <div className="flex flex-wrap gap-3">
              {spaceDisciplines.map((d) => (
                <Link
                  key={d.slug}
                  href={`/disciplines/${d.slug}`}
                  className="group flex items-center gap-3 border border-bsmk-black/15 px-5 py-3 hover:border-bsmk-terracotta transition-colors rounded-lg"
                >
                  <span
                    className="w-3 h-3 shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="font-sans text-sm text-bsmk-black group-hover:text-bsmk-terracotta transition-colors">
                    {d.name}
                  </span>
                  <span className="text-bsmk-black/30 group-hover:text-bsmk-terracotta transition-colors">→</span>
                </Link>
              ))}
            </div>
            </FadeUp>
          </Container>
        </section>
      )}

      {/* Reservation CTA */}
      <section className="py-16 bg-bsmk-black">
        <Container>
          <FadeUp>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-bsmk-sand/50 mb-3">
                Réservation
              </p>
              <h2 className="font-display text-3xl lg:text-4xl text-white mb-3">
                Réserver {space.name}
              </h2>
              <p className="font-sans text-bsmk-white/60 max-w-md">
                Disponible à la demi-journée ou à la journée. Notre équipe vous répondra dans les 48h pour confirmer votre réservation et discuter de vos besoins techniques.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button href={contactUrl} variant="primary" size="lg">
                Réserver cet espace
              </Button>
              <Button href="/espaces" variant="outline" size="lg" className="text-white border-white/30">
                Voir tous les espaces
              </Button>
            </div>
          </div>
          </FadeUp>
        </Container>
      </section>
    </main>
  )
}
