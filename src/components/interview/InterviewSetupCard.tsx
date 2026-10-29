import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Terminal,
  Users,
  Briefcase,
  Cpu,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
} from 'lucide-react'
import type {
  InterviewType,
  InterviewDifficulty,
  CreateInterviewPayload,
} from '../../types/interview'

interface InterviewSetupCardProps {
  onStart: (payload: CreateInterviewPayload) => void
  isLoading?: boolean
  defaultRole?: string
}

const INTERVIEW_TYPES: Array<{
  type: InterviewType
  title: string
  subtitle: string
  icon: typeof Terminal
  accentColor: string
  borderActive: string
  bgActive: string
}> = [
  {
    type: 'TECHNICAL',
    title: 'Technical Round',
    subtitle: 'Data structures, algorithms, system architecture & code logic',
    icon: Terminal,
    accentColor: 'text-cyan-400',
    borderActive: 'border-cyan-500/60 ring-1 ring-cyan-500/30',
    bgActive: 'bg-cyan-500/10',
  },
  {
    type: 'BEHAVIORAL',
    title: 'Behavioral & STAR',
    subtitle: 'Teamwork, conflict management, ownership & leadership scenarios',
    icon: Users,
    accentColor: 'text-purple-400',
    borderActive: 'border-purple-500/60 ring-1 ring-purple-500/30',
    bgActive: 'bg-purple-500/10',
  },
  {
    type: 'SYSTEM_DESIGN',
    title: 'System Design',
    subtitle: 'Distributed scalability, microservices, databases & latency',
    icon: Cpu,
    accentColor: 'text-blue-400',
    borderActive: 'border-blue-500/60 ring-1 ring-blue-500/30',
    bgActive: 'bg-blue-500/10',
  },
  {
    type: 'HR',
    title: 'HR & Culture Fit',
    subtitle: 'Career goals, work ethic, salary expectations & culture alignment',
    icon: Briefcase,
    accentColor: 'text-emerald-400',
    borderActive: 'border-emerald-500/60 ring-1 ring-emerald-500/30',
    bgActive: 'bg-emerald-500/10',
  },
  {
    type: 'MIXED',
    title: 'Comprehensive Mixed',
    subtitle: 'Full-spectrum simulation blending technical, design & behavioral questions',
    icon: Sparkles,
    accentColor: 'text-amber-400',
    borderActive: 'border-amber-500/60 ring-1 ring-amber-500/30',
    bgActive: 'bg-amber-500/10',
  },
]

const POPULAR_ROLES = [
  'Full Stack Engineer',
  'Frontend Engineer',
  'Backend Developer',
  'DevOps / Cloud Engineer',
  'Data Scientist',
  'AI / ML Engineer',
]

const DIFFICULTIES: Array<{
  id: InterviewDifficulty
  label: string
  desc: string
  color: string
}> = [
  {
    id: 'BEGINNER',
    label: 'Entry Level',
    desc: 'Core fundamentals & definitions',
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  },
  {
    id: 'INTERMEDIATE',
    label: 'Mid Level',
    desc: 'Real-world trade-offs & production patterns',
    color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
  },
  {
    id: 'ADVANCED',
    label: 'Senior / Staff',
    desc: 'Complex architectural edge cases & scale',
    color: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
  },
]

const QUESTION_COUNTS = [3, 5, 7, 10]

export function InterviewSetupCard({
  onStart,
  isLoading = false,
  defaultRole = '',
}: InterviewSetupCardProps) {
  const [selectedType, setSelectedType] = useState<InterviewType>('TECHNICAL')
  const [targetRole, setTargetRole] = useState(defaultRole || 'Full Stack Engineer')
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('INTERMEDIATE')
  const [questionCount, setQuestionCount] = useState<number>(5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetRole.trim()) return

    onStart({
      interviewType: selectedType,
      targetRole: targetRole.trim(),
      difficulty,
      questionCount,
    })
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 via-card/50 to-card/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              AI Simulation Studio
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Strict Anti-Injection Verified
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Configure Your Mock Interview
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose your target interview domain, job role, and difficulty to generate custom questions evaluated in real time.
          </p>
        </div>

        {/* 1. Interview Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            1. Select Interview Domain & Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INTERVIEW_TYPES.map((t) => {
              const Icon = t.icon
              const isSelected = selectedType === t.type
              return (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setSelectedType(t.type)}
                  className={`relative text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? `${t.borderActive} ${t.bgActive} shadow-lg shadow-primary/5`
                      : 'border-border/60 bg-card/40 hover:bg-card/70 hover:border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-background/80' : 'bg-muted/50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${t.accentColor}`} />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{t.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {t.subtitle}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 2. Target Job Role */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            2. Target Job Role
          </label>
          <div className="relative">
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Engineer, Cloud Architect, Data Scientist"
              required
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/60 transition-all outline-none text-sm"
            />
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 items-center pt-1">
            <span className="text-xs text-muted-foreground">Quick roles:</span>
            {POPULAR_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setTargetRole(role)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  targetRole === role
                    ? 'bg-primary/20 text-primary border-primary/40 font-medium'
                    : 'bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Difficulty & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              3. Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d) => {
                const isSelected = difficulty === d.id
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficulty(d.id)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? `${d.color} shadow-sm ring-1 ring-primary/30`
                        : 'border-border/50 bg-background/40 hover:bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    <p className="text-xs font-semibold">{d.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">
                      {d.desc}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                4. Number of Questions
              </span>
              <span className="text-xs text-primary font-mono">{questionCount} Questions</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {QUESTION_COUNTS.map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCount(cnt)}
                  className={`py-2.5 rounded-xl border text-center transition-all font-medium text-xs cursor-pointer ${
                    questionCount === cnt
                      ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                      : 'border-border/50 bg-background/40 hover:bg-muted/40 text-muted-foreground'
                  }`}
                >
                  {cnt} Qs
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Estimated duration: ~{questionCount * 3}–{questionCount * 5} minutes.
            </p>
          </div>
        </div>

        {/* Disclaimer & Start Action */}
        <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground/80 max-w-md">
            Scores (0–100) are generated objectively by an AI evaluator for practice and skill identification. They do not constitute an absolute hiring decision.
          </div>
          <motion.button
            type="submit"
            disabled={isLoading || !targetRole.trim()}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-primary via-indigo-500 to-cyan-500 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Session Questions...
              </>
            ) : (
              <>
                Launch Mock Interview
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  )
}
