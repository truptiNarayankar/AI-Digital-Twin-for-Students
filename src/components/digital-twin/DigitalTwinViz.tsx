import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Code2,
  FolderKanban,
  Sparkles,
  FileText,
  MessageSquare,
  TrendingUp,
  Brain,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TWIN_DIMENSIONS } from '@/constants'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

const ICON_MAP = {
  academic: GraduationCap,
  coding: Code2,
  projects: FolderKanban,
  skills: Sparkles,
  resume: FileText,
  interview: MessageSquare,
  career: TrendingUp,
}

interface DigitalTwinVizProps {
  className?: string
  interactive?: boolean
  scale?: number
  syncPercentage?: number
}

export function DigitalTwinViz({
  className,
  interactive = true,
  syncPercentage = 0,
}: DigitalTwinVizProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const reduced = usePrefersReducedMotion()

  // SVG coordinate constants
  const size = 560
  const center = size / 2
  const orbitRadius = 185

  return (
    <div
      className={cn(
        'relative flex items-center justify-center select-none w-full max-w-[560px] aspect-square mx-auto',
        className
      )}
    >
      {/* Background ambient glow behind center */}
      <div
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
        style={{
          background: activeNode
            ? TWIN_DIMENSIONS.find(d => d.id === activeNode)?.color || 'hsl(var(--primary))'
            : 'radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
        }}
      />

      {/* SVG Canvas for Rings, Grids, and Connection Beams */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full absolute inset-0 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="centerCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
            <stop offset="70%" stopColor="hsl(var(--surface))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(var(--surface-raised))" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="orbitLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Orbit track rings */}
        <circle
          cx={center}
          cy={center}
          r={orbitRadius}
          fill="none"
          stroke="url(#orbitLineGrad)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          className={reduced ? '' : 'animate-spin-slow origin-center'}
          style={{ animationDuration: '60s' }}
        />
        <circle
          cx={center}
          cy={center}
          r={orbitRadius * 0.65}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeDasharray="2 4"
          className="opacity-50"
        />
        <circle
          cx={center}
          cy={center}
          r={orbitRadius * 1.22}
          fill="none"
          stroke="hsl(var(--border-subtle))"
          strokeWidth="1"
          className="opacity-40"
        />

        {/* Connection rays from center to surrounding nodes */}
        {TWIN_DIMENSIONS.map((dim, idx) => {
          const angleRad = (dim.angle * Math.PI) / 180
          const x = center + orbitRadius * Math.cos(angleRad)
          const y = center + orbitRadius * Math.sin(angleRad)
          const isSelected = activeNode === dim.id

          return (
            <g key={`ray-${dim.id}`}>
              {/* Static background beam */}
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke={dim.color}
                strokeWidth={isSelected ? '2.5' : '1.2'}
                strokeOpacity={isSelected ? 0.9 : 0.25}
                strokeDasharray="4 4"
                className="transition-all duration-300"
              />

              {/* Animated pulse dot along beam */}
              {!reduced && (
                <motion.circle
                  r={isSelected ? 3.5 : 2}
                  fill={dim.color}
                  initial={{ cx: center, cy: center, opacity: 0 }}
                  animate={{
                    cx: [center, x],
                    cy: [center, y],
                    opacity: [0, 0.9, 0],
                  }}
                  transition={{
                    duration: 3 + (idx % 3) * 0.5,
                    repeat: Infinity,
                    delay: idx * 0.4,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* CENTER NODE: The Core AI Digital Twin */}
      <div className="absolute z-20 flex flex-col items-center justify-center">
        {/* Pulsating outer halo */}
        {!reduced && (
          <div className="absolute w-36 h-36 rounded-full border border-primary/30 animate-pulse-glow" />
        )}
        <div className="absolute w-44 h-44 rounded-full border border-dashed border-secondary/20 animate-spin-slow" />

        {/* Center core card */}
        <motion.div
          className="relative w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-2xl border-2 border-primary/40 glass cursor-pointer"
          style={{
            background: 'radial-gradient(circle at 35% 35%, hsl(var(--surface-raised)), hsl(var(--surface)))',
          }}
          whileHover={{ scale: 1.06 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          onMouseEnter={() => setActiveNode(null)}
        >
          {/* Animated Brain Icon */}
          <div className="relative flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary animate-pulse" />
            <div className="absolute inset-0 rounded-full blur-sm bg-primary/40 -z-10" />
          </div>

          <span className="mt-1 text-[11px] font-bold tracking-wider text-foreground uppercase font-display">
            AI Digital Twin
          </span>
          <span className="text-[9px] font-semibold text-secondary tracking-widest uppercase">
            Living Profile
          </span>

          {/* Core status badge */}
          <div className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-full bg-surface-raised border border-primary/40 text-[9px] font-semibold text-primary shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
            <span>{syncPercentage}% Sync</span>
          </div>
        </motion.div>
      </div>

      {/* SATELLITE NODES (Academic, Coding, Projects, Skills, Resume, Interview, Career) */}
      {TWIN_DIMENSIONS.map((dim, idx) => {
        const angleRad = (dim.angle * Math.PI) / 180
        // Calculate position in percentage coordinates relative to parent container
        const leftPercent = 50 + (orbitRadius / size) * 100 * Math.cos(angleRad)
        const topPercent = 50 + (orbitRadius / size) * 100 * Math.sin(angleRad)

        const IconComponent = ICON_MAP[dim.id as keyof typeof ICON_MAP] || Sparkles
        const isHovered = activeNode === dim.id

        return (
          <motion.div
            key={dim.id}
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: isHovered ? 1.08 : 1,
              y: reduced ? 0 : [0, idx % 2 === 0 ? -5 : 5, 0],
            }}
            transition={{
              opacity: { duration: 0.5, delay: 0.1 * idx },
              scale: { duration: 0.2 },
              y: {
                duration: 4 + (idx % 3),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: idx * 0.3,
              },
            }}
            onMouseEnter={() => interactive && setActiveNode(dim.id)}
            onMouseLeave={() => interactive && setActiveNode(null)}
          >
            <div
              className={cn(
                'group flex items-center gap-2 rounded-xl px-2.5 py-1.5 glass-card border transition-all duration-300 cursor-pointer shadow-lg backdrop-blur-md',
                isHovered
                  ? 'border-opacity-100 ring-2 ring-offset-2 ring-offset-background'
                  : 'border-opacity-30 hover:border-opacity-70'
              )}
              style={{
                borderColor: dim.color,
                boxShadow: isHovered ? `0 0 20px ${dim.color}40` : undefined,
              }}
            >
              {/* Node Icon */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${dim.color}33`, border: `1px solid ${dim.color}66` }}
              >
                <IconComponent className="w-3.5 h-3.5" style={{ color: dim.color }} />
              </div>

              {/* Node Label & Value */}
              <div className="flex flex-col pr-1">
                <span className="text-[11px] font-semibold text-foreground leading-tight whitespace-nowrap">
                  {dim.label}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-10 h-1 rounded-full bg-surface-raised overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${dim.score}%`,
                        backgroundColor: dim.color,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: dim.color }}>
                    {dim.score}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
