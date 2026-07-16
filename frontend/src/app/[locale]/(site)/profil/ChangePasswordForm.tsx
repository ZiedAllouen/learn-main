'use client'

import { useState } from 'react'
import { getAccessToken } from '@/lib/auth'

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirm) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    setLoading(true)
    try {
      const token = getAccessToken()
      if (!token) {
        setError('Vous devez être connecté')
        return
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.message ?? 'Erreur lors du changement de mot de passe')
        return
      }

      setSuccess('Mot de passe modifié avec succès')
      setCurrentPassword('')
      setNewPassword('')
      setConfirm('')
    } catch {
      setError('Impossible de joindre le serveur. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-sans">{error}</p>
        </div>
      )}

      {success && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600 font-sans">{success}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="currentPassword" className="text-xs tracking-widest uppercase text-bsmk-black/50 font-sans">
          Mot de passe actuel
        </label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="bg-white border border-bsmk-black/15 text-bsmk-black placeholder-bsmk-black/30 rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:border-page-accent transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="newPassword" className="text-xs tracking-widest uppercase text-bsmk-black/50 font-sans">
          Nouveau mot de passe
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          autoComplete="new-password"
          placeholder="••••••••"
          className="bg-white border border-bsmk-black/15 text-bsmk-black placeholder-bsmk-black/30 rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:border-page-accent transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword" className="text-xs tracking-widest uppercase text-bsmk-black/50 font-sans">
          Confirmer le mot de passe
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
          placeholder="••••••••"
          className="bg-white border border-bsmk-black/15 text-bsmk-black placeholder-bsmk-black/30 rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:border-page-accent transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-page-accent text-white text-sm font-medium tracking-wide py-3.5 rounded-lg hover:bg-page-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
      >
        {loading ? 'Modification…' : 'Modifier le mot de passe'}
      </button>
    </form>
  )
}
