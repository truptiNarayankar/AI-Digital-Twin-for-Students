/**
 * Analytics Service — Phase 6
 * Calculates deterministic analytics from student's stored data.
 * No AI, no ML — all metrics are transparent aggregations of real data.
 */

import { Student } from '../models/Student.js'
import { AcademicRecord } from '../models/AcademicRecord.js'
import { Skill } from '../models/Skill.js'
import { CodingProfile } from '../models/CodingProfile.js'
import { Project } from '../models/Project.js'
import { Certification } from '../models/Certification.js'
import { Resume } from '../models/Resume.js'
import { ResumeAnalysis } from '../models/ResumeAnalysis.js'
import { Interview } from '../models/Interview.js'
import { SkillGapAnalysis } from '../models/SkillGapAnalysis.js'
import { LearningPath } from '../models/LearningPath.js'
import {
  PlacementAssessment,
  type IPlacementDimensionScores,
} from '../models/PlacementAssessment.js'
import { ApiError } from '../utils/apiError.js'
import { SkillCategory, SkillProficiency, ProjectStatus, ProjectType, SkillGapPriority } from '../types/index.js'

// ============================================================
// Analytics Type Definitions
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

export interface CompletenessItem {
  key: string
  label: string
  completed: boolean
  weight: number
  actionLabel: string
  actionPath: string
}

export interface ProfileCompletenessAnalytics {
  percentage: number
  completedWeight: number
  checklist: CompletenessItem[]
  status: 'INCOMPLETE' | 'MODERATE' | 'GOOD' | 'EXCELLENT'
}

export interface ResumeAnalytics {
  hasResume: boolean
  fileName: string | null
  originalFileName: string | null
  version: number
  uploadedAt: Date | null
  analysisStatus: string
  lastAnalyzedAt: Date | null
  overallScore: number | null
  targetRole: string | null
}

export interface InterviewScorePoint {
  date: Date
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
  analyzedAt: Date | null
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
  updatedAt: Date | null
}

export interface PlacementAnalytics {
  hasAssessment: boolean
  overallReadinessScore: number | null
  estimatedPlacementProbability: number | null
  readinessLevel: string | null
  targetRole: string | null
  dimensionScores: IPlacementDimensionScores | null
  blockersCount: number
  criticalBlockersCount: number
  generatedAt: Date | null
  isStale: boolean
}

export interface StudentAnalytics {
  academic: AcademicAnalytics
  skills: SkillAnalytics
  coding: CodingAnalytics
  projects: ProjectAnalytics
  certifications: CertificationAnalytics
  profile: ProfileCompletenessAnalytics
  resume: ResumeAnalytics
  interviews: InterviewAnalytics
  skillGap?: SkillGapAnalytics
  learningPath?: LearningPathAnalytics
  placement?: PlacementAnalytics
}

// ============================================================
// Analytics Service
// ============================================================

export class AnalyticsService {
  /**
   * Aggregates and calculates all analytics for the authenticated student.
   * Resolves student from userId — never accepts an arbitrary studentId.
   */
  static async getStudentAnalytics(userId: string): Promise<StudentAnalytics> {
    // Resolve student from authenticated userId
    const student = await Student.findOne({ userId })
    if (!student) {
      throw ApiError.notFound('Student profile not found. Please complete your profile setup.')
    }
    const studentId = student._id

    // Parallel fetch of all data collections — single round trip
    const [
      academicRecords,
      skills,
      codingProfiles,
      projects,
      certifications,
      resume,
      latestAnalysis,
      interviews,
      skillGapAnalysis,
      learningPath,
      placementAssessment,
    ] = await Promise.all([
      AcademicRecord.find({ studentId }).sort({ semester: 1 }).lean(),
      Skill.find({ studentId }).lean(),
      CodingProfile.find({ studentId }).lean(),
      Project.find({ studentId }).lean(),
      Certification.find({ studentId }).lean(),
      Resume.findOne({ studentId }).sort({ version: -1, createdAt: -1 }).lean(),
      ResumeAnalysis.findOne({ studentId }).sort({ analyzedAt: -1 }).lean(),
      Interview.find({ studentId }).sort({ createdAt: 1 }).lean(),
      SkillGapAnalysis.findOne({ studentId }).sort({ analyzedAt: -1 }).lean(),
      LearningPath.findOne({ studentId }).sort({ updatedAt: -1 }).lean(),
      PlacementAssessment.findOne({ studentId }).sort({ generatedAt: -1 }).lean(),
    ])

    // Determine latest data timestamp for skill gap and placement staleness calculation
    const timestamps: number[] = []
    skills.forEach((s) => s.updatedAt && timestamps.push(new Date(s.updatedAt).getTime()))
    projects.forEach((p) => p.updatedAt && timestamps.push(new Date(p.updatedAt).getTime()))
    certifications.forEach((c) => c.updatedAt && timestamps.push(new Date(c.updatedAt).getTime()))
    codingProfiles.forEach((cp) => cp.updatedAt && timestamps.push(new Date(cp.updatedAt).getTime()))
    if (latestAnalysis?.analyzedAt) timestamps.push(new Date(latestAnalysis.analyzedAt).getTime())
    interviews.forEach((i) => i.completedAt && timestamps.push(new Date(i.completedAt).getTime()))
    const latestDataTimestamp = timestamps.length > 0 ? new Date(Math.max(...timestamps)) : new Date()

    // Calculate each analytics section independently
    const academic = AnalyticsService._calculateAcademicAnalytics(academicRecords)
    const skillsAnalytics = AnalyticsService._calculateSkillAnalytics(skills)
    const coding = AnalyticsService._calculateCodingAnalytics(codingProfiles)
    const projectsAnalytics = AnalyticsService._calculateProjectAnalytics(projects)
    const certificationAnalytics =
      AnalyticsService._calculateCertificationAnalytics(certifications)
    const profile = AnalyticsService._calculateProfileCompleteness(
      student,
      academicRecords,
      skills,
      codingProfiles,
      projects,
      certifications,
      resume
    )
    const interviewAnalytics = AnalyticsService._calculateInterviewAnalytics(interviews)
    const skillGap = AnalyticsService._calculateSkillGapAnalytics(
      skillGapAnalysis,
      latestDataTimestamp
    )
    const learningPathAnalytics = AnalyticsService._calculateLearningPathAnalytics(learningPath)

    const resumeAnalytics: ResumeAnalytics = {
      hasResume: Boolean(resume),
      fileName: resume?.fileName || null,
      originalFileName: (resume as any)?.originalFileName || resume?.fileName || null,
      version: resume?.version || 0,
      uploadedAt: resume?.uploadedAt || null,
      analysisStatus: resume?.analysisStatus || 'NOT_ANALYZED',
      lastAnalyzedAt: resume?.lastAnalyzedAt || null,
      overallScore: latestAnalysis?.overallScore ?? null,
      targetRole: latestAnalysis?.targetRole ?? null,
    }

    const placement: PlacementAnalytics = {
      hasAssessment: Boolean(placementAssessment),
      overallReadinessScore: placementAssessment?.overallReadinessScore ?? null,
      estimatedPlacementProbability: placementAssessment?.estimatedPlacementProbability ?? null,
      readinessLevel: placementAssessment?.readinessLevel ?? null,
      targetRole: placementAssessment?.targetRole ?? null,
      dimensionScores: placementAssessment?.dimensionScores ?? null,
      blockersCount: (placementAssessment?.placementBlockers || []).length,
      criticalBlockersCount: (placementAssessment?.placementBlockers || []).filter(
        (b: any) => b.severity === 'CRITICAL' || b.severity === 'HIGH'
      ).length,
      generatedAt: placementAssessment?.generatedAt ? new Date(placementAssessment.generatedAt) : null,
      isStale: placementAssessment?.generatedAt
        ? latestDataTimestamp.getTime() > new Date(placementAssessment.generatedAt).getTime()
        : false,
    }

    return {
      academic,
      skills: skillsAnalytics,
      coding,
      projects: projectsAnalytics,
      certifications: certificationAnalytics,
      profile,
      resume: resumeAnalytics,
      interviews: interviewAnalytics,
      skillGap,
      learningPath: learningPathAnalytics,
      placement,
    }
  }

  private static _calculateInterviewAnalytics(interviews: any[]): InterviewAnalytics {
    if (!interviews || interviews.length === 0) {
      return {
        hasData: false,
        totalInterviews: 0,
        completedInterviews: 0,
        inProgressInterviews: 0,
        averageScore: null,
        highestScore: null,
        latestScore: null,
        byType: [],
        scoreProgression: [],
      }
    }

    const completed = interviews.filter(
      (i) => i.status === 'COMPLETED' && typeof i.overallScore === 'number'
    )
    const inProgress = interviews.filter((i) => i.status === 'IN_PROGRESS')

    const scores = completed.map((i) => i.overallScore as number)
    const averageScore =
      scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
    const highestScore = scores.length > 0 ? Math.max(...scores) : null
    const latestScore = completed.length > 0 ? completed[completed.length - 1].overallScore : null

    // By interview type
    const typeMap = new Map<string, { count: number; totalScore: number; completedCount: number }>()
    for (const interview of interviews) {
      const typeKey = interview.interviewType || interview.type || 'TECHNICAL'
      const existing = typeMap.get(typeKey) || { count: 0, totalScore: 0, completedCount: 0 }
      existing.count += 1
      if (interview.status === 'COMPLETED' && typeof interview.overallScore === 'number') {
        existing.totalScore += interview.overallScore
        existing.completedCount += 1
      }
      typeMap.set(typeKey, existing)
    }

    const byType: InterviewTypeCount[] = Array.from(typeMap.entries()).map(([type, stats]) => ({
      type,
      count: stats.count,
      averageScore: stats.completedCount > 0 ? Math.round(stats.totalScore / stats.completedCount) : null,
    }))

    const scoreProgression: InterviewScorePoint[] = completed.map((i) => ({
      date: i.completedAt || i.createdAt,
      score: i.overallScore,
      type: i.interviewType || i.type || 'TECHNICAL',
      targetRole: i.targetRole,
      difficulty: i.difficulty,
    }))

    return {
      hasData: interviews.length > 0,
      totalInterviews: interviews.length,
      completedInterviews: completed.length,
      inProgressInterviews: inProgress.length,
      averageScore,
      highestScore,
      latestScore,
      byType,
      scoreProgression,
    }
  }

  private static _calculateSkillGapAnalytics(
    analysis: any,
    latestDataTimestamp: Date
  ): SkillGapAnalytics {
    if (!analysis) {
      return {
        hasAnalysis: false,
        targetRole: null,
        overallMatchScore: null,
        totalStrengths: 0,
        totalGaps: 0,
        highPriorityGaps: 0,
        moderateGaps: 0,
        missingSkillsCount: 0,
        analyzedAt: null,
        isStale: false,
      }
    }

    const gaps = analysis.gaps || []
    const highPriorityGaps = gaps.filter(
      (g: any) => g.priority === SkillGapPriority.HIGH || g.priority === 'HIGH'
    ).length
    const moderateGaps = gaps.filter(
      (g: any) => g.priority === SkillGapPriority.MEDIUM || g.priority === 'MEDIUM'
    ).length
    const isStale = Boolean(
      analysis.generatedAt &&
      latestDataTimestamp.getTime() > new Date(analysis.generatedAt).getTime()
    )

    return {
      hasAnalysis: true,
      targetRole: analysis.targetRole || null,
      overallMatchScore:
        typeof analysis.overallMatchScore === 'number' ? analysis.overallMatchScore : null,
      totalStrengths: analysis.strengths?.length || 0,
      totalGaps: gaps.length,
      highPriorityGaps,
      moderateGaps,
      missingSkillsCount: analysis.missingSkills?.length || 0,
      analyzedAt: analysis.analyzedAt || analysis.generatedAt || null,
      isStale,
    }
  }

  private static _calculateLearningPathAnalytics(learningPath: any): LearningPathAnalytics {
    if (!learningPath) {
      return {
        hasPath: false,
        targetRole: null,
        totalStages: 0,
        completedStages: 0,
        inProgressStages: 0,
        overallProgress: 0,
        totalEstimatedWeeks: 0,
        status: 'NOT_STARTED',
        updatedAt: null,
      }
    }

    const stages = learningPath.stages || []
    const completedStages = stages.filter((s: any) => s.status === 'COMPLETED').length
    const inProgressStages = stages.filter((s: any) => s.status === 'IN_PROGRESS').length

    return {
      hasPath: true,
      targetRole: learningPath.targetRole || null,
      totalStages: stages.length,
      completedStages,
      inProgressStages,
      overallProgress: typeof learningPath.progress === 'number' ? learningPath.progress : 0,
      totalEstimatedWeeks: learningPath.totalEstimatedWeeks || 0,
      status: learningPath.status || 'IN_PROGRESS',
      updatedAt: learningPath.updatedAt || null,
    }
  }

  // ============================================================
  // Academic Analytics
  // ============================================================

  private static _calculateAcademicAnalytics(
    records: Array<{
      semester: number
      cgpa: number
      backlogs: number
      academicYear?: string
    }>
  ): AcademicAnalytics {
    if (records.length === 0) {
      return {
        hasData: false,
        totalSemesters: 0,
        latestCgpa: null,
        averageCgpa: null,
        highestCgpa: null,
        lowestCgpa: null,
        totalBacklogs: 0,
        currentBacklogs: 0,
        semestersWithBacklogs: 0,
        trend: 'INSUFFICIENT_DATA',
        trendDelta: null,
        cgpaTrend: [],
      }
    }

    // Sort by semester ascending (already sorted from DB, but ensure)
    const sorted = [...records].sort((a, b) => a.semester - b.semester)

    const cgpas = sorted.map((r) => r.cgpa)
    const latestCgpa = cgpas[cgpas.length - 1]
    const averageCgpa =
      Math.round((cgpas.reduce((sum, c) => sum + c, 0) / cgpas.length) * 100) / 100
    const highestCgpa = Math.max(...cgpas)
    const lowestCgpa = Math.min(...cgpas)

    // Backlog aggregation
    const totalBacklogs = sorted.reduce((sum, r) => sum + (r.backlogs || 0), 0)
    const currentBacklogs = sorted[sorted.length - 1]?.backlogs || 0
    const semestersWithBacklogs = sorted.filter((r) => r.backlogs > 0).length

    // Trend determination: compare last 2 semesters if available
    let trend: AcademicTrend = 'INSUFFICIENT_DATA'
    let trendDelta: number | null = null
    if (cgpas.length >= 2) {
      const prev = cgpas[cgpas.length - 2]
      const curr = cgpas[cgpas.length - 1]
      trendDelta = Math.round((curr - prev) * 100) / 100
      if (trendDelta > 0.05) {
        trend = 'IMPROVING'
      } else if (trendDelta < -0.05) {
        trend = 'DECLINING'
      } else {
        trend = 'STABLE'
      }
    } else if (cgpas.length === 1) {
      trend = 'STABLE'
      trendDelta = 0
    }

    const cgpaTrend: CgpaTrendPoint[] = sorted.map((r) => ({
      semester: r.semester,
      cgpa: r.cgpa,
      academicYear: r.academicYear,
    }))

    return {
      hasData: true,
      totalSemesters: sorted.length,
      latestCgpa,
      averageCgpa,
      highestCgpa,
      lowestCgpa,
      totalBacklogs,
      currentBacklogs,
      semestersWithBacklogs,
      trend,
      trendDelta,
      cgpaTrend,
    }
  }

  // ============================================================
  // Skill Analytics
  // ============================================================

  private static _calculateSkillAnalytics(
    skills: Array<{
      category: string
      proficiency: string
      source: string
      verified: boolean
    }>
  ): SkillAnalytics {
    if (skills.length === 0) {
      return {
        hasData: false,
        totalSkills: 0,
        verifiedSkills: 0,
        selfReportedSkills: 0,
        byCategory: [],
        byProficiency: [],
        bySource: [],
        topCategory: null,
        insights: ['No skills added yet. Add your technical skills to build your Digital Twin.'],
      }
    }

    const verifiedSkills = skills.filter((s) => s.verified).length
    const selfReportedSkills = skills.filter((s) => s.source === 'SELF_REPORTED').length

    // Category counts
    const categoryMap = new Map<string, number>()
    for (const skill of skills) {
      categoryMap.set(skill.category, (categoryMap.get(skill.category) || 0) + 1)
    }
    const byCategory: SkillCategoryCount[] = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)

    // Proficiency counts
    const proficiencyOrder = [
      SkillProficiency.BEGINNER,
      SkillProficiency.INTERMEDIATE,
      SkillProficiency.ADVANCED,
      SkillProficiency.EXPERT,
    ]
    const proficiencyMap = new Map<string, number>()
    for (const skill of skills) {
      proficiencyMap.set(skill.proficiency, (proficiencyMap.get(skill.proficiency) || 0) + 1)
    }
    const byProficiency: SkillProficiencyCount[] = proficiencyOrder
      .filter((p) => proficiencyMap.has(p))
      .map((p) => ({ proficiency: p, count: proficiencyMap.get(p) || 0 }))

    // Source counts
    const sourceMap = new Map<string, number>()
    for (const skill of skills) {
      sourceMap.set(skill.source, (sourceMap.get(skill.source) || 0) + 1)
    }
    const bySource: SkillSourceCount[] = Array.from(sourceMap.entries()).map(
      ([source, count]) => ({ source, count })
    )

    const topCategory = byCategory.length > 0 ? byCategory[0].category : null

    // Rule-based insights (no AI)
    const insights: string[] = []
    const advancedCount =
      (proficiencyMap.get(SkillProficiency.ADVANCED) || 0) +
      (proficiencyMap.get(SkillProficiency.EXPERT) || 0)
    const beginnerCount = proficiencyMap.get(SkillProficiency.BEGINNER) || 0

    if (advancedCount > beginnerCount && advancedCount > 0) {
      insights.push('Your profile contains several advanced-level skills — strong foundation.')
    }
    if (topCategory === SkillCategory.PROGRAMMING || topCategory === SkillCategory.WEB_DEVELOPMENT) {
      insights.push(`You have strong coverage in ${AnalyticsService._formatCategory(topCategory)}.`)
    }
    if (skills.length >= 10) {
      insights.push('You have a well-rounded skill portfolio with broad coverage.')
    } else if (skills.length < 5) {
      insights.push('Consider adding more skills to strengthen your profile.')
    }
    if (verifiedSkills === 0 && skills.length > 0) {
      insights.push('No verified skills yet — adding certifications can verify your skills.')
    }
    if (insights.length === 0) {
      insights.push('Keep adding skills across different categories to improve your profile.')
    }

    return {
      hasData: true,
      totalSkills: skills.length,
      verifiedSkills,
      selfReportedSkills,
      byCategory,
      byProficiency,
      bySource,
      topCategory,
      insights,
    }
  }

  // ============================================================
  // Coding Analytics
  // ============================================================

  private static _calculateCodingAnalytics(
    profiles: Array<{
      platform: string
      username: string
      profileUrl?: string
      problemsSolved: number
      contestsParticipated: number
      rating?: number
      highestRating?: number
      easySolved: number
      mediumSolved: number
      hardSolved: number
      isManual: boolean
    }>
  ): CodingAnalytics {
    if (profiles.length === 0) {
      return {
        hasData: false,
        totalPlatforms: 0,
        totalProblemsSolved: 0,
        totalContests: 0,
        highestRating: null,
        averageRating: null,
        platforms: [],
      }
    }

    const totalProblemsSolved = profiles.reduce((sum, p) => sum + (p.problemsSolved || 0), 0)
    const totalContests = profiles.reduce((sum, p) => sum + (p.contestsParticipated || 0), 0)

    // Only aggregate ratings from profiles that have them
    const ratingsWithValues = profiles
      .filter((p) => p.highestRating != null && p.highestRating > 0)
      .map((p) => p.highestRating as number)
    const highestRating = ratingsWithValues.length > 0 ? Math.max(...ratingsWithValues) : null
    const averageRating =
      ratingsWithValues.length > 0
        ? Math.round(ratingsWithValues.reduce((s, r) => s + r, 0) / ratingsWithValues.length)
        : null

    const platforms: CodingPlatformStat[] = profiles.map((p) => ({
      platform: p.platform,
      username: p.username,
      profileUrl: p.profileUrl || null,
      problemsSolved: p.problemsSolved || 0,
      contestsParticipated: p.contestsParticipated || 0,
      rating: p.rating != null && p.rating > 0 ? p.rating : null,
      highestRating: p.highestRating != null && p.highestRating > 0 ? p.highestRating : null,
      easySolved: p.easySolved || 0,
      mediumSolved: p.mediumSolved || 0,
      hardSolved: p.hardSolved || 0,
      isManual: p.isManual,
    }))

    return {
      hasData: true,
      totalPlatforms: profiles.length,
      totalProblemsSolved,
      totalContests,
      highestRating,
      averageRating,
      platforms,
    }
  }

  // ============================================================
  // Project Analytics
  // ============================================================

  private static _calculateProjectAnalytics(
    projects: Array<{
      status: string
      projectType: string
      technologies: string[]
      githubUrl?: string
      liveUrl?: string
      teamSize: number
    }>
  ): ProjectAnalytics {
    if (projects.length === 0) {
      return {
        hasData: false,
        totalProjects: 0,
        completedProjects: 0,
        inProgressProjects: 0,
        plannedProjects: 0,
        projectsWithGithub: 0,
        projectsWithLive: 0,
        topTechnologies: [],
        byType: [],
        averageTeamSize: null,
      }
    }

    const completedProjects = projects.filter((p) => p.status === ProjectStatus.COMPLETED).length
    const inProgressProjects = projects.filter(
      (p) => p.status === ProjectStatus.IN_PROGRESS
    ).length
    const plannedProjects = projects.filter((p) => p.status === ProjectStatus.PLANNED).length
    const projectsWithGithub = projects.filter(
      (p) => p.githubUrl && p.githubUrl.trim() !== ''
    ).length
    const projectsWithLive = projects.filter(
      (p) => p.liveUrl && p.liveUrl.trim() !== ''
    ).length

    // Technology frequency
    const techMap = new Map<string, number>()
    for (const project of projects) {
      for (const tech of project.technologies || []) {
        const normalizedTech = tech.trim()
        if (normalizedTech) {
          techMap.set(normalizedTech, (techMap.get(normalizedTech) || 0) + 1)
        }
      }
    }
    const topTechnologies: TechCount[] = Array.from(techMap.entries())
      .map(([technology, count]) => ({ technology, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Project type distribution
    const typeOrder = [
      ProjectType.PERSONAL,
      ProjectType.ACADEMIC,
      ProjectType.INTERNSHIP,
      ProjectType.HACKATHON,
      ProjectType.OPEN_SOURCE,
      ProjectType.OTHER,
    ]
    const typeMap = new Map<string, number>()
    for (const project of projects) {
      typeMap.set(project.projectType, (typeMap.get(project.projectType) || 0) + 1)
    }
    const byType: ProjectTypeCount[] = typeOrder
      .filter((t) => typeMap.has(t))
      .map((t) => ({ type: t, count: typeMap.get(t) || 0 }))

    // Average team size
    const totalTeamSize = projects.reduce((sum, p) => sum + (p.teamSize || 1), 0)
    const averageTeamSize = Math.round((totalTeamSize / projects.length) * 10) / 10

    return {
      hasData: true,
      totalProjects: projects.length,
      completedProjects,
      inProgressProjects,
      plannedProjects,
      projectsWithGithub,
      projectsWithLive,
      topTechnologies,
      byType,
      averageTeamSize,
    }
  }

  // ============================================================
  // Certification Analytics
  // ============================================================

  private static _calculateCertificationAnalytics(
    certifications: Array<{
      issuingOrganization: string
      expiryDate?: Date
      skills: string[]
    }>
  ): CertificationAnalytics {
    if (certifications.length === 0) {
      return {
        hasData: false,
        totalCertifications: 0,
        activeCertifications: 0,
        expiredCertifications: 0,
        byOrganization: [],
        skillsCovered: [],
      }
    }

    const now = new Date()
    const activeCertifications = certifications.filter(
      (c) => !c.expiryDate || new Date(c.expiryDate) > now
    ).length
    const expiredCertifications = certifications.filter(
      (c) => c.expiryDate && new Date(c.expiryDate) <= now
    ).length

    // Organization distribution
    const orgMap = new Map<string, number>()
    for (const cert of certifications) {
      orgMap.set(cert.issuingOrganization, (orgMap.get(cert.issuingOrganization) || 0) + 1)
    }
    const byOrganization: CertificationOrgCount[] = Array.from(orgMap.entries())
      .map(([organization, count]) => ({ organization, count }))
      .sort((a, b) => b.count - a.count)

    // Unique skills across all certifications
    const skillSet = new Set<string>()
    for (const cert of certifications) {
      for (const skill of cert.skills || []) {
        if (skill.trim()) skillSet.add(skill.trim())
      }
    }
    const skillsCovered = Array.from(skillSet).slice(0, 20)

    return {
      hasData: true,
      totalCertifications: certifications.length,
      activeCertifications,
      expiredCertifications,
      byOrganization,
      skillsCovered,
    }
  }

  // ============================================================
  // Profile Completeness
  // Transparent weighted formula — each weight is documented.
  // ============================================================

  private static _calculateProfileCompleteness(
    student: {
      fullName: string
      department: string
      degree: string
      graduationYear: number
      cgpa: number
      careerGoal?: string
      preferredJobRoles: string[]
    },
    academicRecords: unknown[],
    skills: unknown[],
    codingProfiles: unknown[],
    projects: unknown[],
    certifications: unknown[],
    resume: unknown | null
  ): ProfileCompletenessAnalytics {
    const isPersonalComplete = Boolean(
      student.fullName &&
        student.department &&
        student.degree &&
        student.graduationYear &&
        student.cgpa > 0
    )
    const isAcademicsComplete = academicRecords.length >= 1
    const isSkillsComplete = skills.length >= 3
    const isProjectsComplete = projects.length >= 1
    const isCodingComplete = codingProfiles.length >= 1
    const isCertsComplete = certifications.length >= 1
    const isCareerComplete = Boolean(
      student.careerGoal &&
        student.preferredJobRoles &&
        student.preferredJobRoles.length > 0
    )
    const isResumeUploaded = Boolean(resume)

    // Transparent weights — total = 100%
    const checklist: CompletenessItem[] = [
      {
        key: 'personal',
        label: 'Personal & Academic Profile',
        completed: isPersonalComplete,
        weight: 15,
        actionLabel: 'Complete Profile',
        actionPath: '/student/profile',
      },
      {
        key: 'academics',
        label: 'Semester Academic Records',
        completed: isAcademicsComplete,
        weight: 15,
        actionLabel: 'Add Academic Record',
        actionPath: '/student/academics',
      },
      {
        key: 'skills',
        label: 'Technical Skills (3+ required)',
        completed: isSkillsComplete,
        weight: 15,
        actionLabel: 'Add Skills',
        actionPath: '/student/profile',
      },
      {
        key: 'projects',
        label: 'Project Portfolio (1+ required)',
        completed: isProjectsComplete,
        weight: 15,
        actionLabel: 'Add a Project',
        actionPath: '/student/projects',
      },
      {
        key: 'coding',
        label: 'Coding Profile Linked',
        completed: isCodingComplete,
        weight: 10,
        actionLabel: 'Add Coding Profile',
        actionPath: '/student/coding',
      },
      {
        key: 'certifications',
        label: 'Industry Certifications',
        completed: isCertsComplete,
        weight: 10,
        actionLabel: 'Add Certification',
        actionPath: '/student/certifications',
      },
      {
        key: 'career',
        label: 'Career Goals & Preferred Roles',
        completed: isCareerComplete,
        weight: 10,
        actionLabel: 'Set Career Goals',
        actionPath: '/student/career',
      },
      {
        key: 'resume',
        label: 'Resume Uploaded',
        completed: isResumeUploaded,
        weight: 10,
        actionLabel: 'Upload Resume',
        actionPath: '/student/resume',
      },
    ]

    const percentage = checklist.reduce(
      (acc, item) => (item.completed ? acc + item.weight : acc),
      0
    )
    const completedWeight = percentage

    let status: ProfileCompletenessAnalytics['status'] = 'INCOMPLETE'
    if (percentage >= 90) status = 'EXCELLENT'
    else if (percentage >= 70) status = 'GOOD'
    else if (percentage >= 40) status = 'MODERATE'

    return { percentage, completedWeight, checklist, status }
  }

  // ============================================================
  // Helper Utilities
  // ============================================================

  private static _formatCategory(category: string): string {
    const labelMap: Record<string, string> = {
      PROGRAMMING: 'Programming',
      WEB_DEVELOPMENT: 'Web Development',
      DATABASE: 'Database',
      CLOUD: 'Cloud',
      DEVOPS: 'DevOps',
      AI_ML: 'AI/ML',
      DATA_SCIENCE: 'Data Science',
      SOFT_SKILL: 'Soft Skills',
      TOOLS: 'Tools',
      TECHNICAL: 'Technical',
      SOFT: 'Soft Skills',
      OTHER: 'Other',
    }
    return labelMap[category] || category
  }
}
