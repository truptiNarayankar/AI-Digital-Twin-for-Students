import { Link } from 'react-router-dom'
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertTriangle,
  Award,
  Terminal,
  Users,
  Briefcase,
  Cpu,
  Sparkles,
} from 'lucide-react'
import type { InterviewSession, InterviewType } from '../../types/interview'

interface InterviewHistoryListProps {
  interviews: InterviewSession[]
  isLoading?: boolean
}

function getTypeIcon(type: InterviewType) {
  switch (type) {
    case 'TECHNICAL':
      return <Terminal className="w-4 h-4 text-cyan-400" />
    case 'BEHAVIORAL':
      return <Users className="w-4 h-4 text-purple-400" />
    case 'HR':
      return <Briefcase className="w-4 h-4 text-emerald-400" />
    case 'SYSTEM_DESIGN':
      return <Cpu className="w-4 h-4 text-blue-400" />
    case 'MIXED':
      return <Sparkles className="w-4 h-4 text-amber-400" />
    default:
      return <Terminal className="w-4 h-4 text-cyan-400" />
  }
}

function getScoreTierBadge(score?: number) {
  if (score === undefined || score === null) return null

  if (score >= 85) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <Award className="w-3 h-3" />
        {score}/100 • Excellent
      </span>
    )
  }
  if (score >= 70) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
        <CheckCircle2 className="w-3 h-3" />
        {score}/100 • Strong
      </span>
    )
  }
  if (score >= 50) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        {score}/100 • Developing
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
      {score}/100 • Needs Practice
    </span>
  )
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </span>
      )
    case 'IN_PROGRESS':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
          <Clock className="w-3 h-3" />
          In Progress
        </span>
      )
    case 'ABANDONED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted/40 text-muted-foreground border border-border/40">
          <AlertTriangle className="w-3 h-3" />
          Abandoned
        </span>
      )
    default:
      return null
  }
}

export function InterviewHistoryList({ interviews, isLoading = false }: InterviewHistoryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 rounded-xl border border-border/40 bg-card/40 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (interviews.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-border/60 bg-card/30">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No mock interviews recorded yet</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
          Complete your first practice session above to evaluate your answers, get AI diagnostic feedback, and track your interview readiness.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {interviews.map((session) => {
        const dateStr = new Date(session.completedAt || session.startedAt || session.createdAt).toLocaleDateString(
          'en-US',
          {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }
        )

        const answeredCount = session.questions.filter((q) => q.studentAnswer).length

        return (
          <div
            key={session._id || session.sessionId}
            className="group relative rounded-xl border border-border/50 bg-card/40 hover:bg-card/70 transition-all p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-border/80"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background/80 border border-border/60 text-xs font-semibold text-foreground">
                  {getTypeIcon(session.interviewType || (session as any).type)}
                  {session.interviewType || (session as any).type}
                </div>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted/50 text-muted-foreground border border-border/40">
                  {session.difficulty}
                </span>
                {getStatusBadge(session.status)}
                {session.status === 'COMPLETED' && getScoreTierBadge(session.overallScore)}
              </div>

              <div>
                <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {session.targetRole}
                </h4>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {dateStr}
                  </span>
                  <span>•</span>
                  <span>
                    {answeredCount} of {session.questionCount} Questions Answered
                  </span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {session.status === 'COMPLETED' ? (
                <Link
                  to={`/student/interview/${session.sessionId || session._id}/result`}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center gap-1.5"
                >
                  View Report
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : session.status === 'IN_PROGRESS' ? (
                <Link
                  to={`/student/interview/${session.sessionId || session._id}`}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:opacity-95 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  Resume
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link
                  to={`/student/interview/${session.sessionId || session._id}`}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium border border-border/60 text-muted-foreground hover:text-foreground transition-all"
                >
                  Review
                </Link>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
