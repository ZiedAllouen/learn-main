import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { team } from '@/data/team'
import { HeroText, StaggerContainer, StaggerItem } from '@/components/ui/Motion'

export const metadata = {
  title: 'Notre équipe',
  description:
    'Rencontrez les personnes qui font vivre le BSMK au quotidien : artistes, pédagogues, techniciens et coordinateurs.',
}

export default function EquipePage() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="bg-bsmk-black pt-32 pb-20">
        <Container>
          <div className="max-w-2xl">
            <HeroText delay={0}>
              <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-6">
                Les personnes derrière le projet
              </p>
            </HeroText>
            <HeroText delay={0.1}>
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-bsmk-white leading-tight mb-6">
                Notre équipe
              </h1>
            </HeroText>
            <HeroText delay={0.25}>
              <p className="text-bsmk-sand/70 text-lg leading-relaxed">
                {team.length} personnes unies par la conviction que la culture transforme les individus et les sociétés.
              </p>
            </HeroText>
          </div>
        </Container>
      </section>

      {/* ── TEAM GRID ── */}
      <section className="py-24 bg-bsmk-white">
        <Container>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-transparent">
            {team.map((member) => (
              <StaggerItem key={member.id}>
              <article className="bg-bsmk-white p-8 flex flex-col border border-bsmk-sand/30 rounded-xl">
                {/* Photo */}
                <div className="mb-6">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Identity */}
                <div className="mb-4">
                  <h2 className="text-xl font-display font-bold text-bsmk-black leading-tight">
                    {member.name}
                  </h2>
                  <p className="text-xs tracking-widest uppercase text-bsmk-terracotta mt-1">
                    {member.jobTitle}
                  </p>
                </div>

                {/* Bio */}
                <p className="text-sm text-bsmk-black/60 leading-relaxed flex-1 line-clamp-4">
                  {member.bio}
                </p>

                {/* Social links */}
                {(member.linkedInUrl || member.instagramUrl) && (
                  <div className="flex gap-4 mt-6 pt-6 border-t border-bsmk-sand/40">
                    {member.linkedInUrl && (
                      <Link
                        href={member.linkedInUrl}
                        className="text-xs tracking-widest uppercase text-bsmk-black/40 hover:text-bsmk-blue transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </Link>
                    )}
                    {member.instagramUrl && (
                      <Link
                        href={member.instagramUrl}
                        className="text-xs tracking-widest uppercase text-bsmk-black/40 hover:text-bsmk-terracotta transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagram
                      </Link>
                    )}
                  </div>
                )}
              </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* ── REJOINDRE ── */}
      <section className="py-24 bg-bsmk-sand/20 border-t border-bsmk-sand/40">
        <Container narrow>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-4">
                Rejoindre l'équipe
              </p>
              <h2 className="text-3xl font-display font-bold text-bsmk-black mb-4">
                Travailler au BSMK
              </h2>
              <p className="text-bsmk-black/70 leading-relaxed">
                Le BSMK recherche régulièrement des talents — artistes, pédagogues, techniciens, administrateurs — qui partagent notre vision d'un espace culturel ouvert, exigeant et ancré dans son territoire. Si vous souhaitez rejoindre l'aventure, contactez-nous.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center h-14 px-8 text-base font-medium tracking-wide bg-bsmk-terracotta text-white hover:bg-bsmk-terracotta/90 transition-colors justify-center rounded-lg"
              >
                Nous contacter
              </Link>
              <Link
                href="/bsmk/valeurs"
                className="inline-flex items-center h-14 px-8 text-base font-medium tracking-wide border border-bsmk-black text-bsmk-black hover:bg-bsmk-black hover:text-bsmk-white transition-colors justify-center rounded-lg"
              >
                Découvrir nos valeurs
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
