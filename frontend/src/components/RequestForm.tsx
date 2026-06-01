'use client'

import { useState } from 'react'
import { submitRequest, type RequestType } from '@/lib/api/requests'

interface RequestFormProps {
  type: RequestType
  programId?: string
  spaceId?: string
  submitLabel: string
}

const inputClasses =
  'w-full rounded-lg border border-bsmk-black/15 bg-white px-4 py-2 text-bsmk-black ' +
  'placeholder:text-bsmk-black/40 focus:border-page-accent focus:outline-none focus:ring-1 focus:ring-page-accent'

export function RequestForm({ type, programId, spaceId, submitLabel }: RequestFormProps) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    try {
      await submitRequest({
        type,
        programId,
        spaceId,
        name,
        email,
        ...(phone.trim() ? { phone: phone.trim() } : {}),
        ...(message.trim() ? { message: message.trim() } : {}),
      })
      setState('done')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <p className="rounded-lg bg-bsmk-olive/10 p-4 text-bsmk-black">
        Merci ! Votre demande a bien été reçue. Notre équipe vous répondra sous 48h.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom complet"
        className={inputClasses}
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className={inputClasses}
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Téléphone (optionnel)"
        className={inputClasses}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Votre message (optionnel)"
        rows={4}
        className={inputClasses}
      />
      {state === 'error' && <p className="text-sm text-red-600">Une erreur est survenue. Réessayez.</p>}
      <button
        type="submit"
        disabled={state === 'sending'}
        className="inline-flex items-center justify-center rounded-lg bg-page-accent px-6 py-2 font-medium tracking-wide text-white transition-colors hover:bg-page-accent/90 disabled:opacity-50"
      >
        {state === 'sending' ? 'Envoi…' : submitLabel}
      </button>
    </form>
  )
}
