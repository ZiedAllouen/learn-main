'use client'

import dynamic from 'next/dynamic'

const AdminDashboard = dynamic(
  () => import('./AdminDashboard').then(m => ({ default: m.AdminDashboard })),
  { ssr: false },
)

export function AdminDashboardClient() {
  return <AdminDashboard />
}
