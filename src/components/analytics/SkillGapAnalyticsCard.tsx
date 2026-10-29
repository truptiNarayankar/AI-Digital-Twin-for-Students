import { Target, BookOpen, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { SkillGapAnalytics, LearningPathAnalytics } from '@/types/analytics'

interface SkillGapAnalyticsCardProps {
  skillGap?: SkillGapAnalytics
  learningPath?: LearningPathAnalytics
}

export function SkillGapAnalyticsCard({ skillGap, learningPath }: SkillGapAnalyticsCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Skill Gap Card */}
      <Card variant="default" className="p-6 rounded-2xl border-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground font-display">
                Skill Gap Benchmark
              </h3>
              <span className="text-xs text-muted-foreground">
                {skillGap?.hasAnalysis ? skillGap.targetRole : 'Target Role Alignment'}
              </span>
            </div>
          </div>

          {skillGap?.hasAnalysis && (
            <span className="font-mono font-bold text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
              {skillGap.overallMatchScore ?? 70}% Match
            </span>
          )}
        </div>

        {skillGap?.hasAnalysis ? (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-background/50 border border-border/50">
                <span className="text-xs text-muted-foreground block">Strengths</span>
                <span className="font-mono font-bold text-emerald-400 text-base">
                  {skillGap.totalStrengths}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-background/50 border border-border/50">
                <span className="text-xs text-muted-foreground block">Gaps</span>
                <span className="font-mono font-bold text-amber-400 text-base">
                  {skillGap.totalGaps}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-background/50 border border-border/50">
                <span className="text-xs text-muted-foreground block">Missing</span>
                <span className="font-mono font-bold text-cyan-400 text-base">
                  {skillGap.missingSkillsCount}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {skillGap.highPriorityGaps} high-priority skill gaps identified for{' '}
              <span className="text-foreground font-medium">{skillGap.targetRole}</span>.
            </p>

            <Link to="/student/skill-gap" className="block pt-1">
              <Button variant="outline" size="sm" className="w-full text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Full Skill Gap Analysis
              </Button>
            </Link>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <p className="text-xs text-muted-foreground">
              No skill gap analysis generated yet. Benchmark your skills against industry standards.
            </p>
            <Link to="/student/skill-gap">
              <Button variant="gradient" size="sm" className="text-xs">
                Run Skill Gap Analysis →
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Personalized Learning Path Card */}
      <Card variant="default" className="p-6 rounded-2xl border-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground font-display">
                Personalized Learning Path
              </h3>
              <span className="text-xs text-muted-foreground">
                {learningPath?.hasPath ? learningPath.targetRole : 'Remediation Roadmap'}
              </span>
            </div>
          </div>

          {learningPath?.hasPath && (
            <span className="font-mono font-bold text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              {learningPath.overallProgress}% Done
            </span>
          )}
        </div>

        {learningPath?.hasPath ? (
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Curriculum Progress</span>
                <span className="font-mono font-semibold text-foreground">
                  {learningPath.completedStages}/{learningPath.totalStages} Stages Completed
                </span>
              </div>
              <div className="w-full bg-muted/40 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${learningPath.overallProgress}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Estimated timeframe:{' '}
              <span className="text-foreground font-medium">
                {learningPath.totalEstimatedWeeks} weeks
              </span>{' '}
              with practical tasks and milestones.
            </p>

            <Link to="/student/learning" className="block pt-1">
              <Button variant="outline" size="sm" className="w-full text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Continue Learning Roadmap
              </Button>
            </Link>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <p className="text-xs text-muted-foreground">
              No personalized learning path active. Generate an ordered roadmap to bridge your skill gaps.
            </p>
            <Link to="/student/learning">
              <Button variant="gradient" size="sm" className="text-xs">
                Create Learning Path →
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}
