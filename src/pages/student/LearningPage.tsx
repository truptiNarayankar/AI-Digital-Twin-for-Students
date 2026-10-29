import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Target,
  ArrowRight,
  Layers,
} from 'lucide-react'
import { studentService } from '../../services/student.service'
import { LearningPathTimeline } from '../../components/learning-path/LearningPathTimeline'
import { LearningStageCard } from '../../components/learning-path/LearningStageCard'
import type { LearningPath, LearningStageStatus } from '../../types/learning-path'
import type { SkillGapAnalysis } from '../../types/skill-gap'

export function LearningPage() {
  const navigate = useNavigate()
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [latestSkillGap, setLatestSkillGap] = useState<SkillGapAnalysis | null>(null)
  const [activeStageNumber, setActiveStageNumber] = useState<number | undefined>(undefined)

  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [pathData, skillGapData] = await Promise.all([
        studentService.getLearningPath().catch(() => null),
        studentService.getLatestSkillGap().catch(() => ({ analysis: null })),
      ])

      setLearningPath(pathData)
      setLatestSkillGap(skillGapData.analysis)

      // Set active stage to the first IN_PROGRESS stage or stage 1
      if (pathData && pathData.stages.length > 0) {
        const inProgress = pathData.stages.find((s) => s.status === 'IN_PROGRESS')
        setActiveStageNumber(inProgress ? inProgress.stageNumber : pathData.stages[0].stageNumber)
      }
    } catch (err: unknown) {
      console.error('Failed to load learning path:', err)
      setError('Unable to load learning path. Please check your network connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGeneratePath = async (skillGapAnalysisId?: string) => {
    try {
      setIsGenerating(true)
      setError(null)
      const newPath = await studentService.generateLearningPath(skillGapAnalysisId)
      setLearningPath(newPath)
      if (newPath.stages.length > 0) {
        setActiveStageNumber(newPath.stages[0].stageNumber)
      }
    } catch (err: unknown) {
      console.error('Failed to generate learning path:', err)
      const message =
        (err as any)?.response?.data?.message ||
        (err as any)?.message ||
        'Failed to generate learning path. Please try again.'
      setError(message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUpdateStageProgress = async (
    stageNumber: number,
    payload: { status?: LearningStageStatus; progress?: number }
  ) => {
    if (!learningPath) return
    try {
      const updated = await studentService.updateStageProgress(
        learningPath._id,
        stageNumber,
        payload
      )
      setLearningPath(updated)
    } catch (err: unknown) {
      console.error('Failed to update stage progress:', err)
      const message =
        (err as any)?.response?.data?.message ||
        (err as any)?.message ||
        'Failed to update stage progress.'
      setError(message)
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-r from-emerald-500/15 via-indigo-500/10 to-primary/15 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              Phase 9 • Personalized Learning Roadmaps
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Personalized Learning Path
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              An ordered curriculum designed specifically to bridge your detected skill gaps, complete hands-on practice tasks, and deliver production-grade portfolio projects.
            </p>
          </div>

          {learningPath && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleGeneratePath(latestSkillGap?._id)}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-background/60 border border-border/60 hover:bg-muted/40 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Regenerating...' : 'Regenerate Curriculum'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content */}
      {learningPath ? (
        <div className="space-y-8">
          {/* Learning Path Timeline and Progress */}
          <LearningPathTimeline
            learningPath={learningPath}
            activeStageNumber={activeStageNumber}
            onSelectStage={(num) => setActiveStageNumber(num)}
          />

          {/* Sequential Stage Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Curriculum Stages ({learningPath.stages.length})
              </h3>
              <span className="text-xs text-muted-foreground">
                Sequential, Dependency-Ordered Milestones
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {learningPath.stages.map((stage) => (
                <div
                  key={stage.stageNumber}
                  id={`stage-${stage.stageNumber}`}
                >
                  <LearningStageCard
                    stage={stage}
                    onUpdateProgress={(payload) =>
                      handleUpdateStageProgress(stage.stageNumber, payload)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : !isLoading ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-border/70 p-12 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            No Learning Path Generated Yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {latestSkillGap
              ? `You have an active Skill Gap Analysis for ${latestSkillGap.targetRole}. Generate an ordered learning path to bridge these gaps.`
              : 'Analyze your skills against a target career role to generate a personalized, milestone-driven curriculum.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {latestSkillGap ? (
              <button
                onClick={() => handleGeneratePath(latestSkillGap._id)}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? 'Generating...' : `Generate for ${latestSkillGap.targetRole}`}
              </button>
            ) : (
              <button
                onClick={() => navigate('/student/skill-gap')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              >
                <Target className="w-4 h-4" />
                Run Skill Gap Analysis
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Initial Loading State */
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground font-medium">
            Loading personalized learning path...
          </span>
        </div>
      )}
    </div>
  )
}
