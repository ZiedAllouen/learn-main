import type { Metadata } from 'next'
import { Caladea, Fraunces, Inter } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '../globals.css'

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
    default: 'BSMK - Centre artistique, sportif et écologique hybride multidisciplinaire',
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

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${fraunces.variable} ${caladea.variable}`}>
      <body className="bg-bsmk-white text-bsmk-black antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
