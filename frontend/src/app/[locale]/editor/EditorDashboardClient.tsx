'use client'

import dynamic from 'next/dynamic'

const EditorDashboard = dynamic(
  () => import('./EditorDashboard').then(m => ({ default: m.EditorDashboard })),
  { ssr: false },
)

export function EditorDashboardClient() {
  return <EditorDashboard />
}
