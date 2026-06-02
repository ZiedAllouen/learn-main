import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { getEvents, type ApiEvent } from '@/lib/api/events'
import { ApiError } from '@/lib/api'
import { UnavailableNotice } from '@/components/ui/UnavailableNotice'
import { eventTypeLabels, type EventType } from '@/data/events'
import { formatDate } from '@/lib/utils'
import { HeroText, FadeIn, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

export const metadata: Metadata = {
  title: 'Agenda | BSMK',
  description:
    'Concerts, expositions, ateliers et résidences au BSMK — le calendrier complet des événements du centre des arts de Tunis.',
}

export const dynamic = 'force-dynamic'

const eventTypeBadgeVariant: Record<EventType, 'terracotta' | 'olive' | 'blue' | 'default'> = {
  CONCERT: 'terracotta',
  EXHIBITION: 'olive',
  WORKSHOP: 'blue',
  RESIDENCY: 'olive',
  SCREENING: 'default',
  CONFERENCE: 'blue',
  FESTIVAL: 'terracotta',
  OTHER: 'default',
}

const MONTHS = [
  { label: 'Mai 2026', year: 2026, month: 4 },
  { label: 'Juin 2026', year: 2026, month: 5 },
  { label: 'Juillet 2026', year: 2026, month: 6 },
  { label: 'Août 2026', year: 2026, month: 7 },
]

function getDayNumber(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric' })
}

function getMonthShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'short' })
}

function getMonthYear(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
}

function groupByMonth(evts: ApiEvent[]): Map<string, ApiEvent[]> {
  const map = new Map<string, ApiEvent[]>()
  const sorted = [...evts].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  )
  for (const evt of sorted) {
    const key = getMonthKey(evt.startDate)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(evt)
  }
  return map
}

function buildHref(
  current: { type?: string; month?: string },
  update: Partial<{ type: string | undefined; month: string | undefined }>,
) {
  const merged = { ...current, ...update }
  const p = new URLSearchParams()
  if (merged.type) p.set('type', merged.type)
  if (merged.month) p.set('month', merged.month)
  const s = p.toString()
  return s ? `/agenda?${s}` : '/agenda'
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; month?: string }>
}) {
  const { type, month } = await searchParams

  let events: ApiEvent[] = []
  let unavailable = false
  try {
    const result = await getEvents({ pageSize: 100 })
    events = result.data
  } catch (err) {
    if (err instanceof ApiError) {
      unavailable = true
    } else {
      throw err
    }
  }

  let filteredEvents = [...events]
  if (type) filteredEvents = filteredEvents.filter((e) => e.eventType === type)
  if (month) {
    const [y, m] = month.split('-').map(Number)
    filteredEvents = filteredEvents.filter((e) => {
      const d = new Date(e.startDate)
      return d.getFullYear() === y && d.getMonth() === m
    })
  }

  const upcoming = filteredEvents.slice(0, 3)
  const grouped = groupByMonth(filteredEvents)

  return (
    <main className="bg-bsmk-white text-bsmk-black">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-bsmk-black text-bsmk-white pt-24 pb-20">
        <Container>
          <HeroText delay={0}>
            <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-4">
              Saison 2026–2027
            </p>
          </HeroText>
          <HeroText delay={0.1}>
            <h1 className="font-display text-6xl lg:text-8xl font-bold leading-none mb-6">
              Agenda
            </h1>
          </HeroText>
          <HeroText delay={0.25}>
            <p className="font-sans text-lg text-bsmk-sand max-w-2xl leading-relaxed">
              Concerts, expositions, ateliers et résidences au BSMK. Toute la programmation du
              centre des arts de Tunis, du mois de mai au mois d&apos;août 2026.
            </p>
          </HeroText>
        </Container>
      </section>

      {/* ── Filter bar ───────────────────────────────────────── */}
      <section className="border-b border-bsmk-black/10 bg-bsmk-white sticky top-0 z-20">
        <Container>
          <FadeIn>
          <div className="py-4 flex flex-wrap gap-6 items-start">
            {/* By event type */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs tracking-widest uppercase text-bsmk-black/40 mr-1">Type</span>
              {(Object.entries(eventTypeLabels) as [EventType, string][]).map(([key, label]) => {
                const isActive = type === key
                return (
                  <Link
                    key={key}
                    href={buildHref({ type, month }, { type: isActive ? undefined : key })}
                    className={`px-3 py-1 text-xs tracking-widest uppercase rounded-full transition-colors ${
                      isActive
                        ? 'bg-bsmk-black text-white border border-bsmk-black'
                        : 'border border-bsmk-black/20 text-bsmk-black/60 hover:border-bsmk-black hover:text-bsmk-black'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>

            {/* By month */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs tracking-widest uppercase text-bsmk-black/40 mr-1">Mois</span>
              {MONTHS.map((mo) => {
                const key = `${mo.year}-${String(mo.month).padStart(2, '0')}`
                const isActive = month === key
                return (
                  <Link
                    key={mo.label}
                    href={buildHref({ type, month }, { month: isActive ? undefined : key })}
                    className={`px-3 py-1 text-xs tracking-widest uppercase rounded-full transition-colors ${
                      isActive
                        ? 'bg-bsmk-black text-white border border-bsmk-black'
                        : 'border border-bsmk-black/20 text-bsmk-black/60 hover:border-bsmk-black hover:text-bsmk-black'
                    }`}
                  >
                    {mo.label}
                  </Link>
                )
              })}
            </div>
          </div>
          </FadeIn>
        </Container>
      </section>

      {filteredEvents.length === 0 ? (
        /* ── Empty state ─────────────────────────────────────── */
        <section className="py-24">
          <Container>
            {unavailable ? (
              <UnavailableNotice label="Les événements" />
            ) : (
              <p className="text-center text-bsmk-black/50 text-lg">
                Aucun événement à venir.
              </p>
            )}
          </Container>
        </section>
      ) : (
        <>
      {/* ── À venir ──────────────────────────────────────────── */}
      <section className="py-16 bg-bsmk-sand/20">
        <Container>
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-display text-3xl font-bold">À venir</h2>
            <span className="text-xs tracking-widest uppercase text-bsmk-black/40">
              Prochains événements
            </span>
          </div>

          <StaggerContainer key={`upcoming-${type ?? ''}-${month ?? ''}`} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcoming.map((evt) => (
              <StaggerItem key={evt.id} className="h-full">
              <Link
                key={evt.id}
                href={`/agenda/${evt.slug}`}
                className="group bg-bsmk-white border border-bsmk-black/10 hover:border-page-accent transition-colors flex flex-col h-full rounded-xl overflow-hidden"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={evt.coverUrl ?? 'https://picsum.photos/seed/bsmk-event/800/450'}
                    alt={evt.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bsmk-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <Badge variant={eventTypeBadgeVariant[evt.eventType as EventType]}>
                      {eventTypeLabels[evt.eventType as EventType]}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-lg font-bold leading-snug mb-2 group-hover:text-page-accent transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-sm text-bsmk-black/50 mb-3">
                    {formatDate(evt.startDate)}
                    {evt.location ? ` · ${evt.location}` : ''}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {eventTypeLabels[evt.eventType as EventType]}
                    </span>
                    <span className="text-xs tracking-widest uppercase text-page-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      Voir →
                    </span>
                  </div>
                </div>
              </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ── Chronological list grouped by month ──────────────── */}
      <section className="py-16">
        <Container>
          <h2 className="font-display text-3xl font-bold mb-10">Programme complet</h2>

          <div className="space-y-12">
            {Array.from(grouped.entries()).map(([, monthEvents]) => {
              const firstDate = monthEvents[0].startDate
              return (
                <FadeUp key={`${getMonthKey(firstDate)}-${type ?? ''}-${month ?? ''}`}>
                  {/* Month divider */}
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="font-display text-2xl font-bold capitalize">
                      {getMonthYear(firstDate)}
                    </h3>
                    <div className="flex-1 h-px bg-bsmk-black/10" />
                    <span className="text-xs tracking-widest uppercase text-bsmk-black/30">
                      {monthEvents.length} événement{monthEvents.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Events in this month */}
                  <div className="space-y-px">
                    {monthEvents.map((evt, idx) => (
                      <div key={evt.id}>
                        <div className="flex gap-6 py-5 group">
                          {/* Date block */}
                          <div className="w-16 h-16 shrink-0 bg-page-accent text-white flex flex-col items-center justify-center rounded-md">
                            <span className="font-display text-2xl font-bold leading-none">
                              {getDayNumber(evt.startDate)}
                            </span>
                            <span className="text-[10px] tracking-widest uppercase mt-0.5">
                              {getMonthShort(evt.startDate)}
                            </span>
                          </div>

                          {/* Main content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant={eventTypeBadgeVariant[evt.eventType as EventType]}>
                                {eventTypeLabels[evt.eventType as EventType]}
                              </Badge>
                            </div>
                            <h4 className="font-display text-xl font-bold leading-snug group-hover:text-page-accent transition-colors mb-1">
                              {evt.title}
                            </h4>
                            {evt.location && (
                              <p className="text-sm text-bsmk-black/50 mb-2">{evt.location}</p>
                            )}
                            {evt.description && (
                              <p className="text-sm text-bsmk-black/65 leading-relaxed line-clamp-2">
                                {evt.description}
                              </p>
                            )}
                          </div>

                          {/* Right: type + link */}
                          <div className="shrink-0 flex flex-col items-end justify-between py-1">
                            <span className="text-sm font-semibold text-bsmk-black">
                              {eventTypeLabels[evt.eventType as EventType]}
                            </span>
                            <Link
                              href={`/agenda/${evt.slug}`}
                              className="text-xs tracking-widest uppercase text-page-accent hover:underline"
                            >
                              Voir →
                            </Link>
                          </div>
                        </div>
                        {idx < monthEvents.length - 1 && (
                          <div className="h-px bg-bsmk-black/8" />
                        )}
                      </div>
                    ))}
                  </div>
                </FadeUp>
              )
            })}
          </div>
        </Container>
      </section>
        </>
      )}

      {/* ── CTA band ─────────────────────────────────────────── */}
      <section className="bg-bsmk-olive text-bsmk-white py-16">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs tracking-widest uppercase text-bsmk-white/50 mb-2">
                Vous organisez un événement ?
              </p>
              <h2 className="font-display text-3xl font-bold">
                Proposez votre projet au BSMK
              </h2>
            </div>
            <Link
              href="/contact?sujet=Proposition+événement"
              className="shrink-0 inline-flex items-center h-14 px-8 bg-page-accent text-white text-sm font-medium tracking-wide hover:bg-page-accent/90 transition-colors rounded-lg"
            >
              Nous contacter
            </Link>
          </div>
        </Container>
      </section>
    </main>
  )
}
