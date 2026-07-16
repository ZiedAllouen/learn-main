'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface ToastState {
  message: string
  kind: 'success' | 'error'
}

/**
 * Lightweight, dependency-free toast for the admin dashboard.
 * Auto-dismisses after ~3.5s; a new toast replaces the current one and resets
 * the timer. The timeout is cleared on unmount.
 */
export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string, kind: 'success' | 'error') => {
    if (timer.current) clearTimeout(timer.current)
    setToast({ message, kind })
    timer.current = setTimeout(() => setToast(null), 3500)
  }, [])

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  return { toast, showToast }
}

export function ToastView({ toast }: { toast: ToastState | null }) {
  if (!toast) return null
  const styles = toast.kind === 'success' ? 'bg-bsmk-olive/95' : 'bg-red-600/95'
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[100] ${styles} text-white text-sm px-4 py-3 rounded-xl shadow-2xl max-w-sm`}
    >
      {toast.message}
    </div>
  )
}
