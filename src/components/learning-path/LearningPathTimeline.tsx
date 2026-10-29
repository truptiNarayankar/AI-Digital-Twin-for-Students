import { CheckCircle2, Award } from 'lucide-react'
import type { LearningPath } from '../../types/learning-path'

interface LearningPathTimelineProps {
  learningPath: LearningPath
  activeStageNumber?: number
  onSelectStage?: (stageNumber: number) => void
}

export function LearningPathTimeline({
  learningPath,
  activeStageNumber,
  onSelectStage,
}: LearningPathTimelineProps) {
  const completedStages = learningPath.stages.filter((s) => s.status === 'COMPLETED').length
  const totalStages = learningPath.stages.length

  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-8 backdrop-blur-xl shadow-sm space-y-6">
      {/* Top Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 mb-2">
            <Award className="w-3.5 h-3.5" />
            Curriculum for {learningPath.targetRole}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {learningPath.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            {learningPath.description}
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-4 bg-background/50 border border-border/60 rounded-xl p-3 sm:p-4 shrink-0">
          <div className="text-center min-w-[70px]">
            <span className="text-xs text-muted-foreground block">Duration</span>
            <span className="text-base sm:text-lg font-bold font-mono text-foreground">
              {learningPath.totalEstimatedWeeks} wks
            </span>
          </div>
          <div className="h-8 w-px bg-border/60" />
          <div className="text-center min-w-[70px]">
            <span className="text-xs text-muted-foreground block">Milestones</span>
            <span className="text-base sm:text-lg font-bold font-mono text-primary">
              {completedStages}/{totalStages}
            </span>
          </div>
          <div className="h-8 w-px bg-border/60" />
          <div className="text-center min-w-[70px]">
            <span className="text-xs text-muted-foreground block">Overall</span>
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
              {learningPath.progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Deterministic Overall Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-muted-foreground">
            Overall Curriculum Completion
          </span>
          <span className="font-mono font-bold text-foreground">
            {learningPath.progress}% Completed
          </span>
        </div>
        <div className="w-full bg-muted/50 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${learningPath.progress}%` }}
          />
        </div>
      </div>

      {/* Sequential Horizontal Stage Steps */}
      <div className="pt-2 border-t border-border/50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          {learningPath.stages.map((stage) => {
            const isCompleted = stage.status === 'COMPLETED'
            const isInProgress = stage.status === 'IN_PROGRESS'
            const isSelected = activeStageNumber === stage.stageNumber

            return (
              <button
                key={stage.stageNumber}
                type="button"
                onClick={() => onSelectStage?.(stage.stageNumber)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/10'
                    : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50'
                    : isInProgress
                    ? 'border-primary/40 bg-card/80 hover:border-primary/60'
                    : 'border-border/60 bg-background/40 hover:border-border'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-mono font-bold text-muted-foreground">
                    Stage {stage.stageNumber}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-[11px] font-mono font-bold text-primary">
                      {stage.progress}%
                    </span>
                  )}
                </div>
                <h5 className="text-xs font-semibold text-foreground truncate">
                  {stage.title}
                </h5>
                <span className="text-[10px] text-muted-foreground block truncate mt-0.5">
                  {stage.estimatedDuration}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
