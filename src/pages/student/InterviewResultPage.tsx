import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { studentService } from '../../services/student.service'
import { InterviewResultView } from '../../components/interview/InterviewResultView'
import type { InterviewSession } from '../../types/interview'

export function InterviewResultPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [session, setSession] = useState<InterviewSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadResult(id)
    }
  }, [id])

  const loadResult = async (sessionId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await studentService.getInterviewResult(sessionId)
      setSession(data)
    } catch (err: unknown) {
      console.error('Failed to load interview result:', err)
      const message =
        (err as any)?.response?.data?.message ||
        (err as any)?.message ||
        'Failed to load interview evaluation report.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading Interview Evaluation Report...
        </p>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Report Not Available</h2>
        <p className="text-sm text-muted-foreground">
          {error || 'The requested interview evaluation report could not be loaded.'}
        </p>
        <Link
          to="/student/interview"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Interviews
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3 py-2">
        <Link
          to="/student/interview"
          className="p-2 rounded-xl border border-border/60 hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-foreground">
            Interview Assessment Report
          </h1>
          <p className="text-xs text-muted-foreground">
            Session ID: <span className="font-mono">{session.sessionId}</span>
          </p>
        </div>
      </div>

      {/* Main Results View */}
      <InterviewResultView
        session={session}
        onRetake={() => navigate('/student/interview')}
      />
    </div>
  )
}
