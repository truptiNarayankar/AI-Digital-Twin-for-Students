import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

// ============================================================
// SHARED ANIMATION VARIANTS
// ============================================================
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
}

export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 },
}

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
}

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

// ============================================================
// FADE IN
// ============================================================
interface AnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function FadeIn({ children, className, delay = 0, duration = 0.5 }: AnimationProps) {
  const reduced = usePrefersReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={reduced ? {} : fadeInVariants}
      transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================
// SLIDE UP
// ============================================================
export function SlideUp({ children, className, delay = 0, duration = 0.5 }: AnimationProps) {
  const reduced = usePrefersReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={reduced ? {} : slideUpVariants}
      transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================
// SCALE IN
// ============================================================
export function ScaleIn({ children, className, delay = 0, duration = 0.4 }: AnimationProps) {
  const reduced = usePrefersReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      variants={reduced ? {} : scaleInVariants}
      transition={{ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================
// STAGGER CONTAINER
// ============================================================
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({ children, className, staggerDelay = 0.08 }: StaggerContainerProps) {
  const reduced = usePrefersReducedMotion()
  const variants: Variants = reduced ? {} : {
    hidden: {},
    visible: { transition: { staggerChildren: staggerDelay, delayChildren: 0.1 } },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

// ============================================================
// PAGE TRANSITION
// ============================================================
interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const reduced = usePrefersReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? {} : { opacity: 0, y: -8 }}
      transition={{ duration: reduced ? 0 : 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================
// FLOATING ELEMENT
// ============================================================
interface FloatingElementProps {
  children: ReactNode
  className?: string
  amplitude?: number
  duration?: number
}

export function FloatingElement({
  children,
  className,
  amplitude = 12,
  duration = 5,
}: FloatingElementProps) {
  const reduced = usePrefersReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================
// ANIMATED COUNTER
// ============================================================
import { useEffect, useState, useRef } from 'react'

interface AnimatedCounterProps {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
  className?: string
}

export function AnimatedCounter({
  target,
  duration = 2,
  suffix = '',
  prefix = '',
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    if (reduced) {
      setCount(target)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          const startTime = performance.now()
          const step = (currentTime: number) => {
            const elapsed = (currentTime - startTime) / (duration * 1000)
            const progress = Math.min(elapsed, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
            setCount(eased * target)
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration, reduced])

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  )
}
