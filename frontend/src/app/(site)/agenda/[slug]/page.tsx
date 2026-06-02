import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { getEvent, getEvents } from '@/lib/api/events'
import { RequestForm } from '@/components/RequestForm'
import { disciplines } from '@/data/disciplines'
import { eventTypeLabels, type EventType } from '@/data/events'
import { formatDate } from '@/lib/utils'
import { ScaleIn, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

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

function formatLongDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const event = await getEvent(slug)
    return {
      title: `${event.title} | BSMK`,
      description: event.description ?? undefined,
    }
  } catch {
    return { title: 'Événement introuvable | BSMK' }
  }
}

export const dynamic = 'force-dynamic'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let event
  try {
    event = await getEvent(slug)
  } catch {
    notFound()
  }

  const disciplineSlugs = event.disciplines.map((d) => d.discipline.slug)
  const relatedDisciplines = disciplines.filter((d) =>
    disciplineSlugs.includes(d.slug),
  )

  const { data: sameTypeEvents } = await getEvents({ eventType: event.eventType, pageSize: 4 })
  const relatedEvents = sameTypeEvents.filter((e) => e.slug !== event.slug).slice(0, 3)

  const eventTypeLabel = eventTypeLabels[event.eventType as EventType] ?? event.eventType

  const longStartDate = formatLongDate(event.startDate)
  const startTime = formatTime(event.startDate)
  const longEndDate = event.endDate ? formatLongDate(event.endDate) : null
  const endTime = event.endDate ? formatTime(event.endDate) : null

  const isMultiDay =
    event.endDate &&
    new Date(event.endDate).toDateString() !== new Date(event.startDate).toDateString()

  return (
    <main className="bg-bsmk-white text-bsmk-black">
      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <section className="relative h-[60vh] bg-bsmk-black">
        <ScaleIn className="absolute inset-0">
        <Image
          src={event.coverUrl ?? 'https://picsum.photos/seed/bsmk-event/800/450'}
          alt={event.title}
          fill
          className="object-cover opacity-55"
          priority
        />
        </ScaleIn>
        {/* Gradient: from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-bsmk-black via-bsmk-black/20 to-transparent" />

        {/* Badge overlay top-left */}
        <div className="absolute top-8 left-0 right-0">
          <Container>
            <Badge variant={eventTypeBadgeVariant[event.eventType as EventType]}>
              {eventTypeLabel}
            </Badge>
          </Container>
        </div>

        {/* Title at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <Container className="pb-12">
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
              {event.title}
            </h1>
          </Container>
        </div>
      </section>

      {/* ── 2. Event meta header ─────────────────────────────── */}
      <section className="bg-bsmk-black text-bsmk-white">
        <Container>
          <FadeUp>
          <div className="flex flex-wrap divide-x divide-white/10">
            {/* Date */}
            <div className="flex-1 min-w-[180px] px-6 py-6">
              <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-1">Date</p>
              <p className="font-display text-lg font-bold capitalize">{longStartDate}</p>
              <p className="text-sm text-bsmk-sand/70 mt-0.5">{startTime}</p>
            </div>

            {/* End date / duration if multi-day */}
            {isMultiDay && longEndDate && (
              <div className="flex-1 min-w-[180px] px-6 py-6">
                <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-1">
                  Jusqu&apos;au
                </p>
                <p className="font-display text-lg font-bold capitalize">{longEndDate}</p>
                {endTime && (
                  <p className="text-sm text-bsmk-sand/70 mt-0.5">{endTime}</p>
                )}
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="flex-1 min-w-[180px] px-6 py-6">
                <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-1">Lieu</p>
                <p className="font-display text-lg font-bold">{event.location}</p>
              </div>
            )}

            {/* Type */}
            <div className="flex-1 min-w-[140px] px-6 py-6">
              <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-1">Type</p>
              <p className="font-display text-lg font-bold">{eventTypeLabel}</p>
            </div>
          </div>
          </FadeUp>
        </Container>
      </section>

      {/* ── 3. Description + sidebar ─────────────────────────── */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Prose left */}
            <FadeUp className="lg:col-span-2">
              <h2 className="font-display text-3xl font-bold mb-6">À propos</h2>
              <div className="space-y-5 text-bsmk-black/75 leading-relaxed text-base">
                {(event.description ?? '').split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Practical info */}
              <div className="mt-10 border-t border-bsmk-black/10 pt-8">
                <h3 className="font-display text-xl font-bold mb-5">Informations pratiques</h3>
                <dl className="space-y-4">
                  <div className="flex gap-6">
                    <dt className="text-xs tracking-widest uppercase text-bsmk-black/40 w-28 shrink-0 pt-0.5">
                      Date
                    </dt>
                    <dd className="text-bsmk-black/80 capitalize">
                      {longStartDate} à {startTime}
                      {isMultiDay && longEndDate && (
                        <>
                          {' — '}
                          <span className="capitalize">{longEndDate}</span>
                          {endTime && ` à ${endTime}`}
                        </>
                      )}
                    </dd>
                  </div>
                  {event.location && (
                    <div className="flex gap-6">
                      <dt className="text-xs tracking-widest uppercase text-bsmk-black/40 w-28 shrink-0 pt-0.5">
                        Lieu
                      </dt>
                      <dd className="text-bsmk-black/80">{event.location}</dd>
                    </div>
                  )}
                  <div className="flex gap-6">
                    <dt className="text-xs tracking-widest uppercase text-bsmk-black/40 w-28 shrink-0 pt-0.5">
                      Type
                    </dt>
                    <dd className="text-bsmk-black/80">
                      {eventTypeLabel}
                    </dd>
                  </div>
                </dl>
              </div>
            </FadeUp>

            {/* Sidebar right */}
            <aside className="lg:col-span-1">
              <div className="border border-bsmk-black/10 p-6 space-y-6 rounded-xl">
                <div>
                  <p className="text-xs tracking-widest uppercase text-bsmk-black/40 mb-3">
                    Type d&apos;événement
                  </p>
                  <Badge variant={eventTypeBadgeVariant[event.eventType as EventType]}>
                    {eventTypeLabel}
                  </Badge>
                </div>

                {relatedDisciplines.length > 0 && (
                  <div>
                    <p className="text-xs tracking-widest uppercase text-bsmk-black/40 mb-3">
                      Disciplines
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {relatedDisciplines.map((d) => (
                        <Badge key={d.slug} variant="olive">
                          {d.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs tracking-widest uppercase text-bsmk-black/40 mb-3">
                    Date de début
                  </p>
                  <p className="font-semibold text-bsmk-black capitalize">{longStartDate}</p>
                  <p className="text-sm text-bsmk-black/50">{startTime}</p>
                </div>

                {isMultiDay && longEndDate && (
                  <div>
                    <p className="text-xs tracking-widest uppercase text-bsmk-black/40 mb-3">
                      Date de fin
                    </p>
                    <p className="font-semibold text-bsmk-black capitalize">{longEndDate}</p>
                    {endTime && <p className="text-sm text-bsmk-black/50">{endTime}</p>}
                  </div>
                )}

                {event.ticketUrl && (
                  <div>
                    <a
                      href={event.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-page-accent hover:underline"
                    >
                      Billetterie →
                    </a>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* ── 4. Map placeholder ───────────────────────────────── */}
      {event.location && (
        <section className="py-4 pb-16">
          <Container>
            <ScaleIn>
            <div className="bg-bsmk-sand flex items-center justify-center h-40 border border-bsmk-black/10 rounded-xl">
              <p className="text-bsmk-black/50 text-sm tracking-widest uppercase">
                Voir sur la carte · {event.location}
              </p>
            </div>
            </ScaleIn>
          </Container>
        </section>
      )}

      {/* ── 5. Related events ────────────────────────────────── */}
      {relatedEvents.length > 0 && (
        <section className="py-16 bg-bsmk-sand/20">
          <Container>
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="font-display text-2xl font-bold">
                Autres {eventTypeLabel.toLowerCase()}s
              </h2>
              <Link
                href="/agenda"
                className="text-xs tracking-widest uppercase text-page-accent hover:underline"
              >
                Tout l&apos;agenda →
              </Link>
            </div>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((rel) => (
                <StaggerItem key={rel.id}>
                <Link
                  href={`/agenda/${rel.slug}`}
                  className="group bg-bsmk-white border border-bsmk-black/10 hover:border-page-accent transition-colors flex flex-col rounded-xl overflow-hidden"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={rel.coverUrl ?? 'https://picsum.photos/seed/bsmk-event/800/450'}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bsmk-black/40 to-transparent" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-display text-base font-bold leading-snug mb-1 group-hover:text-page-accent transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-bsmk-black/50">
                      {formatDate(rel.startDate)}
                      {rel.location ? ` · ${rel.location}` : ''}
                    </p>
                  </div>
                </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      )}

      {/* ── 6. Réservation CTA ───────────────────────────────── */}
      <section className="bg-page-accent py-20">
        <Container>
          <FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8">
            <div className="text-white">
              <p className="text-xs tracking-widest uppercase text-white/60 mb-3">
                Places limitées
              </p>
              <h2 className="font-display text-4xl lg:text-5xl font-bold leading-tight">
                Réserver ma place
              </h2>
              <p className="mt-4 text-white/80 max-w-lg leading-relaxed">
                Réservez votre place dès maintenant. Les places étant limitées, nous vous
                conseillons de vous inscrire rapidement.
              </p>
              {event.ticketUrl && (
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center text-sm font-medium tracking-wide text-white hover:underline"
                >
                  Billetterie →
                </a>
              )}
            </div>
            <div className="bg-bsmk-white p-6 rounded-xl">
              <RequestForm type="BOOKING" submitLabel="Réserver ma place" details={{ eventTitle: event.title, eventSlug: event.slug }} />
            </div>
          </div>
          </FadeUp>
        </Container>
      </section>

      {/* ── Back link ────────────────────────────────────────── */}
      <div className="py-8 border-t border-bsmk-black/10">
        <Container>
          <Link
            href="/agenda"
            className="text-sm text-bsmk-black/50 hover:text-page-accent transition-colors tracking-wide"
          >
            ← Retour à l&apos;agenda
          </Link>
        </Container>
      </div>
    </main>
  )
}
