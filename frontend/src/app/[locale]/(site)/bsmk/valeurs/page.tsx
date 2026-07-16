import { Container } from '@/components/ui/Container'
import { HeroText, FadeUp } from '@/components/ui/Motion'

export const metadata = {
  title: 'Nos valeurs',
  description:
    'Les cinq valeurs fondatrices qui guident l\'action du BSMK : création, transmission, ouverture, excellence, communauté.',
}

const values = [
  {
    number: '01',
    name: 'Création',
    icon: '✦',
    headline: 'Favoriser l\'émergence artistique',
    description:
      'La création est au cœur de tout ce que nous faisons. Le BSMK existe pour donner aux artistes les conditions matérielles, temporelles et humaines nécessaires à la naissance de leurs œuvres. Nous croyons que la création artistique n\'est pas un luxe — c\'est une nécessité. Nos ateliers, studios et résidences sont pensés comme des incubateurs du possible, des espaces où l\'expérimentation prime sur la performance.',
    color: 'border-page-accent',
    numberColor: 'text-page-accent',
  },
  {
    number: '02',
    name: 'Transmission',
    icon: '◈',
    headline: 'Partager les savoirs artistiques',
    description:
      'La transmission est le fil invisible qui relie les générations. Au BSMK, nous pensons que le savoir artistique ne s\'enseigne pas uniquement dans les académies — il se transmet dans les ateliers, les répétitions, les résidences, les conversations. Nos programmes pédagogiques sont conçus pour créer des espaces d\'apprentissage horizontal, où le maître et l\'élève partagent une même curiosité, une même exigence. Nous valorisons notamment les savoirs traditionnels méditerranéens en dialogue avec les pratiques contemporaines.',
    color: 'border-bsmk-olive',
    numberColor: 'text-bsmk-olive',
  },
  {
    number: '03',
    name: 'Ouverture',
    icon: '⬡',
    headline: 'L\'ouverture méditerranéenne comme méthode',
    description:
      'La Méditerranée est notre horizon. Pas comme décor romantique, mais comme posture intellectuelle et artistique : accepter l\'autre, chercher le dialogue, travailler dans la complexité. Cette ouverture se manifeste dans nos programmes de résidence qui réunissent des artistes de nationalités différentes, dans notre programmation culturelle qui fait une place égale aux artistes du Nord et du Sud, dans notre refus des hiérarchies culturelles. Être ouvert, c\'est aussi accepter d\'être transformé par la rencontre.',
    color: 'border-bsmk-blue',
    numberColor: 'text-bsmk-blue',
  },
  {
    number: '04',
    name: 'Excellence',
    icon: '◷',
    headline: 'Une exigence au service de la création',
    description:
      'L\'excellence ne signifie pas l\'élitisme. Elle signifie l\'exigence : envers soi-même, envers son travail, envers le public. Au BSMK, nous refusons la médiocrité sans pour autant ériger des barrières à l\'entrée. Nos espaces sont équipés aux meilleurs standards professionnels. Nos intervenants sont choisis pour leur maîtrise et leur générosité pédagogique. Nos événements sont préparés avec soin. Cette rigueur est une marque de respect — envers les artistes qui viennent travailler ici, envers les publics qui viennent découvrir.',
    color: 'border-bsmk-sand',
    numberColor: 'text-bsmk-black',
  },
  {
    number: '05',
    name: 'Communauté',
    icon: '◻',
    headline: 'Construire un écosystème artistique vivant',
    description:
      'Un artiste seul ne peut pas grand-chose. Une communauté d\'artistes peut tout changer. Le BSMK est d\'abord une communauté : des centaines d\'artistes, de pédagogues, de techniciens, de critiques, de spectateurs qui partagent un intérêt commun pour la création et sa diffusion. Nous investissons dans cette communauté — par nos programmes de mentorat, par notre réseau de partenaires méditerranéens, par notre plateforme VetrinArt, par notre magazine. Construire une communauté, c\'est construire un avenir pour l\'art.',
    color: 'border-page-accent/50',
    numberColor: 'text-page-accent',
  },
]

export default function ValeursPage() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="bg-bsmk-black pt-32 pb-20">
        <Container>
          <div className="max-w-2xl">
            <HeroText delay={0}>
              <p className="text-page-accent text-xs tracking-widest uppercase mb-6">
                Ce en quoi nous croyons
              </p>
            </HeroText>
            <HeroText delay={0.1}>
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-bsmk-white leading-tight mb-6">
                Nos valeurs
              </h1>
            </HeroText>
            <HeroText delay={0.25}>
              <p className="text-bsmk-sand/70 text-lg leading-relaxed">
                Cinq principes fondateurs qui guident chaque décision, chaque programme, chaque rencontre au BSMK.
              </p>
            </HeroText>
          </div>
        </Container>
      </section>

      {/* ── VALEURS ── */}
      <section className="py-12 bg-bsmk-white">
        <Container>
          <div className="divide-y divide-bsmk-sand/30">
            {values.map((value, idx) => (
              <FadeUp key={value.number} delay={idx * 0.08}>
              <article className={`py-16 border-l-4 ${value.color} pl-8 -ml-8`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                  {/* Number + Icon */}
                  <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start gap-4">
                    <span className={`text-6xl font-display font-bold ${value.numberColor} leading-none`}>
                      {value.number}
                    </span>
                    <span className="text-4xl text-bsmk-black/20">{value.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-10">
                    <p className="text-xs tracking-widest uppercase text-page-accent mb-2">
                      Valeur {value.number}
                    </p>
                    <h2 className="text-4xl lg:text-5xl font-display font-bold text-bsmk-black mb-4">
                      {value.name}
                    </h2>
                    <h3 className="text-xl text-bsmk-black/60 font-display mb-6">
                      {value.headline}
                    </h3>
                    <p className="text-bsmk-black/70 leading-relaxed text-lg max-w-3xl">
                      {value.description}
                    </p>
                  </div>
                </div>
              </article>
              </FadeUp>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-bsmk-sand/20 border-t border-bsmk-sand/40">
        <Container narrow>
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-bsmk-black mb-4">
              Ces valeurs en action
            </h2>
            <p className="text-bsmk-black/60 text-lg mb-8">
              Découvrez comment elles se traduisent dans nos programmes, nos espaces et notre équipe.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/programmes"
                className="inline-flex items-center h-11 px-6 text-sm font-medium tracking-wide bg-page-accent text-white hover:bg-page-accent/90 transition-colors rounded-lg"
              >
                Voir les programmes
              </a>
              <a
                href="/bsmk/equipe"
                className="inline-flex items-center h-11 px-6 text-sm font-medium tracking-wide border border-bsmk-black text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white transition-colors rounded-lg"
              >
                Rencontrer l'équipe
              </a>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
