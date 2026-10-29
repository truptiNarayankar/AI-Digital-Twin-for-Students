import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import type { SectionScores } from '@/types/resume'
import {
  FileText,
  Briefcase,
  FolderGit2,
  Cpu,
  GraduationCap,
  Award,
  LayoutTemplate,
} from 'lucide-react'

interface SectionScoresCardProps {
  scores: SectionScores
}

export function SectionScoresCard({ scores }: SectionScoresCardProps) {
  const sections = [
    { key: 'summary', label: 'Summary & Profile', score: scores.summary, icon: FileText, weight: '10%' },
    { key: 'experience', label: 'Work & Internships', score: scores.experience, icon: Briefcase, weight: '25%' },
    { key: 'projects', label: 'Project Portfolio', score: scores.projects, icon: FolderGit2, weight: '25%' },
    { key: 'skills', label: 'Technical Skills', score: scores.skills, icon: Cpu, weight: '15%' },
    { key: 'education', label: 'Academic & Degrees', score: scores.education, icon: GraduationCap, weight: '10%' },
    { key: 'certifications', label: 'Certifications', score: scores.certifications, icon: Award, weight: '5%' },
    { key: 'formatting', label: 'Format & ATS Layout', score: scores.formatting, icon: LayoutTemplate, weight: '10%' },
  ]

  const getScoreColor = (val: number) => {
    if (val >= 85) return 'from-emerald-500 to-teal-400 text-emerald-400 bg-emerald-500/10'
    if (val >= 70) return 'from-indigo-500 to-sky-400 text-indigo-400 bg-indigo-500/10'
    if (val >= 55) return 'from-amber-500 to-yellow-400 text-amber-400 bg-amber-500/10'
    return 'from-rose-500 to-orange-400 text-rose-400 bg-rose-500/10'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-base font-bold text-foreground font-display flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-primary" />
            Section-by-Section Assessment
          </h3>
          <p className="text-xs text-foreground-muted mt-0.5">
            Granular evaluation of core resume sections against competitive benchmarks.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {sections.map((sec, idx) => {
          const Icon = sec.icon
          const colorClass = getScoreColor(sec.score)

          return (
            <motion.div
              key={sec.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-surface border border-border flex items-center justify-center text-foreground-muted">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-foreground">{sec.label}</span>
                  <span className="text-[10px] text-foreground-muted/70">({sec.weight})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-foreground text-sm">
                    {sec.score}
                    <span className="text-[10px] text-foreground-muted font-normal">/100</span>
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="h-2 w-full bg-surface-raised rounded-full overflow-hidden border border-border/50">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(0, sec.score))}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.06, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}
