import { Brain, CheckCircle2, Circle, ArrowRight, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { RadialProgress } from '@/components/ui/Progress'
import { cn } from '@/lib/utils'
import type { ProfileCompletenessAnalytics } from '@/types/analytics'

interface ProfileCompletenessCardProps {
  data: ProfileCompletenessAnalytics
}

const STATUS_CONFIG = {
  INCOMPLETE: { label: 'Incomplete', variant: 'danger' as const, color: 'hsl(var(--danger))' },
  MODERATE: { label: 'Moderate', variant: 'warning' as const, color: 'hsl(var(--warning))' },
  GOOD: { label: 'Good', variant: 'success' as const, color: 'hsl(var(--success))' },
  EXCELLENT: { label: 'Excellent', variant: 'success' as const, color: 'hsl(var(--primary))' },
}

export function ProfileCompletenessCard({ data }: ProfileCompletenessCardProps) {
  const statusConfig = STATUS_CONFIG[data.status]
  const incomplete = data.checklist.filter((item) => !item.completed)
  const complete = data.checklist.filter((item) => item.completed)

  return (
    <Card variant="default" className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground font-display">
              Digital Twin Completeness
            </h3>
            <p className="text-xs text-foreground-muted">Transparent weighted formula</p>
          </div>
        </div>
        <Badge variant={statusConfig.variant} size="sm">
          {statusConfig.label}
        </Badge>
      </div>

      {/* Radial Progress + Percentage */}
      <div className="flex flex-col items-center mb-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <RadialProgress
            value={data.percentage}
            size={140}
            strokeWidth={12}
            color={statusConfig.color}
            label={`${data.percentage}%`}
            sublabel="complete"
          />
        </motion.div>
        <p className="text-xs text-foreground-muted mt-2 text-center max-w-[200px]">
          Based on 8 weighted categories. Each item's weight is shown below.
        </p>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {/* Completed items */}
        {complete.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-1.5 px-2 rounded-lg"
          >
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
              <span className="text-xs text-foreground truncate">{item.label}</span>
            </div>
            <span className="text-xs text-foreground-subtle ml-2 shrink-0">+{item.weight}%</span>
          </div>
        ))}

        {/* Incomplete items */}
        {incomplete.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-surface-raised/50 border border-border/50 group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Circle className="w-3.5 h-3.5 text-foreground-subtle shrink-0" />
              <span className="text-xs text-foreground-muted truncate">{item.label}</span>
            </div>
            <Link
              to={item.actionPath}
              className={cn(
                'text-xs font-medium text-primary flex items-center gap-1 ml-2 shrink-0',
                'opacity-0 group-hover:opacity-100 transition-opacity'
              )}
            >
              {item.actionLabel}
              <ArrowRight className="w-3 h-3" />
            </Link>
            {/* Show weight on non-hover */}
            <span className="text-xs text-foreground-subtle ml-2 shrink-0 group-hover:hidden">
              +{item.weight}%
            </span>
          </div>
        ))}
      </div>

      {/* Transparent formula note */}
      <div className="mt-4 p-3 rounded-xl bg-surface-raised/50 border border-border flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-foreground-subtle shrink-0 mt-0.5" />
        <p className="text-xs text-foreground-subtle leading-relaxed">
          Completeness is a deterministic calculation. Each category has a defined weight and
          a specific completion condition — no AI involved.
        </p>
      </div>
    </Card>
  )
}
