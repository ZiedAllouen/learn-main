'use client'

import { motion, useInView, useMotionValue, useSpring, useTransform, useScroll, AnimatePresence, type Variants } from 'framer-motion'
import { useRef, useEffect, useState, useCallback, type ReactNode } from 'react'

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

// ── New animation primitives ──────────────────────────────────────────────────

/** Fade + blur-in — elements appear as if coming into focus */
export function BlurIn({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={VP}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Slide up with scale — snappier than FadeUp, good for cards entering */
export function SlideUp({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={VP}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Parallax wrapper — content shifts vertically based on scroll position */
export function Parallax({
  children,
  className,
  offset = 50,
}: {
  children: ReactNode
  className?: string
  offset?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

/** Animated section divider — a line that draws itself when entering view */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={`flex justify-center py-2${className ? ` ${className}` : ''}`}>
      <motion.div
        className="h-px bg-bsmk-sand/40"
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        viewport={VP}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

/** Floating decorative dot — ambient motion for visual richness */
export function FloatingDot({
  className,
  delay = 0,
  size = 6,
}: {
  className?: string
  delay?: number
  size?: number
}) {
  return (
    <motion.div
      className={`absolute rounded-full bg-page-accent/20${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size }}
      animate={{
        y: [0, -12, 0],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

/** Magnetic hover — element subtly follows the cursor when hovered */
export function MagneticHover({
  children,
  className,
  strength = 0.3,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      x.set((e.clientX - centerX) * strength)
      y.set((e.clientY - centerY) * strength)
    },
    [x, y, strength],
  )

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Inline-safe wrappers (for use in Server Components) ──────────────────────

/** Bouncing scroll indicator */
export function ScrollIndicator({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span>Défiler pour explorer</span>
      <span className="text-lg">↓</span>
    </motion.div>
  )
}

/** Icon that scales up on hover — use inside StaggerItem etc. */
export function IconHover({ children, className }: Props) {
  return (
    <motion.span
      className={className}
      whileHover={{ scale: 1.3, rotate: 10 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.span>
  )
}

/** Stat card with subtle hover background */
export function StatCard({ children, className }: Props) {
  return (
    <motion.div
      className={className}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

/** Arrow / span that slides right on hover */
export function HoverSlide({ children, className }: Props) {
  return (
    <motion.span
      className={className}
      whileHover={{ x: 4 }}
    >
      {children}
    </motion.span>
  )
}

/** Date block that scales on hover */
export function HoverScale({ children, className }: Props) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  )
}

// ── Carousel ─────────────────────────────────────────────────────────────────

interface CarouselSlide {
  id: string | number
  image: string
  title: string
  subtitle?: string
  href?: string
  badge?: string
}

export function Carousel({
  slides,
  autoPlayInterval = 5000,
  className,
}: {
  slides: CarouselSlide[]
  autoPlayInterval?: number
  className?: string
}) {
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const paginate = useCallback(
    (newDirection: number) => {
      setActiveIndex(([prev]) => {
        const next = (prev + newDirection + slides.length) % slides.length
        return [next, newDirection]
      })
    },
    [slides.length],
  )

  const goTo = useCallback((index: number) => {
    setActiveIndex(([prev]) => [index, index > prev ? 1 : -1])
  }, [])

  // Auto-play
  useEffect(() => {
    timerRef.current = setInterval(() => paginate(1), autoPlayInterval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paginate, autoPlayInterval])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => paginate(1), autoPlayInterval)
  }, [paginate, autoPlayInterval])

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
    }),
  }

  const slide = slides[activeIndex]

  return (
    <div
      className={`relative overflow-hidden rounded-2xl${className ? ` ${className}` : ''}`}
      onMouseEnter={() => {
        if (timerRef.current) clearInterval(timerRef.current)
      }}
      onMouseLeave={resetTimer}
    >
      {/* Slides */}
      <div className="relative aspect-[16/7] sm:aspect-[16/6]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) {
                paginate(1)
                resetTimer()
              } else if (info.offset.x > 50) {
                paginate(-1)
                resetTimer()
              }
            }}
          >
            {/* Background image */}
            <div className="absolute inset-0 bg-bsmk-black">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bsmk-black/80 via-bsmk-black/20 to-transparent" />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-16">
              {slide.badge && (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="inline-flex items-center self-start px-3 py-1 mb-4 text-xs font-medium tracking-widest uppercase rounded-full bg-page-accent/90 text-white"
                >
                  {slide.badge}
                </motion.span>
              )}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-3 max-w-2xl"
              >
                {slide.title}
              </motion.h3>
              {slide.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-white/70 text-lg max-w-xl"
                >
                  {slide.subtitle}
                </motion.p>
              )}
              {slide.href && (
                <motion.a
                  href={slide.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="mt-6 inline-flex items-center self-start px-6 py-3 text-sm font-medium tracking-wide bg-page-accent text-white rounded-lg hover:bg-page-accent/90 transition-colors"
                >
                  Découvrir →
                </motion.a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => { paginate(-1); resetTimer() }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        onClick={() => { paginate(1); resetTimer() }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Next slide"
      >
        →
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); resetTimer() }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'bg-white w-6'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ── Testimonials Carousel ────────────────────────────────────────────────────

interface Testimonial {
  id: string | number
  quote: string
  author: string
  role?: string
  avatar?: string
}

export function TestimonialsCarousel({
  items,
  autoPlayInterval = 6000,
  className,
}: {
  items: Testimonial[]
  autoPlayInterval?: number
  className?: string
}) {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const paginate = useCallback(
    (dir: number) => {
      setDirection(dir)
      setActive((prev) => (prev + dir + items.length) % items.length)
    },
    [items.length],
  )

  useEffect(() => {
    timerRef.current = setInterval(() => paginate(1), autoPlayInterval)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paginate, autoPlayInterval])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => paginate(1), autoPlayInterval)
  }, [paginate, autoPlayInterval])

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  }

  const item = items[active]

  return (
    <div className={`relative${className ? ` ${className}` : ''}`}>
      <div className="relative min-h-[200px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.blockquote
            key={item.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <p className="text-xl sm:text-2xl font-display italic text-bsmk-white/90 leading-relaxed mb-6">
              &ldquo;{item.quote}&rdquo;
            </p>
            <footer className="flex items-center gap-4">
              {item.avatar && (
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-12 h-12 rounded-full object-cover border-2 border-page-accent/30"
                />
              )}
              <div>
                <cite className="not-italic font-medium text-bsmk-white">{item.author}</cite>
                {item.role && (
                  <p className="text-sm text-bsmk-white/50">{item.role}</p>
                )}
              </div>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={() => { paginate(-1); resetTimer() }}
          className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
          aria-label="Previous testimonial"
        >
          ←
        </button>
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > active ? 1 : -1)
                setActive(i)
                resetTimer()
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'bg-page-accent w-6' : 'bg-white/20 w-1.5 hover:bg-white/40'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => { paginate(1); resetTimer() }}
          className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
          aria-label="Next testimonial"
        >
          →
        </button>
      </div>
    </div>
  )
}

// ── Scroll text reveal ───────────────────────────────────────────────────────

/** Splits text into words and animates each in on scroll with a stagger */
export function ScrollTextReveal({
  text,
  className,
  as: Tag = 'h2',
}: {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}) {
  const words = text.split(' ')

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={VP}
            transition={{
              duration: 0.5,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

// ── Scroll progress bar ──────────────────────────────────────────────────────

/** Thin progress bar at the top of the page showing scroll position */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-[3px] bg-page-accent origin-left z-[60]${className ? ` ${className}` : ''}`}
      style={{ scaleX }}
    />
  )
}

// ── Decorative clip-path shapes ──────────────────────────────────────────────

/** Organic blob shape — pure CSS, used as background decoration */
export function DecorativeBlob({
  className,
  color = 'rgb(var(--page-accent) / 0.06)',
  size = 400,
}: {
  className?: string
  color?: string
  size?: number
}) {
  return (
    <div
      className={`absolute pointer-events-none${className ? ` ${className}` : ''}`}
      style={{
        width: size,
        height: size,
        background: color,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        filter: 'blur(40px)',
      }}
    />
  )
}

/** Arch shape — CSS clip-path for section decorations */
export function DecorativeArch({
  className,
  color = 'rgb(var(--page-accent) / 0.04)',
}: {
  className?: string
  color?: string
}) {
  return (
    <div
      className={`absolute pointer-events-none${className ? ` ${className}` : ''}`}
      style={{
        width: 300,
        height: 600,
        background: color,
        clipPath: 'polygon(0% 100%, 0% 30%, 15% 10%, 35% 0%, 65% 0%, 85% 10%, 100% 30%, 100% 100%)',
      }}
    />
  )
}
