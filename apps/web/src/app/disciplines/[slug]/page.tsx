import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { disciplines, getDisciplineBySlug } from '@/data/disciplines'
import { getArticlesByDiscipline } from '@/data/articles'
import { spaces } from '@/data/spaces'
import { formatDate } from '@/lib/utils'
import { HeroText, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return disciplines.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const discipline = getDisciplineBySlug(slug)
  if (!discipline) return { title: 'Discipline introuvable | BSMK' }
  return {
    title: `${discipline.name} | Disciplines BSMK`,
    description: discipline.description,
  }
}

export default async function DisciplinePage({ params }: Props) {
  const { slug } = await params
  const discipline = getDisciplineBySlug(slug)

  if (!discipline) notFound()

  const relatedSpaces = spaces.filter((s) => s.disciplineSlugs.includes(discipline.slug))
  const relatedArticles = getArticlesByDiscipline(discipline.slug).slice(0, 3)

  return (
    <main className="bg-bsmk-white min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden bg-bsmk-black">
        <Image
          src={discipline.coverUrl}
          alt={discipline.name}
          fill
          priority
          className="object-cover opacity-60"
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: `linear-gradient(to top, ${discipline.color}dd 0%, transparent 60%)`,
          }}
        />
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <Container className="pb-12 lg:pb-16">
            {/* Breadcrumb */}
            <HeroText delay={0}>
              <nav className="mb-6">
                <ol className="flex items-center gap-2 font-sans text-xs text-white/50 tracking-widest uppercase">
                  <li>
                    <Link href="/disciplines" className="hover:text-white transition-colors">
                      Disciplines
                    </Link>
                  </li>
                  <li className="text-white/30">/</li>
                  <li className="text-white/80">{discipline.shortName}</li>
                </ol>
              </nav>
            </HeroText>
            <HeroText delay={0.1}>
              <h1 className="font-display text-5xl lg:text-7xl text-white leading-none mb-4">
                {discipline.name}
              </h1>
            </HeroText>
            <HeroText delay={0.25}>
              <p className="font-sans text-lg text-white/75 max-w-xl leading-relaxed">
                {discipline.description}
              </p>
            </HeroText>
          </Container>
        </div>
      </section>

      {/* Description section */}
      <section className="py-16 lg:py-20 border-b border-bsmk-black/10">
        <Container>
          <FadeUp className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Long description */}
            <div className="lg:col-span-2">
              <p className="font-sans text-xs tracking-widest uppercase text-bsmk-terracotta mb-6 font-medium">
                La discipline
              </p>
              <p className="font-sans text-lg text-bsmk-black/80 leading-relaxed">
                {discipline.longDescription}
              </p>
            </div>
            {/* Quick stats */}
            <div className="lg:col-span-1">
              <p className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 mb-6 font-medium">
                En chiffres
              </p>
              <div className="space-y-6">
                <div className="border-l-2 pl-4" style={{ borderColor: discipline.color }}>
                  <p className="font-display text-4xl text-bsmk-black">{relatedSpaces.length}</p>
                  <p className="font-sans text-sm text-bsmk-black/50 mt-1">
                    {relatedSpaces.length <= 1 ? 'espace dédié' : 'espaces dédiés'}
                  </p>
                </div>
                <div className="border-l-2 pl-4" style={{ borderColor: discipline.accentColor }}>
                  <p className="font-display text-4xl text-bsmk-black">{relatedArticles.length}</p>
                  <p className="font-sans text-sm text-bsmk-black/50 mt-1">
                    {relatedArticles.length <= 1 ? 'article publié' : 'articles publiés'}
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3">
                <Button href="/programmes" variant="primary" size="sm">
                  Voir les programmes
                </Button>
                <Button href="/espaces" variant="outline" size="sm" className="text-bsmk-black border-bsmk-black">
                  Voir les espaces
                </Button>
              </div>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* Espaces liés */}
      {relatedSpaces.length > 0 && (
        <section className="py-16 border-b border-bsmk-black/10">
          <Container>
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="font-display text-3xl text-bsmk-black">Espaces liés</h2>
              <Link
                href="/espaces"
                className="font-sans text-sm text-bsmk-black/40 hover:text-bsmk-terracotta transition-colors"
              >
                Tous les espaces →
              </Link>
            </div>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSpaces.map((space) => (
                <StaggerItem key={space.slug}>
                  <Link
                    href={`/espaces/${space.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-video overflow-hidden bg-bsmk-sand/20 mb-3 rounded-lg">
                      <Image
                        src={space.imageUrls[0]}
                        alt={space.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-display text-lg text-bsmk-black group-hover:text-bsmk-terracotta transition-colors mb-1">
                      {space.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <Badge variant="default">{space.capacity} pers.</Badge>
                      <Badge variant="olive">{space.surfaceSqm} m²</Badge>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      )}

      {/* Articles liés */}
      {relatedArticles.length > 0 && (
        <section className="py-16 border-b border-bsmk-black/10">
          <Container>
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="font-display text-3xl text-bsmk-black">Regards & Réflexions</h2>
              <Link
                href="/magazine"
                className="font-sans text-sm text-bsmk-black/40 hover:text-bsmk-terracotta transition-colors"
              >
                Tout le magazine →
              </Link>
            </div>
            <StaggerContainer className="flex flex-col divide-y divide-bsmk-black/10">
              {relatedArticles.map((article) => (
                <StaggerItem key={article.slug}>
                  <Link
                    href={`/magazine/${article.slug}`}
                    className="group flex gap-6 py-6 items-start"
                  >
                    <div className="relative w-32 lg:w-48 aspect-video overflow-hidden shrink-0 bg-bsmk-sand/20 rounded-md">
                      <Image
                        src={article.coverUrl}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="terracotta" className="mb-2">{article.category}</Badge>
                      <h3 className="font-display text-lg lg:text-xl text-bsmk-black group-hover:text-bsmk-terracotta transition-colors leading-snug mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="font-sans text-sm text-bsmk-black/50 leading-relaxed line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                      <p className="font-sans text-xs text-bsmk-black/40">
                        {article.authorName} · {formatDate(article.publishedAt)} · {article.readingTime} min
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-bsmk-black">
        <Container>
          <FadeUp className="text-center">
            <p className="font-sans text-xs tracking-widest uppercase text-bsmk-sand/50 mb-4">
              Rejoindre la communauté BSMK
            </p>
            <h2 className="font-display text-3xl lg:text-4xl text-white mb-6">
              Rejoindre un programme en {discipline.name}
            </h2>
            <p className="font-sans text-bsmk-white/60 mb-8 max-w-lg mx-auto">
              Intégrez nos ateliers, résidences et formations en {discipline.shortName.toLowerCase()} et développez votre pratique artistique au cœur de Tunis.
            </p>
            <Button href="/programmes" variant="primary" size="lg">
              Voir les programmes →
            </Button>
          </FadeUp>
        </Container>
      </section>
    </main>
  )
}
