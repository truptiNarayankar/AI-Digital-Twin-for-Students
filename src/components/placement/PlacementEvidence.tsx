import { useState } from 'react'
import { Eye, PlusCircle, MinusCircle, HelpCircle } from 'lucide-react'
import type { PlacementEvidenceItem, EvidenceImpact } from '../../types/placement'

interface PlacementEvidenceProps {
  evidence: PlacementEvidenceItem[]
}

export function PlacementEvidence({ evidence }: PlacementEvidenceProps) {
  const [filter, setFilter] = useState<'ALL' | EvidenceImpact>('ALL')

  const filtered = evidence.filter((item) => (filter === 'ALL' ? true : item.impact === filter))

  const getImpactBadge = (impact: EvidenceImpact) => {
    switch (impact) {
      case 'POSITIVE':
        return {
          label: 'Positive Signal',
          icon: PlusCircle,
          className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        }
      case 'NEGATIVE':
        return {
          label: 'Negative Signal',
          icon: MinusCircle,
          className: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        }
      case 'NEUTRAL':
      default:
        return {
          label: 'Neutral Baseline',
          icon: HelpCircle,
          className: 'bg-muted/40 text-muted-foreground border-border/40',
        }
    }
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card/50 p-5 sm:p-6 backdrop-blur-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Transparent Evidence Ledger
            </h3>
            <p className="text-xs text-muted-foreground">
              Direct audit trail of observations derived from your Digital Twin records
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background/60 border border-border/60 self-start sm:self-auto text-xs">
          {(['ALL', 'POSITIVE', 'NEUTRAL', 'NEGATIVE'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filter === tab
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-4 text-center">
            No evidence items match the selected filter.
          </p>
        ) : (
          filtered.map((item, idx) => {
            const config = getImpactBadge(item.impact)
            const Icon = config.icon

            return (
              <div
                key={idx}
                className="rounded-xl border border-border/60 bg-background/40 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-border transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {item.dimension}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.observation}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${config.className} shrink-0 self-start sm:self-auto`}
                >
                  {config.label}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
