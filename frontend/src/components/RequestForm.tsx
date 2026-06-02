'use client'

import { useState } from 'react'
import { submitRequest, type RequestType } from '@/lib/api/requests'

interface RequestFormProps {
  type: RequestType
  programId?: string
  spaceId?: string
  submitLabel: string
  details?: Record<string, unknown>
}

const inputClasses =
  'w-full rounded-lg border border-bsmk-black/15 bg-white px-4 py-2 text-bsmk-black ' +
  'placeholder:text-bsmk-black/40 focus:border-page-accent focus:outline-none focus:ring-1 focus:ring-page-accent'

const labelClasses = 'block text-xs tracking-widest uppercase text-bsmk-black/60 mb-2'

// Static id prefix keeps inputs associated with their labels. If two RequestForms
// render on the same page the ids would collide; acceptable for MVP.
const idPrefix = 'rf'

export function RequestForm({ type, programId, spaceId, submitLabel, details }: RequestFormProps) {
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
        ...(details ? { details } : {}),
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
      <div>
        <label htmlFor={`${idPrefix}-name`} className={labelClasses}>
          Nom complet <span aria-hidden="true" className="text-page-accent">*</span>
        </label>
        <input
          id={`${idPrefix}-name`}
          name="name"
          type="text"
          required
          autoComplete="name"
          aria-required="true"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Votre nom et prénom"
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-email`} className={labelClasses}>
          Adresse email <span aria-hidden="true" className="text-page-accent">*</span>
        </label>
        <input
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-required="true"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-phone`} className={labelClasses}>
          Téléphone
        </label>
        <input
          id={`${idPrefix}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Téléphone (optionnel)"
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-message`} className={labelClasses}>
          Message
        </label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Votre message (optionnel)"
          rows={4}
          className={inputClasses}
        />
      </div>
      <p className="text-xs text-bsmk-black/40">
        Les champs marqués <span className="text-page-accent">*</span> sont obligatoires.
      </p>
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
