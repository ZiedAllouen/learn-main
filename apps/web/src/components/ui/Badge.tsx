import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'terracotta' | 'olive' | 'blue' | 'outline' | 'dark'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-bsmk-sand/20 text-bsmk-black',
  terracotta: 'bg-bsmk-terracotta/10 text-bsmk-terracotta',
  olive: 'bg-bsmk-olive/10 text-bsmk-olive',
  blue: 'bg-bsmk-blue/10 text-bsmk-blue',
  outline: 'border border-current',
  dark: 'bg-white/10 text-bsmk-white',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-xs font-medium tracking-widest uppercase rounded-full',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
