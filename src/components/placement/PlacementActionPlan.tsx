import { ListChecks, Flame, Clock } from 'lucide-react'
import type { PlacementAction, ActionPriority } from '../../types/placement'

interface PlacementActionPlanProps {
  actions: PlacementAction[]
}

export function PlacementActionPlan({ actions }: PlacementActionPlanProps) {
  const getPriorityBadge = (priority: ActionPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return {
          badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
          icon: Flame,
          label: 'Critical Priority',
        }
      case 'HIGH':
        return {
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          icon: Flame,
          label: 'High Priority',
        }
      case 'MEDIUM':
        return {
          badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
          icon: Clock,
          label: 'Medium Priority',
        }
      case 'LOW':
      default:
        return {
          badge: 'bg-muted/40 text-muted-foreground border-border/40',
          icon: Clock,
          label: 'Low Priority',
        }
    }
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card/50 p-5 sm:p-6 backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Prioritized Action Plan
            </h3>
            <p className="text-xs text-muted-foreground">
              Step-by-step roadmap to elevate your placement readiness score
            </p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-muted/40 text-muted-foreground border border-border/40">
          {actions.length} {actions.length === 1 ? 'Action' : 'Actions'}
        </span>
      </div>

      <div className="space-y-3">
        {actions.map((act, index) => {
          const prio = getPriorityBadge(act.priority)
          const Icon = prio.icon

          return (
            <div
              key={index}
              className="rounded-xl border border-border/70 bg-background/40 p-4 space-y-2 hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold font-mono flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-foreground">{act.title}</h4>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${prio.badge} self-start sm:self-auto`}
                >
                  <Icon className="w-3 h-3" />
                  {prio.label}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pl-8">
                {act.description}
              </p>

              {act.reason && (
                <div className="ml-8 text-[11px] text-muted-foreground/90 bg-muted/20 border border-border/40 rounded-lg px-3 py-2">
                  <strong className="text-foreground">Why this matters: </strong>
                  {act.reason}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
