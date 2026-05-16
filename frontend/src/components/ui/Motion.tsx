'use client'

import { motion, useInView, useMotionValue, useSpring, useTransform, type Variants, type HTMLMotionProps } from 'framer-motion'
import { useRef, useEffect, type ReactNode } from 'react'

// ── Shared variants ──────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

export const staggerSlow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
}

// ── Viewport defaults ────────────────────────────────────────────────────────

const VP = { once: true, margin: '-72px' }

// ── Components ───────────────────────────────────────────────────────────────

interface Props {
  children: ReactNode
  className?: string
  delay?: number
}

/** Single element that fades up when it enters the viewport */
export function FadeUp({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Simple opacity fade */
export function FadeIn({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Scale + fade — good for images / cards */
export function ScaleIn({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Slide in from the left */
export function SlideRight({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      variants={slideRight}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Stagger container — children that use motion.* or the *Item variants
 * animate in sequence.
 */
export function StaggerContainer({
  children,
  className,
  slow = false,
}: Props & { slow?: boolean }) {
  return (
    <motion.div
      variants={slow ? staggerSlow : stagger}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Child of StaggerContainer — fades up in sequence */
export function StaggerItem({ children, className }: Props) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  )
}

/** Hero text entrance — triggers immediately (no scroll needed) */
export function HeroText({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Wraps a motion.div with hover-lift for interactive cards */
export function CardHover({
  children,
  className,
}: Props) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Slide in from the right (mirror of SlideRight) */
export function SlideLeft({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Animated number counter that counts up when entering the viewport */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 60, damping: 18 })
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString('fr-FR'))

  useEffect(() => {
    if (isInView) motionValue.set(value)
  }, [isInView, value, motionValue])

  return <motion.span ref={ref} className={className}>{display}</motion.span>
}

/** Infinite horizontal scrolling text ribbon */
export function Marquee({ items, className, speed = 25 }: { items: string[]; className?: string; speed?: number }) {
  return (
    <div className={`overflow-hidden${className ? ` ${className}` : ''}`}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center shrink-0">
            <span>{item}</span>
            <span className="mx-8 opacity-30">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
