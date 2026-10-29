import { TrendingUp, TrendingDown, Minus, GraduationCap, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { AcademicAnalytics } from '@/types/analytics'

interface AcademicPerformanceCardProps {
  data: AcademicAnalytics
}

const trendConfig = {
  IMPROVING: {
    label: 'Improving',
    icon: TrendingUp,
    className: 'text-success',
    badgeVariant: 'success' as const,
  },
  DECLINING: {
    label: 'Declining',
    icon: TrendingDown,
    className: 'text-danger',
    badgeVariant: 'danger' as const,
  },
  STABLE: {
    label: 'Stable',
    icon: Minus,
    className: 'text-warning',
    badgeVariant: 'warning' as const,
  },
  INSUFFICIENT_DATA: {
    label: 'Not enough data',
    icon: Minus,
    className: 'text-foreground-muted',
    badgeVariant: 'muted' as const,
  },
}

export function AcademicPerformanceCard({ data }: AcademicPerformanceCardProps) {
  if (!data.hasData) {
    return (
      <Card variant="default" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h3 className="text-base font-bold text-foreground font-display">Academic Performance</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-surface-raised flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-foreground-subtle" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No academic records yet.</p>
            <p className="text-xs text-foreground-muted mt-1">
              Add your semester results to see your academic trend.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  const trend = trendConfig[data.trend]
  const TrendIcon = trend.icon

  const stats = [
    {
      label: 'Latest CGPA',
      value: data.latestCgpa?.toFixed(2) ?? '—',
      highlight: true,
    },
    {
      label: 'Average CGPA',
      value: data.averageCgpa?.toFixed(2) ?? '—',
    },
    {
      label: 'Highest CGPA',
      value: data.highestCgpa?.toFixed(2) ?? '—',
    },
    {
      label: 'Lowest CGPA',
      value: data.lowestCgpa?.toFixed(2) ?? '—',
    },
  ]

  return (
    <Card variant="default" className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground font-display">
              Academic Performance
            </h3>
            <p className="text-xs text-foreground-muted">{data.totalSemesters} semester{data.totalSemesters !== 1 ? 's' : ''} recorded</p>
          </div>
        </div>
        <Badge variant={trend.badgeVariant} size="sm">
          <TrendIcon className={cn('w-3 h-3 mr-1', trend.className)} />
          {trend.label}
        </Badge>
      </div>

      {/* CGPA Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35, ease: 'easeOut' }}
            className={cn(
              'rounded-xl p-3 border',
              stat.highlight
                ? 'bg-primary/10 border-primary/20'
                : 'bg-surface-raised border-border'
            )}
          >
            <p className="text-xs text-foreground-muted mb-1">{stat.label}</p>
            <p
              className={cn(
                'text-xl font-bold font-display',
                stat.highlight ? 'text-primary' : 'text-foreground'
              )}
            >
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Trend delta if available */}
      {data.trendDelta !== null && data.trendDelta !== 0 && (
        <p className={cn('text-xs font-medium mb-4', trend.className)}>
          <TrendIcon className="w-3 h-3 inline mr-1" />
          {data.trendDelta > 0 ? '+' : ''}{data.trendDelta} CGPA vs previous semester
        </p>
      )}

      {/* Backlogs */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          {data.currentBacklogs > 0 ? (
            <AlertTriangle className="w-4 h-4 text-warning" />
          ) : (
            <GraduationCap className="w-4 h-4 text-success" />
          )}
          <span className="text-xs text-foreground-muted">Current Backlogs</span>
        </div>
        <span
          className={cn(
            'text-sm font-bold',
            data.currentBacklogs > 0 ? 'text-warning' : 'text-success'
          )}
        >
          {data.currentBacklogs === 0 ? 'None' : data.currentBacklogs}
        </span>
      </div>
      {data.semestersWithBacklogs > 0 && (
        <p className="text-xs text-foreground-muted mt-1.5">
          {data.semestersWithBacklogs} semester{data.semestersWithBacklogs !== 1 ? 's' : ''} with backlogs recorded
          ({data.totalBacklogs} total)
        </p>
      )}
    </Card>
  )
}
