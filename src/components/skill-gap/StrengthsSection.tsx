import { CheckCircle2, Award } from 'lucide-react'
import type { SkillStrength } from '../../types/skill-gap'

interface StrengthsSectionProps {
  strengths: SkillStrength[]
}

export function StrengthsSection({ strengths }: StrengthsSectionProps) {
  if (!strengths || strengths.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Validated Strengths to Leverage ({strengths.length})
        </h3>
        <span className="text-xs text-muted-foreground">
          Verified from your Digital Twin
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {strengths.map((item, idx) => (
          <div
            key={`${item.skill}-${idx}`}
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 backdrop-blur-sm space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                {item.skill}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {item.level}
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
