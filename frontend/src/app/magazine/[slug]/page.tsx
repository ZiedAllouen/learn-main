import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { articles, getArticleBySlug } from '@/data/articles'
import { disciplines } from '@/data/disciplines'
import { formatDate } from '@/lib/utils'
import { ScaleIn, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: 'Article introuvable | BSMK' }
  return {
    title: `${article.title} | Magazine BSMK`,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) notFound()

  // Related articles: same category or discipline, excluding self, max 3
  const related = articles
    .filter(
      (a) =>
        a.slug !== article.slug &&
        (a.category === article.category ||
          a.disciplineSlugs.some((d) => article.disciplineSlugs.includes(d))),
    )
    .slice(0, 3)

  // Discipline objects for this article
  const articleDisciplines = disciplines.filter((d) =>
    article.disciplineSlugs.includes(d.slug),
  )

  return (
    <main className="bg-bsmk-white min-h-screen">
      {/* Hero image */}
      <ScaleIn className="relative h-96 lg:h-[540px] bg-bsmk-black overflow-hidden">
        <Image
          src={article.coverUrl}
          alt={article.title}
          fill
          priority
          className="object-cover opacity-80"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bsmk-black via-bsmk-black/40 to-transparent" />
        {/* Category badge + title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <Container>
            <Badge variant="terracotta" className="mb-4">
              {article.category}
            </Badge>
            <h1 className="font-display text-3xl lg:text-5xl text-bsmk-white leading-tight max-w-3xl">
              {article.title}
            </h1>
          </Container>
        </div>
      </ScaleIn>

      {/* Article header: author + meta */}
      <section className="border-b border-bsmk-black/10 py-6">
        <Container>
          <FadeUp className="flex items-center gap-4 flex-wrap">
            <div className="w-10 h-10 relative overflow-hidden shrink-0">
              <Image
                src={article.authorPhotoUrl}
                alt={article.authorName}
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div>
              <p className="font-sans font-medium text-sm text-bsmk-black">{article.authorName}</p>
              <p className="font-sans text-xs text-bsmk-black/50">
                {formatDate(article.publishedAt)} · {article.readingTime} min de lecture
              </p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* Body + Sidebar */}
      <section className="py-12 lg:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main content */}
            <FadeUp className="lg:col-span-2">
              <p className="font-sans text-lg text-bsmk-black/80 leading-relaxed mb-8 italic border-l-4 border-bsmk-terracotta pl-6">
                {article.excerpt}
              </p>
              <div className="prose max-w-none font-sans text-bsmk-black/80 leading-relaxed space-y-4">
                {article.body.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-base leading-8">
                    {paragraph}
                  </p>
                ))}
              </div>
            </FadeUp>

            {/* Sidebar */}
            <FadeUp className="lg:col-span-1 space-y-8" delay={0.2}>
              {/* Tags */}
              {article.tags.length > 0 && (
                <div>
                  <h3 className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 mb-4 font-medium">
                    Mots-clés
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-bsmk-black border-bsmk-black/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Disciplines */}
              {articleDisciplines.length > 0 && (
                <div>
                  <h3 className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 mb-4 font-medium">
                    Disciplines liées
                  </h3>
                  <div className="flex flex-col gap-2">
                    {articleDisciplines.map((d) => (
                      <Link
                        key={d.slug}
                        href={`/disciplines/${d.slug}`}
                        className="font-sans text-sm text-bsmk-black hover:text-bsmk-terracotta transition-colors flex items-center gap-2 group"
                      >
                        <span
                          className="w-2 h-2 shrink-0"
                          style={{ backgroundColor: d.color }}
                        />
                        {d.name}
                        <span className="ml-auto text-bsmk-black/30 group-hover:text-bsmk-terracotta">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related articles */}
              {related.length > 0 && (
                <div>
                  <h3 className="font-sans text-xs tracking-widest uppercase text-bsmk-black/40 mb-4 font-medium">
                    Articles liés
                  </h3>
                  <StaggerContainer className="flex flex-col gap-6">
                    {related.map((rel) => (
                      <StaggerItem key={rel.slug}>
                        <Link
                          href={`/magazine/${rel.slug}`}
                          className="group block"
                        >
                          <div className="relative aspect-video overflow-hidden mb-2 rounded-md">
                            <Image
                              src={rel.coverUrl}
                              alt={rel.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <Badge variant="terracotta" className="mb-1">{rel.category}</Badge>
                          <h4 className="font-display text-sm text-bsmk-black leading-snug group-hover:text-bsmk-terracotta transition-colors line-clamp-2">
                            {rel.title}
                          </h4>
                          <p className="font-sans text-xs text-bsmk-black/40 mt-1">
                            {formatDate(rel.publishedAt)} · {rel.readingTime} min
                          </p>
                        </Link>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              )}
            </FadeUp>
          </div>
        </Container>
      </section>

      {/* Back link */}
      <section className="py-10 border-t border-bsmk-black/10">
        <Container>
          <Button href="/magazine" variant="secondary">
            ← Retour au magazine
          </Button>
        </Container>
      </section>
    </main>
  )
}
