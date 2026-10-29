import { CheckCircle2, AlertTriangle, Quote } from 'lucide-react'
import type { PlacementStrength, PlacementWeakness } from '../../types/placement'

interface PlacementStrengthsProps {
  strengths: PlacementStrength[]
  weaknesses: PlacementWeakness[]
}

export function PlacementStrengths({ strengths, weaknesses }: PlacementStrengthsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Key Competitive Strengths */}
      <div className="rounded-2xl border border-border/80 bg-card/50 p-5 sm:p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Competitive Strengths</h3>
            <p className="text-xs text-muted-foreground">Tangible differentiators highlighted by AI analysis</p>
          </div>
        </div>

        {strengths.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No primary strengths recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {strengths.map((s, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-emerald-300">{s.title}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400">
                    Advantage
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                {s.evidence && (
                  <div className="flex items-start gap-1.5 text-[11px] text-emerald-400/90 font-mono bg-background/50 rounded-lg p-2 mt-1">
                    <Quote className="w-3 h-3 shrink-0 mt-0.5 opacity-70" />
                    <span>Evidence: {s.evidence}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Primary Weaknesses / Areas for Improvement */}
      <div className="rounded-2xl border border-border/80 bg-card/50 p-5 sm:p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Areas for Improvement</h3>
            <p className="text-xs text-muted-foreground">Factors currently limiting candidate readiness</p>
          </div>
        </div>

        {weaknesses.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No prominent weaknesses detected.</p>
        ) : (
          <div className="space-y-3">
            {weaknesses.map((w, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-amber-300">{w.title}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-400">
                    To Address
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{w.description}</p>
                {w.evidence && (
                  <div className="flex items-start gap-1.5 text-[11px] text-amber-400/90 font-mono bg-background/50 rounded-lg p-2 mt-1">
                    <Quote className="w-3 h-3 shrink-0 mt-0.5 opacity-70" />
                    <span>Observation: {w.evidence}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
