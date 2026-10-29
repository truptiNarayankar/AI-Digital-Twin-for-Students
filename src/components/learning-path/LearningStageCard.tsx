import {
  Clock,
  CheckCircle2,
  PlayCircle,
  Circle,
  ExternalLink,
  BookOpen,
  Video,
  GraduationCap,
  FileCode,
  Terminal,
  FolderGit2,
  Rocket,
  CheckSquare,
} from 'lucide-react'
import type {
  LearningStage,
  LearningStageStatus,
  LearningResourceType,
} from '../../types/learning-path'
import { StageProgressControls } from './StageProgressControls'

interface LearningStageCardProps {
  stage: LearningStage
  onUpdateProgress: (payload: { status?: LearningStageStatus; progress?: number }) => Promise<void>
}

export function LearningStageCard({ stage, onUpdateProgress }: LearningStageCardProps) {
  const getStatusBadge = (status: LearningStageStatus) => {
    switch (status) {
      case 'COMPLETED':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          label: 'Completed',
          classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        }
      case 'IN_PROGRESS':
        return {
          icon: <PlayCircle className="w-4 h-4 text-primary" />,
          label: 'In Progress',
          classes: 'bg-primary/20 text-primary border-primary/30',
        }
      case 'SKIPPED':
        return {
          icon: <Circle className="w-4 h-4 text-muted-foreground" />,
          label: 'Skipped',
          classes: 'bg-muted/40 text-muted-foreground border-border/40',
        }
      default:
        return {
          icon: <Circle className="w-4 h-4 text-muted-foreground" />,
          label: 'Not Started',
          classes: 'bg-muted/30 text-muted-foreground border-border/40',
        }
    }
  }

  const getResourceIcon = (type: LearningResourceType) => {
    switch (type) {
      case 'DOCUMENTATION':
        return <BookOpen className="w-3.5 h-3.5 text-sky-400" />
      case 'VIDEO':
        return <Video className="w-3.5 h-3.5 text-rose-400" />
      case 'COURSE':
        return <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
      case 'PRACTICE':
        return <Terminal className="w-3.5 h-3.5 text-emerald-400" />
      case 'PROJECT':
        return <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
      default:
        return <FileCode className="w-3.5 h-3.5 text-cyan-400" />
    }
  }

  const statusInfo = getStatusBadge(stage.status)

  return (
    <div
      className={`rounded-2xl border transition-all p-6 backdrop-blur-sm space-y-6 ${
        stage.status === 'COMPLETED'
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : stage.status === 'IN_PROGRESS'
          ? 'border-primary/40 bg-card/80 shadow-md shadow-primary/5'
          : 'border-border/70 bg-card/60'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/30 font-mono font-bold text-sm text-primary">
            {stage.stageNumber}
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-foreground">
              {stage.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{stage.estimatedDuration}</span>
            </div>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shrink-0 ${statusInfo.classes}`}
        >
          {statusInfo.icon}
          {statusInfo.label}
        </span>
      </div>

      {/* Stage Objective */}
      <div className="p-3.5 rounded-xl bg-muted/30 border border-border/40 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground mr-1.5">Objective:</span>
        {stage.objective}
      </div>

      {/* Target Skills Tags */}
      <div>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
          Focus Technologies & Concepts
        </span>
        <div className="flex flex-wrap gap-1.5">
          {stage.skills.map((skill, idx) => (
            <span
              key={`${skill}-${idx}`}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Prerequisites if any */}
      {stage.prerequisites && stage.prerequisites.length > 0 && (
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
            Prerequisites
          </span>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {stage.prerequisites.map((req, idx) => (
              <span key={idx} className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                {req}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Practice Tasks & Tangible Project Task */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Practice Tasks */}
        <div className="p-4 rounded-xl border border-border/60 bg-background/50 space-y-2.5">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-primary" />
            Hands-on Practice Tasks
          </span>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {stage.practiceTasks.map((task, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary font-mono mt-0.5">•</span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tangible Project Task Milestone */}
        <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2.5">
          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Rocket className="w-4 h-4 text-primary" />
            Stage Project Milestone
          </span>
          <p className="text-xs text-foreground/90 leading-relaxed">
            {stage.projectTask}
          </p>
        </div>
      </div>

      {/* Recommended Learning Resources */}
      {stage.recommendedResources && stage.recommendedResources.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Curated Resources
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {stage.recommendedResources.map((res, idx) => (
              <a
                key={idx}
                href={res.url || '#'}
                target={res.url ? '_blank' : undefined}
                rel="noreferrer"
                className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/40 hover:border-border transition-all text-xs group"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {getResourceIcon(res.type)}
                  <span className="truncate font-medium text-foreground group-hover:text-primary transition-colors">
                    {res.title}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0 uppercase font-mono">
                  {res.type}
                  {res.url && <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Progress Controls */}
      <StageProgressControls
        currentProgress={stage.progress}
        currentStatus={stage.status}
        onUpdate={onUpdateProgress}
      />
    </div>
  )
}
