import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { team } from '@/data/team'
import {
  HeroText,
  FadeUp,
  ScaleIn,
  SlideRight,
  StaggerContainer,
  StaggerItem,
  CountUp,
} from '@/components/ui/Motion'

export const metadata = {
  title: 'À propos — Notre vision',
  description:
    'BSMK est un centre culturel méditerranéen ancré à Tunis. Découvrez notre vision, notre équipe et notre lieu.',
}

const subPages = [
  { label: 'Nos valeurs', href: '/bsmk/valeurs', desc: 'Les principes qui guident notre action.' },
  { label: 'Le lieu', href: '/bsmk/le-lieu', desc: '2 500 m² au cœur de Tunis.' },
  { label: 'Architecture', href: '/bsmk/architecture', desc: 'Un espace conçu pour la création.' },
  { label: 'Notre équipe', href: '/bsmk/equipe', desc: `${team.length} personnes à votre service.` },
]

export default function AboutPage() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="bg-bsmk-black pt-32 pb-20">
        <Container>
          <div className="max-w-3xl">
            <HeroText delay={0}>
              <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-6">
                À propos du BSMK
              </p>
            </HeroText>
            <HeroText delay={0.1}>
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-bsmk-white leading-tight mb-8">
                Notre vision
              </h1>
            </HeroText>
            <HeroText delay={0.25}>
              <p className="text-xl text-bsmk-sand/80 leading-relaxed">
                BSMK est un espace de rencontre entre les arts, les cultures et les individus. Ancré à Tunis, ouvert sur la Méditerranée, il porte la conviction que la création artistique est une force de transformation sociale et politique.
              </p>
            </HeroText>
          </div>
        </Container>
      </section>

      {/* ── IMAGE ÉDITORIALE ── */}
      <ScaleIn>
        <div className="relative h-[50vh] bg-bsmk-black overflow-hidden">
          <Image
            src="https://picsum.photos/seed/bsmk-about/1920/800"
            alt="Vue intérieure du BSMK"
            fill
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bsmk-black/60 to-transparent" />
        </div>
      </ScaleIn>

      {/* ── TEXTE MISSION ── */}
      <section className="py-24 bg-bsmk-white">
        <Container narrow>
          <div className="space-y-12">
            <FadeUp>
              <div>
                <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-4">Notre histoire</p>
                <h2 className="text-3xl font-display font-bold text-bsmk-black mb-6">
                  Un projet né de la conviction
                </h2>
                <div className="space-y-4 text-bsmk-black/70 leading-relaxed text-lg">
                  <p>
                    Le BSMK est né en 2018 d'une initiative citoyenne portée par des artistes, des pédagogues et des acteurs culturels tunisiens. Face à un manque criant d'espaces professionnels dédiés à la création contemporaine à Tunis, ils ont imaginé un lieu différent — pas une institution figée, mais un organisme vivant, en perpétuelle évolution.
                  </p>
                  <p>
                    En cinq ans, le BSMK est devenu un repère incontournable de la scène artistique tunisienne et méditerranéenne. Ses studios de musique, ses salles de danse, son laboratoire numérique, sa salle de projection et ses espaces d'exposition accueillent chaque année des centaines d'artistes, de formations, de résidences et d'événements.
                  </p>
                </div>
              </div>
            </FadeUp>

            <SlideRight>
              <div className="border-l-4 border-bsmk-terracotta pl-8">
                <p className="text-2xl font-display text-bsmk-black leading-relaxed italic">
                  "La Méditerranée n'est pas un décor pour notre projet — elle est notre méthode. Une façon de travailler qui accepte l'hybridation, qui cherche le commun sans effacer les différences."
                </p>
                <p className="text-bsmk-black/40 text-sm mt-4 tracking-wide">— Nadia Bouzid, Directrice artistique</p>
              </div>
            </SlideRight>

            <FadeUp>
              <div>
                <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-4">Notre rôle</p>
                <h2 className="text-3xl font-display font-bold text-bsmk-black mb-6">
                  Un carrefour pour la création
                </h2>
                <div className="space-y-4 text-bsmk-black/70 leading-relaxed text-lg">
                  <p>
                    Le BSMK ne se définit pas comme un musée, ni comme une école, ni comme une salle de spectacle. Il est tout cela à la fois, et plus encore : un lieu de passage, d'échange et de fabrication. Un endroit où les artistes travaillent, apprennent, se rencontrent et créent ensemble.
                  </p>
                  <p>
                    Nos programmes de formation touchent aussi bien les jeunes qui découvrent la pratique artistique que les professionnels qui souhaitent approfondir ou réorienter leur parcours. Nos résidences accueillent des artistes de la rive nord et de la rive sud de la Méditerranée, dans un dialogue fertile et toujours renouvelé.
                  </p>
                  <p>
                    Notre magazine en ligne, nos conférences et nos expositions participent à une ambition plus large : contribuer à la réflexion sur la place de l'art dans la société tunisienne et méditerranéenne contemporaine.
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </Container>
      </section>

      {/* ── CHIFFRES RAPIDES ── */}
      <section className="py-12 bg-bsmk-sand/20 border-y border-bsmk-sand/40">
        <Container>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StaggerItem>
              <CountUp value={2018} className="text-5xl font-display font-bold text-bsmk-terracotta mb-2" />
              <div className="text-xs tracking-widest uppercase text-bsmk-black/50">Fondation</div>
            </StaggerItem>
            <StaggerItem>
              <CountUp value={team.length} className="text-5xl font-display font-bold text-bsmk-terracotta mb-2" />
              <div className="text-xs tracking-widest uppercase text-bsmk-black/50">Membres de l'équipe</div>
            </StaggerItem>
            <StaggerItem>
              <CountUp value={7} className="text-5xl font-display font-bold text-bsmk-terracotta mb-2" />
              <div className="text-xs tracking-widest uppercase text-bsmk-black/50">Disciplines artistiques</div>
            </StaggerItem>
            <StaggerItem>
              <CountUp value={2500} className="text-5xl font-display font-bold text-bsmk-terracotta mb-2" />
              <div className="text-xs tracking-widest uppercase text-bsmk-black/50">m² d'espaces</div>
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </section>

      {/* ── SOUS-PAGES ── */}
      <section className="py-24 bg-bsmk-white">
        <Container>
          <FadeUp>
            <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-8">En savoir plus</p>
          </FadeUp>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {subPages.map((page) => (
              <StaggerItem key={page.href}>
                <Link
                  href={page.href}
                  className="relative overflow-hidden border border-bsmk-sand/40 p-8 rounded-2xl group hover:bg-bsmk-black hover:border-transparent transition-all duration-300 flex flex-col h-full"
                >
                  {/* terracotta slide-in accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-bsmk-terracotta origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  <h3 className="text-xl font-display font-bold text-bsmk-black group-hover:text-bsmk-white mb-3 transition-colors">
                    {page.label}
                  </h3>
                  <p className="text-sm text-bsmk-black/50 group-hover:text-bsmk-white/55 transition-colors mb-6 leading-relaxed flex-1">
                    {page.desc}
                  </p>
                  <span className="text-bsmk-terracotta text-sm transition-colors mt-auto">
                    Découvrir →
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>
    </main>
  )
}
