import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { ScoreCircle } from '../resume/ScoreCircle'
import type { InterviewSession } from '../../types/interview'

interface InterviewResultViewProps {
  session: InterviewSession
  onRetake?: () => void
}

export function InterviewResultView({ session, onRetake }: InterviewResultViewProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0)

  const overallScore = session.overallScore ?? 75
  const categoryScores = session.categoryScores || {}

  const dateStr = new Date(
    session.completedAt || session.startedAt || session.createdAt
  ).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const dimensions = [
    {
      key: 'technical',
      label: 'Technical Depth',
      score: categoryScores.technical ?? overallScore,
      desc: 'Correctness, design patterns & domain depth',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      key: 'communication',
      label: 'Communication & Structure',
      score: categoryScores.communication ?? Math.max(50, overallScore - 4),
      desc: 'Clarity, conciseness & structured thinking',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      key: 'problemSolving',
      label: 'Problem Solving & Edge Cases',
      score: categoryScores.problemSolving ?? Math.min(95, overallScore + 2),
      desc: 'Analytical breakdown, trade-offs & scaling',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      key: 'behavioral',
      label: 'Behavioral & Alignment',
      score: categoryScores.behavioral ?? Math.max(55, overallScore - 2),
      desc: 'Accountability, team synergy & STAR framing',
      color: 'from-amber-500 to-orange-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Top Disclaimer Banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-semibold">
            AI-Generated Mock Assessment Score:
          </strong>{' '}
          This score and diagnostic report are derived from automated analysis of technical and behavioral responses using Gemini AI models. They provide directional feedback for interview skill enhancement and do not constitute an actual hiring offer or company placement guarantee.
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/60 to-card/95 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left info */}
          <div className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Award className="w-3.5 h-3.5" />
              Comprehensive Mock Evaluation
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {session.targetRole}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {session.interviewType} Interview • {session.difficulty} Difficulty
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {dateStr}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                {session.questions.length} Questions Evaluated
              </span>
            </div>

            {/* Action buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {onRetake ? (
                <button
                  type="button"
                  onClick={onRetake}
                  className="px-5 py-2.5 rounded-xl font-medium text-xs bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Practice Again
                </button>
              ) : (
                <Link
                  to="/student/interview"
                  className="px-5 py-2.5 rounded-xl font-medium text-xs bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  New Interview Session
                </Link>
              )}
              <Link
                to="/student/digital-twin"
                className="px-4 py-2.5 rounded-xl font-medium text-xs border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all flex items-center gap-1.5"
              >
                Digital Twin Profile
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/student/analytics"
                className="px-4 py-2.5 rounded-xl font-medium text-xs border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all flex items-center gap-1.5"
              >
                Analytics Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Score Circle */}
          <div className="flex flex-col items-center">
            <ScoreCircle score={overallScore} size={190} strokeWidth={14} />
          </div>
        </div>
      </div>

      {/* Synthesis Paragraph */}
      {session.feedback && (
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-6 space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Executive Assessor Synthesis
          </h3>
          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
            {session.feedback}
          </p>
        </div>
      )}

      {/* 4 Dimension Category Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dimensions.map((dim) => (
          <div
            key={dim.key}
            className="rounded-2xl border border-border/50 bg-card/40 p-5 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground/80">{dim.label}</span>
              <span className="text-xl font-bold font-mono text-foreground">{dim.score}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dim.score}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${dim.color} rounded-full`}
              />
            </div>

            <p className="text-[11px] text-muted-foreground">{dim.desc}</p>
          </div>
        ))}
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-5 h-5" />
            Demonstrated Interview Strengths
          </div>
          <ul className="space-y-3">
            {(session.strengths || []).map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Knowledge Gaps */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-rose-400 uppercase tracking-wider">
            <AlertTriangle className="w-5 h-5" />
            Identified Knowledge Gaps
          </div>
          <ul className="space-y-3">
            {(session.weaknesses || []).map((weakness, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Recommendations */}
      {session.recommendations && session.recommendations.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-card/50 p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider">
            <BookOpen className="w-5 h-5" />
            Actionable Next Steps & Preparation Recommendations
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {session.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border/40 bg-background/40 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {idx + 1}
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Question-by-Question Review Accordion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Question-by-Question Deep Dive
          </h3>
          <span className="text-xs text-muted-foreground">
            {session.questions.length} Questions
          </span>
        </div>

        <div className="space-y-3">
          {session.questions.map((q, idx) => {
            const isExpanded = expandedQuestion === idx
            const score = q.answerScore ?? 0

            return (
              <div
                key={q.questionId || idx}
                className="rounded-xl border border-border/60 bg-card/40 overflow-hidden transition-all"
              >
                {/* Accordion header */}
                <button
                  type="button"
                  onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-card/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-muted/60 text-muted-foreground flex items-center justify-center font-mono text-xs font-semibold shrink-0 mt-0.5 sm:mt-0">
                      Q{idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-sm text-foreground line-clamp-1">
                        {q.questionText}
                      </p>
                      <span className="text-xs text-muted-foreground">{q.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                        score >= 70
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : score >= 50
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {score}/100
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="p-5 pt-0 space-y-4 border-t border-border/40 bg-background/30 text-xs">
                    {/* Full question prompt */}
                    <div className="p-3.5 rounded-lg bg-muted/20 border border-border/40 text-foreground font-medium mt-3">
                      {q.questionText}
                    </div>

                    {/* Candidate's submitted answer */}
                    <div className="space-y-1.5">
                      <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                        Your Answer
                      </span>
                      <div className="p-3.5 rounded-lg bg-background/60 border border-border/40 text-foreground/90 whitespace-pre-wrap leading-relaxed">
                        {q.studentAnswer || '(No answer provided)'}
                      </div>
                    </div>

                    {/* Evaluator feedback */}
                    {q.answerFeedback && (
                      <div className="space-y-1.5">
                        <span className="font-semibold text-primary uppercase tracking-wider text-[10px]">
                          Assessor Feedback
                        </span>
                        <p className="text-foreground/90 leading-relaxed">{q.answerFeedback}</p>
                      </div>
                    )}

                    {/* Strengths & Improvements */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {q.strengths && q.strengths.length > 0 && (
                        <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                          <span className="font-bold text-emerald-400 text-[11px] block">
                            Strengths
                          </span>
                          <ul className="space-y-1 text-[11px] text-foreground/80">
                            {q.strengths.map((str, sIdx) => (
                              <li key={sIdx}>• {str}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {q.improvements && q.improvements.length > 0 && (
                        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-1">
                          <span className="font-bold text-amber-400 text-[11px] block">
                            Areas to Improve
                          </span>
                          <ul className="space-y-1 text-[11px] text-foreground/80">
                            {q.improvements.map((imp, iIdx) => (
                              <li key={iIdx}>• {imp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
