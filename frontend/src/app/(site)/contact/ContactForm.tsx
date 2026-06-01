'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ScaleIn } from '@/components/ui/Motion'

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

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // In a real project this would call an API route or server action
    setSubmitted(true)
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
          placeholder="votre@email.com"
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
          placeholder="Décrivez votre demande…"
          className="w-full border border-bsmk-sand/60 bg-bsmk-white px-4 py-3 text-bsmk-black placeholder:text-bsmk-black/30 focus:outline-none focus:border-page-accent transition-colors text-sm resize-y rounded-md"
        />
      </div>

      <p className="text-xs text-bsmk-black/40">
        Les champs marqués <span className="text-page-accent">*</span> sont obligatoires.
      </p>

      <motion.div whileTap={{ scale: 0.97 }} className="inline-block w-full sm:w-auto">
        <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
          Envoyer le message
        </Button>
      </motion.div>
    </form>
    </ScaleIn>
  )
}
