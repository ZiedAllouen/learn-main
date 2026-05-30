'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { disciplines } from '@/data/disciplines'
import { Container } from '@/components/ui/Container'
import { getAuthUser, logout } from '@/lib/auth'

const SECTION_COLORS: Record<string, string> = {
  '/bsmk': '#2D5F99',
  '/disciplines': '#2D5F99',
  '/programmes': '#C0392B',
  '/agenda': '#C0392B',
  '/espaces': '#5C8A3A',
  '/magazine': '#7A2E73',
  '/vetrinart': '#C99A2E',
  '/cartographie': '#C99A2E',
  '/communaute': '#147070',
  '/contact': '#147070',
  '/participer': '#C0392B',
}

function getSectionColor(pathname: string): string | null {
  for (const prefix of Object.keys(SECTION_COLORS)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return SECTION_COLORS[prefix]
    }
  }
  return null
}

const navLinks = [
  { label: 'Le Centre', href: '/bsmk' },
  { label: 'Disciplines', href: '/disciplines', hasDropdown: true },
  { label: 'Programmes', href: '/programmes' },
  { label: 'Espaces', href: '/espaces' },
  { label: 'Médias', href: '/magazine' },
  { label: 'Agenda', href: '/agenda' },
  { label: 'Vitrinart', href: '/vetrinart' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [disciplinesOpen, setDisciplinesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<ReturnType<typeof getAuthUser>>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    setUser(getAuthUser())
  }, [pathname])

  const isAdmin = user?.role === 'ADMIN'
  const isLoggedIn = !!user

  function handleLogout() {
    logout()
    setUser(null)
    window.location.href = '/'
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const sectionColor = getSectionColor(pathname)

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen ? 'bg-bsmk-black/98 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <Image
              src="/logo.png"
              alt="BSMK"
              width={150}
              height={150}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Navigation principale">
            {navLinks.map(item =>
              item.hasDropdown ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDisciplinesOpen(true)}
                  onMouseLeave={() => setDisciplinesOpen(false)}
                >
                  <Link
                    href={item.href}
                    className="text-sm font-medium tracking-wide transition-colors text-bsmk-white/75 hover:text-bsmk-white"
                    style={isActive(item.href) ? { color: sectionColor ?? '#E07B54' } : {}}
                  >
                    {item.label}
                    <span className="ml-1 opacity-50">↓</span>
                  </Link>

                  {disciplinesOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                      <div className="w-72 bg-bsmk-black border border-white/10 py-2 shadow-2xl rounded-xl overflow-hidden">
                        {disciplines.map(d => (
                          <Link
                            key={d.slug}
                            href={`/disciplines/${d.slug}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-bsmk-white/65 hover:text-bsmk-white hover:bg-white/5 transition-colors group"
                          >
                            <span
                              className="w-2 h-2 rounded-full shrink-0 opacity-70 group-hover:opacity-100"
                              style={{ backgroundColor: d.sectorColor }}
                            />
                            {d.name}
                          </Link>
                        ))}
                        <div className="border-t border-white/10 mt-2 pt-2">
                          <Link
                            href="/disciplines"
                            className="block px-4 py-2 text-xs text-bsmk-terracotta hover:text-bsmk-terracotta/80 transition-colors tracking-wide uppercase"
                          >
                            Toutes les disciplines →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium tracking-wide transition-colors text-bsmk-white/75 hover:text-bsmk-white"
                  style={isActive(item.href) ? { color: sectionColor ?? '#E07B54' } : {}}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-5">
            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-medium transition-colors tracking-wide"
                style={{ color: '#C0392B' }}
              >
                Admin
              </Link>
            )}
            <Link
              href="/contact"
              className="text-sm font-medium text-bsmk-white/60 hover:text-bsmk-white transition-colors tracking-wide"
            >
              Contact
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-bsmk-white/60 hover:text-bsmk-white transition-colors tracking-wide"
              >
                Déconnexion
              </button>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-bsmk-white/60 hover:text-bsmk-white transition-colors tracking-wide"
                style={isActive('/login') ? { color: sectionColor ?? '#E07B54' } : {}}
              >
                Connexion
              </Link>
            )}
            <Link
              href="/participer"
              className="bg-bsmk-terracotta text-white text-sm font-medium px-5 py-2.5 hover:bg-bsmk-terracotta/85 transition-colors tracking-wide rounded-lg"
            >
              Participer
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-bsmk-white p-2 -mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {/* Section color stripe */}
      {sectionColor && (
        <motion.div
          key={sectionColor}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-[3px] origin-left"
          style={{ backgroundColor: sectionColor }}
        />
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="lg:hidden border-t border-white/10 bg-bsmk-black overflow-hidden"
        >
          <Container>
            <nav className="py-6 flex flex-col gap-0" aria-label="Navigation mobile">
              {navLinks.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="py-3.5 text-sm font-medium tracking-wide border-b border-white/5 transition-colors text-bsmk-white/75 hover:text-bsmk-white"
                  style={isActive(item.href) ? { color: sectionColor ?? '#E07B54' } : {}}
                >
                  {item.label}
                </Link>
              ))}

              {/* Disciplines quick links */}
              <div className="pt-5 pb-2">
                <p className="text-xs text-bsmk-sand/40 tracking-widest uppercase mb-3">Disciplines</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {disciplines.map(d => (
                    <Link
                      key={d.slug}
                      href={`/disciplines/${d.slug}`}
                      className="flex items-center gap-2 text-sm text-bsmk-white/50 hover:text-bsmk-white transition-colors py-1"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: d.sectorColor }}
                      />
                      {d.shortName}
                    </Link>
                  ))}
                </div>
              </div>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="mt-4 block border text-sm font-medium px-5 py-3.5 text-center tracking-wide transition-colors rounded-lg"
                  style={{ borderColor: '#C0392B', color: '#C0392B' }}
                >
                  Administration
                </Link>
              )}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="mt-2 block w-full border border-white/20 text-white/70 text-sm font-medium px-5 py-3.5 text-center tracking-wide hover:border-white/50 hover:text-white transition-colors rounded-lg"
                >
                  Déconnexion
                </button>
              ) : (
                <Link
                  href="/login"
                  className="mt-2 block border border-white/20 text-white/70 text-sm font-medium px-5 py-3.5 text-center tracking-wide hover:border-white/50 hover:text-white transition-colors rounded-lg"
                >
                  Connexion
                </Link>
              )}
              <Link
                href="/participer"
                className="mt-2 block bg-bsmk-terracotta text-white text-sm font-medium px-5 py-3.5 text-center tracking-wide hover:bg-bsmk-terracotta/85 transition-colors rounded-lg"
              >
                Participer au BSMK
              </Link>
            </nav>
          </Container>
        </motion.div>
      )}
    </motion.header>
  )
}
