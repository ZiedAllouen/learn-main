import type { Metadata } from 'next'
import { AdminDashboardClient } from './AdminDashboardClient'

export const metadata: Metadata = {
  title: 'Administration | BSMK',
}

export default function AdminPage() {
  return <AdminDashboardClient />
}
