'use client'

import dynamic from 'next/dynamic'

// Leaflet needs the browser DOM, so render it client-side only.
const LocationMap = dynamic(
  () => import('./LocationMap').then(m => ({ default: m.LocationMap })),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 sm:h-80 lg:h-96 w-full rounded-xl bg-bsmk-sand/40 animate-pulse" />
    ),
  },
)

export function LocationMapClient() {
  return <LocationMap />
}
