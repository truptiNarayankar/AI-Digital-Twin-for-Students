import { ArrowRight, Lightbulb, Search, AlertCircle } from 'lucide-react'
import type { SkillGapItem, SkillGapLevel, SkillGapPriority } from '../../types/skill-gap'

interface SkillGapComparisonListProps {
  gaps: SkillGapItem[]
}

export function SkillGapComparisonList({ gaps }: SkillGapComparisonListProps) {
  if (!gaps || gaps.length === 0) {
    return (
      <div className="p-8 rounded-xl border border-dashed border-border/70 text-center text-muted-foreground text-sm">
        No skill gaps detected for this role. Your current skill levels fully satisfy the requirements!
      </div>
    )
  }

  const getPriorityBadge = (priority: SkillGapPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40'
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40'
      case 'MEDIUM':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/40'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40'
    }
  }

  const getGapLevelBadge = (level: SkillGapLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
      case 'MODERATE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          Detected Skill Gaps ({gaps.length})
        </h3>
        <span className="text-xs text-muted-foreground">
          Sorted by Priority & Gap Level
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {gaps.map((item, idx) => (
          <div
            key={`${item.skill}-${idx}`}
            className="rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm hover:border-border transition-all space-y-4"
          >
            {/* Header: Skill Name, Category, Priority & Gap Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-base font-bold text-foreground">{item.skill}</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-muted/60 text-muted-foreground border border-border/50 uppercase">
                  {item.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadge(
                    item.priority
                  )}`}
                >
                  {item.priority} Priority
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getGapLevelBadge(
                    item.gapLevel
                  )}`}
                >
                  {item.gapLevel} Gap
                </span>
              </div>
            </div>

            {/* Level Comparison Bar */}
            <div className="p-3 rounded-lg bg-background/50 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Current Level:</span>
                <span className="font-semibold text-foreground px-2 py-0.5 rounded bg-muted/70">
                  {item.currentLevel}
                </span>
              </div>

              <div className="flex items-center gap-2 text-primary font-semibold">
                <ArrowRight className="w-4 h-4" />
                <span>Target Elevation</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Required for Role:</span>
                <span className="font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {item.requiredLevel}
                </span>
              </div>
            </div>

            {/* Evidence & Why It Matters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                <div className="flex items-center gap-1.5 font-semibold text-muted-foreground mb-1">
                  <Search className="w-3.5 h-3.5 text-muted-foreground" />
                  Observed Evidence
                </div>
                <p className="text-muted-foreground/90 leading-relaxed">
                  {item.evidence}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-1.5 font-semibold text-primary mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-primary" />
                  Recommended Action
                </div>
                <p className="text-foreground/90 leading-relaxed">
                  {item.recommendedAction}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
