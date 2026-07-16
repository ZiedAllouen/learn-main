'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ScaleIn } from '@/components/ui/Motion'
import { submitRequest, type RequestType } from '@/lib/api/requests'

const subjectOptions = [
  { value: '', label: 'Choisir un sujet…' },
  { value: 'renseignements', label: 'Renseignements généraux' },
  { value: 'reservation', label: 'Réservation d\'espace' },
  { value: 'programme', label: 'Candidature programme' },
  { value: 'projet', label: 'Proposition de projet' },
  { value: 'vetrinart', label: 'Inscription VetrinArt' },
  { value: 'soutien', label: 'Soutien / mécénat' },
  { value: 'partenariat', label: 'Partenariat' },
  { value: 'presse', label: 'Presse' },
  { value: 'autre', label: 'Autre' },
]

const SUBJECT_TO_REQUEST_TYPE: Record<string, RequestType> = {
  renseignements: 'OPPORTUNITY',
  reservation: 'BOOKING',
  programme: 'ENROLLMENT',
  projet: 'PROJECT',
  vetrinart: 'ENROLLMENT',
  soutien: 'PARTNERSHIP',
  partenariat: 'PARTNERSHIP',
  presse: 'OPPORTUNITY',
  autre: 'OPPORTUNITY',
}

interface ContactFormProps {
  initialSubject?: string
}

function normalizeSubjectValue(value: string): string {
  const normalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

  if (subjectOptions.some((option) => option.value === normalized)) {
    return normalized
  }
  if (normalized.includes('reservation')) return 'reservation'
  if (normalized.includes('programme')) return 'programme'
  if (normalized.includes('projet')) return 'projet'
  if (normalized.includes('partenariat')) return 'partenariat'
  if (normalized.includes('soutien') || normalized.includes('mecenat')) return 'soutien'
  if (normalized.includes('presse')) return 'presse'
  if (normalized.includes('vetrinart')) return 'vetrinart'
  if (normalized.includes('renseignement') || normalized.includes('information')) return 'renseignements'

  return ''
}

export function ContactForm({ initialSubject = '' }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState(normalizeSubjectValue(initialSubject))
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSending(true)

    try {
      const trimmedSubject = subject.trim()
      const selectedSubject = subjectOptions.find((opt) => opt.value === trimmedSubject)

      await submitRequest({
        type: SUBJECT_TO_REQUEST_TYPE[trimmedSubject] ?? 'OPPORTUNITY',
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        message: message.trim(),
        details: {
          contactSubjectValue: trimmedSubject,
          contactSubjectLabel: selectedSubject?.label ?? trimmedSubject,
        },
      })
      setSubmitted(true)
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-bsmk-olive/10 border border-bsmk-olive/30 rounded-xl p-8 text-center">
        <div className="text-4xl font-display font-bold text-bsmk-olive mb-3">✓</div>
        <h3 className="text-xl font-display font-bold text-bsmk-black mb-2">
          Message envoyé
        </h3>
        <p className="text-bsmk-black/60">
          Nous avons bien reçu votre message. Notre équipe vous répondra dans les meilleurs délais.
        </p>
      </div>
    )
  }

  return (
    <ScaleIn>
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Nom complet */}
      <div>
        <label
          htmlFor="name"
          className="block text-xs tracking-widest uppercase text-bsmk-black/60 mb-2"
        >
          Nom complet <span aria-hidden="true" className="text-page-accent">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          aria-required="true"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Votre nom et prénom"
          className="w-full border border-bsmk-sand/60 bg-bsmk-white px-4 py-3 text-bsmk-black placeholder:text-bsmk-black/30 focus:outline-none focus:border-page-accent transition-colors text-sm rounded-md"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs tracking-widest uppercase text-bsmk-black/60 mb-2"
        >
          Adresse email <span aria-hidden="true" className="text-page-accent">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-required="true"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="w-full border border-bsmk-sand/60 bg-bsmk-white px-4 py-3 text-bsmk-black placeholder:text-bsmk-black/30 focus:outline-none focus:border-page-accent transition-colors text-sm rounded-md"
        />
      </div>

      {/* Téléphone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-xs tracking-widest uppercase text-bsmk-black/60 mb-2"
        >
          Téléphone <span aria-hidden="true" className="text-page-accent">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          aria-required="true"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+216 XX XXX XXX"
          className="w-full border border-bsmk-sand/60 bg-bsmk-white px-4 py-3 text-bsmk-black placeholder:text-bsmk-black/30 focus:outline-none focus:border-page-accent transition-colors text-sm rounded-md"
        />
      </div>

      {/* Sujet */}
      <div>
        <label
          htmlFor="subject"
          className="block text-xs tracking-widest uppercase text-bsmk-black/60 mb-2"
        >
          Sujet <span aria-hidden="true" className="text-page-accent">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          aria-required="true"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border border-bsmk-sand/60 bg-bsmk-white px-4 py-3 text-bsmk-black focus:outline-none focus:border-page-accent transition-colors text-sm appearance-none rounded-md"
        >
          {subjectOptions.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-xs tracking-widest uppercase text-bsmk-black/60 mb-2"
        >
          Message <span aria-hidden="true" className="text-page-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          aria-required="true"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Décrivez votre demande…"
          className="w-full border border-bsmk-sand/60 bg-bsmk-white px-4 py-3 text-bsmk-black placeholder:text-bsmk-black/30 focus:outline-none focus:border-page-accent transition-colors text-sm resize-y rounded-md"
        />
      </div>

      <p className="text-xs text-bsmk-black/40">
        Les champs marqués <span className="text-page-accent">*</span> sont obligatoires.
      </p>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <motion.div whileTap={{ scale: 0.97 }} className="inline-block w-full sm:w-auto">
        <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto" disabled={sending}>
          {sending ? 'Envoi…' : 'Envoyer le message'}
        </Button>
      </motion.div>
    </form>
    </ScaleIn>
  )
}
