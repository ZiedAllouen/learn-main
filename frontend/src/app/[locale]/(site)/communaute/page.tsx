import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { getFeaturedArtists } from '@/data/artists'
import { disciplines } from '@/data/disciplines'
import { HeroText, StaggerContainer, StaggerItem, FadeUp } from '@/components/ui/Motion'

export const metadata: Metadata = {
  title: 'Communaute & Reseau | BSMK',
  description:
    'Artistes du reseau, collectifs, institutions, partenaires et benevoles autour de BSMK x VetrinArt.',
}

const networkGroups = [
  'Artistes du reseau',
  'Collectifs partenaires',
  'Institutions culturelles',
  'Ecoles & universites',
  'Benevoles',
  'Partenaires media',
]

const partnerExamples = [
  'Residences mediterraneennes',
  'Diffusion internationale',
  'Ateliers jeunesse',
  'Production media',
  'Evenements urbains',
  'Recherche & archives',
]

export default function CommunautePage() {
  const featuredArtists = getFeaturedArtists().slice(0, 4)

  return (
    <main className="bg-bsmk-white text-bsmk-black">
      <section className="bg-bsmk-black text-bsmk-white pt-32 pb-20">
        <Container>
          <HeroText delay={0}>
            <p className="text-xs tracking-widest uppercase text-page-accent mb-5">
              Communaute · Reseau · Cooperation
            </p>
          </HeroText>
          <HeroText delay={0.1}>
            <h1 className="font-display text-5xl lg:text-7xl font-bold leading-none mb-6">
              Communaute & Reseau
            </h1>
          </HeroText>
          <HeroText delay={0.25}>
            <p className="max-w-2xl text-lg text-bsmk-sand/75 leading-relaxed">
              BSMK x VetrinArt connecte artistes, collectifs, institutions, publics et
              partenaires pour faire circuler les pratiques, les opportunites et les projets.
            </p>
          </HeroText>
        </Container>
      </section>

      <section className="py-16 bg-page-accent text-white">
        <Container>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-white/20">
            {networkGroups.map((group) => (
              <StaggerItem key={group}>
                <div className="bg-page-accent p-5 min-h-28 flex items-end">
                  <p className="text-sm tracking-wide leading-snug">{group}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs tracking-widest uppercase text-page-accent mb-3">
                VetrinArt
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold">
                Artistes a la une
              </h2>
            </div>
            <Link href="/vetrinart" className="hidden sm:inline text-sm text-page-accent hover:underline">
              Voir le reseau -&gt;
            </Link>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredArtists.map((artist) => {
              const primaryDiscipline = disciplines.find((d) => d.slug === artist.disciplineSlugs[0])
              return (
                <StaggerItem key={artist.id}>
                  <Link href={`/vetrinart/${artist.slug}`} className="group block">
                    <div className="relative aspect-square overflow-hidden bg-bsmk-sand/20 rounded-xl mb-4">
                      <Image
                        src={artist.photoUrl}
                        alt={artist.name}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-display text-xl font-bold group-hover:text-page-accent transition-colors">
                      {artist.name}
                    </h3>
                    <p className="text-sm text-bsmk-black/50 mb-2">
                      {artist.city} · {artist.country}
                    </p>
                    {primaryDiscipline && <Badge>{primaryDiscipline.shortName}</Badge>}
                  </Link>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </Container>
      </section>

      <section className="py-20 bg-bsmk-sand/20 border-y border-bsmk-black/10">
        <Container>
          <FadeUp>
            <p className="text-xs tracking-widest uppercase text-page-accent mb-3">
              Axes de cooperation
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-8">
              Les partenariats sont structures autour de projets concrets.
            </h2>
          </FadeUp>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partnerExamples.map((item) => (
              <StaggerItem key={item}>
                <div className="border border-bsmk-black/10 bg-bsmk-white p-5 rounded-xl">
                  <p className="font-medium">{item}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="mt-10">
            <Link
              href="/participer"
              className="inline-flex items-center h-12 px-6 bg-page-accent text-white text-sm font-medium tracking-wide hover:bg-page-accent/90 transition-colors rounded-lg"
            >
              Rejoindre le reseau
            </Link>
          </div>
        </Container>
      </section>
    </main>
  )
}
