# i18n Infrastructure (next-intl setup, routing, switcher, RTL foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the full next-intl mechanism — locale-prefixed routing, middleware, root layout, a working language switcher, and RTL wiring for Arabic — so that switching between `/fr`, `/en`, `/ar` works end-to-end for at least one real page, proving the pattern before the full string-extraction sweep (a separate plan) applies it everywhere.

**Architecture:** `next-intl` v4 with the App Router. All existing route groups move under `app/[locale]/...`. Middleware negotiates/redirects bare paths to a locale prefix. A `[locale]`-aware root layout sets `<html lang>` / `dir`. Messages live in `messages/{fr,en,ar}.json`. This plan translates only `Header.tsx`, `Footer.tsx`, and the homepage as the proof-of-mechanism; the remaining ~60 files are the subject of the follow-up sweep plan.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3, `next-intl` (new dependency), pnpm workspace (`@bsmk/web` package at `frontend/`).

## Global Constraints

- Locales: `fr` (default), `en`, `ar` — exact codes used throughout (spec: Routing)
- URLs are locale-prefixed: `/fr/...`, `/en/...`, `/ar/...` (spec: Routing)
- `dir="rtl"` on `<html>` only when locale is `ar`, `dir="ltr"` otherwise (spec: RTL support)
- Translation files: `messages/{fr,en,ar}.json`, organized to mirror the app's route/section structure (spec: Translation file structure)
- Language switcher lives in `Header.tsx` near the login/user-menu area, visible on desktop and mobile nav, and preserves the current path when switching (spec: Language switcher)
- Out of scope for this plan and the whole project: any DB-backed dynamic content (events, programs, spaces, artists, media) and any user/editor-submitted form content — never touch `lib/api/*` fetch logic or Prisma schema (spec: Scope)
- No existing frontend test suite — verification is `pnpm typecheck` / `next build` success plus manual dev-server driving across all three locales, per project's `verify` workflow (spec: Testing)
- Working directory for all frontend commands: `frontend/` (package `@bsmk/web`) inside the pnpm workspace at repo root `c:\Users\Zied\Downloads\learn-main\learn-main`

---

## File Structure

| File | Responsibility |
|---|---|
| `frontend/package.json` | Add `next-intl` dependency |
| `frontend/src/i18n/routing.ts` | Defines the locale list, default locale, and the typed `Link`/`usePathname`/`useRouter`/`redirect` navigation helpers (new) |
| `frontend/src/i18n/request.ts` | `next-intl` server config: loads the right `messages/{locale}.json` per request (new) |
| `frontend/src/middleware.ts` | Locale negotiation/redirect middleware (new) |
| `frontend/next.config.ts` | Wrap existing config with `next-intl`'s plugin |
| `frontend/messages/fr.json`, `en.json`, `ar.json` | Translation strings, namespaced by section (new) |
| `frontend/src/app/layout.tsx` | Becomes a minimal passthrough root layout (no more `<html>`/fonts/metadata — those move down) |
| `frontend/src/app/[locale]/layout.tsx` | New locale-aware root layout: `<html lang={locale} dir={...}>`, fonts, metadata, `NextIntlClientProvider` (new) |
| `frontend/src/app/[locale]/(site)/layout.tsx` | Moved verbatim from `app/(site)/layout.tsx` |
| `frontend/src/app/[locale]/(site)/page.tsx` | Moved from `app/(site)/page.tsx`; homepage strings extracted as the proof page |
| `frontend/src/app/[locale]/admin/...`, `frontend/src/app/[locale]/artiste/...`, `frontend/src/app/[locale]/editor/...` | All other route groups moved under `[locale]` verbatim (no string extraction yet — that's the sweep plan) |
| `frontend/src/components/layout/Header.tsx` | Add language switcher; convert nav strings to `useTranslations` as proof |
| `frontend/src/components/layout/Footer.tsx` | Convert strings to `useTranslations` as proof |
| `frontend/src/components/layout/LanguageSwitcher.tsx` | New small client component: renders FR/EN/AR links preserving current path (new) |

## Interfaces (cross-task contract)

- `routing` is a named export of `frontend/src/i18n/routing.ts`, constructed via `next-intl`'s `defineRouting({ locales: ['fr', 'en', 'ar'], defaultLocale: 'fr' })`.
- `frontend/src/i18n/routing.ts` also exports locale-aware navigation APIs from `createNavigation(routing)`: `{ Link, redirect, usePathname, useRouter }`. Any component that links between pages while preserving locale imports `Link`/`usePathname` from `@/i18n/routing`, **not** from `next/link` / `next/navigation`.
- Every page/layout under `app/[locale]/...` receives `params: Promise<{ locale: string }>` (Next 15 async params) and must `await params` before use.
- Translation namespaces used in this plan: `"Header"`, `"Footer"`, `"HomePage"` — keys are consumed via `useTranslations('Header')` etc. Later sweep-plan tasks will add more namespaces to the same three JSON files without touching this contract.

---

### Task 1: Install next-intl and verify baseline build

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: Install the dependency**

Run from repo root:
```bash
cd frontend && pnpm add next-intl@^4
```

- [ ] **Step 2: Verify it resolves and the existing app still builds untouched**

Run: `cd frontend && pnpm typecheck`
Expected: no errors (identical to pre-install baseline)

Run: `cd frontend && pnpm build`
Expected: build succeeds (this is the last time the build succeeds in the *old* file layout — Task 3 moves everything under `[locale]`)

- [ ] **Step 3: Commit**

```bash
git add frontend/package.json frontend/pnpm-lock.yaml
git commit -m "chore: add next-intl dependency"
```

---

### Task 2: Create routing config, request config, and middleware

**Files:**
- Create: `frontend/src/i18n/routing.ts`
- Create: `frontend/src/i18n/request.ts`
- Create: `frontend/src/middleware.ts`
- Modify: `frontend/next.config.ts`

**Interfaces:**
- Produces: `routing`, `Link`, `redirect`, `usePathname`, `useRouter` — all named exports of `routing.ts` — used by every later task that links between pages or reads the current locale.

- [ ] **Step 1: Write `frontend/src/i18n/routing.ts`**

```typescript
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['fr', 'en', 'ar'],
  defaultLocale: 'fr',
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
```

- [ ] **Step 2: Write `frontend/src/i18n/request.ts`**

```typescript
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 3: Write `frontend/src/middleware.ts`**

```typescript
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 4: Wrap `frontend/next.config.ts` with the next-intl plugin**

Replace the full file content:

```typescript
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['@bsmk/ui', '@bsmk/types'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.cloudflare.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 5: Typecheck (build will still fail — no `messages/*.json` or `[locale]` tree yet, that's expected until Task 3-4)**

Run: `cd frontend && pnpm typecheck`
Expected: no type errors in the three new files (import errors for `messages/*.json` not yet created are fine since it's a dynamic `import()` — TypeScript won't statically check that path)

- [ ] **Step 6: Commit**

```bash
git add frontend/src/i18n frontend/src/middleware.ts frontend/next.config.ts
git commit -m "feat: add next-intl routing, request config, and middleware"
```

---

### Task 3: Create base translation message files

**Files:**
- Create: `frontend/messages/fr.json`
- Create: `frontend/messages/en.json`
- Create: `frontend/messages/ar.json`

**Interfaces:**
- Produces: namespaces `"Header"`, `"Footer"`, `"HomePage"` — object shapes below are the exact keys Task 5/6/7 consume via `useTranslations('Header')` etc.

- [ ] **Step 1: Write `frontend/messages/fr.json`**

```json
{
  "Header": {
    "nav": {
      "centre": "Le Centre",
      "disciplines": "Disciplines",
      "programmes": "Programmes",
      "espaces": "Espaces",
      "medias": "Médias",
      "agenda": "Agenda",
      "vitrinart": "Vitrinart"
    },
    "ariaNavPrincipale": "Navigation principale",
    "ariaNavMobile": "Navigation mobile",
    "toutesLesDisciplines": "Toutes les disciplines →",
    "connexion": "Connexion",
    "deconnexion": "Déconnexion",
    "monProfil": "Mon profil",
    "participer": "Participer au BSMK",
    "ouvrirMenu": "Ouvrir le menu",
    "fermerMenu": "Fermer le menu",
    "dashboardAdmin": "Admin",
    "dashboardEditeur": "Éditeur",
    "dashboardArtiste": "Mon espace",
    "langue": "Langue"
  },
  "Footer": {
    "sections": {
      "centre": "Le Centre",
      "disciplines": "Disciplines",
      "explorer": "Explorer"
    },
    "brandTagline": "Centre artistique, sportif et écologique hybride",
    "brandTaglineLine2": "Méditerranée, création, transmission.",
    "copyright": "BSMK — Centre artistique, sportif et écologique hybride multidisciplinaire. Tous droits réservés.",
    "mentionsLegales": "Mentions légales",
    "confidentialite": "Confidentialité"
  },
  "HomePage": {
    "heroTitle": "BSMK",
    "heroSubtitle": "Centre artistique, sportif et écologique hybride multidisciplinaire"
  }
}
```

- [ ] **Step 2: Write `frontend/messages/en.json`**

```json
{
  "Header": {
    "nav": {
      "centre": "The Center",
      "disciplines": "Disciplines",
      "programmes": "Programs",
      "espaces": "Spaces",
      "medias": "Media",
      "agenda": "Agenda",
      "vitrinart": "Vitrinart"
    },
    "ariaNavPrincipale": "Main navigation",
    "ariaNavMobile": "Mobile navigation",
    "toutesLesDisciplines": "All disciplines →",
    "connexion": "Log in",
    "deconnexion": "Log out",
    "monProfil": "My profile",
    "participer": "Join BSMK",
    "ouvrirMenu": "Open menu",
    "fermerMenu": "Close menu",
    "dashboardAdmin": "Admin",
    "dashboardEditeur": "Editor",
    "dashboardArtiste": "My space",
    "langue": "Language"
  },
  "Footer": {
    "sections": {
      "centre": "The Center",
      "disciplines": "Disciplines",
      "explorer": "Explore"
    },
    "brandTagline": "Hybrid artistic, sports, and ecological center",
    "brandTaglineLine2": "Mediterranean, creation, transmission.",
    "copyright": "BSMK — Multidisciplinary hybrid artistic, sports, and ecological center. All rights reserved.",
    "mentionsLegales": "Legal notice",
    "confidentialite": "Privacy"
  },
  "HomePage": {
    "heroTitle": "BSMK",
    "heroSubtitle": "Multidisciplinary hybrid artistic, sports, and ecological center"
  }
}
```

- [ ] **Step 3: Write `frontend/messages/ar.json`**

```json
{
  "Header": {
    "nav": {
      "centre": "المركز",
      "disciplines": "التخصصات",
      "programmes": "البرامج",
      "espaces": "الفضاءات",
      "medias": "الوسائط",
      "agenda": "الأجندة",
      "vitrinart": "فيترينارت"
    },
    "ariaNavPrincipale": "التنقل الرئيسي",
    "ariaNavMobile": "التنقل عبر الهاتف",
    "toutesLesDisciplines": "→ جميع التخصصات",
    "connexion": "تسجيل الدخول",
    "deconnexion": "تسجيل الخروج",
    "monProfil": "ملفي الشخصي",
    "participer": "انضم إلى BSMK",
    "ouvrirMenu": "فتح القائمة",
    "fermerMenu": "إغلاق القائمة",
    "dashboardAdmin": "الإدارة",
    "dashboardEditeur": "المحرر",
    "dashboardArtiste": "مساحتي",
    "langue": "اللغة"
  },
  "Footer": {
    "sections": {
      "centre": "المركز",
      "disciplines": "التخصصات",
      "explorer": "استكشاف"
    },
    "brandTagline": "مركز فني ورياضي وبيئي هجين",
    "brandTaglineLine2": "المتوسط، الإبداع، النقل.",
    "copyright": "BSMK — مركز فني ورياضي وبيئي هجين متعدد التخصصات. جميع الحقوق محفوظة.",
    "mentionsLegales": "الإشعار القانوني",
    "confidentialite": "الخصوصية"
  },
  "HomePage": {
    "heroTitle": "BSMK",
    "heroSubtitle": "مركز فني ورياضي وبيئي هجين متعدد التخصصات"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/messages
git commit -m "feat: add base fr/en/ar translation message files"
```

---

### Task 4: Move all routes under `app/[locale]/` and split the root layout

**Files:**
- Modify: `frontend/src/app/layout.tsx` (becomes minimal passthrough)
- Create: `frontend/src/app/[locale]/layout.tsx` (new locale-aware root layout, content adapted from old `app/layout.tsx`)
- Move (verbatim, `git mv`): every file/folder currently under `frontend/src/app/(site)/`, `frontend/src/app/admin/`, `frontend/src/app/artiste/`, `frontend/src/app/editor/` down one level into `frontend/src/app/[locale]/(site)/`, `frontend/src/app/[locale]/admin/`, `frontend/src/app/[locale]/artiste/`, `frontend/src/app/[locale]/editor/` respectively

**Interfaces:**
- Consumes: `routing` from `@/i18n/routing` (Task 2)
- Produces: `app/[locale]/layout.tsx` renders `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>` — every nested layout/page from this point on is reachable only via a `/[locale]/...` URL. This is the file every later "does RTL flip correctly" check points at.

- [ ] **Step 1: Move route groups with git mv (preserves history)**

```bash
cd frontend/src/app
mkdir "[locale]"
git mv "(site)" "[locale]/(site)"
git mv admin "[locale]/admin"
git mv artiste "[locale]/artiste"
git mv editor "[locale]/editor"
```

- [ ] **Step 2: Replace `frontend/src/app/layout.tsx` with a minimal passthrough**

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
```

- [ ] **Step 3: Write `frontend/src/app/[locale]/layout.tsx`**

This is the old `app/layout.tsx` content, adapted: fonts/metadata unchanged, but `<html>` now reads `locale` from route params, sets `dir`, and wraps children in `NextIntlClientProvider` so client components (`Header`, `Footer`, switcher) can call `useTranslations`.

```typescript
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
```

- [ ] **Step 4: Typecheck**

Run: `cd frontend && pnpm typecheck`
Expected: no errors. (Internal links using plain `next/link`/`Link href="/agenda"` inside moved pages still typecheck fine — they just won't carry the locale prefix yet. Fixing those is Task 5-6 for Header/Footer, and the full sweep plan for everything else.)

- [ ] **Step 5: Build and manually verify routing works**

Run: `cd frontend && pnpm build`
Expected: build succeeds, route manifest shows paths like `/[locale]`, `/[locale]/agenda`, etc.

Run: `cd frontend && pnpm dev`
Visit `http://localhost:9003/` → expect a redirect to `http://localhost:9003/fr` (or `/en` depending on browser `Accept-Language`)
Visit `http://localhost:9003/en/agenda` → page loads (still French content — that's expected, this task doesn't translate agenda)
Visit `http://localhost:9003/ar` → view page source, confirm `<html lang="ar" dir="rtl">`

- [ ] **Step 6: Commit**

```bash
git add -A frontend/src/app
git commit -m "feat: move routes under [locale] segment, add locale-aware root layout"
```

---

### Task 5: Build the language switcher component

**Files:**
- Create: `frontend/src/components/layout/LanguageSwitcher.tsx`

**Interfaces:**
- Consumes: `usePathname`, `useRouter` from `@/i18n/routing` (Task 2); `routing.locales` from `@/i18n/routing`
- Produces: `LanguageSwitcher` component (default export), no props — reads current locale/path from hooks internally. Imported by `Header.tsx` in Task 6.

- [ ] **Step 1: Write the component**

```typescript
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { routing } from '@/i18n/routing'

const localeLabels: Record<string, string> = {
  fr: 'FR',
  en: 'EN',
  ar: 'AR',
}

export function LanguageSwitcher() {
  const t = useTranslations('Header')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex items-center gap-1" aria-label={t('langue')}>
      {routing.locales.map(loc => (
        <button
          key={loc}
          onClick={() => router.replace(pathname, { locale: loc })}
          className={`text-xs tracking-widest uppercase px-1.5 py-1 transition-colors ${
            loc === locale ? 'text-bsmk-white' : 'text-bsmk-white/40 hover:text-bsmk-white/75'
          }`}
          aria-current={loc === locale ? 'true' : undefined}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `cd frontend && pnpm typecheck`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/layout/LanguageSwitcher.tsx
git commit -m "feat: add LanguageSwitcher component"
```

---

### Task 6: Wire translations and the switcher into Header

**Files:**
- Modify: `frontend/src/components/layout/Header.tsx`

**Interfaces:**
- Consumes: `LanguageSwitcher` (Task 5), `Link`/`usePathname` from `@/i18n/routing` (Task 2, replacing `next/link`/`next/navigation`), `useTranslations('Header')` reading the `Header` namespace (Task 3)

- [ ] **Step 1: Replace navigation imports**

In `frontend/src/components/layout/Header.tsx`, change:
```typescript
import Link from 'next/link'
import { usePathname } from 'next/navigation'
```
to:
```typescript
import { Link, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
```

- [ ] **Step 2: Replace the hardcoded `navLinks` array with a translation-driven one**

Change:
```typescript
const navLinks = [
  { label: 'Le Centre', href: '/bsmk' },
  { label: 'Disciplines', href: '/disciplines', hasDropdown: true },
  { label: 'Programmes', href: '/programmes' },
  { label: 'Espaces', href: '/espaces' },
  { label: 'Médias', href: '/magazine' },
  { label: 'Agenda', href: '/agenda' },
  { label: 'Vitrinart', href: '/vetrinart' },
]
```
to a function called inside the component body (since it needs `t`):
```typescript
function useNavLinks() {
  const t = useTranslations('Header.nav')
  return [
    { label: t('centre'), href: '/bsmk' },
    { label: t('disciplines'), href: '/disciplines', hasDropdown: true },
    { label: t('programmes'), href: '/programmes' },
    { label: t('espaces'), href: '/espaces' },
    { label: t('medias'), href: '/magazine' },
    { label: t('agenda'), href: '/agenda' },
    { label: t('vitrinart'), href: '/vetrinart' },
  ]
}
```

- [ ] **Step 3: Update the component body**

Inside `export function Header()`, add near the top (after existing hooks):
```typescript
const t = useTranslations('Header')
const navLinks = useNavLinks()
```

Then replace every remaining hardcoded French string in the JSX with `t(...)` calls:
- `aria-label="Navigation principale"` → `aria-label={t('ariaNavPrincipale')}`
- `Toutes les disciplines →` → `{t('toutesLesDisciplines')}`
- `Connexion` (both desktop and mobile) → `{t('connexion')}`
- `Déconnexion` (both desktop and mobile) → `{t('deconnexion')}`
- `Mon profil` (both desktop and mobile) → `{t('monProfil')}`
- `Participer au BSMK` → `{t('participer')}`
- `aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}` → `aria-label={mobileOpen ? t('fermerMenu') : t('ouvrirMenu')}`
- `aria-label="Navigation mobile"` → `aria-label={t('ariaNavMobile')}`
- Dashboard labels: `{ href: '/admin', label: 'Admin' }` → `{ href: '/admin', label: t('dashboardAdmin') }`, `{ href: '/editor', label: 'Éditeur' }` → `{ href: '/editor', label: t('dashboardEditeur') }`, `{ href: '/artiste', label: 'Mon espace' }` → `{ href: '/artiste', label: t('dashboardArtiste') }`

- [ ] **Step 4: Add the switcher to desktop actions**

In the `{/* Desktop actions */}` div (around where `Connexion`/user menu render), add `<LanguageSwitcher />` as a sibling before the login/user-menu block:
```typescript
<div className="hidden lg:flex items-center gap-5">
  <LanguageSwitcher />
  {isLoggedIn ? (
    /* ...unchanged... */
  ) : (
    /* ...unchanged... */
  )}
</div>
```

- [ ] **Step 5: Add the switcher to the mobile menu**

In the mobile menu `<nav>`, add `<LanguageSwitcher />` near the top, before the mapped `navLinks`:
```typescript
<nav className="py-6 flex flex-col gap-0" aria-label={t('ariaNavMobile')}>
  <div className="pb-4">
    <LanguageSwitcher />
  </div>
  {navLinks.map(item => (
    /* ...unchanged... */
  ))}
```

- [ ] **Step 6: Typecheck**

Run: `cd frontend && pnpm typecheck`
Expected: no errors

- [ ] **Step 7: Manual verification**

Run: `cd frontend && pnpm dev`
Visit `/fr` → header shows French nav labels, "Connexion"
Click "EN" in the switcher → URL becomes `/en`, header shows "Log in", nav labels in English, current path preserved (not redirected to homepage)
Click "AR" → URL becomes `/ar`, header shows Arabic labels, page `dir="rtl"`, and visually confirm the nav/switcher don't look broken mirrored (acceptable if only partially mirrored — full RTL polish beyond Header/Footer is out of scope for this plan)

- [ ] **Step 8: Commit**

```bash
git add frontend/src/components/layout/Header.tsx
git commit -m "feat: wire translations and language switcher into Header"
```

---

### Task 7: Wire translations into Footer

**Files:**
- Modify: `frontend/src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `Link` from `@/i18n/routing` (Task 2), `useTranslations('Footer')` reading the `Footer` namespace (Task 3)

- [ ] **Step 1: Replace the import**

Change:
```typescript
import Link from 'next/link'
```
to:
```typescript
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
```

- [ ] **Step 2: Mark the component as a client component and add the translation hook**

`Footer` currently has no `'use client'` directive and is a plain function (server component). `useTranslations` works in server components too via direct call — no `'use client'` needed. Add at the top of the function body:
```typescript
export function Footer() {
  const t = useTranslations('Footer')
  // ...rest unchanged, using t() below
```

- [ ] **Step 3: Replace `footerSections` titles with translated ones**

Change the `footerSections` array (module-level, so it can't call `t()` there) into a function invoked inside the component:
```typescript
function useFooterSections(t: ReturnType<typeof useTranslations<'Footer'>>) {
  return [
    {
      title: t('sections.centre'),
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
      title: t('sections.disciplines'),
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
      title: t('sections.explorer'),
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
}
```
(The individual link labels — "Notre vision", "Musique & Production", etc. — stay hardcoded French in this plan. Extracting every footer link label is in scope for the follow-up sweep plan; this plan only proves the section-title translation mechanism.)

Then inside `Footer()`:
```typescript
const footerSections = useFooterSections(t)
```

- [ ] **Step 4: Replace remaining hardcoded strings used in this plan's scope**

- `Centre artistique, sportif et écologique hybride<br />Méditerranée, création, transmission.` → `{t('brandTagline')}<br />{t('brandTaglineLine2')}`
- `© {new Date().getFullYear()} BSMK — Centre artistique, sportif et écologique hybride multidisciplinaire. Tous droits réservés.` → `© {new Date().getFullYear()} {t('copyright')}`
- `Mentions légales` → `{t('mentionsLegales')}`
- `Confidentialité` → `{t('confidentialite')}`

(Instagram/Facebook/YouTube `aria-label`s and the individual footer link labels stay as-is in this plan — sweep plan handles them.)

- [ ] **Step 5: Typecheck**

Run: `cd frontend && pnpm typecheck`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/layout/Footer.tsx
git commit -m "feat: wire translations into Footer"
```

---

### Task 8: Translate the homepage as the full end-to-end proof

**Files:**
- Modify: `frontend/src/app/[locale]/(site)/page.tsx`

**Interfaces:**
- Consumes: `useTranslations('HomePage')` (Task 3 namespace)

- [ ] **Step 1: Read the current homepage file to find its hero title/subtitle strings**

(This step is investigative — read `frontend/src/app/[locale]/(site)/page.tsx` in full at implementation time and locate wherever the hero title/subtitle currently render as literal French text. The exact JSX shape wasn't captured verbatim in this plan since the homepage's full body is out of this plan's file-modification list otherwise; only the hero region changes here.)

- [ ] **Step 2: Add the translation import and hook**

At the top of the file, add:
```typescript
import { useTranslations } from 'next-intl'
```
(If the homepage is currently a server component with no `'use client'`, `useTranslations` still works via direct call — no directive change needed. If it already has `'use client'`, no change needed either.)

Inside the component function, add:
```typescript
const t = useTranslations('HomePage')
```

- [ ] **Step 3: Replace the hero title and subtitle literals with `t('heroTitle')` / `t('heroSubtitle')`**

Locate the JSX rendering the hero heading (likely an `<h1>` containing "BSMK") and the subtitle (likely containing "Centre artistique, sportif et écologique hybride multidisciplinaire" — the same string as the root metadata description). Replace those two literal text nodes with `{t('heroTitle')}` and `{t('heroSubtitle')}` respectively, keeping all surrounding JSX/classNames unchanged.

- [ ] **Step 4: Typecheck**

Run: `cd frontend && pnpm typecheck`
Expected: no errors

- [ ] **Step 5: Manual end-to-end verification**

Run: `cd frontend && pnpm dev`
Visit `/fr` → hero shows French title/subtitle
Visit `/en` → hero shows English title/subtitle, Header/Footer also in English
Visit `/ar` → hero shows Arabic title/subtitle, `<html dir="rtl">`, Header/Footer in Arabic
Confirm switching languages via the Header switcher preserves the path (test from a non-homepage route like `/fr/agenda` → switch to EN → lands on `/en/agenda`)

- [ ] **Step 6: Commit**

```bash
git add "frontend/src/app/[locale]/(site)/page.tsx"
git commit -m "feat: translate homepage hero as end-to-end i18n proof"
```

---

### Task 9: Fix client-side router redirects broken by the `[locale]` move

**Why this is in this plan, not the sweep plan:** `AdminDashboard.tsx`, `ArtistSpace.tsx`, `EditorDashboard.tsx`, and `profil/page.tsx` call `useRouter()` from plain `next/navigation` and then `router.push('/login')` with a bare, non-locale-prefixed path. A client-side `router.push` does a soft transition that must match an existing route in the (now `[locale]`-nested) route tree — `/login` no longer resolves to anything, so this is a 404 on logout, not a cosmetic gap. This is a direct correctness break caused by Task 4's route move, so it's fixed here rather than deferred.

**Files:**
- Modify: `frontend/src/app/admin/AdminDashboard.tsx` → `frontend/src/app/[locale]/admin/AdminDashboard.tsx` (already moved by Task 4; only the import/call changes here)
- Modify: `frontend/src/app/[locale]/artiste/ArtistSpace.tsx`
- Modify: `frontend/src/app/[locale]/editor/EditorDashboard.tsx`
- Modify: `frontend/src/app/[locale]/(site)/profil/page.tsx`

**Interfaces:**
- Consumes: `useRouter` from `@/i18n/routing` (Task 2) — replaces `useRouter` from `next/navigation` in all four files. The locale-aware `useRouter().push(path)` automatically prefixes `path` with the current locale, so `router.push('/login')` correctly navigates to e.g. `/en/login` when the user is currently on an English page.

- [ ] **Step 1: Fix `frontend/src/app/[locale]/admin/AdminDashboard.tsx`**

Change:
```typescript
import { useRouter } from 'next/navigation'
```
to:
```typescript
import { useRouter } from '@/i18n/routing'
```
The existing `router.push('/login')` call at the `handleLogout` function needs no other change — the locale-aware hook has the same `push(path)` signature.

- [ ] **Step 2: Fix `frontend/src/app/[locale]/artiste/ArtistSpace.tsx`**

Same change: replace the `next/navigation` import of `useRouter` with `@/i18n/routing`. Leave the `router.push('/login')` call site unchanged.

- [ ] **Step 3: Fix `frontend/src/app/[locale]/editor/EditorDashboard.tsx`**

Same change: replace the `next/navigation` import of `useRouter` with `@/i18n/routing`. Leave the `router.push('/login')` call site unchanged.

- [ ] **Step 4: Fix `frontend/src/app/[locale]/(site)/profil/page.tsx`**

Read the file first to confirm its exact `useRouter` usage (it wasn't read verbatim during planning), then apply the same import replacement: `next/navigation`'s `useRouter` → `@/i18n/routing`'s `useRouter`. Leave call sites unchanged unless the file pushes to a bare non-prefixed path other than what the locale-aware router already handles automatically.

- [ ] **Step 5: Typecheck**

Run: `cd frontend && pnpm typecheck`
Expected: no errors

- [ ] **Step 6: Manual verification**

Run: `cd frontend && pnpm dev`
Log in, visit `/en/admin` (as an admin user), click logout → expect landing on `/en/login`, not a 404
Repeat for `/ar/artiste` and `/fr/editor` if test accounts for those roles exist; otherwise confirm at least the admin path and note the other two follow the identical fix

- [ ] **Step 7: Commit**

```bash
git add "frontend/src/app/[locale]/admin/AdminDashboard.tsx" "frontend/src/app/[locale]/artiste/ArtistSpace.tsx" "frontend/src/app/[locale]/editor/EditorDashboard.tsx" "frontend/src/app/[locale]/(site)/profil/page.tsx"
git commit -m "fix: use locale-aware router for post-logout redirects"
```

**Note on the remaining `window.location.href` sites (`lib/api.ts`, `Header.tsx`'s `handleLogout`, `LoginForm.tsx`, `RegisterForm.tsx`):** these do a full hard navigation (browser-level, not client-side React Router), so they always round-trip through the middleware from Task 2, which redirects bare paths to the correct locale-prefixed URL. They render correctly today with one extra redirect hop and are left as-is in this plan; converting them to locale-aware paths to skip that hop is cosmetic and belongs in the sweep plan alongside the rest of the string/link sweep.

---

## Self-Review Notes

- **Spec coverage:** Routing (Task 2, 4), RTL foundation (Task 4 sets `dir`; full component-level RTL/logical-properties migration for Header/Footer/forms is explicitly deferred to the sweep plan per the spec's "targeted migration of high-visibility shared components" language — flagging this plan only proves `dir` propagation, not visual mirroring polish), language switcher (Task 5-6), translation file structure (Task 3), migration steps 1-4 of the spec's 8-step approach are covered; steps 5-8 (full string sweep, RTL polish, full translation, final verify) belong to the follow-up sweep plan by design. Task 9 was added after self-review found a real break (see below) that the spec didn't anticipate but that Task 4's own migration approach directly causes.
- **Placeholder scan:** Task 8 Step 1 is intentionally investigative rather than a placeholder — the homepage's non-hero content is out of this plan's scope (sweep plan handles it), so only the exact two hero strings are specified with find-and-replace instructions grounded in what's known to exist (the hero title is "BSMK", matching the root metadata `title.default` prefix; the subtitle matches the root metadata `description` verbatim, which is what was actually read from `app/layout.tsx`). Task 9 Step 4 is similarly investigative (file not read verbatim during planning) but scoped to a single, mechanical, already-proven find-and-replace, not an open-ended instruction.
- **Type consistency:** `routing`, `Link`, `redirect`, `usePathname`, `useRouter` names are introduced once in Task 2 and reused with identical names/import paths (`@/i18n/routing`) in Tasks 5, 6, 7, 9. `LanguageSwitcher` is a named export from Task 5 and imported by exact name in Task 6. Namespace strings (`'Header'`, `'Footer'`, `'HomePage'`) match exactly between Task 3's JSON top-level keys and Tasks 6/7/8's `useTranslations(...)` calls.
- **Gap found and fixed during review:** grepped the codebase for `router.push`/`window.location.href`/`redirect(` after drafting Task 4, since moving routes under `[locale]` risks silently breaking any hardcoded-path navigation. Found 4 real `next/navigation` `useRouter` + bare-path `router.push('/login')` call sites that would 404 post-move; added Task 9 to fix them. Confirmed the remaining `window.location.href` call sites are hard navigations that survive the move via middleware (one extra redirect hop, not a break), so correctly left out of this plan's must-fix list.
