import { History, TrendingUp, Calendar, ChevronRight } from 'lucide-react'
import type { PlacementAssessment } from '../../types/placement'

interface PlacementHistoryProps {
  history: PlacementAssessment[]
  selectedAssessmentId?: string
  onSelectAssessment: (assessment: PlacementAssessment) => void
}

export function PlacementHistory({
  history,
  selectedAssessmentId,
  onSelectAssessment,
}: PlacementHistoryProps) {
  if (history.length <= 1) {
    return null
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'PLACEMENT_READY':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      case 'NEAR_READY':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
      case 'DEVELOPING':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      case 'NOT_READY':
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    }
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card/50 p-5 sm:p-6 backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Assessment Version History
            </h3>
            <p className="text-xs text-muted-foreground">
              Track readiness and probability progression across evaluation milestones
            </p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-muted/40 text-muted-foreground border border-border/40">
          {history.length} Runs Recorded
        </span>
      </div>

      <div className="divide-y divide-border/40 overflow-hidden rounded-xl border border-border/60 bg-background/30">
        {history.map((item) => {
          const isSelected = (item._id || item.id) === selectedAssessmentId
          const levelClass = getLevelColor(item.readinessLevel)

          return (
            <button
              key={item._id || item.id}
              onClick={() => onSelectAssessment(item)}
              className={`w-full p-3.5 sm:p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                isSelected
                  ? 'bg-primary/10 border-l-4 border-l-primary'
                  : 'hover:bg-accent/40'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-card border border-border/70 flex flex-col items-center justify-center font-mono shrink-0">
                  <span className="text-[10px] text-muted-foreground uppercase">v</span>
                  <span className="text-xs font-bold text-foreground">{item.assessmentVersion}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">{item.targetRole}</h4>
                    <span
                      className={`px-2 py-0.2 rounded-full text-[10px] font-semibold border ${levelClass}`}
                    >
                      {item.readinessLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(item.generatedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5 pl-12 sm:pl-0">
                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-foreground">
                    {item.overallReadinessScore} <span className="text-xs text-muted-foreground font-normal">pts</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>{item.estimatedPlacementProbability}% prob</span>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isSelected ? 'rotate-90 text-primary' : ''}`} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
