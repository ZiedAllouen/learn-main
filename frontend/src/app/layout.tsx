import type { Metadata } from 'next'
import { Caladea, Fraunces, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const caladea = Caladea({
  subsets: ['latin'],
  variable: '--font-ui',
  display: 'swap',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'BSMK - Centre des arts et de la culture',
    template: '%s | BSMK',
  },
  description:
    'BSMK est un centre culturel et artistique dedie a la creation, la formation et la diffusion des arts en Mediterranee.',
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
    <html lang="fr" className={`${inter.variable} ${fraunces.variable} ${caladea.variable}`}>
      <body className="bg-bsmk-white text-bsmk-black antialiased">
        {children}
      </body>
    </html>
  )
}
