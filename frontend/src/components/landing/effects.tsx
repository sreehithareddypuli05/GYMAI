import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/** Scroll-triggered reveal — a lightweight stand-in for React Bits' scroll-reveal patterns. */
export function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Static premium card surface — intentionally no cursor-follow animation. */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('relative overflow-hidden card-surface', className)}><div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-orange/10 blur-3xl" />{children}</div>
}

/** API-compatible wrapper without magnetic cursor movement. */
export function MagneticButton({ children, className }: { children: ReactNode; className?: string; strength?: number }) {
  return <div className={cn('inline-block', className)}>{children}</div>
}

/** Word-by-word reveal for headline text — React Bits-style animated text, re-themed for GymAI. */
export function AnimatedHeading({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mr-[0.28em]"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  )
}

/** Staggered list reveal — React Bits-style animated list, re-themed for GymAI. */
export function AnimatedList({ children, className }: { children: ReactNode[]; className?: string }) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

export function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let frame: number
    const duration = 900
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <span className="data-figure">
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}
