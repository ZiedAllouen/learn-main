'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { ChangePasswordForm } from './ChangePasswordForm'

export default function ProfilPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)

  useEffect(() => {
    const u = getAuthUser()
    if (!u) {
      router.replace('/login?redirect=/profil')
      return
    }
    setUser(u)
  }, [router])

  if (!user) return null

  return (
    <main className="min-h-screen bg-bsmk-white">
      <div className="max-w-xl mx-auto px-8 py-16">
        <div className="mb-8">
          <div className="flex gap-1 mb-6">
            <div className="w-6 h-1 rounded-full bg-page-accent" />
          </div>
          <h1 className="font-display text-3xl text-bsmk-black mb-2">Mon profil</h1>
          <p className="font-sans text-sm text-bsmk-black/50">{user.email}</p>
        </div>

        <div className="bg-bsmk-white border border-bsmk-black/10 rounded-2xl p-8">
          <h2 className="font-sans text-sm font-medium tracking-wide text-bsmk-black mb-6">
            Changer le mot de passe
          </h2>
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  )
}
