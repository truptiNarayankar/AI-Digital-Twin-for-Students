import { Types } from 'mongoose'
import { Student } from '../models/Student.js'
import { AcademicRecord } from '../models/AcademicRecord.js'
import { Skill } from '../models/Skill.js'
import { Project } from '../models/Project.js'
import { CodingProfile } from '../models/CodingProfile.js'
import { Certification } from '../models/Certification.js'
import { ResumeAnalysis } from '../models/ResumeAnalysis.js'
import { Interview } from '../models/Interview.js'
import { SkillGapAnalysis } from '../models/SkillGapAnalysis.js'
import { LearningPath } from '../models/LearningPath.js'
import {
  PlacementAssessment,
  type IPlacementAssessment,
  type IPlacementDimensionScores,
} from '../models/PlacementAssessment.js'
import { StudentService } from './student.service.js'
import {
  PlacementAiService,
  type PlacementTwinContext,
} from './placement-ai.service.js'
import {
  ReadinessLevel,
  SkillGapPriority,
} from '../types/index.js'
import { ApiError } from '../utils/apiError.js'

export interface AssessPlacementOptions {
  targetRole?: string
  forceRefresh?: boolean
}

export interface LatestAssessmentResponse {
  assessment: IPlacementAssessment | null
  isStale: boolean
  staleReason: string | null
}

export interface PlacementReadinessSummary {
  hasAssessment: boolean
  overallReadinessScore: number | null
  estimatedPlacementProbability: number | null
  readinessLevel: ReadinessLevel | null
  targetRole: string | null
  generatedAt: Date | null
}

export class PlacementService {
  /**
   * Aggregates all Digital Twin vectors and detects the latest timestamp across records.
   */
  public static async gatherDigitalTwinContext(studentId: Types.ObjectId): Promise<{
    context: PlacementTwinContext
    latestDataTimestamp: Date
  }> {
    const [
      student,
      academicRecords,
      skills,
      projects,
      codingProfiles,
      certifications,
      resumeAnalysis,
      interviews,
      skillGap,
      learningPath,
    ] = await Promise.all([
      Student.findById(studentId).lean(),
      AcademicRecord.find({ studentId }).sort({ semester: 1 }).lean(),
      Skill.find({ studentId }).lean(),
      Project.find({ studentId }).sort({ createdAt: -1 }).lean(),
      CodingProfile.find({ studentId }).lean(),
      Certification.find({ studentId }).lean(),
      ResumeAnalysis.findOne({ studentId }).sort({ analyzedAt: -1 }).lean(),
      Interview.find({ studentId, status: 'COMPLETED' }).sort({ completedAt: -1 }).lean(),
      SkillGapAnalysis.findOne({ studentId }).sort({ analyzedAt: -1 }).lean(),
      LearningPath.findOne({ studentId }).sort({ updatedAt: -1 }).lean(),
    ])

    if (!student) {
      throw ApiError.notFound('Student profile not found.')
    }

    // Determine latest data timestamp across all Digital Twin vectors
    const timestamps: number[] = []
    if (student.updatedAt) timestamps.push(new Date(student.updatedAt).getTime())
    academicRecords.forEach((a) => a.updatedAt && timestamps.push(new Date(a.updatedAt).getTime()))
    skills.forEach((s) => s.updatedAt && timestamps.push(new Date(s.updatedAt).getTime()))
    projects.forEach((p) => p.updatedAt && timestamps.push(new Date(p.updatedAt).getTime()))
    codingProfiles.forEach((cp) => cp.updatedAt && timestamps.push(new Date(cp.updatedAt).getTime()))
    certifications.forEach((c) => c.updatedAt && timestamps.push(new Date(c.updatedAt).getTime()))
    if (resumeAnalysis?.analyzedAt) timestamps.push(new Date(resumeAnalysis.analyzedAt).getTime())
    if (resumeAnalysis?.updatedAt) timestamps.push(new Date(resumeAnalysis.updatedAt).getTime())
    interviews.forEach((i) => i.completedAt && timestamps.push(new Date(i.completedAt).getTime()))
    if (skillGap?.generatedAt) timestamps.push(new Date(skillGap.generatedAt).getTime())
    if (learningPath?.updatedAt) timestamps.push(new Date(learningPath.updatedAt).getTime())

    const latestDataTimestamp = timestamps.length > 0 ? new Date(Math.max(...timestamps)) : new Date()

    // 1. Academics metrics
    const totalSemesters = academicRecords.length
    const totalBacklogs = academicRecords.reduce((acc, r) => acc + (r.backlogs || 0), 0)
    const latestAcademic = academicRecords.length > 0 ? academicRecords[academicRecords.length - 1] : null
    const latestCgpa = latestAcademic ? latestAcademic.cgpa : (student.cgpa || null)
    const averageCgpa =
      academicRecords.length > 0
        ? Math.round((academicRecords.reduce((sum, r) => sum + r.cgpa, 0) / academicRecords.length) * 100) / 100
        : (student.cgpa || null)

    let academicTrend = 'INSUFFICIENT_DATA'
    if (academicRecords.length >= 2) {
      const firstHalf = academicRecords.slice(0, Math.ceil(academicRecords.length / 2))
      const secondHalf = academicRecords.slice(Math.ceil(academicRecords.length / 2))
      const firstAvg = firstHalf.reduce((s, r) => s + r.cgpa, 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((s, r) => s + r.cgpa, 0) / secondHalf.length
      if (secondAvg - firstAvg > 0.3) academicTrend = 'IMPROVING'
      else if (firstAvg - secondAvg > 0.3) academicTrend = 'DECLINING'
      else academicTrend = 'STABLE'
    }

    // 2. Mock Interview metrics
    const interviewScores = interviews
      .map((i) => i.overallScore)
      .filter((s): s is number => typeof s === 'number')
    const avgInterviewScore =
      interviewScores.length > 0
        ? Math.round(interviewScores.reduce((a, b) => a + b, 0) / interviewScores.length)
        : null
    const interviewWeaknesses = Array.from(new Set(interviews.flatMap((i) => i.weaknesses || [])))

    // 3. Profile Completeness Checklist
    const isPersonalComplete = Boolean(
      student.fullName &&
        student.department &&
        student.degree &&
        student.graduationYear &&
        student.cgpa > 0
    )
    const checklist = [
      { key: 'personal', completed: isPersonalComplete, weight: 25 },
      { key: 'academics', completed: academicRecords.length >= 1, weight: 15 },
      { key: 'skills', completed: skills.length >= 3, weight: 15 },
      { key: 'projects', completed: projects.length >= 1, weight: 15 },
      { key: 'coding', completed: codingProfiles.length >= 1, weight: 10 },
      { key: 'certifications', completed: certifications.length >= 1, weight: 10 },
      {
        key: 'career',
        completed: Boolean(student.careerGoal && student.preferredJobRoles && student.preferredJobRoles.length > 0),
        weight: 10,
      },
    ]
    const completenessPercentage = checklist.reduce((acc, item) => (item.completed ? acc + item.weight : acc), 0)

    // Calculate deterministic dimension scores (0 - 100)
    const dimensionScores = this.calculateDeterministicScores({
      student,
      academicRecords,
      totalBacklogs,
      latestCgpa,
      skills,
      projects,
      codingProfiles,
      certifications,
      resumeAnalysis,
      interviews,
      avgInterviewScore,
      skillGap,
      completenessPercentage,
    })

    // Calculate deterministic overall readiness score
    const overallReadinessScore = Math.round(
      dimensionScores.academics * 0.10 +
      dimensionScores.technicalSkills * 0.15 +
      dimensionScores.codingAbility * 0.15 +
      dimensionScores.projects * 0.15 +
      dimensionScores.resume * 0.10 +
      dimensionScores.interviewPerformance * 0.15 +
      dimensionScores.certifications * 0.05 +
      dimensionScores.careerAlignment * 0.10 +
      dimensionScores.profileCompleteness * 0.05
    )

    // Calculate deterministic estimated placement probability
    const estimatedPlacementProbability = this.calculateEstimatedProbability(
      overallReadinessScore,
      {
        interviewsCount: interviews.length,
        avgInterviewScore,
        hasResumeAnalysis: Boolean(resumeAnalysis && resumeAnalysis.overallScore !== undefined),
        resumeScore: resumeAnalysis?.overallScore || 0,
        criticalSkillGapsCount: (skillGap?.gaps || []).filter((g) => g.priority === SkillGapPriority.CRITICAL).length,
        projectsCount: projects.length,
        totalBacklogs,
        totalProblemsSolved: codingProfiles.reduce((s, cp) => s + (cp.problemsSolved || 0), 0),
      }
    )

    // Compute readiness level
    const readinessLevel = this.determineReadinessLevel(overallReadinessScore)

    // Map skill gap missing skills
    const criticalMissingSkills = (skillGap?.gaps || [])
      .filter((g) => g.priority === SkillGapPriority.CRITICAL || g.priority === SkillGapPriority.HIGH)
      .map((g) => g.skill)

    const context: PlacementTwinContext = {
      profile: {
        fullName: student.fullName,
        department: student.department,
        degree: student.degree,
        cgpa: student.cgpa,
        graduationYear: student.graduationYear,
        careerGoal: student.careerGoal,
        preferredJobRoles: student.preferredJobRoles,
      },
      academic: {
        hasData: academicRecords.length > 0,
        latestCgpa,
        averageCgpa,
        totalSemesters,
        totalBacklogs,
        trend: academicTrend,
      },
      skills: skills.map((s) => ({
        name: s.name,
        proficiency: s.proficiency,
        category: s.category,
        isVerified: s.verified || false,
      })),
      projects: projects.map((p) => ({
        title: p.title,
        technologies: p.technologies || [],
        status: p.status,
        description: p.description,
      })),
      codingProfiles: codingProfiles.map((cp) => ({
        platform: cp.platform,
        problemsSolved: cp.problemsSolved,
        highestRating: cp.highestRating,
      })),
      certifications: certifications.map((c) => ({
        name: c.name,
        issuingOrganization: c.issuingOrganization,
        skills: c.skills,
      })),
      resumeAnalysis: resumeAnalysis
        ? {
            overallScore: resumeAnalysis.overallScore,
            skillsDetected: resumeAnalysis.skillsDetected || [],
            weaknesses: resumeAnalysis.weaknesses || [],
          }
        : null,
      interviewPerformance: {
        completedCount: interviews.length,
        averageScore: avgInterviewScore,
        weaknesses: interviewWeaknesses,
      },
      skillGap: skillGap
        ? {
            hasAnalysis: true,
            targetRole: skillGap.targetRole,
            overallMatchScore: skillGap.overallMatchScore,
            totalGaps: (skillGap.gaps || []).length,
            highPriorityGaps: (skillGap.gaps || []).filter(
              (g) => g.priority === SkillGapPriority.CRITICAL || g.priority === SkillGapPriority.HIGH
            ).length,
            missingSkills: criticalMissingSkills,
          }
        : null,
      learningPath: learningPath
        ? {
            hasPath: true,
            targetRole: learningPath.targetRole,
            completedStages: (learningPath.stages || []).filter((s) => s.status === 'COMPLETED').length,
            totalStages: (learningPath.stages || []).length,
            overallProgress: learningPath.progress,
          }
        : null,
      completenessPercentage,
      dimensionScores,
      overallReadinessScore,
      estimatedPlacementProbability,
      readinessLevel,
    }

    return { context, latestDataTimestamp }
  }

  /**
   * Deterministically calculates scores (0–100) across the 9 dimensions.
   */
  public static calculateDeterministicScores(params: {
    student: { cgpa?: number; careerGoal?: string; preferredJobRoles?: string[] }
    academicRecords: Array<{ cgpa: number; backlogs?: number }>
    totalBacklogs: number
    latestCgpa: number | null
    skills: Array<{ proficiency: string }>
    projects: Array<{ status: string; technologies?: string[] }>
    codingProfiles: Array<{ problemsSolved: number; highestRating?: number | null }>
    certifications: Array<{ name: string }>
    resumeAnalysis: { overallScore?: number | null } | null
    interviews: Array<{ overallScore?: number }>
    avgInterviewScore: number | null
    skillGap: { overallMatchScore?: number } | null
    completenessPercentage: number
  }): IPlacementDimensionScores {
    // 1. Academics (10%)
    let academicsScore = 50 // Default neutral if no academic record
    if (params.academicRecords.length > 0 && params.latestCgpa !== null) {
      const rawCgpaScore = (params.latestCgpa / 10) * 100
      const backlogsPenalty = params.totalBacklogs * 10
      academicsScore = Math.max(0, Math.min(100, Math.round(rawCgpaScore - backlogsPenalty)))
    } else if (params.student.cgpa && params.student.cgpa > 0) {
      academicsScore = Math.max(0, Math.min(100, Math.round((params.student.cgpa / 10) * 100)))
    }

    // 2. Technical Skills (15%)
    const proficiencyWeights: Record<string, number> = {
      BEGINNER: 40,
      INTERMEDIATE: 70,
      ADVANCED: 90,
      EXPERT: 100,
    }
    let skillProficiencyScore = 30
    if (params.skills.length > 0) {
      const sum = params.skills.reduce((acc, s) => acc + (proficiencyWeights[s.proficiency] || 50), 0)
      skillProficiencyScore = sum / params.skills.length
    }
    let technicalSkillsScore = skillProficiencyScore
    if (params.skillGap?.overallMatchScore !== undefined && params.skillGap.overallMatchScore !== null) {
      technicalSkillsScore = Math.round(skillProficiencyScore * 0.5 + params.skillGap.overallMatchScore * 0.5)
    } else {
      technicalSkillsScore = Math.round(skillProficiencyScore)
    }
    technicalSkillsScore = Math.max(0, Math.min(100, technicalSkillsScore))

    // 3. Coding Ability (15%)
    const totalProblemsSolved = params.codingProfiles.reduce((s, cp) => s + (cp.problemsSolved || 0), 0)
    const highestRating = Math.max(0, ...params.codingProfiles.map((cp) => cp.highestRating || 0))
    let codingScore = 10
    if (totalProblemsSolved >= 500) codingScore = 100
    else if (totalProblemsSolved >= 250) codingScore = 90
    else if (totalProblemsSolved >= 100) codingScore = 75
    else if (totalProblemsSolved >= 25) codingScore = 55
    else if (totalProblemsSolved >= 1) codingScore = 35

    if (highestRating >= 1800) codingScore = Math.min(100, codingScore + 10)
    else if (highestRating >= 1600) codingScore = Math.min(100, codingScore + 5)

    // 4. Projects (15%)
    const projectCount = params.projects.length
    const completedProjects = params.projects.filter((p) => p.status === 'COMPLETED').length
    let projectsScore = 10
    if (projectCount >= 3) projectsScore = completedProjects >= 2 ? 95 : 85
    else if (projectCount === 2) projectsScore = completedProjects >= 1 ? 80 : 70
    else if (projectCount === 1) projectsScore = completedProjects === 1 ? 55 : 45

    const allTechs = new Set(params.projects.flatMap((p) => p.technologies || []))
    if (allTechs.size >= 4) {
      projectsScore = Math.min(100, projectsScore + 5)
    }

    // 5. Resume (10%)
    let resumeScore = 15 // missing resume penalty
    if (params.resumeAnalysis && typeof params.resumeAnalysis.overallScore === 'number') {
      resumeScore = Math.max(0, Math.min(100, params.resumeAnalysis.overallScore))
    }

    // 6. Interview Performance (15%)
    let interviewScore = 15 // unpracticed penalty
    if (params.interviews.length > 0 && params.avgInterviewScore !== null) {
      interviewScore = params.avgInterviewScore
      if (params.interviews.length >= 3) {
        interviewScore = Math.min(100, interviewScore + 5)
      }
    }

    // 7. Certifications (5%)
    const certCount = params.certifications.length
    let certScore = 25
    if (certCount >= 3) certScore = 95
    else if (certCount === 2) certScore = 80
    else if (certCount === 1) certScore = 60

    // 8. Career Alignment (10%)
    let careerScore = 50
    if (params.student.careerGoal) careerScore += 20
    if (params.student.preferredJobRoles && params.student.preferredJobRoles.length > 0) careerScore += 20
    if (params.skillGap?.overallMatchScore !== undefined && params.skillGap.overallMatchScore !== null) {
      careerScore = Math.round(careerScore * 0.4 + params.skillGap.overallMatchScore * 0.6)
    }
    careerScore = Math.max(0, Math.min(100, careerScore))

    // 9. Profile Completeness (5%)
    const profileCompleteness = Math.max(0, Math.min(100, Math.round(params.completenessPercentage)))

    return {
      academics: academicsScore,
      technicalSkills: technicalSkillsScore,
      codingAbility: codingScore,
      projects: projectsScore,
      resume: resumeScore,
      interviewPerformance: interviewScore,
      certifications: certScore,
      careerAlignment: careerScore,
      profileCompleteness,
    }
  }

  /**
   * Deterministically calculates the estimated placement probability (0–100%).
   */
  public static calculateEstimatedProbability(
    overallReadinessScore: number,
    factors: {
      interviewsCount: number
      avgInterviewScore: number | null
      hasResumeAnalysis: boolean
      resumeScore: number
      criticalSkillGapsCount: number
      projectsCount: number
      totalBacklogs: number
      totalProblemsSolved: number
    }
  ): number {
    let prob = overallReadinessScore

    // Penalties for missing critical components
    if (factors.interviewsCount === 0) prob -= 15
    if (!factors.hasResumeAnalysis) prob -= 10
    if (factors.projectsCount === 0) prob -= 10
    if (factors.criticalSkillGapsCount > 0) {
      prob -= Math.min(15, factors.criticalSkillGapsCount * 5)
    }
    if (factors.totalBacklogs > 0) {
      prob -= Math.min(15, factors.totalBacklogs * 5)
    }

    // Bonuses for high capability evidence
    if (factors.interviewsCount > 0 && factors.avgInterviewScore !== null && factors.avgInterviewScore >= 80) {
      prob += 5
    }
    if (factors.hasResumeAnalysis && factors.resumeScore >= 80) {
      prob += 5
    }
    if (factors.totalProblemsSolved >= 200) {
      prob += 5
    }

    // Strictly clamp between 5 and 98 to respect ethical, transparent estimation
    return Math.max(5, Math.min(98, Math.round(prob)))
  }

  /**
   * Translates overall readiness score into a ReadinessLevel enum.
   */
  public static determineReadinessLevel(score: number): ReadinessLevel {
    if (score >= 80) return ReadinessLevel.PLACEMENT_READY
    if (score >= 60) return ReadinessLevel.NEAR_READY
    if (score >= 40) return ReadinessLevel.DEVELOPING
    return ReadinessLevel.NOT_READY
  }

  /**
   * Assesses placement readiness and estimated probability for a student.
   * If a fresh assessment exists and forceRefresh is false, returns cached assessment.
   */
  public static async assessPlacement(
    userId: string,
    options: AssessPlacementOptions = {}
  ): Promise<IPlacementAssessment> {
    const student = await StudentService.getOrCreateStudent(userId)

    const targetRole = (
      options.targetRole ||
      student.careerGoal ||
      (student.preferredJobRoles && student.preferredJobRoles[0]) ||
      'Full Stack Developer'
    ).trim()

    const { context, latestDataTimestamp } = await this.gatherDigitalTwinContext(student._id)

    // Check for existing cached assessment
    const existing = await PlacementAssessment.findOne({
      studentId: student._id,
      targetRole,
    }).sort({ generatedAt: -1 })

    if (existing && !options.forceRefresh) {
      const isStillFresh = new Date(existing.generatedAt).getTime() >= latestDataTimestamp.getTime()
      if (isStillFresh) {
        return existing
      }
    }

    // Generate AI qualitative diagnostic reasoning
    const aiOutput = await PlacementAiService.generatePlacementInsights(targetRole, context)

    // Determine version number
    const count = await PlacementAssessment.countDocuments({ studentId: student._id })

    // Persist new assessment
    const assessment = new PlacementAssessment({
      studentId: student._id,
      targetRole,
      overallReadinessScore: context.overallReadinessScore,
      readinessScore: context.overallReadinessScore, // compatibility alias
      estimatedPlacementProbability: context.estimatedPlacementProbability,
      placementProbability: context.estimatedPlacementProbability, // compatibility alias
      readinessLevel: context.readinessLevel,
      dimensionScores: context.dimensionScores,
      strengths: aiOutput.strengths,
      weaknesses: aiOutput.weaknesses,
      placementBlockers: aiOutput.placementBlockers,
      recommendedActions: aiOutput.recommendedActions,
      evidence: aiOutput.evidence,
      assessmentSummary: aiOutput.assessmentSummary,
      summary: aiOutput.assessmentSummary, // compatibility alias
      aiModel: aiOutput.model,
      assessmentVersion: count + 1,
      generatedAt: new Date(),
      assessmentDate: new Date(), // compatibility alias
      profileUpdatedAtSnapshot: latestDataTimestamp,
    })

    await assessment.save()
    return assessment
  }

  /**
   * Returns the most recent assessment along with stale detection status.
   */
  public static async getLatestAssessment(userId: string): Promise<LatestAssessmentResponse> {
    const student = await StudentService.getOrCreateStudent(userId)

    const assessment = await PlacementAssessment.findOne({
      studentId: student._id,
    }).sort({ generatedAt: -1 })

    if (!assessment) {
      return {
        assessment: null,
        isStale: false,
        staleReason: null,
      }
    }

    const { latestDataTimestamp } = await this.gatherDigitalTwinContext(student._id)
    const isStale = latestDataTimestamp.getTime() > new Date(assessment.generatedAt).getTime()
    const staleReason = isStale
      ? 'Digital Twin data (such as projects, skills, coding profiles, or interviews) has been updated since this assessment was generated.'
      : null

    return {
      assessment,
      isStale,
      staleReason,
    }
  }

  /**
   * Returns chronological assessment history for the authenticated student.
   */
  public static async getAssessmentHistory(userId: string): Promise<IPlacementAssessment[]> {
    const student = await StudentService.getOrCreateStudent(userId)

    return PlacementAssessment.find({
      studentId: student._id,
    }).sort({ generatedAt: -1 })
  }

  /**
   * Returns lightweight readiness summary for dashboard widgets.
   */
  public static async getReadinessSummary(userId: string): Promise<PlacementReadinessSummary> {
    const student = await StudentService.getOrCreateStudent(userId)

    const assessment = await PlacementAssessment.findOne({
      studentId: student._id,
    }).sort({ generatedAt: -1 })

    if (!assessment) {
      return {
        hasAssessment: false,
        overallReadinessScore: null,
        estimatedPlacementProbability: null,
        readinessLevel: null,
        targetRole: null,
        generatedAt: null,
      }
    }

    return {
      hasAssessment: true,
      overallReadinessScore: assessment.overallReadinessScore,
      estimatedPlacementProbability: assessment.estimatedPlacementProbability,
      readinessLevel: assessment.readinessLevel,
      targetRole: assessment.targetRole,
      generatedAt: assessment.generatedAt,
    }
  }
}
