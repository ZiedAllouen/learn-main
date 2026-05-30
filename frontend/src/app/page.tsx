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
  StaggerContainer,
  StaggerItem,
  Marquee,
  CountUp,
} from '@/components/ui/Motion'

export const metadata = {
  title: 'BSMK — Centre des arts et de la culture',
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

const modalityLabels: Record<string, string> = {
  IN_PERSON: 'Présentiel',
  ONLINE: 'En ligne',
  HYBRID: 'Hybride',
}

export default async function HomePage() {
  const featuredPrograms = getFeaturedPrograms(3)
  const latestArticles = getLatestArticles(3)
  const upcomingEvents = getUpcomingEvents(4)

  // Fetch sectors from API (non-blocking — show placeholder if API is down)
  let sectors: Awaited<ReturnType<typeof getSectors>> = []
  try {
    sectors = await getSectors()
  } catch {
    // API not available — sectors strip will be hidden
  }

  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative min-h-screen bg-bsmk-black flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/seed/bsmk-hero/1920/1080"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        <Container className="relative z-10 py-32">
          <div className="max-w-4xl">
            <HeroText delay={0}>
              <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-8">
                Tunis · Méditerranée · Création
              </p>
            </HeroText>
            <HeroText delay={0.1}>
              <h1 className="text-[clamp(5rem,15vw,14rem)] font-display font-bold text-bsmk-white leading-none tracking-tight mb-6">
                BSMK
              </h1>
            </HeroText>
            <HeroText delay={0.25}>
              <p className="text-[clamp(1.5rem,4vw,3.5rem)] font-display text-bsmk-sand leading-tight mb-12">
                Centre des arts
                <br />
                et de la culture
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

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-bsmk-white/40 text-sm tracking-widest">
          ↓ Défiler pour explorer
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <section className="bg-bsmk-terracotta py-3 overflow-hidden">
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
                <Link
                  href={action.href}
                  className="flex flex-col items-center gap-3 py-8 px-4 text-bsmk-white/60 hover:text-bsmk-white hover:bg-white/5 transition-colors group"
                >
                  <span className="text-2xl text-bsmk-terracotta">{action.icon}</span>
                  <span className="text-xs tracking-widest uppercase text-center leading-snug">
                    {action.label}
                  </span>
                  <span className="text-[11px] text-bsmk-white/35 text-center leading-snug max-w-32">
                    {action.desc}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

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
                  <Link
                    href={`/disciplines?sector=${sector.slug}`}
                    className="sector-pill inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium tracking-wide transition-all"
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
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      )}

      {/* ── PROGRAMMES PHARES ── */}
      <section className="py-24 bg-bsmk-white">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <FadeUp>
              <div>
                <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-3">Formation · Résidence · Mentorat</p>
                <h2 className="text-4xl lg:text-5xl font-display font-bold text-bsmk-black">
                  Programmes phares
                </h2>
              </div>
            </FadeUp>
            <Button href="/programmes" variant="primary" size="sm" className="hidden sm:inline-flex">
              Voir les programmes →
            </Button>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPrograms.map((program) => (
              <StaggerItem key={program.id} className="h-full">
              <Link href={`/programmes/${program.slug}`} className="group block h-full border border-bsmk-sand/40 hover:border-bsmk-terracotta transition-colors rounded-xl overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={program.coverUrl}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1 bg-bsmk-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="terracotta">{program.programType}</Badge>
                    <Badge variant="default">{modalityLabels[program.modality]}</Badge>
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3 leading-snug group-hover:text-bsmk-terracotta transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-sm text-bsmk-black/60 leading-relaxed mb-4 flex-1 line-clamp-3">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-bsmk-sand/40">
                    <span className="text-sm font-medium text-bsmk-olive">{program.priceIndicative}</span>
                    <span className="text-xs tracking-widest uppercase text-bsmk-terracotta">
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

      {/* ── DERNIERS ARTICLES ── */}
      <section className="py-24 bg-bsmk-sand/20">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <FadeUp>
              <div>
                <p className="text-bsmk-olive text-xs tracking-widest uppercase mb-3">Magazine · Culture · Création</p>
                <h2 className="text-4xl lg:text-5xl font-display font-bold text-bsmk-black">
                  Du côté des médias
                </h2>
              </div>
            </FadeUp>
            <Link
              href="/magazine"
              className="text-sm text-bsmk-terracotta hover:underline tracking-wide hidden sm:inline"
            >
              Voir tout →
            </Link>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <StaggerItem key={article.id}>
              <article className="flex flex-col">
                <Link href={`/magazine/${article.slug}`} className="block group">
                  <div className="relative aspect-video overflow-hidden mb-4 rounded-lg">
                    <Image
                      src={article.coverUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <Badge variant="olive" className="self-start mb-3">{article.category}</Badge>
                <Link href={`/magazine/${article.slug}`}>
                  <h3 className="text-xl font-display font-bold mb-2 leading-snug hover:text-bsmk-terracotta transition-colors">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-sm text-bsmk-black/60 leading-relaxed mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-bsmk-black/40 mt-auto">
                  <span>{article.authorName}</span>
                  <span>·</span>
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>·</span>
                  <span>{article.readingTime} min</span>
                </div>
              </article>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="mt-8 sm:hidden">
            <Link href="/magazine" className="text-sm text-bsmk-terracotta hover:underline">
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
                <h2 className="text-4xl lg:text-5xl font-display font-bold text-bsmk-black">
                  Agenda
                </h2>
              </div>
            </FadeUp>
            <Link
              href="/agenda"
              className="text-sm text-bsmk-terracotta hover:underline tracking-wide hidden sm:inline"
            >
              Voir tout →
            </Link>
          </div>

          <StaggerContainer className="divide-y divide-bsmk-sand/40">
            {upcomingEvents.map((event) => {
              const date = new Date(event.startDate)
              const day = date.toLocaleDateString('fr-FR', { day: '2-digit' })
              const month = date.toLocaleDateString('fr-FR', { month: 'short' })
              return (
                <StaggerItem key={event.id}>
                <Link
                  href={`/agenda/${event.slug}`}
                  className="flex items-center gap-6 py-6 group hover:bg-bsmk-sand/10 -mx-6 px-6 transition-colors"
                >
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-3xl font-display font-bold text-bsmk-terracotta leading-none">
                      {day}
                    </div>
                    <div className="text-xs tracking-widest uppercase text-bsmk-black/40 mt-1">
                      {month}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="default">{eventTypeLabels[event.eventType]}</Badge>
                      {event.free ? (
                        <Badge variant="olive">Entrée libre</Badge>
                      ) : (
                        <Badge variant="terracotta">{event.price}</Badge>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-lg text-bsmk-black group-hover:text-bsmk-terracotta transition-colors truncate">
                      {event.title}
                    </h3>
                    <p className="text-sm text-bsmk-black/50 mt-0.5">{event.location}</p>
                  </div>

                  <div className="flex-shrink-0 text-bsmk-black/20 group-hover:text-bsmk-terracotta transition-colors">
                    →
                  </div>
                </Link>
                </StaggerItem>
              )
            })}
          </StaggerContainer>

          <div className="mt-8 sm:hidden">
            <Link href="/agenda" className="text-sm text-bsmk-terracotta hover:underline">
              Voir tout l'agenda →
            </Link>
          </div>
        </Container>
      </section>

      {/* ── CHIFFRES CLÉS ── */}
      <section className="py-24 bg-bsmk-black text-bsmk-white">
        <Container>
          <FadeUp>
            <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-12 text-center">
              BSMK en chiffres
            </p>
          </FadeUp>
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="bg-bsmk-black p-10 text-center">
                  <CountUp value={stat.number} className="text-6xl lg:text-7xl font-display font-bold text-bsmk-terracotta mb-3" />
                  <div className="text-sm text-bsmk-white/60 tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 bg-bsmk-terracotta">
        <Container>
          <FadeUp>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
                Rejoignez la communauté BSMK
              </h2>
              <p className="text-white/80 text-lg mb-10 leading-relaxed">
                Ateliers, résidences, formations, événements — trouvez votre place dans notre écosystème artistique méditerranéen.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button href="/programmes" variant="secondary" size="lg">
                  Voir les programmes
                </Button>
                <Link
                  href="/participer"
                  className="text-white/80 hover:text-white text-sm tracking-wide underline underline-offset-4"
                >
                  Ou proposer un projet
                </Link>
              </div>
            </div>
          </FadeUp>
        </Container>
      </section>
    </main>
  )
}
