import { Compass, TrendingUp, AlertTriangle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PlacementAnalytics } from '../../types/analytics'

interface PlacementReadinessAnalyticsCardProps {
  placement?: PlacementAnalytics
}

export function PlacementReadinessAnalyticsCard({ placement }: PlacementReadinessAnalyticsCardProps) {
  if (!placement || !placement.hasAssessment) {
    return (
      <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-primary/10 via-card/50 to-card/20 p-6 backdrop-blur-sm shadow-sm flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/30">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Placement Readiness Assessment</h3>
            </div>
            <span className="text-xs text-muted-foreground font-mono">Phase 10</span>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Run an AI placement readiness evaluation to compute your 9-dimension score, estimated placement probability, and uncover actionable blockers.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Deterministic twin synthesis
          </span>
          <Link
            to="/student/placement"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Run Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  const score = placement.overallReadinessScore ?? 0
  const prob = placement.estimatedPlacementProbability ?? 0

  const getLevelStyle = (level: string | null) => {
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
    <div className="rounded-2xl border border-border/80 bg-card/60 p-5 sm:p-6 backdrop-blur-sm shadow-sm space-y-4 hover:border-primary/40 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/20 text-primary border border-primary/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Placement Readiness</h3>
            <p className="text-xs text-muted-foreground">Target Role: {placement.targetRole || 'Full Stack'}</p>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getLevelStyle(placement.readinessLevel)}`}>
          {placement.readinessLevel || 'Assessed'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="rounded-xl bg-background/50 border border-border/60 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Readiness Score</span>
          </div>
          <div className="text-2xl font-black font-mono text-foreground">
            {score} <span className="text-xs font-normal text-muted-foreground">/ 100</span>
          </div>
          <div className="w-full bg-muted/40 h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${score}%` }} />
          </div>
        </div>

        <div className="rounded-xl bg-background/50 border border-border/60 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Est. Probability</span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {prob}%
          </div>
          <div className="w-full bg-muted/40 h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${prob}%` }} />
          </div>
        </div>
      </div>

      {placement.criticalBlockersCount > 0 && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{placement.criticalBlockersCount} critical blocker(s) require action</span>
        </div>
      )}

      <div className="pt-2 border-t border-border/40 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          {placement.isStale ? (
            <span className="text-amber-400">Update available</span>
          ) : (
            `Updated ${placement.generatedAt ? new Date(placement.generatedAt).toLocaleDateString() : 'recently'}`
          )}
        </span>

        <Link
          to="/student/placement"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <span>View Diagnostic Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
