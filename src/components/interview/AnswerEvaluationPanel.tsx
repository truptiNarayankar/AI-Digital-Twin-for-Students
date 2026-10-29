import { motion } from 'framer-motion'
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Award,
  TrendingUp,
} from 'lucide-react'
import type { InterviewQuestion } from '../../types/interview'

interface AnswerEvaluationPanelProps {
  question: InterviewQuestion
  isLastQuestion: boolean
  onNext: () => void
  isLoadingNext?: boolean
}

export function AnswerEvaluationPanel({
  question,
  isLastQuestion,
  onNext,
  isLoadingNext = false,
}: AnswerEvaluationPanelProps) {
  const score = question.answerScore ?? 0

  const getScoreBadge = (s: number) => {
    if (s >= 85) {
      return {
        bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        label: 'Exceptional Response',
        icon: Award,
      }
    }
    if (s >= 70) {
      return {
        bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
        label: 'Strong Response',
        icon: TrendingUp,
      }
    }
    if (s >= 50) {
      return {
        bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        label: 'Satisfactory Response',
        icon: AlertCircle,
      }
    }
    return {
      bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      label: 'Needs Development',
      icon: AlertCircle,
    }
  }

  const badgeInfo = getScoreBadge(score)
  const BadgeIcon = badgeInfo.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-primary/30 bg-gradient-to-br from-card/90 via-card/70 to-card/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6"
    >
      {/* Score Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeInfo.bg}`}
            >
              <BadgeIcon className="w-3.5 h-3.5" />
              {badgeInfo.label}
            </span>
            <span className="text-xs text-muted-foreground">
              Question {question.questionNumber} Assessment
            </span>
          </div>
          <h4 className="text-xl font-bold text-foreground">AI Assessor Feedback</h4>
        </div>

        <div className="flex items-baseline gap-1 bg-background/80 px-4 py-2 rounded-xl border border-border/60">
          <span className="text-3xl font-extrabold tracking-tight text-primary font-mono">
            {score}
          </span>
          <span className="text-xs text-muted-foreground font-mono">/ 100</span>
        </div>
      </div>

      {/* Evaluator feedback summary */}
      {question.answerFeedback && (
        <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-sm text-foreground/90 leading-relaxed">
          {question.answerFeedback}
        </div>
      )}

      {/* Strengths & Improvements grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Key Strengths Demonstrated
          </div>
          {question.strengths && question.strengths.length > 0 ? (
            <ul className="space-y-2">
              {question.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-foreground/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">General concepts noted.</p>
          )}
        </div>

        {/* Improvements & Missing topics */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            Areas for Expansion & Missing Concepts
          </div>
          <ul className="space-y-2">
            {(question.improvements || []).map((imp, idx) => (
              <li key={`imp-${idx}`} className="flex items-start gap-2 text-xs text-foreground/90">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{imp}</span>
              </li>
            ))}
            {(question.missingTopics || []).map((topic, idx) => (
              <li
                key={`mis-${idx}`}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 mt-1.5 shrink-0" />
                <span>
                  Omitted concept: <strong className="text-foreground/90">{topic}</strong>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Advance Action */}
      <div className="pt-3 flex justify-end">
        <motion.button
          type="button"
          onClick={onNext}
          disabled={isLoadingNext}
          whileHover={{ scale: isLoadingNext ? 1 : 1.02 }}
          whileTap={{ scale: isLoadingNext ? 1 : 0.98 }}
          className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoadingNext ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Preparing Next Step...
            </>
          ) : isLastQuestion ? (
            <>
              <Sparkles className="w-4 h-4" />
              Synthesize Final Evaluation Report
            </>
          ) : (
            <>
              Advance to Next Question
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
