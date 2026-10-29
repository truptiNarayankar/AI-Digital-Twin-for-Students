import { Award, AlertCircle, Layers, CheckCircle2 } from 'lucide-react'
import type { SkillGapAnalysis } from '../../types/skill-gap'

interface SkillGapSummaryCardsProps {
  analysis: SkillGapAnalysis
}

export function SkillGapSummaryCards({ analysis }: SkillGapSummaryCardsProps) {
  const matchScore = analysis.overallMatchScore ?? 70

  const highPriorityGaps = analysis.gaps.filter(
    (g) => g.priority === 'HIGH' || g.priority === 'CRITICAL'
  ).length

  // Match score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 from-emerald-500/20 to-emerald-500/5 border-emerald-500/30'
    if (score >= 60) return 'text-amber-400 from-amber-500/20 to-amber-500/5 border-amber-500/30'
    return 'text-rose-400 from-rose-500/20 to-rose-500/5 border-rose-500/30'
  }

  return (
    <div className="space-y-6">
      {/* Role Summary Banner */}
      <div className="rounded-xl border border-border/70 bg-card/50 p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
              Target Role Profile
            </span>
            <h3 className="text-lg font-bold text-foreground">{analysis.targetRole}</h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Analyzed {new Date(analysis.generatedAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">
          {analysis.roleSummary}
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Match Score Card */}
        <div
          className={`rounded-xl border bg-gradient-to-br p-5 backdrop-blur-sm relative overflow-hidden ${getScoreColor(
            matchScore
          )}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Role Match Score
            </span>
            <Award className="w-5 h-5 opacity-80" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono">{matchScore}%</span>
            <span className="text-xs text-muted-foreground">alignment</span>
          </div>
          <div className="w-full bg-muted/40 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-current rounded-full transition-all duration-500"
              style={{ width: `${matchScore}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Diagnostic benchmark based on digital twin portfolio
          </p>
        </div>

        {/* Strengths Card */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Portfolio Strengths
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">
              {analysis.strengths.length}
            </span>
            <span className="text-xs text-muted-foreground">verified</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Core skills already demonstrated in projects or tests
          </p>
        </div>

        {/* Gaps to Level Up */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Skill Gaps
            </span>
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400">
              {analysis.gaps.length}
            </span>
            <span className="text-xs text-muted-foreground">need elevation</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            <span className="font-semibold text-amber-400">{highPriorityGaps}</span> high/critical priority gaps
          </p>
        </div>

        {/* Missing Core Technologies */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Missing Technologies
            </span>
            <Layers className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-400">
              {analysis.missingSkills.length}
            </span>
            <span className="text-xs text-muted-foreground">unexplored</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Industry expectations completely absent from portfolio
          </p>
        </div>
      </div>
    </div>
  )
}
