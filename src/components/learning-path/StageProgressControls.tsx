import { useState } from 'react'
import { CheckCircle2, PlayCircle, Loader2 } from 'lucide-react'
import type { LearningStageStatus } from '../../types/learning-path'

interface StageProgressControlsProps {
  currentProgress: number
  currentStatus: LearningStageStatus
  onUpdate: (payload: { status?: LearningStageStatus; progress?: number }) => Promise<void>
}

export function StageProgressControls({
  currentProgress,
  currentStatus,
  onUpdate,
}: StageProgressControlsProps) {
  const [progress, setProgress] = useState(currentProgress)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value))
  }

  const handleSaveProgress = async (newProgress: number, newStatus?: LearningStageStatus) => {
    try {
      setIsUpdating(true)
      const statusToSet =
        newStatus ||
        (newProgress === 100
          ? 'COMPLETED'
          : newProgress > 0
          ? 'IN_PROGRESS'
          : 'NOT_STARTED')
      await onUpdate({ progress: newProgress, status: statusToSet })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleMarkComplete = async () => {
    setProgress(100)
    await handleSaveProgress(100, 'COMPLETED')
  }

  const handleMarkInProgress = async () => {
    const val = progress === 0 ? 25 : progress
    setProgress(val)
    await handleSaveProgress(val, 'IN_PROGRESS')
  }

  return (
    <div className="pt-4 border-t border-border/60 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Stage Progress:</span>
          <span className="font-mono font-bold text-primary text-sm">{progress}%</span>
          {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          {currentStatus !== 'IN_PROGRESS' && currentStatus !== 'COMPLETED' && (
            <button
              onClick={handleMarkInProgress}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-primary/20 text-primary hover:bg-primary/30 active:scale-95 transition-all disabled:opacity-50"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              Start Stage
            </button>
          )}

          {currentStatus !== 'COMPLETED' && (
            <button
              onClick={handleMarkComplete}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 active:scale-95 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark Complete
            </button>
          )}
        </div>
      </div>

      {/* Slider Control */}
      <div className="space-y-1.5">
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={progress}
          onChange={handleSliderChange}
          onMouseUp={() => handleSaveProgress(progress)}
          onTouchEnd={() => handleSaveProgress(progress)}
          disabled={isUpdating}
          className="w-full accent-primary h-2 bg-muted/60 rounded-lg cursor-pointer transition-all disabled:opacity-50"
        />

        {/* Preset Percentages */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
          {[0, 25, 50, 75, 100].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setProgress(preset)
                handleSaveProgress(preset)
              }}
              disabled={isUpdating}
              className={`px-2 py-0.5 rounded transition-all hover:text-foreground ${
                progress === preset
                  ? 'font-bold text-primary bg-primary/10'
                  : 'text-muted-foreground'
              }`}
            >
              {preset}%
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
