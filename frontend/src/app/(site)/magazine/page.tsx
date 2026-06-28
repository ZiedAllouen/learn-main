import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { articles, categories, getFeaturedArticles } from '@/data/articles'
import { formatDate } from '@/lib/utils'
import { getMedia, type MediaType, mediaTypeLabels } from '@/lib/api/media'
import { HeroText, FadeIn, ScaleIn, StaggerContainer, StaggerItem, FadeUp } from '@/components/ui/Motion'

export const metadata: Metadata = {
  title: 'Médias | BSMK',
  description: 'Vidéos, photos, éditoriaux, magazine et publications du BSMK — la création en Méditerranée.',
}

const mediaTypeColors: Record<MediaType, string> = {
  VIDEO: '#C0392B',
  PHOTO: '#7A2E73',
  AUDIO: '#27AE60',
  EDITO: '#2D5F99',
  MAGAZINE: '#C99A2E',
  PUBLICATION: '#147070',
}

const ALL_MEDIA_TYPES: MediaType[] = ['VIDEO', 'PHOTO', 'AUDIO', 'EDITO', 'MAGAZINE', 'PUBLICATION']

export default async function MagazinePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; type?: string }>
}) {
  const { category, type } = await searchParams
  const featured = getFeaturedArticles(1)[0]
  const allArticles = category
    ? articles.filter((a) => {
        const cat = categories.find((c) => c.slug === category)
        return cat ? a.category === cat.name : true
      })
    : articles

  // Helper: build /magazine?... preserving the other filter param
  function magazineHref(overrides: { type?: string; category?: string }) {
    const params = new URLSearchParams()
    const nextType = overrides.type !== undefined ? overrides.type : type
    const nextCat = overrides.category !== undefined ? overrides.category : category
    if (nextType) params.set('type', nextType)
    if (nextCat) params.set('category', nextCat)
    const qs = params.toString()
    return `/magazine${qs ? `?${qs}` : ''}`
  }

  // Load media items from API (graceful fallback)
  let mediaItems: Awaited<ReturnType<typeof getMedia>>['data'] = []
  let mediaTotal = 0
  try {
    const result = await getMedia({
      type: type as MediaType | undefined,
      status: 'PUBLISHED',
      pageSize: 12,
    })
    mediaItems = result.data
    mediaTotal = result.total
  } catch {
    // API unavailable
  }

  return (
    <main className="bg-bsmk-white min-h-screen">
      {/* Hero */}
      <section className="bg-bsmk-black text-bsmk-white py-20 lg:py-28">
        <Container>
          <HeroText delay={0}>
            <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-4 font-sans">
              BSMK — Médias & Publication
            </p>
          </HeroText>
          <HeroText delay={0.1}>
            <h1 className="font-display text-5xl lg:text-7xl text-bsmk-white mb-6 leading-none">
              Médias
            </h1>
          </HeroText>
          <HeroText delay={0.25}>
            <p className="font-sans text-lg text-bsmk-white/70 max-w-2xl leading-relaxed">
              Vidéos, photos, éditoriaux, magazine et publications sur la création méditerranéenne
            </p>
          </HeroText>
        </Container>
      </section>

      {/* Media type filter strip (new API types) */}
      <section className="border-b border-bsmk-black/10 bg-bsmk-white sticky top-0 z-20 shadow-sm">
        <Container>
          <FadeIn className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            <Link
              href={magazineHref({ type: '' })}
              className={`shrink-0 px-4 py-1.5 text-xs font-medium tracking-widest uppercase font-sans transition-colors rounded-full ${
                !type ? 'bg-bsmk-black text-bsmk-white' : 'text-bsmk-black/60 border border-bsmk-black/20 hover:bg-bsmk-black hover:text-bsmk-white'
              }`}
            >
              Tout
            </Link>
            {ALL_MEDIA_TYPES.map((t) => (
              <Link
                key={t}
                href={magazineHref({ type: t })}
                className="shrink-0 px-4 py-1.5 text-xs font-medium tracking-widest uppercase font-sans transition-all rounded-full border hover:text-white"
                style={{
                  borderColor: type === t ? mediaTypeColors[t] : `${mediaTypeColors[t]}60`,
                  color: type === t ? 'white' : mediaTypeColors[t],
                  backgroundColor: type === t ? mediaTypeColors[t] : 'transparent',
                }}
              >
                {mediaTypeLabels[t]}
              </Link>
            ))}
          </FadeIn>
          </Container>
        </section>

      {/* Media grid from API */}
      <section className="py-16 bg-bsmk-black">
        <Container>
          <div className="flex items-baseline justify-between mb-10">
            <FadeUp>
              <h2 className="font-display text-3xl text-bsmk-white">
                {type ? mediaTypeLabels[type as MediaType] : 'Tous les médias'}
              </h2>
            </FadeUp>
            <span className="font-sans text-sm text-bsmk-white/40">{mediaTotal} éléments</span>
          </div>

          {mediaItems.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mediaItems.map((item) => (
                <StaggerItem key={item.id}>
                  <div className="group block">
                    {/* Thumbnail */}
                    <div
                      className="relative aspect-video overflow-hidden rounded-lg mb-3"
                      style={{ backgroundColor: `${mediaTypeColors[item.type]}30` }}
                    >
                      {item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ backgroundColor: `${mediaTypeColors[item.type]}20` }}
                        >
                          <span className="text-4xl opacity-40">
                            {item.type === 'VIDEO' ? '▶' : item.type === 'AUDIO' ? '♫' : '◼'}
                          </span>
                        </div>
                      )}
                      {/* Type badge overlay */}
                      <div className="absolute top-2 left-2">
                        <span
                          className="font-sans text-[10px] tracking-widest uppercase px-2 py-0.5 text-white rounded"
                          style={{ backgroundColor: mediaTypeColors[item.type] }}
                        >
                          {mediaTypeLabels[item.type]}
                        </span>
                      </div>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-bsmk-black/40"
                        >
                          <span className="text-white text-2xl">→</span>
                        </a>
                      )}
                    </div>

                    <h3 className="font-display text-base text-bsmk-white leading-snug mb-1 group-hover:text-bsmk-sand transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    {item.publishedAt && (
                      <p className="font-sans text-xs text-bsmk-white/40">
                        {formatDate(item.publishedAt)}
                      </p>
                    )}
                    {item.disciplines.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.disciplines.map(({ discipline: d }) => (
                          <span
                            key={d.id}
                            className="font-sans text-[10px] text-bsmk-white/50 border border-white/10 px-1.5 py-0.5 rounded"
                          >
                            {d.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-16">
              <p className="text-bsmk-white/40 text-sm mb-4">
                {type
                  ? `Aucun média de type « ${mediaTypeLabels[type as MediaType]} » pour le moment.`
                  : 'Aucun média pour le moment.'}
              </p>
              {type && (
                <Link
                  href={magazineHref({ type: '' })}
                  className="text-xs tracking-widest uppercase text-page-accent hover:underline"
                >
                  Voir tous les médias →
                </Link>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* Category filter bar for articles */}
      <section className="border-b border-bsmk-black/10 bg-bsmk-white">
        <Container>
          <FadeIn className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-hide">
            <span className="text-xs tracking-widest uppercase text-bsmk-black/30 mr-3 shrink-0">Articles :</span>
            <Link
              href={magazineHref({ category: '' })}
              className={`shrink-0 px-4 py-2 text-xs font-medium tracking-widest uppercase font-sans transition-colors rounded-full ${
                !category ? 'bg-bsmk-black text-bsmk-white' : 'text-bsmk-black/60 hover:bg-bsmk-black hover:text-bsmk-white'
              }`}
            >
              Tous
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={magazineHref({ category: cat.slug })}
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
            <h2 className="font-display text-2xl text-bsmk-black">Articles</h2>
            <span className="font-sans text-sm text-bsmk-black/40">{allArticles.length} articles</span>
          </div>

          <StaggerContainer key={category ?? 'all'} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {allArticles.map((article) => (
              <StaggerItem key={article.id}>
              <Link href={`/magazine/${article.slug}`} className="group block">
                <article className="flex flex-col h-full">
                  <div className="relative aspect-video overflow-hidden bg-bsmk-sand/20 mb-4 rounded-lg">
                    <Image
                      src={article.coverUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="mb-3">
                      <Badge variant="terracotta">{article.category}</Badge>
                    </div>
                    <h3 className="font-display text-lg text-bsmk-black leading-snug line-clamp-2 mb-2 group-hover:text-page-accent transition-colors">
                      {article.title}
                    </h3>
                    <p className="font-sans text-sm text-bsmk-black/60 leading-relaxed line-clamp-3 mb-4 flex-1">
                      {article.excerpt}
                    </p>
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
