'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { disciplines } from '@/data/disciplines'
import { Container } from '@/components/ui/Container'
import { getAuthUser, logout } from '@/lib/auth'
import { getSectionColor } from '@/lib/sectionColors'

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
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<ReturnType<typeof getAuthUser>>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isLoggedIn = !!user
  // Role-aware dashboard link: each role goes to its own space.
  const dashboard =
    user?.role === 'ADMIN'
      ? { href: '/admin', label: 'Admin' }
      : user?.role === 'EDITOR'
        ? { href: '/editor', label: 'Éditeur' }
        : user?.role === 'ARTIST'
          ? { href: '/artiste', label: 'Mon espace' }
          : null

  function handleLogout() {
    logout()
    setUser(null)
    window.location.href = '/'
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const sectionColor = getSectionColor(pathname).base

  // Always a solid dark bar — on every page, scrolled or not. Fully opaque so
  // the white nav is always readable and the header never reveals the page
  // background beneath it (e.g. split-panel pages). Scrolling only adds a subtle
  // shadow to lift it off the content.
  const headerBg = `bg-bsmk-black ${scrolled ? 'shadow-lg shadow-black/20' : ''}`
  const navText = 'text-bsmk-white/75 hover:text-bsmk-white'
  const actionText = 'text-bsmk-white/60 hover:text-bsmk-white'
  const hamburger = 'text-bsmk-white'
  const panelBg = 'bg-bsmk-black border-white/10'
  const panelItem = 'text-bsmk-white/65 hover:text-bsmk-white hover:bg-white/5'
  const panelDivider = 'border-white/10'
  const mobileBg = 'bg-bsmk-black border-white/10'
  const mobileItemBorder = 'border-white/5'
  const mobileDiscLabel = 'text-bsmk-sand/40'
  const mobileDiscItem = 'text-bsmk-white/50 hover:text-bsmk-white'
  const mobileOutlineBtn = 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
  const desktopNavLink = 'font-ui text-[1rem] font-normal tracking-[0.005em] transition-colors'
  const desktopActionLink = 'font-ui text-[0.98rem] font-normal tracking-[0.005em] transition-colors'
  const mobileNavLink = 'font-ui text-[1.02rem] font-normal tracking-[0.005em] transition-colors'

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${headerBg}`}
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
                    className={`${desktopNavLink} ${navText}`}
                    style={isActive(item.href) ? { color: sectionColor } : {}}
                  >
                    {item.label}
                    <span className="ml-1 opacity-50">↓</span>
                  </Link>

                  {disciplinesOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                      <div className={`w-72 border py-2 shadow-2xl rounded-xl overflow-hidden ${panelBg}`}>
                        {disciplines.map(d => (
                          <Link
                            key={d.slug}
                            href={`/disciplines/${d.slug}`}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors group ${panelItem}`}
                          >
                            <span
                              className="w-2 h-2 rounded-full shrink-0 opacity-70 group-hover:opacity-100"
                              style={{ backgroundColor: d.sectorColor }}
                            />
                            {d.name}
                          </Link>
                        ))}
                        <div className={`border-t mt-2 pt-2 ${panelDivider}`}>
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
                  className={`${desktopNavLink} ${navText}`}
                  style={isActive(item.href) ? { color: sectionColor } : {}}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-5">
            <Link
              href="/contact"
              className={`${desktopActionLink} ${actionText}`}
            >
              Contact
            </Link>
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 text-bsmk-white/75 hover:text-bsmk-white ${desktopActionLink}`}
                >
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs uppercase">
                    {user?.email?.charAt(0)}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className={`absolute right-0 top-full mt-2 w-52 border py-2 shadow-2xl rounded-xl overflow-hidden ${panelBg}`}>
                    <div className="px-4 py-2.5 border-b border-white/10">
                      <p className="text-xs text-white/40 truncate">{user?.email}</p>
                    </div>
                    {dashboard && (
                      <Link
                        href={dashboard.href}
                        className={`block px-4 py-2.5 text-sm transition-colors ${panelItem}`}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {dashboard.label}
                      </Link>
                    )}
                    <Link
                      href="/profil"
                      className={`block px-4 py-2.5 text-sm transition-colors ${panelItem}`}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mon profil
                    </Link>
                    <div className={`border-t mt-1 pt-1 ${panelDivider}`}>
                      <button
                        onClick={() => { setUserMenuOpen(false); handleLogout() }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${panelItem}`}
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`${desktopActionLink} ${actionText}`}
                style={isActive('/login') ? { color: sectionColor } : {}}
              >
                Connexion
              </Link>
            )}
            <Link
              href="/participer"
              className="font-ui bg-bsmk-terracotta text-white text-[0.98rem] font-normal px-5 py-2.5 hover:bg-bsmk-terracotta/85 transition-colors tracking-[0.005em] rounded-lg"
            >
              Participer
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden p-2 -mr-2 ${hamburger}`}
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
          className={`lg:hidden border-t overflow-hidden ${mobileBg}`}
        >
          <Container>
            <nav className="py-6 flex flex-col gap-0" aria-label="Navigation mobile">
              {navLinks.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`py-3.5 border-b ${mobileNavLink} ${mobileItemBorder} ${navText}`}
                  style={isActive(item.href) ? { color: sectionColor } : {}}
                >
                  {item.label}
                </Link>
              ))}

              {/* Disciplines quick links */}
              <div className="pt-5 pb-2">
                <p className={`text-xs tracking-widest uppercase mb-3 ${mobileDiscLabel}`}>Disciplines</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {disciplines.map(d => (
                    <Link
                      key={d.slug}
                      href={`/disciplines/${d.slug}`}
                      className={`font-ui flex items-center gap-2 text-sm font-medium transition-colors py-1 ${mobileDiscItem}`}
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

              {isLoggedIn ? (
                <>
                  {dashboard && (
                    <Link
                      href={dashboard.href}
                      className={`font-ui mt-4 block border text-base font-normal px-5 py-3.5 text-center tracking-[0.005em] transition-colors rounded-lg ${mobileOutlineBtn}`}
                    >
                      {dashboard.label}
                    </Link>
                  )}
                  <Link
                    href="/profil"
                    className={`font-ui mt-2 block border text-base font-normal px-5 py-3.5 text-center tracking-[0.005em] transition-colors rounded-lg ${mobileOutlineBtn}`}
                  >
                    Mon profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`font-ui mt-2 block w-full border text-base font-normal px-5 py-3.5 text-center tracking-[0.005em] transition-colors rounded-lg ${mobileOutlineBtn}`}
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className={`font-ui mt-2 block border text-base font-normal px-5 py-3.5 text-center tracking-[0.005em] transition-colors rounded-lg ${mobileOutlineBtn}`}
                >
                  Connexion
                </Link>
              )}
              <Link
                href="/participer"
                className="font-ui mt-2 block bg-bsmk-terracotta text-white text-base font-normal px-5 py-3.5 text-center tracking-[0.005em] hover:bg-bsmk-terracotta/85 transition-colors rounded-lg"
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
