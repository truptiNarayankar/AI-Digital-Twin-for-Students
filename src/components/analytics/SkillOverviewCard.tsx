import { Sparkles, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { SkillAnalytics } from '@/types/analytics'

interface SkillOverviewCardProps {
  data: SkillAnalytics
}

const CATEGORY_LABELS: Record<string, string> = {
  PROGRAMMING: 'Programming',
  WEB_DEVELOPMENT: 'Web Development',
  DATABASE: 'Database',
  CLOUD: 'Cloud',
  DEVOPS: 'DevOps',
  AI_ML: 'AI / ML',
  DATA_SCIENCE: 'Data Science',
  SOFT_SKILL: 'Soft Skills',
  TOOLS: 'Tools',
  TECHNICAL: 'Technical',
  SOFT: 'Soft Skills',
  OTHER: 'Other',
}

const PROFICIENCY_COLORS: Record<string, string> = {
  BEGINNER: 'bg-foreground-subtle text-foreground-muted',
  INTERMEDIATE: 'bg-secondary/20 text-secondary',
  ADVANCED: 'bg-primary/20 text-primary',
  EXPERT: 'bg-accent/20 text-accent',
}

const PROFICIENCY_BAR_COLORS: Record<string, string> = {
  BEGINNER: 'bg-foreground-subtle/50',
  INTERMEDIATE: 'bg-secondary',
  ADVANCED: 'bg-primary',
  EXPERT: 'bg-accent',
}

const PROFICIENCY_LABELS: Record<string, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
}

export function SkillOverviewCard({ data }: SkillOverviewCardProps) {
  if (!data.hasData) {
    return (
      <Card variant="default" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-secondary" />
          <h3 className="text-base font-bold text-foreground font-display">Skill Overview</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-surface-raised flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-foreground-subtle" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No skills added yet.</p>
            <p className="text-xs text-foreground-muted mt-1 mb-3">
              Add your technical skills to build your Digital Twin.
            </p>
            <Link to="/student/profile">
              <Button variant="outline" size="sm">
                Add Skills
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  const maxCategoryCount = Math.max(...data.byCategory.map((c) => c.count), 1)

  return (
    <Card variant="default" className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground font-display">Skill Overview</h3>
            <p className="text-xs text-foreground-muted">
              {data.totalSkills} skill{data.totalSkills !== 1 ? 's' : ''} recorded
            </p>
          </div>
        </div>
        <Badge variant="secondary" size="sm">
          {data.verifiedSkills} verified
        </Badge>
      </div>

      {/* Proficiency Distribution */}
      <div className="flex flex-wrap gap-2 mb-5">
        {data.byProficiency.map((p) => (
          <span
            key={p.proficiency}
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg',
              PROFICIENCY_COLORS[p.proficiency] || 'bg-surface-raised text-foreground-muted'
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', PROFICIENCY_BAR_COLORS[p.proficiency])} />
            {PROFICIENCY_LABELS[p.proficiency] || p.proficiency}: {p.count}
          </span>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="space-y-2.5 mb-5">
        {data.byCategory.slice(0, 6).map((cat, i) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs text-foreground-muted w-28 shrink-0 truncate">
              {CATEGORY_LABELS[cat.category] || cat.category}
            </span>
            <div className="flex-1 h-1.5 bg-surface-raised rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                transition={{ delay: i * 0.05 + 0.1, duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
              />
            </div>
            <span className="text-xs font-bold text-foreground w-5 text-right">{cat.count}</span>
          </motion.div>
        ))}
      </div>

      {/* Rule-based Insights */}
      {data.insights.length > 0 && (
        <div className="border-t border-border pt-4 space-y-2">
          {data.insights.slice(0, 2).map((insight, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
              <p className="text-xs text-foreground-muted">{insight}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
