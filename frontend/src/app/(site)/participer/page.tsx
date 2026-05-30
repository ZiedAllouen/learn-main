import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { HeroText, StaggerContainer, StaggerItem, FadeUp } from '@/components/ui/Motion'

export const metadata: Metadata = {
  title: 'Participer | BSMK',
  description:
    'Candidater à un programme, réserver un espace, proposer un projet, devenir partenaire ou soutenir BSMK × VetrinArt.',
}

const participationPaths = [
  {
    title: 'Candidater à un programme',
    text: 'Formations, résidences, ateliers intensifs, mentorat et accompagnement de projets.',
    href: '/programmes',
    action: 'Voir les programmes',
  },
  {
    title: 'Réserver un espace',
    text: 'Studios musique, salles de danse, ateliers, conférence, coworking et salle événementielle.',
    href: '/espaces',
    action: 'Explorer les espaces',
  },
  {
    title: 'Proposer un projet',
    text: 'Performance, exposition, projection, atelier, résidence, série média ou projet collectif.',
    href: '/contact?sujet=Projet',
    action: 'Décrire le projet',
  },
  {
    title: 'Devenir partenaire',
    text: 'Institutions, marques, écoles, collectifs, médias et structures culturelles méditerranéennes.',
    href: '/contact?sujet=Partenariat',
    action: 'Écrire au partenariat',
  },
  {
    title: 'Rejoindre VetrinArt',
    text: 'Créer une présence artiste, présenter un portfolio et intégrer le réseau professionnel.',
    href: '/vetrinart',
    action: 'Découvrir VetrinArt',
  },
  {
    title: 'Soutenir',
    text: 'Soutien matériel, mécénat, bénévolat, équipement, production média ou appui logistique.',
    href: '/contact?sujet=Soutien',
    action: 'Proposer un soutien',
  },
]

export default function ParticiperPage() {
  return (
    <main className="bg-bsmk-white text-bsmk-black">
      <section className="bg-bsmk-black text-bsmk-white pt-32 pb-20">
        <Container>
          <HeroText delay={0}>
            <p className="text-xs tracking-widest uppercase text-bsmk-terracotta mb-5">
              Créer · Se former · Diffuser · Se connecter
            </p>
          </HeroText>
          <HeroText delay={0.1}>
            <h1 className="font-display text-5xl lg:text-7xl font-bold leading-none mb-6">
              Participer
            </h1>
          </HeroText>
          <HeroText delay={0.25}>
            <p className="max-w-2xl text-lg text-bsmk-sand/75 leading-relaxed">
              Une porte d’entrée simple pour rejoindre l’écosystème BSMK × VetrinArt :
              apprendre, réserver, proposer, collaborer ou soutenir.
            </p>
          </HeroText>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {participationPaths.map((path) => (
              <StaggerItem key={path.title}>
                <Link
                  href={path.href}
                  className="group block h-full border border-bsmk-black/10 bg-bsmk-white p-6 hover:border-bsmk-terracotta transition-colors rounded-xl"
                >
                  <h2 className="font-display text-2xl font-bold mb-3 group-hover:text-bsmk-terracotta transition-colors">
                    {path.title}
                  </h2>
                  <p className="text-sm text-bsmk-black/60 leading-relaxed mb-8">
                    {path.text}
                  </p>
                  <span className="text-xs tracking-widest uppercase text-bsmk-terracotta">
                    {path.action} →
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <section className="bg-bsmk-sand/20 py-16 border-y border-bsmk-black/10">
        <Container>
          <FadeUp className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs tracking-widest uppercase text-bsmk-terracotta mb-4">
                MVP sans backend
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                Les formulaires sont prêts pour la première phase.
              </h2>
              <p className="text-bsmk-black/65 leading-relaxed">
                Pour cette version, les parcours renvoient vers les pages et le formulaire de contact.
                Quand le backend sera ajouté, ces mêmes entrées pourront devenir des candidatures,
                réservations, paiements ou comptes membres.
              </p>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <Button href="/contact" variant="primary" size="lg">
                Contacter l’équipe
              </Button>
            </div>
          </FadeUp>
        </Container>
      </section>
    </main>
  )
}
