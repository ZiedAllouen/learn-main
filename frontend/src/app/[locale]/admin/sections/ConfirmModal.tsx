'use client'

import { useEffect, useRef } from 'react'

interface ConfirmModalProps {
  open: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  destructive,
  loading,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    confirmRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  const confirmCls = destructive
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-page-accent hover:bg-page-accent/90'

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-bsmk-white border border-bsmk-black/10 rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="font-display text-lg text-bsmk-black">{title}</h3>
        {message && <p className="text-sm text-bsmk-black/60 mt-2">{message}</p>}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="text-bsmk-black/60 hover:text-bsmk-black px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`${confirmCls} disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors`}
          >
            {loading ? '…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
