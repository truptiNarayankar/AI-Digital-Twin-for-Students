import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  User,
  GraduationCap,
  Sparkles,
  Code2,
  FolderKanban,
  Award,
  Target,
  FileText,
  Brain,
  AlertCircle,
} from 'lucide-react'
import { Tabs, type TabItem } from '@/components/ui/Tabs'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProfileHeader } from '@/components/student/ProfileHeader'
import { DigitalTwinSummaryCard } from '@/components/student/DigitalTwinSummaryCard'
import { PersonalInfoTab } from '@/components/student/PersonalInfoTab'
import { AcademicTab } from '@/components/student/AcademicTab'
import { SkillsTab } from '@/components/student/SkillsTab'
import { CodingProfilesTab } from '@/components/student/CodingProfilesTab'
import { ProjectsTab } from '@/components/student/ProjectsTab'
import { CertificationsTab } from '@/components/student/CertificationsTab'
import { CareerGoalsTab } from '@/components/student/CareerGoalsTab'
import { ResumeTab } from '@/components/student/ResumeTab'
import { studentService } from '@/services/student.service'
import type { DigitalTwinSummary, StudentProfile } from '@/types/student'

export function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') || 'summary'

  const [digitalTwin, setDigitalTwin] = useState<DigitalTwinSummary | null>(null)
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const twin = await studentService.getDigitalTwin()
      setDigitalTwin(twin)
      setProfile(twin.student)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load student digital twin data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId })
  }

  const handleProfileUpdated = (updated: StudentProfile) => {
    setProfile(updated)
    loadData()
  }

  const tabs: TabItem[] = [
    {
      id: 'summary',
      label: 'Twin Overview',
      icon: <Brain className="w-4 h-4" />,
    },
    {
      id: 'personal',
      label: 'Personal & College',
      icon: <User className="w-4 h-4" />,
    },
    {
      id: 'academics',
      label: 'Academics',
      icon: <GraduationCap className="w-4 h-4" />,
      badge: digitalTwin?.academics?.length || undefined,
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <Sparkles className="w-4 h-4" />,
      badge: digitalTwin?.skills?.length || undefined,
    },
    {
      id: 'coding',
      label: 'Coding Profiles',
      icon: <Code2 className="w-4 h-4" />,
      badge: digitalTwin?.codingProfiles?.length || undefined,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderKanban className="w-4 h-4" />,
      badge: digitalTwin?.projects?.length || undefined,
    },
    {
      id: 'certifications',
      label: 'Certifications',
      icon: <Award className="w-4 h-4" />,
      badge: digitalTwin?.certifications?.length || undefined,
    },
    {
      id: 'career',
      label: 'Career Goals',
      icon: <Target className="w-4 h-4" />,
    },
    {
      id: 'resume',
      label: 'Master Resume',
      icon: <FileText className="w-4 h-4" />,
      badge: digitalTwin?.hasResume ? 'v' + (digitalTwin.resume?.version || '1') : undefined,
    },
  ]

  if (isLoading && !digitalTwin) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-surface rounded-2xl border border-border" />
        <div className="h-12 bg-surface-raised rounded-xl border border-border w-96" />
        <div className="h-96 bg-surface rounded-2xl border border-border" />
      </div>
    )
  }

  if (error && !digitalTwin) {
    return (
      <Card className="p-8 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-danger mx-auto mb-3" />
        <h3 className="text-lg font-bold text-foreground">Error Loading Profile</h3>
        <p className="text-body-sm text-foreground-muted mt-1 mb-4">{error}</p>
        <Button variant="gradient" onClick={loadData}>
          Retry
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Profile Header */}
      <ProfileHeader
        profile={profile}
        digitalTwin={digitalTwin}
        isLoading={isLoading}
        onRefresh={loadData}
      />

      {/* Navigation Tabs Bar */}
      <div className="overflow-x-auto pb-1">
        <Tabs
          tabs={tabs}
          activeTab={currentTab}
          onChange={handleTabChange}
          variant="pills"
        />
      </div>

      {/* Tab Panels */}
      <div>
        {currentTab === 'summary' && (
          <DigitalTwinSummaryCard
            summary={digitalTwin}
            onTabSelect={handleTabChange}
          />
        )}

        {currentTab === 'personal' && (
          <PersonalInfoTab
            profile={profile}
            onProfileUpdated={handleProfileUpdated}
          />
        )}

        {currentTab === 'academics' && (
          <AcademicTab
            records={digitalTwin?.academics || []}
            onRecordsUpdated={loadData}
          />
        )}

        {currentTab === 'skills' && (
          <SkillsTab
            skills={digitalTwin?.skills || []}
            onSkillsUpdated={loadData}
          />
        )}

        {currentTab === 'coding' && (
          <CodingProfilesTab
            profiles={digitalTwin?.codingProfiles || []}
            onProfilesUpdated={loadData}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectsTab
            projects={digitalTwin?.projects || []}
            onProjectsUpdated={loadData}
          />
        )}

        {currentTab === 'certifications' && (
          <CertificationsTab
            certifications={digitalTwin?.certifications || []}
            onCertificationsUpdated={loadData}
          />
        )}

        {currentTab === 'career' && (
          <CareerGoalsTab
            careerGoal={profile?.careerGoal}
            preferredRoles={profile?.preferredRoles || []}
            preferredDomains={profile?.preferredDomains || []}
            onGoalsUpdated={loadData}
          />
        )}

        {currentTab === 'resume' && (
          <ResumeTab
            resume={digitalTwin?.resume || null}
            onResumeUpdated={loadData}
          />
        )}
      </div>
    </div>
  )
}
