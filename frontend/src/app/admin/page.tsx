import type { Metadata } from 'next'
import { AdminDashboard } from './AdminDashboard'

export const metadata: Metadata = {
  title: 'Administration | BSMK',
}

export default function AdminPage() {
  return <AdminDashboard />
}
