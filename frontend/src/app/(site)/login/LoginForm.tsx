'use client'

import { useState } from 'react'
import Link from 'next/link'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.message ?? 'Identifiants incorrects')
        return
      }
      if (data.accessToken) localStorage.setItem('accessToken', data.accessToken)
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)
      // Prefer a safe same-origin return path (?redirect=) over the role-based
      // default. Reject open-redirects: must be a relative path, not
      // protocol-relative (//) and not absolute (contains ://).
      const raw = new URLSearchParams(window.location.search).get('redirect')
      const safe = raw && raw.startsWith('/') && !raw.startsWith('//') && !raw.includes('://') ? raw : null
      try {
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]))
        const fallback = payload.role === 'ADMIN' ? '/admin' : '/'
        window.location.href = safe ?? fallback
      } catch {
        window.location.href = safe ?? '/'
      }
    } catch {
      setError('Impossible de joindre le serveur. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="px-4 py-3 bg-red-900/30 border border-red-500/40 rounded-lg">
          <p className="text-sm text-red-400 font-sans">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs tracking-widest uppercase text-bsmk-white/40 font-sans">
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="vous@exemple.tn"
          className="bg-white/5 border border-white/10 text-bsmk-white placeholder-white/20 rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:border-bsmk-sand/60 focus:bg-white/8 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-xs tracking-widest uppercase text-bsmk-white/40 font-sans">
            Mot de passe
          </label>
          <Link
            href="/login/reset"
            className="text-xs text-bsmk-white/30 hover:text-bsmk-sand transition-colors font-sans"
          >
            Oublié ?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="bg-white/5 border border-white/10 text-bsmk-white placeholder-white/20 rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:border-bsmk-sand/60 focus:bg-white/8 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-bsmk-white text-bsmk-black text-sm font-medium tracking-wide py-3.5 rounded-lg hover:bg-bsmk-sand transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
      >
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  )
}
