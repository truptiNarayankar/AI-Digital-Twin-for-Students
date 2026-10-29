import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Send,
  AlertTriangle,
  X,
  ShieldCheck,
} from 'lucide-react'
import { studentService } from '../../services/student.service'
import { QuestionCard } from '../../components/interview/QuestionCard'
import { AnswerEvaluationPanel } from '../../components/interview/AnswerEvaluationPanel'
import type { InterviewSession, InterviewQuestion } from '../../types/interview'

export function ActiveInterviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [session, setSession] = useState<InterviewSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [answerText, setAnswerText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showAbandonModal, setShowAbandonModal] = useState(false)

  useEffect(() => {
    if (id) {
      loadSession(id)
    }
  }, [id])

  const loadSession = async (sessionId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await studentService.getInterview(sessionId)
      setSession(data)

      if (data.status === 'COMPLETED') {
        navigate(`/student/interview/${data.sessionId || data._id}/result`, { replace: true })
      }
    } catch (err: unknown) {
      console.error('Failed to load session:', err)
      const message =
        (err as any)?.response?.data?.message ||
        (err as any)?.message ||
        'Failed to load interview session.'
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
          Connecting to AI Interview Session...
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
        <h2 className="text-xl font-bold text-foreground">Interview Session Error</h2>
        <p className="text-sm text-muted-foreground">{error || 'Session could not be loaded.'}</p>
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

  // Determine current active question
  const currentIdx = Math.min(session.currentQuestionIndex, session.questions.length - 1)
  const currentQuestion: InterviewQuestion | undefined = session.questions[currentIdx]
  const isCurrentAnswered = Boolean(currentQuestion?.studentAnswer)
  const isLastQuestion = currentIdx + 1 >= session.questionCount
  const wordCount = answerText.trim().split(/\s+/).filter(Boolean).length

  // Handle Answer Submission
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentQuestion || !answerText.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      setError(null)

      const result = await studentService.submitInterviewAnswer(session.sessionId || session._id, {
        questionId: currentQuestion.questionId,
        answer: answerText.trim(),
      })

      // Update state with evaluated session
      setSession(result.session)
      setAnswerText('')
    } catch (err: unknown) {
      console.error('Failed to submit answer:', err)
      const msg =
        (err as any)?.response?.data?.message ||
        (err as any)?.message ||
        'Failed to evaluate answer. Please try again.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Advance to Next Question or Finalize
  const handleNextOrComplete = async () => {
    const answeredCount = session.questions.filter((q) => q.studentAnswer).length

    if (answeredCount >= session.questionCount || isLastQuestion) {
      try {
        setIsFinalizing(true)
        setError(null)
        await studentService.completeInterview(session.sessionId || session._id)
        navigate(`/student/interview/${session.sessionId || session._id}/result`)
      } catch (err: unknown) {
        console.error('Failed to complete interview:', err)
        const msg =
          (err as any)?.response?.data?.message ||
          (err as any)?.message ||
          'Failed to finalize interview report.'
        setError(msg)
      } finally {
        setIsFinalizing(false)
      }
    } else {
      // Reload session to guarantee next question is synced
      await loadSession(session.sessionId || session._id)
      setAnswerText('')
    }
  }

  // Abandon Session
  const handleAbandon = async () => {
    try {
      await studentService.abandonInterview(session.sessionId || session._id)
      navigate('/student/interview')
    } catch (err: unknown) {
      console.error('Failed to abandon session:', err)
      navigate('/student/interview')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Session Top Nav */}
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-3">
          <Link
            to="/student/interview"
            className="p-2 rounded-xl border border-border/60 hover:bg-muted/40 transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-foreground">
              {session.targetRole} • {session.interviewType}
            </h1>
            <p className="text-xs text-muted-foreground">
              Session ID: <span className="font-mono">{session.sessionId}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAbandonModal(true)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          Exit Session
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Question Card */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          questionIndex={currentIdx}
          totalQuestions={session.questionCount}
          targetRole={session.targetRole}
          difficulty={session.difficulty}
        />
      )}

      {/* Answer Area OR Evaluation View */}
      {isCurrentAnswered && currentQuestion ? (
        <AnswerEvaluationPanel
          question={currentQuestion}
          isLastQuestion={isLastQuestion}
          onNext={handleNextOrComplete}
          isLoadingNext={isFinalizing}
        />
      ) : (
        <form onSubmit={handleSubmitAnswer} className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 via-card/50 to-card/90 backdrop-blur-xl p-5 sm:p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-primary" />
                Your Spoken / Written Response
              </label>
              <span className="text-xs font-mono text-muted-foreground">
                {wordCount} words
              </span>
            </div>

            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Structure your answer thoroughly. For technical questions, mention data structures, algorithms, and trade-offs. For behavioral questions, outline Situation, Task, Action, and Result (STAR)..."
              rows={8}
              required
              disabled={isSubmitting}
              className="w-full p-4 rounded-xl bg-background/60 border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/60 transition-all outline-none text-sm leading-relaxed resize-y font-sans"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Evaluated against industry benchmarks by Gemini AI
              </span>

              <motion.button
                type="submit"
                disabled={isSubmitting || wordCount < 3}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-primary to-indigo-600 text-white shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    AI Analyzing Answer...
                  </>
                ) : (
                  <>
                    Submit Answer for AI Review
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      )}

      {/* Abandon Confirmation Modal */}
      <AnimatePresence>
        {showAbandonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl border border-border/80 bg-card p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowAbandonModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground">Abandon Mock Interview?</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Exiting will mark this session as abandoned. Unanswered questions will not be scored, and you will return to the interview hub.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAbandonModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  Continue Interview
                </button>
                <button
                  type="button"
                  onClick={handleAbandon}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                >
                  Exit & Abandon
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
