import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

interface ButtonAsButton extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  href?: undefined
}

interface ButtonAsLink extends BaseProps {
  href: string
  target?: string
  rel?: string
}

type ButtonProps = ButtonAsButton | ButtonAsLink

const variantClasses: Record<ButtonVariant, string> = {
  // Primary CTA follows the current section's accent (see PageAccent / --page-accent).
  primary: 'bg-page-accent text-white hover:bg-page-accent/90',
  secondary: 'bg-bsmk-white text-bsmk-black hover:bg-bsmk-sand',
  ghost: 'text-current hover:bg-white/10',
  outline: 'border border-current hover:bg-white/5',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center font-medium tracking-wide transition-colors rounded-lg',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )

  if ('href' in props && props.href) {
    const { href, target, rel, ...rest } = props as ButtonAsLink
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    )
  }

  const { href: _href, ...buttonProps } = props as ButtonAsButton & { href?: undefined }
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
