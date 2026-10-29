import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

export interface StatCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'accent'
  isDemo?: boolean
  className?: string
  subtext?: string
}

export function StatCard({
  label,
  value,
  change,
  changeLabel = 'vs last month',
  icon,
  color = 'primary',
  isDemo = false,
  className,
  subtext,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0

  const glowColorMap = {
    primary: 'hover:border-primary/40 hover:shadow-glow-primary',
    secondary: 'hover:border-secondary/40 hover:shadow-glow-secondary',
    success: 'hover:border-success/40 hover:shadow-glow-success',
    warning: 'hover:border-warning/40',
    danger: 'hover:border-danger/40',
    accent: 'hover:border-accent/40',
  }

  const iconBgMap = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
  }

  return (
    <Card
      variant="default"
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        glowColorMap[color],
        className
      )}
    >
      {isDemo && (
        <div className="absolute top-3 right-3">
          <Badge variant="demo" size="sm">DEMO DATA</Badge>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <p className="text-body-sm font-medium text-foreground-muted">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-foreground font-display">
              {value}
            </span>
          </div>

          {(change !== undefined || subtext) && (
            <div className="mt-2.5 flex items-center gap-1.5 text-caption">
              {change !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center font-semibold rounded-md px-1.5 py-0.5',
                    isPositive ? 'text-success bg-success/10' : 'text-danger bg-danger/10'
                  )}
                >
                  {isPositive ? '+' : ''}{change}%
                </span>
              )}
              <span className="text-foreground-subtle">{subtext || changeLabel}</span>
            </div>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border',
              iconBgMap[color]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Subtle bottom gradient line */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-0.5 opacity-40',
          color === 'primary' && 'bg-primary',
          color === 'secondary' && 'bg-secondary',
          color === 'success' && 'bg-success',
          color === 'warning' && 'bg-warning',
          color === 'accent' && 'bg-accent'
        )}
      />
    </Card>
  )
}
