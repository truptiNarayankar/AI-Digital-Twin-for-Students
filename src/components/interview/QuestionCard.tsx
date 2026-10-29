import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Tag,
  Lightbulb,
} from 'lucide-react'
import type { InterviewQuestion, InterviewDifficulty } from '../../types/interview'

interface QuestionCardProps {
  question: InterviewQuestion
  questionIndex: number
  totalQuestions: number
  targetRole: string
  difficulty: InterviewDifficulty
}

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  targetRole,
  difficulty,
}: QuestionCardProps) {
  const [showHints, setShowHints] = useState(false)

  const progressPercent = Math.round(((questionIndex + 1) / totalQuestions) * 100)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 via-card/50 to-card/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
      {/* Progress header */}
      <div className="space-y-2 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full font-mono font-bold bg-primary/15 text-primary border border-primary/20">
              Question {questionIndex + 1} of {totalQuestions}
            </span>
            <span className="px-2.5 py-1 rounded-full font-medium bg-muted/50 text-muted-foreground border border-border/40 flex items-center gap-1">
              <Tag className="w-3 h-3 text-cyan-400" />
              {question.category}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{targetRole}</span>
            <span>•</span>
            <span className="font-medium text-foreground">{difficulty}</span>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
          />
        </div>
      </div>

      {/* Main Question Text */}
      <div className="relative my-4 p-5 sm:p-6 rounded-xl bg-background/50 border border-border/60">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground leading-relaxed">
              {question.questionText}
            </h3>
          </div>
        </div>
      </div>

      {/* Expected topics hint toggle */}
      {question.expectedTopics && question.expectedTopics.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/40">
          <button
            type="button"
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Key Themes Evaluated by the AI Assessor</span>
            {showHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <AnimatePresence>
            {showHints && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {question.expectedTopics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  Pro tip: Frame your response using concrete terminology and explain architectural trade-offs or rationale.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
