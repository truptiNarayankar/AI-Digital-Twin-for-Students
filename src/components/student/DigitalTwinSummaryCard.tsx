import {
  Brain,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  Code2,
  FolderKanban,
  Award,
  Target,
  FileText,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { DigitalTwinSummary } from '@/types/student'

interface DigitalTwinSummaryCardProps {
  summary: DigitalTwinSummary | null
  onTabSelect?: (tabId: string) => void
}

export function DigitalTwinSummaryCard({ summary, onTabSelect }: DigitalTwinSummaryCardProps) {
  if (!summary) return null

  const { completeness, academics, skills, codingProfiles, projects, certifications, resume } = summary
  const breakdown = completeness.breakdown

  const sections = [
    {
      id: 'personal',
      label: 'Personal & College Info',
      weight: '25%',
      score: breakdown.personal,
      max: 25,
      icon: <Brain className="w-4 h-4" />,
      detail: summary.student.college ? `${summary.student.degree || 'Degree'} • ${summary.student.department || 'Dept'}` : 'Incomplete profile info',
      isComplete: breakdown.personal >= 20,
    },
    {
      id: 'academics',
      label: 'Academic Records',
      weight: '15%',
      score: breakdown.academics,
      max: 15,
      icon: <GraduationCap className="w-4 h-4" />,
      detail: academics.length > 0 ? `${academics.length} semester(s) recorded` : 'No semester records added',
      isComplete: breakdown.academics >= 15,
    },
    {
      id: 'skills',
      label: 'Skills Inventory',
      weight: '15%',
      score: breakdown.skills,
      max: 15,
      icon: <Sparkles className="w-4 h-4" />,
      detail: skills.length > 0 ? `${skills.length} technical skills verified` : 'Add at least 3 skills',
      isComplete: breakdown.skills >= 15,
    },
    {
      id: 'projects',
      label: 'Project Portfolio',
      weight: '15%',
      score: breakdown.projects,
      max: 15,
      icon: <FolderKanban className="w-4 h-4" />,
      detail: projects.length > 0 ? `${projects.length} project(s) showcased` : 'Add academic or personal projects',
      isComplete: breakdown.projects >= 15,
    },
    {
      id: 'coding',
      label: 'Coding Platforms',
      weight: '10%',
      score: breakdown.codingProfiles,
      max: 10,
      icon: <Code2 className="w-4 h-4" />,
      detail: codingProfiles.length > 0 ? `${codingProfiles.length} platform(s) linked` : 'Link LeetCode, CodeChef, etc.',
      isComplete: breakdown.codingProfiles >= 10,
    },
    {
      id: 'certifications',
      label: 'Certifications',
      weight: '10%',
      score: breakdown.certifications,
      max: 10,
      icon: <Award className="w-4 h-4" />,
      detail: certifications.length > 0 ? `${certifications.length} credential(s) verified` : 'Add course or exam credentials',
      isComplete: breakdown.certifications >= 10,
    },
    {
      id: 'career',
      label: 'Career Aspirations',
      weight: '10%',
      score: breakdown.careerGoals,
      max: 10,
      icon: <Target className="w-4 h-4" />,
      detail: summary.student.careerGoal ? `${summary.student.preferredRoles?.length || 0} preferred role(s)` : 'Define target roles and domains',
      isComplete: breakdown.careerGoals >= 10,
    },
  ]

  return (
    <Card className="p-6 border-primary/20 bg-surface">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="text-h3 font-bold text-foreground font-display">
              Digital Twin Foundation Matrix
            </h2>
            <Badge variant="primary" size="sm">
              Deterministic Scoring
            </Badge>
          </div>
          <p className="text-body-sm text-foreground-muted mt-1">
            Deterministic data completeness evaluation across all 7 student profile vectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-bold text-foreground font-display">
              {completeness.percentage}%
            </span>
            <span className="text-xs text-foreground-muted block">Profile Completeness</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            {completeness.percentage >= 70 ? (
              <CheckCircle2 className="w-6 h-6 text-success" />
            ) : (
              <AlertCircle className="w-6 h-6 text-warning" />
            )}
          </div>
        </div>
      </div>

      {/* Grid of Vectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-6">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onTabSelect?.(section.id)}
            className="text-left rounded-xl border border-border p-4 bg-surface-raised/40 hover:bg-surface-raised hover:border-primary/40 transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                <span className="text-primary group-hover:scale-110 transition-transform">
                  {section.icon}
                </span>
                {section.label}
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface border border-border">
                {section.score}/{section.max}
              </span>
            </div>

            <div className="space-y-2 w-full">
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden border border-border/50">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    section.isComplete ? 'bg-success' : section.score > 0 ? 'bg-primary' : 'bg-danger/60'
                  }`}
                  style={{ width: `${(section.score / section.max) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-foreground-muted">
                <span className="truncate">{section.detail}</span>
                <span className="text-primary group-hover:underline flex-shrink-0 ml-1">
                  Manage &rarr;
                </span>
              </div>
            </div>
          </button>
        ))}

        {/* Resume status card */}
        <button
          type="button"
          onClick={() => onTabSelect?.('resume')}
          className="text-left rounded-xl border border-border p-4 bg-surface-raised/40 hover:bg-surface-raised hover:border-primary/40 transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="flex items-center gap-2 text-foreground font-medium text-sm">
              <span className="text-accent group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </span>
              Master Resume
            </div>
            {resume ? (
              <Badge variant="success" size="sm">v{resume.version}</Badge>
            ) : (
              <Badge variant="warning" size="sm">Missing</Badge>
            )}
          </div>

          <div className="text-[11px] text-foreground-muted space-y-1">
            <p className="truncate font-medium text-foreground">
              {resume ? resume.originalFileName : 'No PDF uploaded'}
            </p>
            <p className="text-[10px] text-foreground-muted">
              {resume ? `Uploaded on ${new Date(resume.uploadedAt || resume.lastUploadedAt || resume.createdAt || Date.now()).toLocaleDateString()}` : 'Upload your master resume'}
            </p>
          </div>
        </button>
      </div>

      {/* Non-AI Disclosure Notice */}
      <div className="mt-6 rounded-xl bg-surface-raised/60 border border-border p-4 flex items-start gap-3">
        <Brain className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-xs text-foreground-muted leading-relaxed">
          <span className="font-semibold text-foreground">Digital Twin Data Pipeline: </span>
          All metrics above are calculated deterministically from your structured records.
          AI twin simulations, placement readiness scoring, and smart skill-gap telemetry will be powered in upcoming phases using this verified foundation.
        </div>
      </div>
    </Card>
  )
}
