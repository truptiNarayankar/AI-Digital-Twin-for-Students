import { useState, useEffect } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Brain, GraduationCap, Sparkles, Code2, FolderKanban, Award } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { CardSkeleton, ChartSkeleton } from '@/components/ui/LoadingSkeleton'
import { AcademicPerformanceCard } from './AcademicPerformanceCard'
import { CGPATrendChart } from './CGPATrendChart'
import { SkillOverviewCard } from './SkillOverviewCard'
import { CodingActivityCard } from './CodingActivityCard'
import { ProjectExperienceCard } from './ProjectExperienceCard'
import { CertificationCard } from './CertificationCard'
import { ProfileCompletenessCard } from './ProfileCompletenessCard'
import { InterviewAnalyticsCard } from './InterviewAnalyticsCard'
import { SkillGapAnalyticsCard } from './SkillGapAnalyticsCard'
import { PlacementReadinessAnalyticsCard } from './PlacementReadinessAnalyticsCard'
import { studentService } from '@/services/student.service'
import type { StudentAnalytics } from '@/types/analytics'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton />
        <ChartSkeleton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    studentService
      .getAnalytics()
      .then((data) => {
        setAnalytics(data)
        setError(null)
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load analytics.'
        setError(message)
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <LoadingState />

  if (error || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center">
          <Brain className="w-8 h-8 text-danger" />
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">Could not load analytics</p>
          <p className="text-sm text-foreground-muted mt-1 max-w-sm">
            {error || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
      </div>
    )
  }

  // Overview stats from real analytics data
  const overviewStats = [
    {
      label: 'Profile Complete',
      value: `${analytics.profile.percentage}%`,
      icon: <Brain className="w-5 h-5 text-primary" />,
      color: 'primary' as const,
      subtext: analytics.profile.status,
    },
    {
      label: 'Latest CGPA',
      value: analytics.academic.latestCgpa != null
        ? analytics.academic.latestCgpa.toFixed(2)
        : '—',
      icon: <GraduationCap className="w-5 h-5 text-secondary" />,
      color: 'secondary' as const,
      subtext: analytics.academic.hasData
        ? `${analytics.academic.totalSemesters} semesters`
        : 'No records',
    },
    {
      label: 'Skills',
      value: analytics.skills.totalSkills,
      icon: <Sparkles className="w-5 h-5 text-success" />,
      color: 'success' as const,
      subtext: `${analytics.skills.verifiedSkills} verified`,
    },
    {
      label: 'Problems Solved',
      value: analytics.coding.totalProblemsSolved,
      icon: <Code2 className="w-5 h-5 text-warning" />,
      color: 'warning' as const,
      subtext: analytics.coding.hasData
        ? `${analytics.coding.totalPlatforms} platforms`
        : 'No profiles',
    },
    {
      label: 'Projects',
      value: analytics.projects.totalProjects,
      icon: <FolderKanban className="w-5 h-5 text-accent" />,
      color: 'accent' as const,
      subtext: analytics.projects.hasData
        ? `${analytics.projects.completedProjects} completed`
        : 'No projects',
    },
    {
      label: 'Certifications',
      value: analytics.certifications.totalCertifications,
      icon: <Award className="w-5 h-5 text-primary" />,
      color: 'primary' as const,
      subtext: analytics.certifications.hasData
        ? `${analytics.certifications.activeCertifications} active`
        : 'None added',
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Overview Stat Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {overviewStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            subtext={stat.subtext}
          />
        ))}
      </motion.div>

      {/* Academic Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AcademicPerformanceCard data={analytics.academic} />
        <CGPATrendChart data={analytics.academic} />
      </motion.div>

      {/* Skills + Coding */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkillOverviewCard data={analytics.skills} />
        <CodingActivityCard data={analytics.coding} />
      </motion.div>

      {/* Projects + Certifications + Completeness */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <ProjectExperienceCard data={analytics.projects} />
        <CertificationCard data={analytics.certifications} />
        <ProfileCompletenessCard data={analytics.profile} />
      </motion.div>

      {/* Mock Interview Intelligence */}
      <motion.div variants={itemVariants}>
        <InterviewAnalyticsCard data={analytics.interviews} />
      </motion.div>

      {/* Skill Gap & Personalized Learning Path Intelligence */}
      <motion.div variants={itemVariants}>
        <SkillGapAnalyticsCard
          skillGap={analytics.skillGap}
          learningPath={analytics.learningPath}
        />
      </motion.div>

      {/* Placement Readiness & Estimated Probability Intelligence — Phase 10 */}
      <motion.div variants={itemVariants}>
        <PlacementReadinessAnalyticsCard placement={analytics.placement} />
      </motion.div>
    </motion.div>
  )
}
