'use client'

import dynamic from 'next/dynamic'

const ArtistSpace = dynamic(
  () => import('./ArtistSpace').then(m => ({ default: m.ArtistSpace })),
  { ssr: false },
)

export function ArtistSpaceClient() {
  return <ArtistSpace />
}
