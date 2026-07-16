import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PageAccent } from '@/components/layout/PageAccent'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageAccent>
      <Header />
      {children}
      <Footer />
    </PageAccent>
  )
}
