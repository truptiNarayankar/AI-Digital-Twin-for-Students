import { useState, useEffect } from 'react'
import {
  Brain,
  Sparkles,
  Layers,
  GraduationCap,
  Code2,
  FolderKanban,
  Award,
  BarChart3,
  FileText,
  MessageSquare,
  Target,
  BookOpen,
  Compass,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { DigitalTwinViz } from '@/components/digital-twin/DigitalTwinViz'
import { DonutChart } from '@/components/charts/DonutChart'
import { studentService } from '@/services/student.service'
import type { StudentAnalytics } from '@/types/analytics'

export function DigitalTwinPage() {
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState<string>('academic')

  useEffect(() => {
    studentService
      .getAnalytics()
      .then((data) => setAnalytics(data))
      .catch(() => {
        // Analytics unavailable — page still renders with empty states
      })
      .finally(() => setIsLoading(false))
  }, [])

  // Build dynamic dimension cards from real analytics
  const dimensions = [
    {
      id: 'academic',
      label: 'Academic',
      color: '#818cf8',
      icon: GraduationCap,
      value: analytics?.academic.latestCgpa != null
        ? `${analytics.academic.latestCgpa.toFixed(2)} CGPA`
        : '—',
      detail: analytics?.academic.hasData
        ? `${analytics.academic.totalSemesters} semesters • Trend: ${analytics.academic.trend === 'IMPROVING' ? '↑' : analytics.academic.trend === 'DECLINING' ? '↓' : '→'} ${analytics.academic.trend}`
        : 'No academic records yet',
      hasData: analytics?.academic.hasData ?? false,
    },
    {
      id: 'skills',
      label: 'Skills',
      color: '#34d399',
      icon: Sparkles,
      value: analytics ? `${analytics.skills.totalSkills}` : '—',
      detail: analytics?.skills.hasData
        ? `${analytics.skills.verifiedSkills} verified · ${analytics.skills.byCategory.length} categories`
        : 'No skills added yet',
      hasData: analytics?.skills.hasData ?? false,
    },
    {
      id: 'coding',
      label: 'Coding',
      color: '#22d3ee',
      icon: Code2,
      value: analytics?.coding.hasData ? `${analytics.coding.totalProblemsSolved}` : '—',
      detail: analytics?.coding.hasData
        ? `${analytics.coding.totalPlatforms} platforms · ${analytics.coding.totalContests} contests`
        : 'No coding profiles linked',
      hasData: analytics?.coding.hasData ?? false,
    },
    {
      id: 'projects',
      label: 'Projects',
      color: '#a78bfa',
      icon: FolderKanban,
      value: analytics ? `${analytics.projects.totalProjects}` : '—',
      detail: analytics?.projects.hasData
        ? `${analytics.projects.completedProjects} completed · ${analytics.projects.inProgressProjects} in progress`
        : 'No projects added yet',
      hasData: analytics?.projects.hasData ?? false,
    },
    {
      id: 'certifications',
      label: 'Certifications',
      color: '#fbbf24',
      icon: Award,
      value: analytics ? `${analytics.certifications.totalCertifications}` : '—',
      detail: analytics?.certifications.hasData
        ? `${analytics.certifications.activeCertifications} active · ${analytics.certifications.byOrganization.length} orgs`
        : 'No certifications added',
      hasData: analytics?.certifications.hasData ?? false,
    },
    {
      id: 'resume',
      label: 'AI Resume',
      color: '#f43f5e',
      icon: FileText,
      value: analytics?.resume?.overallScore != null
        ? `${analytics.resume.overallScore}/100`
        : analytics?.resume?.hasResume
        ? `v${analytics.resume.version}`
        : '—',
      detail: analytics?.resume?.overallScore != null
        ? `v${analytics.resume.version} AI Analyzed • Quality Score: ${analytics.resume.overallScore}/100`
        : analytics?.resume?.hasResume
        ? `v${analytics.resume.version} Uploaded • Assessment pending`
        : 'No resume document uploaded yet',
      hasData: analytics?.resume?.hasResume ?? false,
    },
    {
      id: 'interview',
      label: 'Mock Interview',
      color: '#06b6d4',
      icon: MessageSquare,
      value: analytics?.interviews?.averageScore != null
        ? `${analytics.interviews.averageScore}/100`
        : analytics?.interviews?.completedInterviews
        ? `${analytics.interviews.completedInterviews} completed`
        : '—',
      detail: analytics?.interviews?.hasData
        ? `${analytics.interviews.completedInterviews} completed • Best: ${analytics.interviews.highestScore ?? '—'}/100`
        : 'No mock interviews taken yet',
      hasData: analytics?.interviews?.hasData ?? false,
    },
    {
      id: 'skillGap',
      label: 'Skill Gap',
      color: '#f59e0b',
      icon: Target,
      value: analytics?.skillGap?.overallMatchScore != null
        ? `${analytics.skillGap.overallMatchScore}%`
        : analytics?.skillGap?.hasAnalysis
        ? `${analytics.skillGap.totalGaps} gaps`
        : '—',
      detail: analytics?.skillGap?.hasAnalysis
        ? `${analytics.skillGap.targetRole || 'Target Role'} • ${analytics.skillGap.totalGaps} gaps (${analytics.skillGap.highPriorityGaps} high priority)`
        : 'No skill gap analysis yet',
      hasData: analytics?.skillGap?.hasAnalysis ?? false,
    },
    {
      id: 'learningPath',
      label: 'Learning Path',
      color: '#10b981',
      icon: BookOpen,
      value: analytics?.learningPath?.hasPath
        ? `${analytics.learningPath.overallProgress}%`
        : '—',
      detail: analytics?.learningPath?.hasPath
        ? `${analytics.learningPath.completedStages}/${analytics.learningPath.totalStages} stages completed • ${analytics.learningPath.totalEstimatedWeeks} weeks`
        : 'No learning path active',
      hasData: analytics?.learningPath?.hasPath ?? false,
    },
    {
      id: 'placement',
      label: 'Placement Readiness',
      color: '#ec4899',
      icon: Compass,
      value: analytics?.placement?.overallReadinessScore != null
        ? `${analytics.placement.overallReadinessScore}/100`
        : analytics?.placement?.hasAssessment
        ? `${analytics.placement.estimatedPlacementProbability}% prob`
        : '—',
      detail: analytics?.placement?.hasAssessment
        ? `${analytics.placement.targetRole || 'Target Role'} • ${analytics.placement.readinessLevel} • ${analytics.placement.estimatedPlacementProbability}% prob`
        : 'No placement assessment yet',
      hasData: analytics?.placement?.hasAssessment ?? false,
    },
  ]

  const activeDim = dimensions.find((d) => d.id === selectedSection) || dimensions[0]
  const ActiveIcon = activeDim.icon
  const completeness = analytics?.profile.percentage ?? 0

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-h1 font-bold text-foreground font-display">
              Digital Twin Overview
            </h1>
            <Badge variant={analytics ? 'success' : 'muted'} size="sm">
              {analytics ? 'LIVE DATA' : 'LOADING'}
            </Badge>
          </div>
          <p className="text-body-sm text-foreground-muted mt-1">
            Dynamic representation of your career profile across all dimensions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/student/analytics">
            <Button
              variant="gradient"
              size="sm"
              leftIcon={<BarChart3 className="w-4 h-4" />}
            >
              Full Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Digital Twin Visualization */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 rounded-3xl bg-surface-raised/40 border border-border relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-2 px-4">
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-4 h-4" /> Digital Twin Spatial Map
            </span>
            <span className="text-[11px] text-foreground-subtle">
              {isLoading ? 'Loading…' : analytics ? 'Live Data' : 'Hover nodes for details'}
            </span>
          </div>

          <DigitalTwinViz
            interactive
            syncPercentage={completeness}
            className="my-4"
          />

          {/* Completeness bar */}
          {!isLoading && (
            <div className="w-full px-4 mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-foreground-muted">Profile Completeness</span>
                <span className="font-bold text-foreground">{completeness}%</span>
              </div>
              <Progress value={completeness} size="md" color="primary" />
            </div>
          )}

          {/* Dimension selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 px-2">
            {dimensions.map((dim) => {
              const Icon = dim.icon
              return (
                <button
                  key={dim.id}
                  onClick={() => setSelectedSection(dim.id)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${
                    selectedSection === dim.id
                      ? 'border-primary bg-primary/20 text-primary font-semibold shadow-sm'
                      : 'border-border bg-surface text-foreground-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {dim.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Selected Dimension + Skill Composition */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="default" className="p-6 rounded-2xl border-border">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
                  style={{ backgroundColor: activeDim.color }}
                >
                  <ActiveIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground font-display">
                    {activeDim.label}
                  </h3>
                  <span className="text-xs text-foreground-subtle">Dimension Overview</span>
                </div>
              </div>
              <div className="text-right">
                <span
                  className="text-2xl font-bold font-display"
                  style={{ color: activeDim.color }}
                >
                  {activeDim.value}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-3.5 rounded-xl bg-surface-raised border border-border text-xs text-foreground-muted">
                <div className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  {activeDim.label} Summary:
                </div>
                <p>{activeDim.detail}</p>
              </div>

              {!activeDim.hasData && (
                <div className="text-center">
                  <Link to={`/student/${activeDim.id === 'academic' ? 'academics' : activeDim.id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Add {activeDim.label} Data →
                    </Button>
                  </Link>
                </div>
              )}

              {activeDim.id === 'resume' && activeDim.hasData && (
                <div className="text-center">
                  <Link to="/student/resume">
                    <Button variant="gradient" size="sm" className="text-xs">
                      Open AI Resume Analyzer →
                    </Button>
                  </Link>
                </div>
              )}

              {activeDim.id === 'interview' && (
                <div className="text-center">
                  <Link to="/student/interview">
                    <Button variant="gradient" size="sm" className="text-xs">
                      Practice Mock Interview →
                    </Button>
                  </Link>
                </div>
              )}

              {activeDim.id === 'skillGap' && (
                <div className="text-center">
                  <Link to="/student/skill-gap">
                    <Button variant="gradient" size="sm" className="text-xs">
                      Analyze Skill Gaps →
                    </Button>
                  </Link>
                </div>
              )}

              {activeDim.id === 'learningPath' && (
                <div className="text-center">
                  <Link to="/student/learning">
                    <Button variant="gradient" size="sm" className="text-xs">
                      Open Learning Path →
                    </Button>
                  </Link>
                </div>
              )}

              {activeDim.id === 'placement' && (
                <div className="text-center">
                  <Link to="/student/placement">
                    <Button variant="gradient" size="sm" className="text-xs">
                      Open Placement Readiness →
                    </Button>
                  </Link>
                </div>
              )}

              {/* Quick link to full analytics */}
              <Link to="/student/analytics">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-primary"
                  rightIcon={<BarChart3 className="w-3 h-3" />}
                >
                  View Detailed Analytics
                </Button>
              </Link>
            </div>
          </Card>

          {/* Skill Composition Donut */}
          <Card variant="default" className="p-6 rounded-2xl border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-foreground font-display flex items-center gap-2">
                <Layers className="w-4 h-4 text-secondary" />
                Skill Composition
              </h3>
              {analytics?.skills.hasData ? (
                <Badge variant="success" size="sm">Live</Badge>
              ) : (
                <Badge variant="muted" size="sm">No Data</Badge>
              )}
            </div>
            <p className="text-xs text-foreground-muted mb-3">
              {analytics?.skills.hasData
                ? `${analytics.skills.totalSkills} skills across ${analytics.skills.byCategory.length} categories`
                : 'Add skills to see your composition breakdown.'}
            </p>
            <div className="h-44 flex items-center justify-center">
              <DonutChart />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
