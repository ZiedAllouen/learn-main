// Single source of truth for per-section accent colors.
//
// Each page "follows" the color of the stripe under the header. The Header uses
// these for the active nav link + the color stripe; the (site) layout exposes the
// matching color to page content via the `--page-accent` CSS variable (consumed by
// the Tailwind `page-accent` color — see tailwind.config.ts).

export type SectionColor = {
  /** Base accent hex (matches the header stripe). */
  base: string
  /** Lighter variant used for hover / on-dark emphasis. */
  hover: string
}

// Route prefix -> accent. Order doesn't matter; longest matching prefix wins.
export const SECTION_COLORS: Record<string, SectionColor> = {
  '/bsmk': { base: '#2D5F99', hover: '#4A7CB8' },
  '/disciplines': { base: '#2D5F99', hover: '#4A7CB8' },
  '/programmes': { base: '#C0392B', hover: '#D9594B' },
  '/agenda': { base: '#C0392B', hover: '#D9594B' },
  '/espaces': { base: '#5C8A3A', hover: '#76A852' },
  '/magazine': { base: '#7A2E73', hover: '#9C4A94' },
  '/vetrinart': { base: '#C99A2E', hover: '#E0B449' },
  '/cartographie': { base: '#C99A2E', hover: '#E0B449' },
  '/communaute': { base: '#147070', hover: '#1E9090' },
  '/contact': { base: '#147070', hover: '#1E9090' },
  '/participer': { base: '#C0392B', hover: '#D9594B' },
}

// Brand terracotta — fallback accent for pages outside the section map
// (home, login, register, …).
export const DEFAULT_SECTION_COLOR: SectionColor = {
  base: '#C4622D',
  hover: '#E07B54',
}

// Routes whose hero/top section is dark — the header sits on dark and uses light text.
// All other routes are light-topped and get a light header.
// Content sections whose LISTING page has a dark hero (bg-bsmk-black at the top),
// but whose DETAIL page (`/<section>/<slug>`) is light-topped (bg-bsmk-white).
// The header is dark/transparent over the dark hero, and light over the detail pages.
const LIGHT_DETAIL_SECTIONS = [
  '/programmes',
  '/espaces',
  '/agenda',
  '/vetrinart',
  '/magazine',
  '/disciplines',
]

/**
 * True when the page at `pathname` has a DARK hero at the top, so the header
 * should be light-on-dark (transparent → dark when scrolled).
 *
 * Reality of this site: every top-level/listing page (home, /bsmk, the content
 * listings, /contact, /login, /register, …) opens with a `bg-bsmk-black` hero.
 * The ONLY light-topped pages are the content DETAIL pages — `/<section>/<slug>`
 * — which start with `bg-bsmk-white`. So a page is light-topped iff it is a
 * detail page under one of the content sections; everything else is dark-hero.
 */
export function hasDarkHero(pathname: string): boolean {
  // A light-topped detail page looks like `/<section>/<slug>` (exactly one extra segment).
  const isLightDetail = LIGHT_DETAIL_SECTIONS.some(section => {
    if (!pathname.startsWith(section + '/')) return false
    const rest = pathname.slice(section.length + 1)
    return rest.length > 0 && !rest.includes('/') // exactly one segment after the section
  })
  return !isLightDetail
}

/** Resolve a pathname to its section accent, falling back to terracotta. */
export function getSectionColor(pathname: string): SectionColor {
  let match: { prefix: string; color: SectionColor } | null = null
  for (const [prefix, color] of Object.entries(SECTION_COLORS)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      if (!match || prefix.length > match.prefix.length) {
        match = { prefix, color }
      }
    }
  }
  return match?.color ?? DEFAULT_SECTION_COLOR
}

/** "#C4622D" -> "196 98 45" for use in `rgb(var(--page-accent) / <alpha>)`. */
export function hexToRgbChannels(hex: string): string {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `${r} ${g} ${b}`
}
