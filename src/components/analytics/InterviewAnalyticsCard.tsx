import { Link } from 'react-router-dom'
import { MessageSquare, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { InterviewAnalytics } from '@/types/analytics'

interface InterviewAnalyticsCardProps {
  data?: InterviewAnalytics
}

export function InterviewAnalyticsCard({ data }: InterviewAnalyticsCardProps) {
  if (!data || !data.hasData || data.totalInterviews === 0) {
    return (
      <Card variant="default" className="p-6 rounded-2xl border-border space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-display">
                Mock Interview Performance
              </h3>
              <p className="text-xs text-foreground-muted">AI-evaluated technical & HR rounds</p>
            </div>
          </div>
          <Badge variant="muted" size="sm">
            NO SESSIONS
          </Badge>
        </div>

        <div className="text-center py-6 px-3 bg-surface-raised rounded-xl border border-border/60">
          <Sparkles className="w-8 h-8 text-primary/60 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">No mock interviews completed yet</p>
          <p className="text-xs text-foreground-muted mt-1 max-w-sm mx-auto">
            Test your real-world technical and behavioral interview readiness with our AI interviewer.
          </p>
          <div className="mt-4">
            <Link to="/student/interview">
              <Button variant="gradient" size="sm" className="text-xs">
                Start Mock Interview →
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  const avg = data.averageScore ?? 0
  const high = data.highestScore ?? 0

  return (
    <Card variant="default" className="p-6 rounded-2xl border-border space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-display">
              Mock Interview Performance
            </h3>
            <p className="text-xs text-foreground-muted">AI-evaluated technical & HR rounds</p>
          </div>
        </div>
        <Badge variant={avg >= 70 ? 'success' : 'warning'} size="sm">
          {data.completedInterviews} COMPLETED
        </Badge>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-surface-raised border border-border text-center">
          <span className="text-[11px] text-foreground-muted block font-medium">Avg Score</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-primary mt-0.5 block">
            {avg > 0 ? `${avg}/100` : '—'}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-raised border border-border text-center">
          <span className="text-[11px] text-foreground-muted block font-medium">Best Score</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-0.5 block">
            {high > 0 ? `${high}/100` : '—'}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-raised border border-border text-center">
          <span className="text-[11px] text-foreground-muted block font-medium">Total Rounds</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-0.5 block">
            {data.totalInterviews}
          </span>
        </div>
      </div>

      {/* Breakdown by interview type */}
      {data.byType && data.byType.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            Performance by Interview Format
          </span>
          <div className="space-y-2">
            {data.byType.map((item) => (
              <div
                key={item.type}
                className="flex items-center justify-between p-2.5 rounded-xl bg-background/60 border border-border/60 text-xs"
              >
                <span className="font-medium text-foreground">{item.type}</span>
                <div className="flex items-center gap-3">
                  <span className="text-foreground-muted">{item.count} sessions</span>
                  <span className="font-mono font-bold text-primary">
                    {item.averageScore != null ? `${item.averageScore}/100` : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <span className="text-[11px] text-foreground-subtle">
          Transparent AI-calculated benchmark
        </span>
        <Link to="/student/interview">
          <Button variant="ghost" size="sm" className="text-xs text-primary" rightIcon={<ArrowRight className="w-3 h-3" />}>
            Open Interview Studio
          </Button>
        </Link>
      </div>
    </Card>
  )
}
