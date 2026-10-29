import { motion } from 'framer-motion'
import { Award, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react'

interface ScoreCircleProps {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ScoreCircle({
  score,
  size = 180,
  strokeWidth = 12,
  className = '',
}: ScoreCircleProps) {
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference

  const getTier = (s: number) => {
    if (s >= 85) {
      return {
        label: 'Exceptional Alignment',
        color: '#10b981',
        gradientId: 'scoreGradEmerald',
        stop1: '#10b981',
        stop2: '#06b6d4',
        badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        icon: Award,
      }
    }
    if (s >= 70) {
      return {
        label: 'Competitive Standard',
        color: '#6366f1',
        gradientId: 'scoreGradIndigo',
        stop1: '#6366f1',
        stop2: '#38bdf8',
        badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        icon: TrendingUp,
      }
    }
    if (s >= 55) {
      return {
        label: 'Developing Foundation',
        color: '#f59e0b',
        gradientId: 'scoreGradAmber',
        stop1: '#f59e0b',
        stop2: '#fbbf24',
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        icon: Sparkles,
      }
    }
    return {
      label: 'Needs High-Impact Work',
      color: '#f43f5e',
      gradientId: 'scoreGradRose',
      stop1: '#f43f5e',
      stop2: '#fb923c',
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      icon: ShieldAlert,
    }
  }

  const tier = getTier(clampedScore)
  const TierIcon = tier.icon

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={tier.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={tier.stop1} />
              <stop offset="100%" stopColor={tier.stop2} />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-border/40"
          />

          {/* Animated Progress Stroke */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${tier.gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl sm:text-5xl font-extrabold font-display text-foreground tracking-tight"
          >
            {clampedScore}
          </motion.span>
          <span className="text-xs uppercase font-semibold text-foreground-muted tracking-wider mt-0.5">
            out of 100
          </span>
        </div>
      </div>

      {/* Tier Badge */}
      <div
        className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${tier.badgeBg}`}
      >
        <TierIcon className="w-3.5 h-3.5" />
        <span>{tier.label}</span>
      </div>

      <p className="text-[11px] text-foreground-muted/80 text-center mt-2 max-w-[220px]">
        AI Resume Quality Score based on clarity, metrics, and role alignment.
      </p>
    </div>
  )
}
