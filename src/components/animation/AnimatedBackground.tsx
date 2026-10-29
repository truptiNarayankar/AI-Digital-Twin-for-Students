import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'
import type { AnimatedBackgroundProps } from '@/types'

interface Particle {
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.2,
  }))
}

const PARTICLE_COUNTS: Record<string, number> = {
  low: 8,
  medium: 14,
  high: 20,
}

export function AnimatedBackground({
  variant = 'hero',
  intensity = 'medium',
  className,
}: AnimatedBackgroundProps) {
  const reduced = usePrefersReducedMotion()
  const particleCount = PARTICLE_COUNTS[intensity]
  const particles = useMemo(() => generateParticles(particleCount), [particleCount])

  const showGrid = variant === 'dashboard' || variant === 'minimal'
  const showBlobs = variant === 'hero' || variant === 'dashboard'
  const showParticles = variant === 'hero' && !reduced

  return (
    <div
      className={cn('fixed inset-0 overflow-hidden pointer-events-none z-0', className)}
      aria-hidden="true"
    >
      {/* Deep radial background glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, hsl(252 100% 68% / 0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, hsl(192 100% 55% / 0.06) 0%, transparent 50%), radial-gradient(ellipse 50% 50% at 20% 60%, hsl(280 90% 65% / 0.05) 0%, transparent 50%)',
        }}
      />

      {/* Animated gradient blobs */}
      {showBlobs && !reduced && (
        <>
          <div
            className="animated-bg-element absolute rounded-full blur-[120px] opacity-20"
            style={{
              width: '60vmax',
              height: '60vmax',
              top: '-20%',
              left: '-10%',
              background: 'radial-gradient(circle, hsl(252 100% 68% / 0.6) 0%, transparent 70%)',
              animation: 'blobMove1 18s ease-in-out infinite',
            }}
          />
          <div
            className="animated-bg-element absolute rounded-full blur-[100px] opacity-15"
            style={{
              width: '50vmax',
              height: '50vmax',
              top: '30%',
              right: '-15%',
              background: 'radial-gradient(circle, hsl(192 100% 55% / 0.5) 0%, transparent 70%)',
              animation: 'blobMove2 22s ease-in-out infinite',
            }}
          />
          <div
            className="animated-bg-element absolute rounded-full blur-[130px] opacity-10"
            style={{
              width: '45vmax',
              height: '45vmax',
              bottom: '-20%',
              left: '20%',
              background: 'radial-gradient(circle, hsl(280 90% 65% / 0.5) 0%, transparent 70%)',
              animation: 'blobMove3 25s ease-in-out infinite',
            }}
          />
        </>
      )}

      {/* Static blobs for reduced motion */}
      {showBlobs && reduced && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              'radial-gradient(ellipse 50% 50% at 20% 20%, hsl(252 100% 68% / 0.4) 0%, transparent 60%)',
          }}
        />
      )}

      {/* Grid pattern overlay */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {/* Hero dot grid */}
      {variant === 'hero' && (
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      )}

      {/* Floating particles */}
      {showParticles && particles.map((p, i) => (
        <div
          key={i}
          className="animated-bg-element absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: i % 3 === 0
              ? 'hsl(252 100% 68%)'
              : i % 3 === 1
              ? 'hsl(192 100% 55%)'
              : 'hsl(280 90% 65%)',
            opacity: p.opacity,
            animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
            boxShadow: `0 0 ${p.size * 2}px currentColor`,
          }}
        />
      ))}

      {/* Top edge glow line */}
      {variant === 'hero' && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, hsl(252 100% 68% / 0.5) 30%, hsl(192 100% 55% / 0.5) 70%, transparent 100%)',
          }}
        />
      )}
    </div>
  )
}
