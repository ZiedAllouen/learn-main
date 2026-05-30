import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { RegisterForm } from './RegisterForm'

export const metadata: Metadata = {
  title: 'Créer un compte | BSMK',
  description: 'Rejoindre le portail BSMK',
}

const SECTOR_COLORS = ['#2D5F99', '#C0392B', '#7A2E73', '#5C8A3A', '#147070', '#C99A2E', '#8A8F7A']

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-bsmk-black flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 flex">
          {SECTOR_COLORS.map((color, i) => (
            <div key={i} className="flex-1 opacity-15" style={{ backgroundColor: color }} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-bsmk-black via-bsmk-black/80 to-transparent" />

        <div className="relative z-10">
          <Link href="/">
            <Image src="/logo.png" alt="BSMK" width={80} height={80} className="h-12 w-auto object-contain brightness-0 invert" />
          </Link>
        </div>

        <div className="relative z-10">
          <p className="text-xs tracking-widest uppercase text-bsmk-sand/60 mb-4">
            Tunis · Méditerranée · Création
          </p>
          <h2 className="font-display text-4xl lg:text-5xl text-bsmk-white leading-tight mb-6">
            Rejoignez<br />l&apos;écosystème
          </h2>
          <p className="font-sans text-bsmk-white/50 text-base leading-relaxed max-w-sm">
            Créez votre espace personnel pour accéder aux programmes, gérer vos projets et contribuer à la communauté BSMK.
          </p>
        </div>

        <div className="relative z-10 flex gap-2">
          {SECTOR_COLORS.map((color, i) => (
            <div key={i} className="h-1 flex-1 rounded-full" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-16">
        <div className="lg:hidden mb-12">
          <Link href="/">
            <Image src="/logo.png" alt="BSMK" width={80} height={80} className="h-10 w-auto object-contain brightness-0 invert" />
          </Link>
        </div>

        <div className="w-full max-w-sm mx-auto lg:mx-0">
          <div className="mb-8">
            <div className="flex gap-1 mb-6">
              {SECTOR_COLORS.slice(0, 4).map((color, i) => (
                <div key={i} className="w-6 h-1 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>
            <h1 className="font-display text-3xl text-bsmk-white mb-2">Créer un compte</h1>
            <p className="font-sans text-sm text-bsmk-white/40">
              Déjà membre ?{' '}
              <Link href="/login" className="text-bsmk-sand hover:text-bsmk-white transition-colors underline underline-offset-4">
                Se connecter
              </Link>
            </p>
          </div>

          <RegisterForm />

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-xs text-bsmk-white/25 text-center font-sans">
              En créant un compte, vous acceptez nos{' '}
              <Link href="/mentions-legales" className="text-bsmk-white/40 hover:text-bsmk-white transition-colors">
                conditions d&apos;utilisation
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
