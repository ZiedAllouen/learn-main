# i18n Localization (French / English / Arabic) — Design

## Goal

Add full internationalization to the BSMK frontend so the platform is usable in French, English, and Arabic, with users able to switch languages at any time. French remains the default/fallback locale, matching all existing content.

## Scope

**In scope — translate everything authored in code:**
- All UI chrome: navigation, buttons, form labels, validation/error messages, headings, microcopy
- Static content data files with real editorial content: `data/disciplines.ts`, `data/articles.ts`, `data/team.ts`, and small static lookup tables (`eventTypeLabels`, `programTypes`, `audienceTypes`, etc.)
- Admin, editor, and artist dashboard UI (not just the public site)
- RTL layout support for Arabic

**Out of scope — deferred to a future project:**
- Database-backed dynamic content: `Event`, `Program`, `Space`, `Artist`/`ArtistWork`, `Media`, `Article`/`Discipline` records fetched via the backend API (`lib/api/*`). These are stored in Postgres via Prisma as single-language `String`/`Json` columns with no locale column, and localizing them requires a schema migration, NestJS API changes to accept a locale parameter, and admin UI changes so editors can enter content in 3 languages. This is user/editor-submitted content, not code-authored UI, and is a large enough change to warrant its own design pass.
- Any content submitted through forms by end users, artists, or editors (bios, event descriptions, media captions) — stays French-only for now regardless of which UI surface it appears on.

## Architecture

### Library: `next-intl`

Purpose-built for Next.js App Router. Provides locale-aware routing middleware, works in both server and client components, supports ICU message format (plurals, interpolation, dates), and has documented patterns for RTL locales.

### Routing

- Locale-prefixed URLs: `/fr/...`, `/en/...`, `/ar/...`
- French (`fr`) is the default locale, matching all existing hardcoded content
- `next-intl` middleware handles locale detection/negotiation on first visit (via `Accept-Language`) and redirects bare paths (e.g. `/agenda`) to the negotiated locale
- Existing route groups (`(site)`, `admin`, `artiste`, `editor`) move under a `[locale]` dynamic segment: `app/[locale]/(site)/...`, `app/[locale]/admin/...`, etc.

### RTL support

- `<html dir="rtl">` is set automatically when the active locale is `ar` (and `dir="ltr"` otherwise), driven from the root `[locale]` layout
- Layout-critical shared components (Header, Footer, primary nav, form layouts, cards with leading/trailing icons) are migrated to Tailwind logical-property utilities (`ms-`/`me-`/`ps-`/`pe-` instead of `ml-`/`mr-`/`pl-`/`pr-`) so spacing mirrors correctly under RTL
- This is a targeted migration of high-visibility shared components, not a blanket rewrite of every existing className in every file. Any remaining LTR-only spacing in less-visible/leaf components is an accepted follow-up, not a blocker for this pass

### Language switcher

- A new switcher control lives in `Header.tsx`, near the existing login/user-menu area, visible on both desktop and mobile nav
- Switching locale preserves the current path (e.g. switching from `/fr/agenda` to English lands on `/en/agenda`, not the homepage)

### Translation file structure

- `messages/{fr,en,ar}.json`, organized to mirror the app's route/section structure (e.g. top-level keys per feature area: `nav`, `header`, `footer`, `disciplines`, `agenda`, `admin`, etc.)
- Static content files (`disciplines.ts`, `articles.ts`, `team.ts`) are restructured to carry per-locale text — either inline per-field objects (`{ fr: '...', en: '...', ar: '...' }`) or, where content is keyed by a stable slug, moved into the messages JSON under a namespace keyed by that slug. The exact per-file shape is decided during implementation based on how each file is currently structured and consumed.

## Translation content

All French strings are translated into English and Arabic directly as part of this work (machine-translated by Claude, not sourced from a separate translator). Tone/accuracy review by native speakers, especially for Arabic, can happen as a follow-up but does not block shipping this feature.

## Migration approach

1. Install and configure `next-intl`: middleware, locale-aware root layout, request config
2. Move existing route groups under `app/[locale]/...`
3. Build the language switcher component in `Header.tsx`
4. Sweep every page/component for hardcoded French strings; extract to translation keys; wire up `useTranslations` (client) / `getTranslations` (server)
5. Restructure `disciplines.ts`, `articles.ts`, `team.ts`, and small enum-label lookup tables to carry per-locale text
6. Apply RTL logical-property migration to layout-critical shared components
7. Translate every extracted string into English and Arabic
8. Verify: `pnpm typecheck` and `next build` succeed; manually drive the dev server across all three locales — homepage, a nav dropdown, a form page, an admin dashboard page, and an Arabic RTL visual check

## Testing

No existing frontend test suite exists. Verification is via type-check/build success plus manual multi-locale driving of the dev server (per the project's `verify` workflow), covering the golden path in each locale and an explicit RTL visual check for Arabic.

## Explicitly deferred (not part of this spec)

- Locale support for database-backed content (events, programs, spaces, artist bios, media, articles/disciplines-via-API) — needs its own Prisma schema + NestJS + admin-UI design
- Professional/native-speaker translation review pass
- Exhaustive RTL audit of every leaf component's spacing utilities
