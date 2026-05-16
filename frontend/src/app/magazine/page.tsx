import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { articles, categories, getFeaturedArticles } from '@/data/articles'
import { formatDate } from '@/lib/utils'
import { HeroText, FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

export const metadata: Metadata = {
  title: 'Magazine | BSMK',
  description: 'Actualités, réflexions et regards sur la création contemporaine en Méditerranée.',
}

export default async function MagazinePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const featured = getFeaturedArticles(1)[0]
  const allArticles = category
    ? articles.filter((a) => {
        const cat = categories.find((c) => c.slug === category)
        return cat ? a.category === cat.name : true
      })
    : articles

  return (
    <main className="bg-bsmk-white min-h-screen">
      {/* Hero */}
      <section className="bg-bsmk-black text-bsmk-white py-20 lg:py-28">
        <Container narrow>
          <HeroText delay={0}>
            <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-4 font-sans">
              BSMK — Publication
            </p>
          </HeroText>
          <HeroText delay={0.1}>
            <h1 className="font-display text-5xl lg:text-7xl text-bsmk-white mb-6 leading-none">
              Magazine
            </h1>
          </HeroText>
          <HeroText delay={0.25}>
            <p className="font-sans text-lg text-bsmk-white/70 max-w-2xl leading-relaxed">
              Actualités, réflexions et regards sur la création contemporaine en Méditerranée
            </p>
          </HeroText>
        </Container>
      </section>

      {/* Category filter bar */}
      <section className="border-b border-bsmk-black/10 bg-bsmk-white sticky top-0 z-10">
        <Container>
          <FadeIn className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-hide">
            <Link
              href="/magazine"
              className={`shrink-0 px-4 py-2 text-xs font-medium tracking-widest uppercase font-sans transition-colors rounded-full ${
                !category ? 'bg-bsmk-black text-bsmk-white' : 'text-bsmk-black/60 hover:bg-bsmk-black hover:text-bsmk-white'
              }`}
            >
              Tous
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/magazine?category=${cat.slug}`}
                className={`shrink-0 px-4 py-2 text-xs font-medium tracking-widest uppercase font-sans transition-colors rounded-full ${
                  category === cat.slug ? 'bg-bsmk-black text-bsmk-white' : 'text-bsmk-black/60 hover:bg-bsmk-black hover:text-bsmk-white'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </FadeIn>
        </Container>
      </section>

      {/* Featured article hero card */}
      {featured && (
        <section className="bg-bsmk-black py-12">
          <Container>
            <ScaleIn>
            <Link href={`/magazine/${featured.slug}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-xl">
                {/* Text side */}
                <div className="bg-bsmk-black p-8 lg:p-12 flex flex-col justify-between order-2 lg:order-1">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Badge variant="terracotta">{featured.category}</Badge>
                      <span className="text-xs text-bsmk-white/40 font-sans tracking-widest uppercase">
                        À la une
                      </span>
                    </div>
                    <h2 className="font-display text-3xl lg:text-4xl text-bsmk-white leading-tight mb-4 group-hover:text-bsmk-sand transition-colors">
                      {featured.title}
                    </h2>
                    <p className="font-sans text-bsmk-white/60 text-base leading-relaxed line-clamp-4">
                      {featured.excerpt}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-4 border-t border-bsmk-white/10 pt-6">
                    <div className="w-10 h-10 relative overflow-hidden shrink-0 rounded-full">
                      <Image
                        src={featured.authorPhotoUrl}
                        alt={featured.authorName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-sans text-sm text-bsmk-white font-medium">{featured.authorName}</p>
                      <p className="font-sans text-xs text-bsmk-white/40">
                        {formatDate(featured.publishedAt)} · {featured.readingTime} min de lecture
                      </p>
                    </div>
                  </div>
                </div>
                {/* Image side */}
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[460px] overflow-hidden order-1 lg:order-2">
                  <Image
                    src={featured.coverUrl}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-bsmk-black/20" />
                </div>
              </div>
            </Link>
            </ScaleIn>
          </Container>
        </section>
      )}

      {/* Article grid */}
      <section className="py-16 lg:py-20">
        <Container>
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-display text-2xl text-bsmk-black">Tous les articles</h2>
            <span className="font-sans text-sm text-bsmk-black/40">{allArticles.length} articles</span>
          </div>

          <StaggerContainer key={category ?? 'all'} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allArticles.map((article) => (
              <StaggerItem key={article.id}>
              <Link
                href={`/magazine/${article.slug}`}
                className="group block"
              >
                <article className="flex flex-col h-full">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-bsmk-sand/20 mb-4 rounded-lg">
                    <Image
                      src={article.coverUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <div className="mb-3">
                      <Badge variant="terracotta">{article.category}</Badge>
                    </div>
                    <h3 className="font-display text-lg text-bsmk-black leading-snug line-clamp-2 mb-2 group-hover:text-bsmk-terracotta transition-colors">
                      {article.title}
                    </h3>
                    <p className="font-sans text-sm text-bsmk-black/60 leading-relaxed line-clamp-3 mb-4 flex-1">
                      {article.excerpt}
                    </p>
                    {/* Meta */}
                    <div className="flex items-center gap-2 pt-4 border-t border-bsmk-black/10">
                      <div className="w-6 h-6 relative overflow-hidden shrink-0 rounded-full">
                        <Image
                          src={article.authorPhotoUrl}
                          alt={article.authorName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-sans text-xs text-bsmk-black/60">{article.authorName}</span>
                      <span className="text-bsmk-black/30">·</span>
                      <span className="font-sans text-xs text-bsmk-black/40">{formatDate(article.publishedAt)}</span>
                      <span className="text-bsmk-black/30">·</span>
                      <span className="font-sans text-xs text-bsmk-black/40">{article.readingTime} min</span>
                    </div>
                  </div>
                </article>
              </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>
    </main>
  )
}
