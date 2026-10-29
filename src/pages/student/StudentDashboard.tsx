import { useState, useEffect } from 'react'
import {
  Brain,
  Sparkles,
  TrendingUp,
  Award,
  FileText,
  MessageSquare,
  Target,
  Activity,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  Code2,
  GraduationCap,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { SkillRadarChart } from '@/components/charts/SkillRadarChart'
import { PerformanceLineChart } from '@/components/charts/PerformanceLineChart'
import { DEMO_PROFILE } from '@/constants'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { studentService } from '@/services/student.service'
import type { DigitalTwinSummary } from '@/types/student'
import { DigitalTwinViz } from '@/components/digital-twin/DigitalTwinViz'

export function StudentDashboard() {
  const { user } = useAuth()
  const [twinData, setTwinData] = useState<DigitalTwinSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [twinError, setTwinError] = useState<string | null>(null)

  const createVirtualCopy = async () => {
    setIsLoading(true)
    setTwinError(null)
    try {
      const data = await studentService.getDigitalTwin()
      setTwinData(data)
    } catch (error: unknown) {
      setTwinError(error instanceof Error ? error.message : 'Could not create your virtual copy.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    studentService
      .getDigitalTwin()
      .then((data) => {
        if (isMounted) setTwinData(data)
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setTwinError(error instanceof Error ? error.message : 'Could not load your virtual copy.')
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const studentName = twinData?.student?.fullName || user?.name || DEMO_PROFILE.name
  const college = twinData?.student?.college || DEMO_PROFILE.college
  const branch = twinData?.student?.department || DEMO_PROFILE.branch
  const cgpa = twinData?.student?.cgpa !== undefined && twinData?.student?.cgpa > 0
    ? twinData.student.cgpa.toFixed(2)
    : DEMO_PROFILE.cgpa
  const completeness = twinData?.completeness?.percentage ?? 0

  if (isLoading && !twinData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-surface rounded-2xl border border-border" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-surface rounded-2xl border border-border" />
          ))}
        </div>
        <div className="h-80 bg-surface rounded-2xl border border-border" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-h1 font-bold text-foreground font-display">
              Welcome back, {studentName.split(' ')[0]}
            </h1>
            {twinData ? (
              <Badge variant="success" size="sm">LIVE PROFILE</Badge>
            ) : (
              <Badge variant="demo" size="sm">DEMO DATA</Badge>
            )}
          </div>
          <p className="text-body-sm text-foreground-muted mt-1">
            {branch} • {college} • CGPA: {cgpa}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/student/profile">
            <Button variant="outline" size="sm" leftIcon={<Award className="w-4 h-4" />}>
              Manage Profile
            </Button>
          </Link>
          <Link to="/student/digital-twin">
            <Button variant="gradient" size="sm" leftIcon={<Brain className="w-4 h-4" />}>
              View Full Twin Model
            </Button>
          </Link>
        </div>
      </div>

      {/* Phase 5 Data Foundation Telemetry Card */}
      {twinData && (
        <Card className="p-5 border-primary/20 bg-gradient-to-r from-surface via-surface-raised/40 to-surface">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground font-display">
                  Phase 5: Digital Twin Foundation Health
                </h3>
                <Badge variant={completeness >= 70 ? 'success' : 'warning'} size="sm">
                  {completeness}% Completeness
                </Badge>
              </div>
              <p className="text-xs text-foreground-muted">
                Deterministic profile readiness calculated from real academic transcripts, project artefacts, and coding accounts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border">
                <GraduationCap className="w-3.5 h-3.5 text-primary" />
                {twinData.academics.length} Semesters
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                {twinData.skills.length} Skills
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border">
                <FolderKanban className="w-3.5 h-3.5 text-accent" />
                {twinData.projects.length} Projects
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border">
                <Code2 className="w-3.5 h-3.5 text-warning" />
                {twinData.codingProfiles.length} Platforms
              </span>
              <Link to="/student/profile">
                <Button variant="ghost" size="sm" className="text-primary text-xs h-8">
                  Update Foundation &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-5 sm:p-6 border-primary/20 bg-gradient-to-br from-surface via-surface-raised/30 to-surface overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
          <div className="lg:col-span-2 min-w-0">
            <DigitalTwinViz
              interactive
              syncPercentage={twinData ? completeness : 0}
              className="max-w-[320px]"
            />
          </div>
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-foreground font-display">Your Virtual Career Copy</h2>
              <Badge variant={twinData ? 'success' : 'demo'} size="sm">
                {twinData ? 'LIVE PROFILE' : 'PREVIEW'}
              </Badge>
            </div>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Your digital twin brings academics, skills, projects and career progress together in one interactive profile.
              Keep your information up to date to make this virtual copy more complete.
            </p>
            {twinError && (
              <p role="alert" className="flex items-center gap-2 text-sm text-danger">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {twinError}
              </p>
            )}
            <div className="flex flex-wrap gap-3 text-xs text-foreground-muted">
              <span className="px-3 py-2 rounded-lg bg-surface border border-border">
                {twinData ? `${completeness}% profile complete` : 'Create your virtual copy from your profile'}
              </span>
              {twinData && (
                <span className="px-3 py-2 rounded-lg bg-surface border border-border">
                  {twinData.skills.length} skills · {twinData.projects.length} projects · {twinData.academics.length} semesters
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="gradient"
                size="sm"
                isLoading={isLoading}
                onClick={() => void createVirtualCopy()}
                leftIcon={<Brain className="w-4 h-4" />}
              >
                {twinData ? 'Sync Virtual Copy' : 'Create Virtual Copy'}
              </Button>
              <Link to="/student/digital-twin">
                <Button variant="outline" size="sm" leftIcon={<Brain className="w-4 h-4" />}>
                  Explore Virtual Copy
                </Button>
              </Link>
              <Link to="/student/profile">
                <Button variant="outline" size="sm">Update My Profile</Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Digital Twin Health */}
        <StatCard
          label="Twin Health"
          value={twinData ? `${completeness}%` : `${DEMO_PROFILE.twinHealth}%`}
          change={4}
          icon={<Brain className="w-5 h-5 text-primary" />}
          color="primary"
          isDemo={!twinData}
        />

        {/* 2. Placement Readiness */}
        <StatCard
          label="Readiness Index"
          value={`${DEMO_PROFILE.placementReadiness}%`}
          change={8}
          icon={<Award className="w-5 h-5 text-secondary" />}
          color="secondary"
          isDemo
        />

        {/* 3. AI Estimated Placement Probability */}
        <StatCard
          label="Est. Probability"
          value={`${DEMO_PROFILE.placementProbability}%`}
          change={5}
          icon={<TrendingUp className="w-5 h-5 text-success" />}
          color="success"
          isDemo
        />

        {/* 4. Skill Gap */}
        <StatCard
          label="Skill Gap"
          value={`${DEMO_PROFILE.skillGapScore}%`}
          change={-6}
          icon={<Target className="w-5 h-5 text-warning" />}
          color="warning"
          isDemo
        />

        {/* 5. Resume Score */}
        <StatCard
          label="Resume Score"
          value={twinData?.hasResume ? 'Active' : `${DEMO_PROFILE.resumeScore}%`}
          change={3}
          icon={<FileText className="w-5 h-5 text-accent" />}
          color="accent"
          isDemo={!twinData?.hasResume}
        />

        {/* 6. Interview Score */}
        <StatCard
          label="Interview Score"
          value={`${DEMO_PROFILE.interviewScore}%`}
          change={6}
          icon={<MessageSquare className="w-5 h-5 text-primary" />}
          color="primary"
          isDemo
        />
      </div>

      {/* Main Insights and Telemetry Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Performance Progression Chart (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="default" className="p-6 rounded-2xl border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground font-display flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Twin Readiness Trajectory
                </h3>
                <p className="text-xs text-foreground-muted mt-0.5">
                  Historical placement probability and skill index growth
                </p>
              </div>
              <Badge variant="demo" size="sm">SIMULATION</Badge>
            </div>
            <div className="h-64">
              <PerformanceLineChart />
            </div>
          </Card>

          {/* AI Recommendation Banner */}
          <Card variant="glow" className="p-5 rounded-2xl border-primary/30">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    AI Mentor Recommendation • PHASE 6 PREVIEW
                  </span>
                  <span className="text-[10px] text-foreground-subtle">Awaiting model weights</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  "Ensure your academic records and GitHub repository artefacts are up to date.
                  Our neural twin engine will use your verified foundation to benchmark eligibility for upcoming placement drives."
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <Link to="/student/profile?tab=projects">
                    <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">
                      Review Projects &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Radar Chart + Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="default" className="p-6 rounded-2xl border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-foreground font-display flex items-center gap-2">
                <Brain className="w-4 h-4 text-secondary" />
                Competency Radar
              </h3>
              <Badge variant="demo" size="sm">DEMO</Badge>
            </div>
            <p className="text-xs text-foreground-muted mb-4">
              Current proficiency balance across all academic and vocational vectors.
            </p>
            <div className="h-64 flex items-center justify-center">
              <SkillRadarChart />
            </div>
          </Card>

          <Card variant="default" className="p-6 rounded-2xl border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-foreground font-display flex items-center gap-2">
                <Activity className="w-4 h-4 text-success" />
                Recent Twin Foundation Activity
              </h3>
              <span className="text-xs text-foreground-subtle">Deterministic log</span>
            </div>
            <div className="space-y-3 mt-4 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-raised">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Personal information synchronized</span>
                </div>
                <span className="text-primary font-semibold">25% pts</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-raised">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Technical skills cataloged</span>
                </div>
                <span className="text-secondary font-semibold">
                  {twinData ? `${twinData.skills.length} skills` : 'Verified'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-raised">
                <div className="flex items-center gap-2">
                  {twinData?.hasResume ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-warning" />
                  )}
                  <span>Master resume status</span>
                </div>
                <span className={twinData?.hasResume ? 'text-success font-semibold' : 'text-warning font-semibold'}>
                  {twinData?.hasResume ? 'Uploaded' : 'Action needed'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
