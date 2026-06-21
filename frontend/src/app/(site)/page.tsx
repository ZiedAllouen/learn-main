import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getFeaturedPrograms } from '@/data/programs'
import { getLatestArticles } from '@/data/articles'
import { getUpcomingEvents, eventTypeLabels } from '@/data/events'
import { formatDate } from '@/lib/utils'
import { getSectors } from '@/lib/api/sectors'
import {
  HeroText,
  FadeUp,
  BlurIn,
  SlideUp,
  ScaleIn,
  Parallax,
  StaggerContainer,
  StaggerItem,
  Marquee,
  CountUp,
  SectionDivider,
  FloatingDot,
  MagneticHover,
  Carousel,
  TestimonialsCarousel,
  ScrollIndicator,
  IconHover,
  StatCard,
  HoverSlide,
  HoverScale,
  ScrollTextReveal,
  ScrollProgress,
  DecorativeBlob,
  DecorativeArch,
} from '@/components/ui/Motion'

export const metadata = {
  title: 'BSMK — Centre artistique, sportif et écologique hybride multidisciplinaire',
  description:
    'BSMK est un centre culturel et artistique dédié à la création, la formation et la diffusion des arts en Méditerranée.',
}

const quickActions = [
  { label: 'Créer', href: '/espaces', icon: '✦', desc: 'Studios, ateliers et lieux de production' },
  { label: 'Se former', href: '/programmes', icon: '◈', desc: 'Formations, ateliers et résidences' },
  { label: 'Médiation', href: '/vetrinart', icon: '◻', desc: 'Profils artistes, médias et visibilité' },
  { label: 'Consulter', href: '/contact', icon: '◷', desc: 'Accompagnement et conseil artistique' },
]

const stats = [
  { number: 7, label: 'disciplines artistiques' },
  { number: 10, label: 'espaces dédiés' },
  { number: 6, label: 'programmes en cours' },
  { number: 12, label: 'événements ce mois' },
]

const testimonials = [
  {
    id: 1,
    quote: 'BSMK m\'a offert un espace de création unique, entouré d\'artistes passionnés. Une expérience transformative.',
    author: 'Amina Bouazizi',
    role: 'Artiste visuelle — Résidente 2024',
  },
  {
    id: 2,
    quote: 'La formation en arts numériques m\'a permis de repousser les limites de ma pratique. Un véritable catalyseur.',
    author: 'Youssef Khelifi',
    role: 'Créateur numérique',
  },
  {
    id: 3,
    quote: 'Un lieu où la Méditerranée rencontre l\'avant-garde. Chaque événement est une source d\'inspiration.',
    author: 'Sofia Mancuso',
    role: 'Directrice artistique — Festival Média',
  },
]

const modalityLabels: Record<string, string> = {
  IN_PERSON: 'Présentiel',
  ONLINE: 'En ligne',
  HYBRID: 'Hybride',
}

export default async function HomePage() {
  const featuredPrograms = getFeaturedPrograms(3)
  const latestArticles = getLatestArticles(3)
  const upcomingEvents = getUpcomingEvents(4)

  let sectors: Awaited<ReturnType<typeof getSectors>> = []
  try {
    sectors = await getSectors()
  } catch {
    // API not available — sectors strip will be hidden
  }

  return (
    <main>
      <ScrollProgress />
      {/* ── HERO ── */}
      <section className="relative min-h-screen bg-bsmk-black flex flex-col justify-center overflow-hidden">
        {/* Background image with parallax */}
        <Parallax offset={80} className="absolute inset-0">
          <Image
            src="/assets/images/andrii-olishevskyi.jpg"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
        </Parallax>

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-bsmk-black/40 via-transparent to-bsmk-black/60" />

        {/* Floating decorative dots */}
        <FloatingDot className="top-[20%] left-[10%]" size={8} delay={0} />
        <FloatingDot className="top-[30%] right-[15%]" size={6} delay={0.5} />
        <FloatingDot className="bottom-[25%] left-[20%]" size={10} delay={1} />
        <FloatingDot className="top-[60%] right-[8%]" size={5} delay={1.5} />
        <FloatingDot className="bottom-[40%] left-[5%]" size={7} delay={2} />

        <Container className="relative z-10 py-32">
          <div className="max-w-4xl">
            <HeroText delay={0}>
              <p className="text-page-accent text-xs tracking-widest uppercase mb-8">
                Tunis · Méditerranée · Création
              </p>
            </HeroText>
            <HeroText delay={0.1}>
              <h1 className="text-[clamp(5rem,15vw,14rem)] font-sans font-bold text-bsmk-white leading-none tracking-tight mb-6">
                BSMK
              </h1>
            </HeroText>
            <HeroText delay={0.25}>
              <p className="text-[clamp(1.5rem,4vw,3.5rem)] text-bsmk-sand leading-tight mb-12">
                Centre artistique
                <br />
                sportif et écologique
                <br />
                hybride multidisciplinaire
              </p>
            </HeroText>
            <HeroText delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/programmes" variant="primary" size="lg">
                  Découvrir les programmes
                </Button>
                <Button href="/espaces" variant="outline" size="lg" className="text-bsmk-white border-bsmk-white">
                  Explorer le lieu
                </Button>
              </div>
            </HeroText>
          </div>
        </Container>

        {/* Animated scroll indicator */}
        <ScrollIndicator className="absolute bottom-8 left-1/2 -translate-x-1/2 text-bsmk-white/40 text-sm tracking-widest flex flex-col items-center gap-2" />
      </section>

      {/* ── MARQUEE ── */}
      <section className="life-gradient py-3 overflow-hidden">
        <Marquee
          items={['Musique', 'Danse', 'Arts visuels', 'Cinéma & vidéo', 'Théâtre', 'Photographie', 'Arts numériques', 'Résidences', 'Formations', 'Méditerranée']}
          className="text-white/80 text-xs tracking-widest uppercase font-sans"
          speed={30}
        />
      </section>

      {/* ── 5 ACTIONS STRIP ── */}
      <section className="bg-bsmk-black border-t border-white/10">
        <Container>
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {quickActions.map((action) => (
              <StaggerItem key={action.href}>
                <MagneticHover strength={0.15}>
                  <Link
                    href={action.href}
                    className="flex flex-col items-center gap-3 py-8 px-4 text-bsmk-white/60 hover:text-bsmk-white hover:bg-white/5 transition-colors group"
                  >
                    <IconHover className="text-2xl text-page-accent">
                      {action.icon}
                    </IconHover>
                    <span className="text-xs tracking-widest uppercase text-center leading-snug">
                      {action.label}
                    </span>
                    <span className="text-[11px] text-bsmk-white/35 text-center leading-snug max-w-32">
                      {action.desc}
                    </span>
                  </Link>
                </MagneticHover>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ── HERO CAROUSEL ── */}
      <section className="py-16 bg-bsmk-black">
        <Container>
          <FadeUp>
            <p className="text-page-accent text-xs tracking-widest uppercase mb-6 text-center">
              À la une
            </p>
          </FadeUp>
          <Carousel
            slides={[
              {
                id: 'hero-1',
                image: '/assets/images/caught-in-joy.jpg',
                title: 'Résidence de création artistique',
                subtitle: 'Une immersion de 3 mois au cœur de la Méditerranée pour donner vie à votre projet.',
                href: '/programmes',
                badge: 'Nouveau',
              },
              {
                id: 'hero-2',
                image: '/assets/images/rainier-ridao.jpg',
                title: 'Festival des arts numériques',
                subtitle: 'Installations interactives, performances live et rencontres avec des artistes internationaux.',
                href: '/agenda',
                badge: 'Événement',
              },
              {
                id: 'hero-3',
                image: '/assets/images/techivation.jpg',
                title: 'Ateliers ouverts à tous',
                subtitle: 'Découvrez nos espaces de création et participez à des ateliers d\'initiation gratuits.',
                href: '/espaces',
                badge: 'Gratuit',
              },
            ]}
          />
        </Container>
      </section>

      <SectionDivider className="bg-bsmk-black" />

      {/* ── SECTORS STRIP (from API) ── */}
      {sectors.length > 0 && (
        <section className="py-12 bg-bsmk-white border-b border-bsmk-sand/40">
          <Container>
            <FadeUp>
              <p className="text-xs tracking-widest uppercase text-bsmk-black/40 mb-6 text-center">
                Secteurs artistiques
              </p>
            </FadeUp>
            <StaggerContainer className="flex flex-wrap justify-center gap-3">
              {sectors.map((sector) => (
                <StaggerItem key={sector.slug}>
                  <MagneticHover strength={0.1}>
                    <Link
                      href={`/disciplines?sector=${sector.slug}`}
                      className="sector-pill inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium tracking-wide transition-all hover:shadow-lg"
                      style={{
                        '--sc': sector.color,
                        borderColor: sector.color,
                        color: sector.color,
                      } as React.CSSProperties}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: sector.color }}
                      />
                      {sector.name}
                    </Link>
                  </MagneticHover>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      )}

      {/* ── PROGRAMMES PHARES ── */}
      <section className="relative py-24 bg-bsmk-white overflow-hidden">
        <DecorativeBlob className="-top-20 -right-20" size={500} />
        <DecorativeArch className="bottom-0 -left-10 rotate-12 opacity-50" color="rgb(92 107 58 / 0.04)" />
        <Container>
          <div className="flex items-end justify-between mb-12">
            <FadeUp>
              <div>
                <p className="text-page-accent text-xs tracking-widest uppercase mb-3">Formation · Résidence · Mentorat</p>
                <ScrollTextReveal text="Programmes phares" className="text-4xl lg:text-5xl font-display font-bold text-bsmk-black" />
              </div>
            </FadeUp>
            <SlideUp delay={0.2}>
              <Button href="/programmes" variant="primary" size="sm" className="hidden sm:inline-flex">
                Voir les programmes →
              </Button>
            </SlideUp>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5" slow>
            {featuredPrograms.map((program, idx) => (
              <StaggerItem key={program.id} className="h-full">
                <Link
                  href={`/programmes/${program.slug}`}
                  className="group relative block h-80 md:h-96 rounded-2xl overflow-hidden"
                >
                  {/* Full-bleed background image */}
                  <Image
                    src={program.coverUrl}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bsmk-black/80 via-bsmk-black/20 to-transparent" />

                  {/* Number indicator */}
                  <div className="absolute top-5 left-5 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-sm font-display font-bold text-white">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-5 right-5 flex gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-medium tracking-widest uppercase rounded-full bg-page-accent/90 text-white">
                      {program.programType}
                    </span>
                  </div>

                  {/* Content overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-display font-bold text-white mb-2 leading-snug group-hover:text-page-accent transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed mb-4 line-clamp-2">
                      {program.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-page-accent">{program.priceIndicative}</span>
                      <span className="text-xs tracking-widest uppercase text-white/50 group-hover:text-white transition-colors">
                        En savoir plus →
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="mt-8 sm:hidden">
            <Button href="/programmes" variant="outline" size="md" className="border-bsmk-black text-bsmk-black w-full">
              Voir tous les programmes →
            </Button>
          </div>
        </Container>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-bsmk-black">
        <Container>
          <FadeUp>
            <p className="text-page-accent text-xs tracking-widest uppercase mb-12 text-center">
              Témoignages
            </p>
          </FadeUp>
          <div className="max-w-3xl mx-auto">
            <TestimonialsCarousel items={testimonials} />
          </div>
        </Container>
      </section>

      <SectionDivider className="bg-bsmk-white" />

      {/* ── DERNIERS ARTICLES ── */}
      <section className="py-24 bg-bsmk-sand/20">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <FadeUp>
              <div>
                <p className="text-bsmk-olive text-xs tracking-widest uppercase mb-3">Magazine · Culture · Création</p>
                <ScrollTextReveal text="Du côté des médias" className="text-4xl lg:text-5xl font-display font-bold text-bsmk-black" />
              </div>
            </FadeUp>
            <SlideUp delay={0.2}>
              <Link
                href="/magazine"
                className="text-sm text-page-accent hover:underline tracking-wide hidden sm:inline"
              >
                Voir tout →
              </Link>
            </SlideUp>
          </div>

          {latestArticles.length >= 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Featured article — left, larger */}
              <StaggerContainer className="lg:col-span-3">
                <StaggerItem>
                  <article className="group">
                    <Link href={`/magazine/${latestArticles[0].slug}`} className="block">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-5">
                        <Image
                          src={latestArticles[0].coverUrl}
                          alt={latestArticles[0].title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bsmk-black/40 to-transparent" />
                        <div className="absolute bottom-4 left-5">
                          <Badge variant="olive">{latestArticles[0].category}</Badge>
                        </div>
                      </div>
                    </Link>
                    <Link href={`/magazine/${latestArticles[0].slug}`}>
                      <h3 className="text-2xl lg:text-3xl font-display font-bold mb-3 leading-snug group-hover:text-page-accent transition-colors">
                        {latestArticles[0].title}
                      </h3>
                    </Link>
                    <p className="text-sm text-bsmk-black/60 leading-relaxed mb-4 line-clamp-3">
                      {latestArticles[0].excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-bsmk-black/40">
                      <span>{latestArticles[0].authorName}</span>
                      <span>·</span>
                      <span>{formatDate(latestArticles[0].publishedAt)}</span>
                      <span>·</span>
                      <span>{latestArticles[0].readingTime} min</span>
                    </div>
                  </article>
                </StaggerItem>
              </StaggerContainer>

              {/* Side articles — right, stacked */}
              <StaggerContainer className="lg:col-span-2 flex flex-col gap-8" slow>
                {latestArticles.slice(1, 3).map((article) => (
                  <StaggerItem key={article.id}>
                    <article className="group flex flex-col">
                      <Link href={`/magazine/${article.slug}`} className="block">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-xl mb-4">
                          <Image
                            src={article.coverUrl}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-bsmk-black/30 to-transparent" />
                          <div className="absolute bottom-3 left-4">
                            <Badge variant="olive">{article.category}</Badge>
                          </div>
                        </div>
                      </Link>
                      <Link href={`/magazine/${article.slug}`}>
                        <h3 className="text-lg font-display font-bold mb-2 leading-snug group-hover:text-page-accent transition-colors">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-bsmk-black/60 leading-relaxed mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-bsmk-black/40 mt-auto">
                        <span>{article.authorName}</span>
                        <span>·</span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </article>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          )}

          <div className="mt-8 sm:hidden">
            <Link href="/magazine" className="text-sm text-page-accent hover:underline">
              Voir tout →
            </Link>
          </div>
        </Container>
      </section>

      {/* ── PROCHAINS ÉVÉNEMENTS ── */}
      <section className="py-24 bg-bsmk-white">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <FadeUp>
              <div>
                <p className="text-bsmk-blue text-xs tracking-widest uppercase mb-3">Concerts · Expositions · Ateliers</p>
                <ScrollTextReveal text="Agenda" className="text-4xl lg:text-5xl font-display font-bold text-bsmk-black" />
              </div>
            </FadeUp>
            <SlideUp delay={0.2}>
              <Link
                href="/agenda"
                className="text-sm text-page-accent hover:underline tracking-wide hidden sm:inline"
              >
                Voir tout →
              </Link>
            </SlideUp>
          </div>

          <StaggerContainer className="divide-y divide-bsmk-sand/40">
            {upcomingEvents.map((event) => {
              const date = new Date(event.startDate)
              const day = date.toLocaleDateString('fr-FR', { day: '2-digit' })
              const month = date.toLocaleDateString('fr-FR', { month: 'short' })
              return (
                <StaggerItem key={event.id}>
                  <MagneticHover strength={0.05}>
                    <Link
                      href={`/agenda/${event.slug}`}
                      className="flex items-center gap-6 py-6 group hover:bg-bsmk-sand/10 -mx-6 px-6 transition-all duration-300 rounded-lg"
                    >
                      <HoverScale className="flex-shrink-0 w-16 text-center">
                        <div className="text-3xl font-display font-bold text-page-accent leading-none">
                          {day}
                        </div>
                        <div className="text-xs tracking-widest uppercase text-bsmk-black/40 mt-1">
                          {month}
                        </div>
                      </HoverScale>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="default">{eventTypeLabels[event.eventType]}</Badge>
                          {event.free ? (
                            <Badge variant="olive">Entrée libre</Badge>
                          ) : (
                            <Badge variant="terracotta">{event.price}</Badge>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-lg text-bsmk-black group-hover:text-page-accent transition-colors truncate">
                          {event.title}
                        </h3>
                        <p className="text-sm text-bsmk-black/50 mt-0.5">{event.location}</p>
                      </div>

                      <HoverSlide className="flex-shrink-0 text-bsmk-black/20 group-hover:text-page-accent transition-colors">
                        →
                      </HoverSlide>
                    </Link>
                  </MagneticHover>
                </StaggerItem>
              )
            })}
          </StaggerContainer>

          <div className="mt-8 sm:hidden">
            <Link href="/agenda" className="text-sm text-page-accent hover:underline">
              Voir tout l&apos;agenda →
            </Link>
          </div>
        </Container>
      </section>

      {/* ── CHIFFRES CLÉS ── */}
      <section className="relative py-24 bg-bsmk-black text-bsmk-white overflow-hidden">
        <DecorativeBlob className="-bottom-32 -left-32" size={600} color="rgb(110 127 99 / 0.08)" />
        <Container>
          <BlurIn>
            <p className="text-page-accent text-xs tracking-widest uppercase mb-12 text-center">
              BSMK en chiffres
            </p>
          </BlurIn>
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <StatCard className="bg-bsmk-black p-10 text-center">
                  <CountUp value={stat.number} className="text-6xl lg:text-7xl font-display font-bold text-page-accent mb-3" />
                  <div className="text-sm text-bsmk-white/60 tracking-wide uppercase">
                    {stat.label}
                  </div>
                </StatCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 life-gradient relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-48 h-48 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white rounded-full" />
        </div>
        <DecorativeBlob className="top-0 right-0 opacity-20" color="white" size={500} />

        <Container>
          <ScaleIn>
            <div className="max-w-2xl mx-auto text-center relative z-10">
              <ScrollTextReveal text="Rejoignez la communauté BSMK" className="text-4xl lg:text-5xl font-bold text-white mb-6" as="h2" />
              <p className="text-white/80 text-lg mb-10 leading-relaxed">
                Ateliers, résidences, formations, événements — trouvez votre place dans notre écosystème artistique méditerranéen.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <MagneticHover strength={0.1}>
                  <Button href="/programmes" variant="secondary" size="lg">
                    Voir les programmes
                  </Button>
                </MagneticHover>
                <MagneticHover strength={0.1}>
                  <Button href="/contact" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-bsmk-black">
                    Contact
                  </Button>
                </MagneticHover>
                <MagneticHover strength={0.1}>
                  <Button href="/participer" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-bsmk-black">
                    Participer
                  </Button>
                </MagneticHover>
              </div>
            </div>
          </ScaleIn>
        </Container>
      </section>
    </main>
  )
}
