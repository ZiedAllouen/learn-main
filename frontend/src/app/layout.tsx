import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'BSMK — Centre des arts et de la culture',
    template: '%s | BSMK',
  },
  description:
    'BSMK est un centre culturel et artistique dédié à la création, la formation et la diffusion des arts en Méditerranée.',
  icons: {
    icon: '/favicon.svg',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'BSMK',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-bsmk-white text-bsmk-black antialiased">
        {children}
      </body>
    </html>
  )
}
