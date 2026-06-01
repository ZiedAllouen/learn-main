import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { disciplines } from '@/data/disciplines'
import { getProgram } from '@/lib/api/programs'
import { RequestForm } from '@/components/RequestForm'
import { HeroText, ScaleIn, StaggerContainer, StaggerItem, FadeUp } from '@/components/ui/Motion'

const modalityLabels: Record<string, string> = {
  IN_PERSON: 'En présentiel',
  ONLINE: 'En ligne',
  HYBRID: 'Hybride',
}

const modalityVariant: Record<string, 'terracotta' | 'blue' | 'olive'> = {
  IN_PERSON: 'terracotta',
  ONLINE: 'blue',
  HYBRID: 'olive',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const program = await getProgram(slug)
    return {
      title: `${program.title} | BSMK`,
      description: program.description ?? undefined,
    }
  } catch {
    return { title: 'Programme introuvable | BSMK' }
  }
}

export const dynamic = 'force-dynamic'

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let program
  try {
    program = await getProgram(slug)
  } catch {
    notFound()
  }

  const disciplineSlugs = program.disciplines.map((d) => d.discipline.slug)
  const audienceSlugs = program.audiences.map((a) => a.audienceType.slug)

  const relatedDisciplines = disciplines.filter((d) =>
    disciplineSlugs.includes(d.slug),
  )

  const audienceLabels: Record<string, string> = {
    jeunes: 'Jeunes (16–30 ans)',
    adultes: 'Adultes',
    professionnels: 'Professionnels',
    'tout-public': 'Tout public',
  }

  const isGratuit = program.priceIndicative?.toLowerCase().startsWith('gratuit') ?? false

  // The detail prose comes from `body` (rich text stored as JSON). For Phase 1 we
  // render plain-text bodies (paragraphs separated by blank lines), falling back to
  // the short description when no body is set.
  const longDescription =
    typeof program.body === 'string' ? program.body : (program.description ?? '')

  return (
    <main className="bg-bsmk-white text-bsmk-black">
      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <section className="relative h-[60vh] bg-bsmk-black">
        <ScaleIn className="absolute inset-0">
        <Image
          src={program.coverUrl ?? `https://picsum.photos/seed/prog-${program.slug}/1200/600`}
          alt={program.title}
          fill
          className="object-cover opacity-60"
          priority
        />
        </ScaleIn>
        <div className="absolute inset-0 bg-gradient-to-t from-bsmk-black via-bsmk-black/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <Container className="pb-12">
            <HeroText delay={0}>
              <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-3">
                {program.programType?.name}
              </p>
            </HeroText>
            <HeroText delay={0.1}>
              <h1 className="font-display text-5xl lg:text-7xl font-bold text-white leading-none mb-6 max-w-3xl">
                {program.title}
              </h1>
            </HeroText>
            <HeroText delay={0.25}>
              <Badge variant={modalityVariant[program.modality]}>
                {modalityLabels[program.modality]}
              </Badge>
            </HeroText>
          </Container>
        </div>
      </section>

      {/* ── 2. Info strip ────────────────────────────────────── */}
      <section className="bg-bsmk-black text-bsmk-white">
        <Container>
          <StaggerContainer className="flex flex-wrap divide-x divide-white/10">
            <StaggerItem className="flex-1 min-w-[140px] px-6 py-6">
              <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-1">Durée</p>
              <p className="font-display text-xl font-bold">{program.duration}</p>
            </StaggerItem>
            <StaggerItem className="flex-1 min-w-[140px] px-6 py-6">
              <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-1">Modalité</p>
              <p className="font-display text-xl font-bold">
                {modalityLabels[program.modality]}
              </p>
            </StaggerItem>
            <StaggerItem className="flex-1 min-w-[140px] px-6 py-6">
              <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-1">Type</p>
              <p className="font-display text-xl font-bold">{program.programType?.name}</p>
            </StaggerItem>
            <StaggerItem className="flex-1 min-w-[140px] px-6 py-6">
              <p className="text-xs tracking-widest uppercase text-bsmk-sand mb-1">Tarif</p>
              <p className="font-display text-xl font-bold">
                {isGratuit ? 'Gratuit' : program.priceIndicative}
              </p>
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </section>

      {/* ── 3. Description ───────────────────────────────────── */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Prose */}
            <FadeUp className="lg:col-span-2">
              <h2 className="font-display text-3xl font-bold mb-6">À propos du programme</h2>
              <div className="space-y-5 text-bsmk-black/75 leading-relaxed text-base">
                {longDescription.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </FadeUp>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="border border-bsmk-black/10 p-6 space-y-6 rounded-xl">
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

                {audienceSlugs.length > 0 && (
                  <div>
                    <p className="text-xs tracking-widest uppercase text-bsmk-black/40 mb-3">
                      Public visé
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {audienceSlugs.map((a) => (
                        <Badge key={a} variant="blue">
                          {audienceLabels[a] ?? a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs tracking-widest uppercase text-bsmk-black/40 mb-3">
                    Type de programme
                  </p>
                  <Badge variant="terracotta">{program.programType?.name}</Badge>
                </div>

                <div>
                  <p className="text-xs tracking-widest uppercase text-bsmk-black/40 mb-2">
                    Tarif indicatif
                  </p>
                  <p className="font-semibold text-bsmk-black">{program.priceIndicative}</p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* ── 4. Related disciplines ───────────────────────────── */}
      {relatedDisciplines.length > 0 && (
        <section className="py-16 bg-bsmk-sand/20">
          <Container>
            <h2 className="font-display text-3xl font-bold mb-10">Disciplines associées</h2>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDisciplines.map((discipline) => (
                <StaggerItem key={discipline.slug}>
                <div
                  className="group relative overflow-hidden bg-bsmk-black rounded-xl"
                >
                  <div className="relative h-48">
                    <Image
                      src={discipline.coverUrl}
                      alt={discipline.name}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-bold text-bsmk-white mb-2">
                      {discipline.name}
                    </h3>
                    <p className="text-sm text-bsmk-sand/80 leading-relaxed">
                      {discipline.description}
                    </p>
                  </div>
                </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      )}

      {/* ── 5. Inscription CTA ───────────────────────────────── */}
      <section className="bg-page-accent py-20">
        <Container>
          <FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8">
            <div className="text-white">
              <p className="text-xs tracking-widest uppercase text-white/60 mb-3">
                Prêt à commencer ?
              </p>
              <h2 className="font-display text-4xl lg:text-5xl font-bold leading-tight">
                Rejoindre ce programme
              </h2>
              <p className="mt-4 text-white/80 max-w-lg leading-relaxed">
                {isGratuit
                  ? 'Ce programme est accessible sur appel à candidatures. Envoyez-nous votre dossier pour participer.'
                  : `Tarif indicatif : ${program.priceIndicative}. Des réductions et bourses peuvent être disponibles.`}
              </p>
            </div>
            <div className="bg-bsmk-white p-6 rounded-xl">
              <RequestForm
                type="ENROLLMENT"
                programId={program.id}
                submitLabel="S'inscrire à ce programme"
              />
            </div>
          </div>
          </FadeUp>
        </Container>
      </section>

      {/* ── Back link ────────────────────────────────────────── */}
      <div className="py-8 border-t border-bsmk-black/10">
        <Container>
          <Link
            href="/programmes"
            className="text-sm text-bsmk-black/50 hover:text-page-accent transition-colors tracking-wide"
          >
            ← Tous les programmes
          </Link>
        </Container>
      </div>
    </main>
  )
}
