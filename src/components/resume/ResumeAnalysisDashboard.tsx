import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { ResumeAnalysis } from '@/types/resume'
import { ScoreCircle } from './ScoreCircle'
import { SectionScoresCard } from './SectionScoresCard'
import { AnalysisFeedbackCards } from './AnalysisFeedbackCards'
import {
  Sparkles,
  Target,
  FileCheck2,
  AlertCircle,
  Clock,
  Layers,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'

interface ResumeAnalysisDashboardProps {
  analysis: ResumeAnalysis | null
  isAnalyzing: boolean
  currentTargetRole: string
  onReanalyze: (role: string) => Promise<void>
}

export function ResumeAnalysisDashboard({
  analysis,
  isAnalyzing,
  currentTargetRole,
  onReanalyze,
}: ResumeAnalysisDashboardProps) {
  const [targetRole, setTargetRole] = useState(currentTargetRole || 'Software Engineer')
  const [loadingStep, setLoadingStep] = useState(0)

  // Simulation of visual multi-step progress indicator during AI processing
  useEffect(() => {
    if (!isAnalyzing) {
      setLoadingStep(0)
      return
    }

    const steps = [
      'Extracting and structuring resume document text...',
      'Evaluating project impact and work experience achievements...',
      'Assessing technical keywords and ATS structural readability...',
      'Synthesizing actionable recommendations with Gemini...',
    ]

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
    }, 2400)

    return () => clearInterval(interval)
  }, [isAnalyzing])

  if (isAnalyzing) {
    const steps = [
      'Extracting and structuring resume document text',
      'Evaluating project impact and work experience achievements',
      'Assessing technical keywords and ATS structural readability',
      'Synthesizing actionable recommendations with Gemini',
    ]

    return (
      <Card className="p-10 text-center border-primary/30 bg-surface">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-5 animate-pulse">
          <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        <h3 className="text-lg font-bold text-foreground font-display">
          AI Resume Analysis in Progress...
        </h3>
        <p className="text-xs text-foreground-muted mt-1 max-w-md mx-auto">
          Our backend Gemini engine is performing deep semantic parsing against target role benchmarks.
        </p>

        {/* Visual Progress Steps */}
        <div className="max-w-md mx-auto mt-8 space-y-3 text-left">
          {steps.map((step, idx) => {
            const isCompleted = idx < loadingStep
            const isCurrent = idx === loadingStep

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : isCurrent
                    ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                    : 'bg-surface border-border text-foreground-muted/60 opacity-60'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center text-[9px]">
                    {idx + 1}
                  </div>
                )}
                <span>{step}</span>
              </div>
            )
          })}
        </div>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card className="p-10 text-center border-border bg-surface">
        <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-border flex items-center justify-center text-foreground-muted mx-auto mb-3">
          <Layers className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-foreground font-display">
          Ready for AI Assessment
        </h3>
        <p className="text-xs text-foreground-muted max-w-md mx-auto mt-1 mb-6 leading-relaxed">
          Click "Analyze Resume with AI" above to extract actionable feedback, ATS recommendations, and section scores tailored to your career goal.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Target Role & Re-Analyze Header Bar */}
      <Card className="p-5 border-border bg-surface">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground-muted">Evaluation Target Role:</span>
                <Badge variant="primary" size="sm" className="font-bold">
                  {analysis.targetRole || targetRole}
                </Badge>
              </div>
              <p className="text-[11px] text-foreground-muted mt-0.5">
                Evaluated with {analysis.model} • Assessment v{analysis.analysisVersion} on{' '}
                {new Date(analysis.analyzedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Quick Target Role Switcher */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Backend Engineer"
              className="text-xs px-3 py-1.5 rounded-lg border border-border bg-surface-raised text-foreground focus:outline-none focus:border-primary/50 w-44"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReanalyze(targetRole)}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-primary" />}
            >
              Tailor Analysis
            </Button>
          </div>
        </div>
      </Card>

      {/* Primary Score & Quick Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Circle Card */}
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-xs uppercase tracking-wider font-bold text-foreground-muted mb-4">
            AI Resume Quality Score
          </h3>
          <ScoreCircle score={analysis.overallScore} />
        </Card>

        {/* High-Level Diagnostic Metrics */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-4">
          <Card className="p-5 border-emerald-500/20 bg-emerald-950/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-bold uppercase tracking-wider">Identified Strengths</span>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-foreground font-display">
                {analysis.strengths?.length || 0}
              </span>
              <p className="text-[11px] text-foreground-muted mt-1">
                Verified high-impact elements found in document
              </p>
            </div>
          </Card>

          <Card className="p-5 border-amber-500/20 bg-amber-950/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-bold uppercase tracking-wider">Areas to Improve</span>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-foreground font-display">
                {analysis.weaknesses?.length || 0}
              </span>
              <p className="text-[11px] text-foreground-muted mt-1">
                Content or metric improvements suggested
              </p>
            </div>
          </Card>

          <Card className="p-5 border-indigo-500/20 bg-indigo-950/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-400">
              <span className="text-xs font-bold uppercase tracking-wider">Skills & Keywords</span>
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-foreground font-display">
                {(analysis.skillsDetected?.length || 0) + (analysis.keywords?.length || 0)}
              </span>
              <p className="text-[11px] text-foreground-muted mt-1">
                Technical competencies indexed in text
              </p>
            </div>
          </Card>

          <Card className="p-5 border-rose-500/20 bg-rose-950/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-400">
              <span className="text-xs font-bold uppercase tracking-wider">Missing Sections</span>
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-foreground font-display">
                {analysis.missingSections?.length || 0}
              </span>
              <p className="text-[11px] text-foreground-muted mt-1">
                Standard sections absent or underdeveloped
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Section-by-Section Progress Breakdown */}
      <SectionScoresCard scores={analysis.sectionScores} />

      {/* Deep Feedback, ATS recommendations, and Actionable Suggestions */}
      <AnalysisFeedbackCards analysis={analysis} />
    </div>
  )
}
