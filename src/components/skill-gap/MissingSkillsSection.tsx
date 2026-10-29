import { AlertOctagon } from 'lucide-react'
import type { MissingSkill, SkillGapPriority } from '../../types/skill-gap'

interface MissingSkillsSectionProps {
  missingSkills: MissingSkill[]
}

export function MissingSkillsSection({ missingSkills }: MissingSkillsSectionProps) {
  if (!missingSkills || missingSkills.length === 0) {
    return null
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-400" />
          Missing Core Technologies ({missingSkills.length})
        </h3>
        <span className="text-xs text-muted-foreground">
          Essential industry concepts absent from portfolio
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {missingSkills.map((item, idx) => (
          <div
            key={`${item.skill}-${idx}`}
            className="rounded-xl border border-border/70 bg-card/60 p-4 backdrop-blur-sm space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                {item.skill}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getPriorityBadge(
                  item.priority
                )}`}
              >
                {item.priority} Priority
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {item.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
