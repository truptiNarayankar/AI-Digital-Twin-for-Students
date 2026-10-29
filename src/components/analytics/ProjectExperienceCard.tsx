import { FolderKanban, GitBranch, Globe, CheckCircle2, Clock, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { ProjectAnalytics } from '@/types/analytics'

interface ProjectExperienceCardProps {
  data: ProjectAnalytics
}

const TYPE_LABELS: Record<string, string> = {
  ACADEMIC: 'Academic',
  PERSONAL: 'Personal',
  INTERNSHIP: 'Internship',
  HACKATHON: 'Hackathon',
  OPEN_SOURCE: 'Open Source',
  OTHER: 'Other',
}

const TYPE_COLORS: Record<string, string> = {
  ACADEMIC: 'bg-primary/15 text-primary border-primary/20',
  PERSONAL: 'bg-secondary/15 text-secondary border-secondary/20',
  INTERNSHIP: 'bg-success/15 text-success border-success/20',
  HACKATHON: 'bg-accent/15 text-accent border-accent/20',
  OPEN_SOURCE: 'bg-warning/15 text-warning border-warning/20',
  OTHER: 'bg-surface-raised text-foreground-muted border-border',
}

export function ProjectExperienceCard({ data }: ProjectExperienceCardProps) {
  if (!data.hasData) {
    return (
      <Card variant="default" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FolderKanban className="w-5 h-5 text-accent" />
          <h3 className="text-base font-bold text-foreground font-display">Project Experience</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-surface-raised flex items-center justify-center">
            <FolderKanban className="w-7 h-7 text-foreground-subtle" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No projects added yet.</p>
            <p className="text-xs text-foreground-muted mt-1 mb-3">
              Add your first project to start building your project portfolio.
            </p>
            <Link to="/student/projects">
              <Button variant="outline" size="sm">
                Add a Project
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  const statusStats = [
    {
      label: 'Completed',
      value: data.completedProjects,
      icon: CheckCircle2,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'In Progress',
      value: data.inProgressProjects,
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      label: 'Planned',
      value: data.plannedProjects,
      icon: Calendar,
      color: 'text-foreground-muted',
      bg: 'bg-surface-raised',
    },
  ]

  const maxTechCount = Math.max(...data.topTechnologies.map((t) => t.count), 1)

  return (
    <Card variant="default" className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <FolderKanban className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground font-display">Project Experience</h3>
            <p className="text-xs text-foreground-muted">
              {data.totalProjects} project{data.totalProjects !== 1 ? 's' : ''} recorded
            </p>
          </div>
        </div>
        <Badge variant="accent" size="sm">
          {data.totalProjects} total
        </Badge>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {statusStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={cn('rounded-xl p-3 text-center', stat.bg)}
            >
              <Icon className={cn('w-4 h-4 mx-auto mb-1', stat.color)} />
              <p className={cn('text-lg font-bold font-display', stat.color)}>{stat.value}</p>
              <p className="text-xs text-foreground-muted mt-0.5">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* GitHub + Live URLs */}
      <div className="flex items-center gap-4 mb-5 text-xs">
        <div className="flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5 text-foreground-muted" />
          <span className="text-foreground-muted">
            <span className="font-bold text-foreground">{data.projectsWithGithub}</span> with GitHub
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-foreground-muted" />
          <span className="text-foreground-muted">
            <span className="font-bold text-foreground">{data.projectsWithLive}</span> live deployed
          </span>
        </div>
        {data.averageTeamSize != null && data.averageTeamSize > 1 && (
          <div className="flex items-center gap-1.5">
            <span className="text-foreground-muted">
              Avg. team: <span className="font-bold text-foreground">{data.averageTeamSize}</span>
            </span>
          </div>
        )}
      </div>

      {/* Project types */}
      {data.byType.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {data.byType.map((t) => (
            <span
              key={t.type}
              className={cn(
                'text-xs px-2.5 py-1 rounded-lg border font-medium',
                TYPE_COLORS[t.type] || TYPE_COLORS.OTHER
              )}
            >
              {TYPE_LABELS[t.type] || t.type} ({t.count})
            </span>
          ))}
        </div>
      )}

      {/* Top Technologies */}
      {data.topTechnologies.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">
            Top Technologies
          </h4>
          {data.topTechnologies.slice(0, 8).map((tech, i) => (
            <motion.div
              key={tech.technology}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <span className="text-xs text-foreground-muted w-24 shrink-0 truncate">
                {tech.technology}
              </span>
              <div className="flex-1 h-1.5 bg-surface-raised rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(tech.count / maxTechCount) * 100}%` }}
                  transition={{ delay: i * 0.04 + 0.1, duration: 0.4, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
                />
              </div>
              <span className="text-xs font-bold text-foreground w-12 text-right">
                {tech.count} {tech.count === 1 ? 'project' : 'projects'}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  )
}
