'use client'

import { usePathname } from 'next/navigation'
import { getSectionColor, hexToRgbChannels } from '@/lib/sectionColors'

/**
 * Sets the `--page-accent` / `--page-accent-hover` CSS variables on its wrapper
 * based on the current route, so all page content can "follow" the same color as
 * the header stripe (via the Tailwind `page-accent` color).
 *
 * Rendered as a plain <div> wrapper (display: contents) so it doesn't affect layout.
 */
export function PageAccent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { base, hover } = getSectionColor(pathname)

  return (
    <div
      className="contents"
      style={
        {
          '--page-accent': hexToRgbChannels(base),
          '--page-accent-hover': hexToRgbChannels(hover),
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
