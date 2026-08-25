import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EvasiveButtonProps {
  isValid: boolean
  loading?: boolean
  label?: string
  loadingLabel?: string
  type?: 'submit' | 'button'
  onClick?: () => void
}

const EVADE_RADIUS = 100
const PULL_FACTOR = 0.6
const PADDING = 6

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

/**
 * The Evasive Login Button — GymAI's signature interaction.
 * While the form is incomplete, the button gently slides away from an
 * approaching cursor, staying fully inside its container. Once both
 * fields are valid it settles back to center and behaves like a normal
 * button. Evasion is disabled for keyboard focus, touch/coarse pointers,
 * and prefers-reduced-motion, so the control is always usable.
 */
export function EvasiveButton({
  isValid,
  loading,
  label = 'Log in',
  loadingLabel = 'Authenticating…',
  type = 'submit',
  onClick,
}: EvasiveButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const boundsRef = useRef({ maxX: 0, maxY: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [reduceMotion, setReduceMotion] = useState(false)
  const [coarsePointer, setCoarsePointer] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerQuery = window.matchMedia('(pointer: coarse)')
    setReduceMotion(motionQuery.matches)
    setCoarsePointer(pointerQuery.matches)
    const onMotionChange = () => setReduceMotion(motionQuery.matches)
    motionQuery.addEventListener('change', onMotionChange)
    return () => motionQuery.removeEventListener('change', onMotionChange)
  }, [])

  const evasive = !isValid && !loading && !reduceMotion && !coarsePointer && !focused

  useEffect(() => {
    if (!evasive) {
      setOffset({ x: 0, y: 0 })
      return
    }

    const container = containerRef.current
    const button = buttonRef.current
    if (!container || !button) return

    const containerRect = container.getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()
    boundsRef.current = {
      maxX: Math.max(0, (containerRect.width - buttonRect.width) / 2 - PADDING),
      maxY: Math.max(0, (containerRect.height - buttonRect.height) / 2 - PADDING),
    }

    const handleMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = cx - e.clientX
      const dy = cy - e.clientY
      const dist = Math.hypot(dx, dy)

      if (dist < EVADE_RADIUS) {
        const push = (EVADE_RADIUS - dist) * PULL_FACTOR
        const ux = dx / (dist || 1)
        const uy = dy / (dist || 1)
        const { maxX, maxY } = boundsRef.current
        setOffset((prev) => ({
          x: clamp(prev.x + ux * push, -maxX, maxX),
          y: clamp(prev.y + uy * push, -maxY, maxY),
        }))
      }
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [evasive])

  return (
    <div ref={containerRef} className="relative flex h-24 w-full items-center justify-center">
      <motion.button
        ref={buttonRef}
        type={type}
        onClick={onClick}
        disabled={loading}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.7 }}
        className={cn(
          'inline-flex min-w-[180px] items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-semibold transition-colors duration-200 disabled:cursor-not-allowed',
          isValid
            ? 'bg-emerald text-charcoal hover:bg-emerald-light shadow-emerald'
            : 'bg-surface-raised text-ink-muted border border-surface-borderStrong'
        )}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> {loadingLabel}
          </>
        ) : (
          <>
            {label} <ArrowRight size={16} />
          </>
        )}
      </motion.button>
    </div>
  )
}
