'use client'

import { useState } from 'react'
import Link from 'next/link'

export function RegisterForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.message ?? 'Erreur lors de la création du compte.')
        return
      }
      window.location.href = '/login'
    } catch {
      setError('Impossible de joindre le serveur. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'bg-white/5 border border-white/10 text-bsmk-white placeholder-white/20 rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:border-bsmk-sand/60 focus:bg-white/8 transition-colors'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="px-4 py-3 bg-red-900/30 border border-red-500/40 rounded-lg">
          <p className="text-sm text-red-400 font-sans">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="firstName" className="text-xs tracking-widest uppercase text-bsmk-white/40 font-sans">
            Prénom
          </label>
          <input
            id="firstName"
            type="text"
            value={form.firstName}
            onChange={set('firstName')}
            required
            autoComplete="given-name"
            placeholder="Prénom"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="lastName" className="text-xs tracking-widest uppercase text-bsmk-white/40 font-sans">
            Nom
          </label>
          <input
            id="lastName"
            type="text"
            value={form.lastName}
            onChange={set('lastName')}
            required
            autoComplete="family-name"
            placeholder="Nom"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs tracking-widest uppercase text-bsmk-white/40 font-sans">
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={set('email')}
          required
          autoComplete="email"
          placeholder="vous@exemple.tn"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-xs tracking-widest uppercase text-bsmk-white/40 font-sans">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={set('password')}
          required
          autoComplete="new-password"
          placeholder="8 caractères minimum"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="confirm" className="text-xs tracking-widest uppercase text-bsmk-white/40 font-sans">
          Confirmer le mot de passe
        </label>
        <input
          id="confirm"
          type="password"
          value={form.confirm}
          onChange={set('confirm')}
          required
          autoComplete="new-password"
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-bsmk-white text-bsmk-black text-sm font-medium tracking-wide py-3.5 rounded-lg hover:bg-bsmk-sand transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
      >
        {loading ? 'Création…' : 'Créer le compte'}
      </button>

      <p className="text-xs text-center text-bsmk-white/30 font-sans">
        Déjà membre ?{' '}
        <Link href="/login" className="text-bsmk-sand hover:text-bsmk-white transition-colors underline underline-offset-4">
          Se connecter
        </Link>
      </p>
    </form>
  )
}
