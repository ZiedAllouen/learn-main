import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import {
  HeroText,
  FadeUp,
  ScaleIn,
  SlideRight,
  StaggerContainer,
  StaggerItem,
} from '@/components/ui/Motion'

export const metadata = {
  title: 'Architecture — L\'espace conçu pour la création',
  description:
    'Découvrez la philosophie architecturale du BSMK : lumière méditerranéenne, espaces ouverts et design modulaire au service de la création artistique.',
}

const designPrinciples = [
  {
    title: 'Lumière méditerranéenne',
    description:
      'La lumière est le premier matériau de l\'architecture du BSMK. Chaque espace a été orienté et dimensionné pour capter la lumière naturelle tunisienne — vive, changeante, dorée. Les grandes baies vitrées de l\'atelier arts visuels au troisième étage inondent l\'espace d\'une clarté douce, sans éblouissement. Les puits de lumière zénithale traversent les couloirs de circulation, transformant les espaces de passage en espaces de contemplation.',
    imageUrl: 'https://picsum.photos/seed/archi-lumiere/800/600',
    imageAlt: 'Jeu de lumière dans les espaces du BSMK',
  },
  {
    title: 'Espaces ouverts, frontières fluides',
    description:
      'L\'architecture du BSMK refuse les cloisonnements inutiles. Les espaces ont été conçus pour être poreux les uns aux autres — non dans le sens d\'une grande salle indifférenciée, mais dans celui de frontières négociables, d\'espaces qui peuvent s\'ouvrir ou se fermer selon les besoins. Des portes coulissantes en bois permettent de connecter ou d\'isoler les salles. Les couloirs sont dimensionnés pour être des espaces à part entière, où des expositions peuvent prendre place.',
    imageUrl: 'https://picsum.photos/seed/archi-open/800/600',
    imageAlt: 'Espaces ouverts et modulables du BSMK',
  },
  {
    title: 'Modularité au service de l\'art',
    description:
      'Aucun espace du BSMK n\'a une seule configuration figée. La grande salle peut accueillir 300 personnes en concert ou se transformer en espace d\'exposition pour une installation monumentale. La salle de répétition théâtre a des gradins amovibles et un sol modulable. Cette flexibilité n\'est pas un compromis — c\'est une philosophie. L\'architecture doit servir l\'art, pas l\'inverse. Nous refusons les boîtes noires qui imposent leur logique aux artistes.',
    imageUrl: 'https://picsum.photos/seed/archi-modular/800/600',
    imageAlt: 'Configuration modulable de la grande salle',
  },
]

export default function ArchitecturePage() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative bg-bsmk-black overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/seed/bsmk-archi-hero/1920/900"
            alt="Vue architecturale du BSMK"
            fill
            className="object-cover opacity-50"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-bsmk-black/80 to-transparent" />
        <Container className="relative z-10 py-40">
          <div className="max-w-2xl">
            <HeroText delay={0}>
              <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-6">
                Atelier Tunis · Réhabilitation 2019–2020
              </p>
            </HeroText>
            <HeroText delay={0.1}>
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-bsmk-white leading-tight mb-6">
                Architecture
              </h1>
            </HeroText>
            <HeroText delay={0.25}>
              <p className="text-bsmk-sand/80 text-xl leading-relaxed">
                Un bâtiment du début du XXe siècle réinterprété pour la création contemporaine, dans le respect de son histoire et de son environnement méditerranéen.
              </p>
            </HeroText>
          </div>
        </Container>
      </section>

      {/* ── INTRO ── */}
      <section className="py-24 bg-bsmk-white">
        <Container narrow>
          <FadeUp>
            <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-6">La démarche</p>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-bsmk-black mb-8">
              Réhabiliter sans effacer
            </h2>
            <div className="space-y-5 text-bsmk-black/70 leading-relaxed text-lg">
              <p>
                Lorsqu'il s'est agi de transformer l'ancien entrepôt de la rue de la Kasbah en centre culturel, Atelier Tunis a fait le choix de la conservation augmentée. Pas de table rase, pas de reconstruction à neuf : une dialogue patient entre le bâtiment existant et les besoins nouveaux.
              </p>
              <p>
                Les murs épais en pierre de taille — caractéristiques de l'architecture tunisoise de l'époque coloniale — ont été conservés et mis en valeur. Ils offrent une isolation thermique naturelle remarquable, maintenant les espaces intérieurs frais en été et tempérés en hiver, sans recours excessif à la climatisation.
              </p>
              <p>
                Les planchers en bois ont été restaurés et renforcés. Les hauteurs sous plafond généreuses ont été préservées, permettant d'accueillir des installations monumentales et de créer une qualité acoustique naturelle dans les espaces de spectacle.
              </p>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* ── PRINCIPLES ── */}
      <section className="pb-24 bg-bsmk-white">
        <Container>
          <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-12">
            Trois principes de conception
          </p>
          <div className="space-y-24">
            {designPrinciples.map((principle, idx) => (
              <div
                key={principle.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  idx % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                <SlideRight className={idx % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <span className="text-7xl font-display font-bold text-bsmk-sand/40 leading-none block mb-4">
                    0{idx + 1}
                  </span>
                  <h3 className="text-3xl font-display font-bold text-bsmk-black mb-6">
                    {principle.title}
                  </h3>
                  <p className="text-bsmk-black/70 leading-relaxed text-lg">
                    {principle.description}
                  </p>
                </SlideRight>
                <ScaleIn className={`relative aspect-[4/3] overflow-hidden ${idx % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <Image
                    src={principle.imageUrl}
                    alt={principle.imageAlt}
                    fill
                    className="object-cover"
                  />
                </ScaleIn>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CITATION ARCHITECTE ── */}
      <section className="py-24 bg-bsmk-black">
        <Container narrow>
          <FadeUp>
            <div className="text-center">
              <span className="text-bsmk-terracotta text-6xl font-display leading-none">"</span>
              <blockquote className="text-2xl lg:text-3xl font-display text-bsmk-white leading-relaxed mt-4 mb-8">
                Notre objectif était de construire un bâtiment qui disparaît au profit de l'art. Un bâtiment qui ne s'impose pas, qui ne concurrence pas les œuvres qui y prennent place, mais qui les rend possibles. La plus grande réussite d'une architecture culturelle, c'est quand on l'oublie.
              </blockquote>
              <div className="border-t border-white/10 pt-8">
                <p className="text-bsmk-white font-medium">Amel Rezgui</p>
                <p className="text-bsmk-white/40 text-sm tracking-wide mt-1">Architecte principale, Atelier Tunis — Réhabilitation BSMK 2020</p>
              </div>
            </div>
          </FadeUp>
        </Container>
      </section>

      {/* ── GALERIE ── */}
      <section className="py-24 bg-bsmk-sand/20">
        <Container>
          <FadeUp>
            <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-8">Galerie photographique</p>
          </FadeUp>
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {['archi-detail-1', 'archi-detail-2', 'archi-detail-3', 'archi-detail-4', 'archi-detail-5', 'archi-detail-6'].map((seed) => (
              <StaggerItem key={seed}>
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={`https://picsum.photos/seed/${seed}/600/600`}
                    alt="Détail architectural du BSMK"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>
    </main>
  )
}
