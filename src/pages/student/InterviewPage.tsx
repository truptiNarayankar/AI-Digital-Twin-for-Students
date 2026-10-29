import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MessageSquare,
  History,
  AlertCircle,
} from 'lucide-react'
import { studentService } from '../../services/student.service'
import { InterviewSetupCard } from '../../components/interview/InterviewSetupCard'
import { InterviewHistoryList } from '../../components/interview/InterviewHistoryList'
import type { InterviewSession, CreateInterviewPayload } from '../../types/interview'

export function InterviewPage() {
  const navigate = useNavigate()
  const [interviews, setInterviews] = useState<InterviewSession[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInterviews()
  }, [])

  const loadInterviews = async () => {
    try {
      setIsLoadingHistory(true)
      const data = await studentService.getInterviews()
      setInterviews(data)
    } catch (err: unknown) {
      console.error('Failed to load interview history:', err)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleStartInterview = async (payload: CreateInterviewPayload) => {
    try {
      setIsStarting(true)
      setError(null)
      const session = await studentService.createInterview(payload)
      navigate(`/student/interview/${session.sessionId || session._id}`)
    } catch (err: unknown) {
      console.error('Failed to start interview:', err)
      const message =
        (err as any)?.response?.data?.message ||
        (err as any)?.message ||
        'Failed to initialize interview session. Please try again.'
      setError(message)
    } finally {
      setIsStarting(false)
    }
  }

  // Calculate high-level summary metrics
  const completedSessions = interviews.filter(
    (i) => i.status === 'COMPLETED' && typeof i.overallScore === 'number'
  )
  const scores = completedSessions.map((i) => i.overallScore as number)
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0
  const totalQuestionsAnswered = interviews.reduce(
    (acc, s) => acc + s.questions.filter((q) => q.studentAnswer).length,
    0
  )

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-r from-primary/15 via-indigo-500/10 to-cyan-500/15 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
              <MessageSquare className="w-3.5 h-3.5" />
              Phase 8 • AI Mock Interview System
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Technical & Behavioral Mock Interviews
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Sharpen your real-time interview skills with AI-tailored questions, instant answer scoring, constructive feedback, and comprehensive post-interview diagnostic reports.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto shrink-0">
            <div className="p-3 sm:p-4 rounded-xl border border-border/60 bg-background/50 text-center min-w-[85px]">
              <span className="text-xs text-muted-foreground block">Completed</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-foreground">
                {completedSessions.length}
              </span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl border border-border/60 bg-background/50 text-center min-w-[85px]">
              <span className="text-xs text-muted-foreground block">Avg Score</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-primary">
                {avgScore > 0 ? avgScore : '—'}
              </span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl border border-border/60 bg-background/50 text-center min-w-[85px]">
              <span className="text-xs text-muted-foreground block">High Score</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                {highestScore > 0 ? highestScore : '—'}
              </span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl border border-border/60 bg-background/50 text-center min-w-[85px]">
              <span className="text-xs text-muted-foreground block">Qs Solved</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
                {totalQuestionsAnswered}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Setup Card */}
      <InterviewSetupCard onStart={handleStartInterview} isLoading={isStarting} />

      {/* Previous Sessions / History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Interview History & Practice Records
          </h2>
          <span className="text-xs text-muted-foreground">
            {interviews.length} Sessions Recorded
          </span>
        </div>

        <InterviewHistoryList interviews={interviews} isLoading={isLoadingHistory} />
      </div>
    </div>
  )
}
