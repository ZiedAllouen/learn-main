import { Container } from '@/components/ui/Container'
import { ContactForm } from './ContactForm'
import { HeroText, StaggerContainer, StaggerItem, FadeUp } from '@/components/ui/Motion'

export const metadata = {
  title: 'Contact',
  description:
    'Contactez le BSMK pour toute demande d\'information, de réservation d\'espace, de partenariat ou de presse.',
}

const contactDetails = [
  {
    label: 'Adresse',
    icon: '◷',
    lines: ['12, Rue de la Kasbah', '1008 Tunis, Tunisie'],
  },
  {
    label: 'Email',
    icon: '◻',
    lines: ['contact@bsmk.tn'],
    link: 'mailto:contact@bsmk.tn',
  },
  {
    label: 'Téléphone',
    icon: '✦',
    lines: ['+216 71 234 567'],
    link: 'tel:+21671234567',
  },
  {
    label: 'Horaires d\'accueil',
    icon: '◈',
    lines: ['Lun – Ven : 9h – 22h', 'Samedi : 10h – 22h', 'Dimanche : 14h – 20h'],
  },
]

const departments = [
  { name: 'Programmes & formations', email: 'programmes@bsmk.tn' },
  { name: 'Réservation d\'espaces', email: 'espaces@bsmk.tn' },
  { name: 'Presse & communication', email: 'presse@bsmk.tn' },
  { name: 'Partenariats', email: 'partenariats@bsmk.tn' },
]

export default function ContactPage() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="bg-bsmk-black pt-32 pb-20">
        <Container>
          <div className="max-w-2xl">
            <HeroText delay={0}>
              <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-6">
                Écrivez-nous
              </p>
            </HeroText>
            <HeroText delay={0.1}>
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-bsmk-white leading-tight mb-6">
                Contact
              </h1>
            </HeroText>
            <HeroText delay={0.25}>
              <p className="text-bsmk-sand/70 text-lg leading-relaxed">
                Une question, une demande de réservation, un projet de partenariat ? Notre équipe vous répond dans les 48 heures ouvrables.
              </p>
            </HeroText>
          </div>
        </Container>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="py-24 bg-bsmk-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* ── LEFT: Contact info ── */}
            <aside className="lg:col-span-4 space-y-12">
              {/* Contact details */}
              <div>
                <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-6">
                  Nos coordonnées
                </p>
                <StaggerContainer className="space-y-8">
                  {contactDetails.map((detail) => (
                    <StaggerItem key={detail.label}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-bsmk-terracotta text-sm">{detail.icon}</span>
                        <span className="text-xs tracking-widest uppercase text-bsmk-black/40">
                          {detail.label}
                        </span>
                      </div>
                      {detail.link ? (
                        <a
                          href={detail.link}
                          className="text-bsmk-black hover:text-bsmk-terracotta transition-colors"
                        >
                          {detail.lines.map((line) => (
                            <div key={line} className="text-sm font-medium">
                              {line}
                            </div>
                          ))}
                        </a>
                      ) : (
                        <div>
                          {detail.lines.map((line) => (
                            <div key={line} className="text-sm text-bsmk-black/70">
                              {line}
                            </div>
                          ))}
                        </div>
                      )}
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>

              {/* Departments */}
              <div className="border-t border-bsmk-sand/40 pt-8">
                <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-6">
                  Contacts directs
                </p>
                <div className="space-y-4">
                  {departments.map((dept) => (
                    <div key={dept.name}>
                      <p className="text-xs text-bsmk-black/40 mb-0.5">{dept.name}</p>
                      <a
                        href={`mailto:${dept.email}`}
                        className="text-sm text-bsmk-black hover:text-bsmk-terracotta transition-colors"
                      >
                        {dept.email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="border-t border-bsmk-sand/40 pt-8">
                <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-4">
                  Réseaux sociaux
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/bsmk.tn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs tracking-widest uppercase text-bsmk-black/40 hover:text-bsmk-terracotta transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://facebook.com/bsmk.tn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs tracking-widest uppercase text-bsmk-black/40 hover:text-bsmk-blue transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://linkedin.com/company/bsmk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs tracking-widest uppercase text-bsmk-black/40 hover:text-bsmk-blue transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </aside>

            {/* ── RIGHT: Form ── */}
            <FadeUp className="lg:col-span-8" delay={0.15}>
              <p className="text-bsmk-terracotta text-xs tracking-widest uppercase mb-6">
                Formulaire de contact
              </p>
              <h2 className="text-3xl font-display font-bold text-bsmk-black mb-8">
                Envoyez-nous un message
              </h2>
              <ContactForm />
            </FadeUp>
          </div>
        </Container>
      </section>

      {/* ── MAP PLACEHOLDER ── */}
      <section className="bg-bsmk-sand/20 py-12 border-t border-bsmk-sand/40">
        <Container>
          <div className="relative h-64 bg-bsmk-sand/40 flex items-center justify-center">
            <div className="text-center">
              <p className="text-bsmk-black/40 text-xs tracking-widest uppercase mb-2">Localisation</p>
              <p className="font-display text-bsmk-black/60 text-lg">12, Rue de la Kasbah — Tunis</p>
              <a
                href="https://maps.google.com/?q=Tunis,Médina"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-widest uppercase text-bsmk-terracotta hover:underline mt-3 inline-block"
              >
                Ouvrir dans Google Maps →
              </a>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
