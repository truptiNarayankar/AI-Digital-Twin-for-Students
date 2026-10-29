/**
 * Phase 6 — Analytics TypeScript Types
 * Deterministic, transparent analytics types — no AI, no predictions.
 * All metrics are aggregations of student-provided data.
 */

// ============================================================
// Academic Analytics
// ============================================================

export interface CgpaTrendPoint {
  semester: number
  cgpa: number
  academicYear?: string
}

export type AcademicTrend = 'IMPROVING' | 'DECLINING' | 'STABLE' | 'INSUFFICIENT_DATA'

export interface AcademicAnalytics {
  hasData: boolean
  totalSemesters: number
  latestCgpa: number | null
  averageCgpa: number | null
  highestCgpa: number | null
  lowestCgpa: number | null
  totalBacklogs: number
  currentBacklogs: number
  semestersWithBacklogs: number
  trend: AcademicTrend
  trendDelta: number | null
  cgpaTrend: CgpaTrendPoint[]
}

// ============================================================
// Skill Analytics
// ============================================================

export interface SkillCategoryCount {
  category: string
  count: number
}

export interface SkillProficiencyCount {
  proficiency: string
  count: number
}

export interface SkillSourceCount {
  source: string
  count: number
}

export interface SkillAnalytics {
  hasData: boolean
  totalSkills: number
  verifiedSkills: number
  selfReportedSkills: number
  byCategory: SkillCategoryCount[]
  byProficiency: SkillProficiencyCount[]
  bySource: SkillSourceCount[]
  topCategory: string | null
  insights: string[]
}

// ============================================================
// Coding Analytics
// ============================================================

export interface CodingPlatformStat {
  platform: string
  username: string
  profileUrl: string | null
  problemsSolved: number
  contestsParticipated: number
  rating: number | null
  highestRating: number | null
  easySolved: number
  mediumSolved: number
  hardSolved: number
  isManual: boolean
}

export interface CodingAnalytics {
  hasData: boolean
  totalPlatforms: number
  totalProblemsSolved: number
  totalContests: number
  highestRating: number | null
  averageRating: number | null
  platforms: CodingPlatformStat[]
}

// ============================================================
// Project Analytics
// ============================================================

export interface TechCount {
  technology: string
  count: number
}

export interface ProjectTypeCount {
  type: string
  count: number
}

export interface ProjectAnalytics {
  hasData: boolean
  totalProjects: number
  completedProjects: number
  inProgressProjects: number
  plannedProjects: number
  projectsWithGithub: number
  projectsWithLive: number
  topTechnologies: TechCount[]
  byType: ProjectTypeCount[]
  averageTeamSize: number | null
}

// ============================================================
// Certification Analytics
// ============================================================

export interface CertificationOrgCount {
  organization: string
  count: number
}

export interface CertificationAnalytics {
  hasData: boolean
  totalCertifications: number
  activeCertifications: number
  expiredCertifications: number
  byOrganization: CertificationOrgCount[]
  skillsCovered: string[]
}

// ============================================================
// Profile Completeness Analytics
// Transparent weighted formula — each item's weight is documented.
// ============================================================

export interface CompletenessItem {
  key: string
  label: string
  completed: boolean
  weight: number
  actionLabel: string
  actionPath: string
}

export type CompletenessStatus = 'INCOMPLETE' | 'MODERATE' | 'GOOD' | 'EXCELLENT'

export interface ProfileCompletenessAnalytics {
  percentage: number
  completedWeight: number
  checklist: CompletenessItem[]
  status: CompletenessStatus
}

// ============================================================
// Resume Analytics — Phase 7
// ============================================================

export interface ResumeAnalytics {
  hasResume: boolean
  fileName: string | null
  originalFileName: string | null
  version: number
  uploadedAt: string | null
  analysisStatus: string
  lastAnalyzedAt: string | null
  overallScore: number | null
  targetRole: string | null
}

// ============================================================
// Interview Analytics — Phase 8
// ============================================================

export interface InterviewScorePoint {
  date: string
  score: number
  type: string
  targetRole: string
  difficulty: string
}

export interface InterviewTypeCount {
  type: string
  count: number
  averageScore: number | null
}

export interface InterviewAnalytics {
  hasData: boolean
  totalInterviews: number
  completedInterviews: number
  inProgressInterviews: number
  averageScore: number | null
  highestScore: number | null
  latestScore: number | null
  byType: InterviewTypeCount[]
  scoreProgression: InterviewScorePoint[]
}

export interface SkillGapAnalytics {
  hasAnalysis: boolean
  targetRole: string | null
  overallMatchScore: number | null
  totalStrengths: number
  totalGaps: number
  highPriorityGaps: number
  moderateGaps: number
  missingSkillsCount: number
  analyzedAt: string | null
  isStale: boolean
}

export interface LearningPathAnalytics {
  hasPath: boolean
  targetRole: string | null
  totalStages: number
  completedStages: number
  inProgressStages: number
  overallProgress: number
  totalEstimatedWeeks: number
  status: string
  updatedAt: string | null
}

export interface PlacementAnalytics {
  hasAssessment: boolean
  overallReadinessScore: number | null
  estimatedPlacementProbability: number | null
  readinessLevel: string | null
  targetRole: string | null
  dimensionScores: {
    academics: number
    technicalSkills: number
    codingAbility: number
    projects: number
    resume: number
    interviewPerformance: number
    certifications: number
    careerAlignment: number
    profileCompleteness: number
  } | null
  blockersCount: number
  criticalBlockersCount: number
  generatedAt: string | null
  isStale: boolean
}

// ============================================================
// Root Analytics Object
// ============================================================

export interface StudentAnalytics {
  academic: AcademicAnalytics
  skills: SkillAnalytics
  coding: CodingAnalytics
  projects: ProjectAnalytics
  certifications: CertificationAnalytics
  profile: ProfileCompletenessAnalytics
  resume?: ResumeAnalytics
  interviews?: InterviewAnalytics
  skillGap?: SkillGapAnalytics
  learningPath?: LearningPathAnalytics
  placement?: PlacementAnalytics
}


