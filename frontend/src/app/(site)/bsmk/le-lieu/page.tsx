import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  HeroText,
  FadeUp,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  CountUp,
  SlideLeft,
} from '@/components/ui/Motion'

export const metadata = {
  title: 'Le lieu — BSMK au cœur de Tunis',
  description:
    'Découvrez les 2 500 m² du BSMK, ses espaces de création et sa localisation au cœur de Tunis.',
}

const floorData = [
  {
    floor: 'Niveau 0',
    label: 'Rez-de-chaussée',
    description:
      'Le niveau d\'accueil et de la grande salle. C\'est ici que la vie publique du BSMK bat son plein : concerts, expositions, projections grand format, festivals. La grande salle polyvalente peut accueillir 300 personnes en configuration concert. La salle de projection 4K Dolby Atmos est l\'une des rares de sa catégorie à Tunis.',
    spaces: ['Grande salle polyvalente (300 places)', 'Salle de projection 4K (100 places)', 'Accueil & billetterie', 'Boutique & librairie'],
  },
  {
    floor: 'Niveau 1',
    label: 'Premier étage',
    description:
      'Le cœur sonore du BSMK. Le Studio A est un studio de musique professionnel doté d\'une console Neve 8078 et d\'un accès Pro Tools HDX. Le Studio B, plus accessible, est dédié aux répétitions et aux formations. La salle de conférence accueille séminaires, masterclasses et rencontres professionnelles.',
    spaces: ['Studio A — Production professionnelle', 'Studio B — Répétition', 'Salle de conférence (50 places)', 'Loges artistes'],
  },
  {
    floor: 'Niveau 2',
    label: 'Deuxième étage',
    description:
      'Le niveau du mouvement et du travail. La grande salle de danse (120 m²) est le plus grand espace de pratique de la danse à Tunis, doté d\'un sol Harlequin semi-souple. La salle de répétition théâtre est modulable, en noir intégral. L\'espace coworking artistes offre 25 postes de travail dédiés aux créatifs.',
    spaces: ['Grande salle de danse (120 m²)', 'Salle de répétition théâtre (40 places)', 'Coworking artistes (25 postes)', 'Terrasse panoramique'],
  },
  {
    floor: 'Niveau 3',
    label: 'Troisième étage',
    description:
      'Le niveau de la création visuelle et numérique. L\'atelier arts visuels baigne dans la lumière naturelle, équipé pour la peinture, la gravure, la sculpture et la céramique. Le FabLab numérique réunit impression 3D, découpe laser et postes créatifs, à l\'intersection de l\'art et de la technologie.',
    spaces: ['Atelier arts visuels & céramique', 'FabLab numérique (10 stations iMac)', 'Espace d\'exposition rooftop', 'Terrasse jardin'],
  },
]


export default function LeLieuPage() {
  return (
    <main>
      {/* ── HERO IMAGE ── */}
      <section className="relative h-[70vh] bg-bsmk-black overflow-hidden">
        <Image
          src="https://picsum.photos/seed/bsmk-lieu/1920/1080"
          alt="Vue extérieure du BSMK, Tunis"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bsmk-black via-bsmk-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <Container className="pb-16">
            <div className="max-w-2xl">
              <HeroText delay={0}>
                <p className="text-page-accent text-xs tracking-widest uppercase mb-4">
                  Tunis · Centre-ville
                </p>
              </HeroText>
              <HeroText delay={0.1}>
                <h1 className="text-5xl lg:text-7xl font-display font-bold text-bsmk-white leading-tight">
                  Le lieu
                </h1>
              </HeroText>
            </div>
          </Container>
        </div>
      </section>

      {/* ── STATS RAPIDES ── */}
      <section className="bg-bsmk-black border-b border-white/10">
        <Container>
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            <StaggerItem key="surface">
              <div className="py-10 px-6 text-center">
                <div className="text-4xl lg:text-5xl font-display font-bold text-page-accent leading-none flex items-baseline justify-center gap-1">
                  <CountUp value={2500} />
                  <span className="text-2xl text-page-accent/60">m²</span>
                </div>
                <div className="text-xs tracking-widest uppercase text-bsmk-white/40 mt-2">de surface totale</div>
              </div>
            </StaggerItem>
            <StaggerItem key="etages">
              <div className="py-10 px-6 text-center">
                <div className="text-4xl lg:text-5xl font-display font-bold text-page-accent leading-none flex items-baseline justify-center gap-1">
                  <CountUp value={3} />
                  <span className="text-2xl text-page-accent/60">étages</span>
                </div>
                <div className="text-xs tracking-widest uppercase text-bsmk-white/40 mt-2">de création</div>
              </div>
            </StaggerItem>
            <StaggerItem key="espaces">
              <div className="py-10 px-6 text-center">
                <div className="text-4xl lg:text-5xl font-display font-bold text-page-accent leading-none flex items-baseline justify-center gap-1">
                  <CountUp value={10} />
                  <span className="text-2xl text-page-accent/60">espaces</span>
                </div>
                <div className="text-xs tracking-widest uppercase text-bsmk-white/40 mt-2">professionnels</div>
              </div>
            </StaggerItem>
            <StaggerItem key="localisation">
              <div className="py-10 px-6 text-center">
                <div className="text-4xl lg:text-5xl font-display font-bold text-page-accent leading-none">
                  Centre-ville
                </div>
                <div className="text-xs tracking-widest uppercase text-bsmk-white/40 mt-2">de Tunis</div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </section>

      {/* ── INTRODUCTION ── */}
      <section className="py-24 bg-bsmk-white">
        <Container narrow>
          <FadeUp>
            <p className="text-page-accent text-xs tracking-widest uppercase mb-6">Le bâtiment</p>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-bsmk-black mb-8">
              Un bâtiment entièrement dédié à la création
            </h2>
            <div className="space-y-5 text-bsmk-black/70 leading-relaxed text-lg">
              <p>
                Installé dans un bâtiment du début du XXe siècle entièrement réhabilité, le BSMK occupe 2 500 m² au cœur de Tunis, à quelques minutes à pied de la Médina classée au patrimoine mondial de l'UNESCO. Le bâtiment a été rénové en 2020 par le cabinet d'architecture Atelier Tunis avec une attention particulière portée à la lumière naturelle, à l'acoustique et à la modularité des espaces.
              </p>
              <p>
                Sur quatre niveaux, le lieu abrite dix espaces professionnels distincts : studios de musique, salles de danse, salle de répétition théâtre, salle de projection cinéma, atelier arts visuels, FabLab numérique, grande salle d'événements, salle de conférence, espace coworking et terrasse-jardin. Chaque espace a été conçu pour répondre aux besoins spécifiques de sa discipline.
              </p>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* ── NIVEAUX ── */}
      <section className="py-12 bg-bsmk-white">
        <Container>
          <p className="text-page-accent text-xs tracking-widest uppercase mb-10">Plan par niveau</p>
          <div className="space-y-px">
            {floorData.map((floor, idx) => (
              <div key={floor.floor} className="grid grid-cols-1 lg:grid-cols-12 border border-bsmk-sand/40">
                {/* Floor label */}
                <ScaleIn className={`lg:col-span-2 p-8 flex flex-col justify-center ${idx % 2 === 0 ? 'bg-bsmk-black text-bsmk-white' : 'bg-bsmk-sand/20 text-bsmk-black'}`}>
                  <div className="text-xs tracking-widest uppercase opacity-50 mb-1">{floor.label}</div>
                  <div className="text-3xl font-display font-bold">{floor.floor}</div>
                </ScaleIn>
                {/* Content */}
                <FadeUp className="lg:col-span-10 p-8 bg-bsmk-white">
                  <p className="text-bsmk-black/70 leading-relaxed mb-6">{floor.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {floor.spaces.map((space) => (
                      <Badge key={space} variant="default">{space}</Badge>
                    ))}
                  </div>
                </FadeUp>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── ACCÈS ── */}
      <section className="py-24 bg-bsmk-sand/20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeUp>
              <div>
                <p className="text-page-accent text-xs tracking-widest uppercase mb-4">Accès & localisation</p>
                <h2 className="text-3xl font-display font-bold text-bsmk-black mb-6">
                  Au cœur de Tunis
                </h2>
                <div className="space-y-4 text-bsmk-black/70 leading-relaxed">
                  <p>
                    Le BSMK est situé dans le quartier de La Médina, à deux pas des axes principaux de Tunis. Facilement accessible en métro léger (station République) et en voiture avec un parking public à proximité.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-3">
                      <span className="text-page-accent">◷</span>
                      <span>Lundi – Vendredi : 9h – 22h</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-page-accent">◷</span>
                      <span>Samedi : 10h – 22h</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-page-accent">◷</span>
                      <span>Dimanche : 14h – 20h (selon programmation)</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
            <SlideLeft>
              <div className="bg-bsmk-white p-8 border border-bsmk-sand/40">
                <p className="text-xs tracking-widest uppercase text-bsmk-black/40 mb-2">Adresse</p>
                <p className="text-xl font-display font-bold text-bsmk-black mb-1">BSMK — Centre des arts et de la culture</p>
                <p className="text-bsmk-black/60">12, Rue de la Kasbah</p>
                <p className="text-bsmk-black/60">1008 Tunis, Tunisie</p>
                <div className="mt-6 pt-6 border-t border-bsmk-sand/40">
                  <Button href="/espaces" variant="primary">
                    Réserver un espace →
                  </Button>
                </div>
              </div>
            </SlideLeft>
          </div>
        </Container>
      </section>
    </main>
  )
}
