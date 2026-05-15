import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ContainerProps {
  className?: string
  children: ReactNode
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer'
  narrow?: boolean
}

export function Container({ className, children, as: Tag = 'div', narrow }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto px-6 lg:px-8', narrow ? 'max-w-4xl' : 'max-w-7xl', className)}>
      {children}
    </Tag>
  )
}
