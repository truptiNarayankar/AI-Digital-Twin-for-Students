import { RadialProgress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface ReadinessChartProps {
  score?: number
  label?: string
  status?: string
  className?: string
  size?: number
}

export function ReadinessChart({
  score = 78,
  label = 'Placement Readiness',
  status = 'Tier-1 Candidate Track',
  className,
  size = 170,
}: ReadinessChartProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-4', className)}>
      <div className="relative">
        <RadialProgress
          value={score}
          size={size}
          strokeWidth={12}
          color="hsl(var(--primary))"
          label={`${score}%`}
          sublabel="Score"
        />
        {/* Outer subtle glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-20 pointer-events-none"
          style={{ background: 'hsl(var(--primary))' }}
        />
      </div>
      <div className="mt-4 text-center">
        <p className="text-body-sm font-semibold text-foreground">{label}</p>
        <div className="mt-1.5 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <Badge variant="success" size="sm">
            {status}
          </Badge>
        </div>
      </div>
    </div>
  )
}
