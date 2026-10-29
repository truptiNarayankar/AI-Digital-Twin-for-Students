import { cn } from '@/lib/utils'

// ============================================================
// PROGRESS BAR
// ============================================================
interface ProgressProps {
  value: number
  max?: number
  className?: string
  trackClassName?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  showLabel?: boolean
  label?: string
}

const colorMap = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  accent: 'bg-accent',
}

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
}

export function Progress({
  value,
  max = 100,
  className,
  trackClassName,
  color = 'primary',
  size = 'md',
  animated = true,
  showLabel = false,
  label,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-caption text-foreground-muted">{label}</span>}
          {showLabel && (
            <span className="text-caption text-foreground-muted font-medium">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-surface-raised overflow-hidden',
          sizeMap[size],
          trackClassName
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            colorMap[color],
            animated && 'origin-left'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// ============================================================
// RADIAL PROGRESS
// ============================================================
interface RadialProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  className?: string
  label?: string
  sublabel?: string
}

export function RadialProgress({
  value,
  size = 120,
  strokeWidth = 10,
  color = 'hsl(var(--primary))',
  className,
  label,
  sublabel,
}: RadialProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--surface-raised))"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center label */}
      {(label || sublabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {label && <span className="text-base font-bold text-foreground leading-none">{label}</span>}
          {sublabel && <span className="text-caption text-foreground-muted mt-0.5">{sublabel}</span>}
        </div>
      )}
    </div>
  )
}
