import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'

const footerSections = [
  {
    title: 'Le Centre',
    links: [
      { label: 'Notre vision', href: '/bsmk' },
      { label: 'Nos valeurs', href: '/bsmk/valeurs' },
      { label: 'Le lieu', href: '/bsmk/le-lieu' },
      { label: 'Architecture', href: '/bsmk/architecture' },
      { label: "L'équipe", href: '/bsmk/equipe' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Disciplines',
    links: [
      { label: 'Musique & Production', href: '/disciplines/musique-production' },
      { label: 'Danse & Mouvement', href: '/disciplines/danse-performance' },
      { label: 'Arts Visuels', href: '/disciplines/arts-visuels' },
      { label: 'Théâtre & Arts vivants', href: '/disciplines/theatre-arts-vivants' },
      { label: 'Cinéma & Audiovisuel', href: '/disciplines/cinema-audiovisuel' },
      { label: 'Arts Numériques & Gaming', href: '/disciplines/arts-numeriques' },
      { label: 'Mode & Design', href: '/disciplines/artisanat-design' },
    ],
  },
  {
    title: 'Explorer',
    links: [
      { label: 'Programmes', href: '/programmes' },
      { label: 'Espaces', href: '/espaces' },
      { label: 'Agenda', href: '/agenda' },
      { label: 'Médias', href: '/magazine' },
      { label: 'Vitrinart', href: '/vetrinart' },
      { label: 'Communauté', href: '/communaute' },
      { label: 'Cartographie', href: '/cartographie' },
      { label: 'Participer', href: '/participer' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-bsmk-black text-bsmk-white border-t border-white/10" role="contentinfo">
      <Container>
        {/* Main grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="BSMK"
                width={80}
                height={80}
                className="h-14 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-bsmk-white/45 leading-relaxed">
              Centre des arts et de la culture.<br />
              Méditerranée, création, transmission.
            </p>
            <address className="not-italic text-sm text-bsmk-white/45 leading-relaxed">
              R56J+42J, 36 Av. de La Liberté<br />
              Tunis 1002, Tunisie<br />
              <a href="mailto:urban.whyz@gmail.com" className="hover:text-bsmk-white transition-colors">
                urban.whyz@gmail.com
              </a>
            </address>
            <div className="flex gap-5 pt-1">
              <a
                href="https://www.instagram.com/bsmk.hub?utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-bsmk-white/35 hover:text-bsmk-white transition-colors tracking-wide"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/URBAN.WHYZ/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-bsmk-white/35 hover:text-bsmk-white transition-colors tracking-wide"
                aria-label="Facebook"
              >
                Facebook
              </a>
              <a
                href="https://www.youtube.com/@whyzurban1860/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-bsmk-white/35 hover:text-bsmk-white transition-colors tracking-wide"
                aria-label="YouTube"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className="text-xs font-medium tracking-widest uppercase text-bsmk-sand/50 mb-5">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-bsmk-white/55 hover:text-bsmk-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-bsmk-white/25">
            © {new Date().getFullYear()} BSMK — Centre des arts et de la culture. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-bsmk-white/25 hover:text-bsmk-white/60 transition-colors">
              Mentions légales
            </a>
            <a href="#" className="text-xs text-bsmk-white/25 hover:text-bsmk-white/60 transition-colors">
              Confidentialité
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
