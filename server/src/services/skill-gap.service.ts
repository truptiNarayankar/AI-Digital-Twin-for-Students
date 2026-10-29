import { Types } from 'mongoose'
import { SkillGapAnalysis, type ISkillGapAnalysis } from '../models/SkillGapAnalysis.js'
import { LearningPath, type ILearningPath } from '../models/LearningPath.js'
import { StudentService } from './student.service.js'
import { SkillGapAiService, type DigitalTwinContext } from './skill-gap-ai.service.js'
import { Skill } from '../models/Skill.js'
import { Project } from '../models/Project.js'
import { CodingProfile } from '../models/CodingProfile.js'
import { Certification } from '../models/Certification.js'
import { ResumeAnalysis } from '../models/ResumeAnalysis.js'
import { Interview } from '../models/Interview.js'
import { ApiError } from '../utils/apiError.js'
import { LearningStageStatus } from '../types/index.js'
import { env } from '../config/env.js'

export interface UpdateStageProgressDto {
  status?: LearningStageStatus
  progress?: number
}

export class SkillGapService {
  /**
   * Gathers non-sensitive candidate context from Digital Twin models.
   */
  private static async gatherDigitalTwinContext(studentId: Types.ObjectId): Promise<{
    context: DigitalTwinContext
    latestDataTimestamp: Date
  }> {
    const [
      skills,
      projects,
      codingProfiles,
      certifications,
      resumeAnalysis,
      interviews,
    ] = await Promise.all([
      Skill.find({ studentId }).lean(),
      Project.find({ studentId }).lean(),
      CodingProfile.find({ studentId }).lean(),
      Certification.find({ studentId }).lean(),
      ResumeAnalysis.findOne({ studentId }).sort({ analyzedAt: -1 }).lean(),
      Interview.find({ studentId, status: 'COMPLETED' }).sort({ completedAt: -1 }).lean(),
    ])

    // Determine the latest timestamp among related student data for stale detection
    const timestamps: number[] = []
    skills.forEach((s) => s.updatedAt && timestamps.push(new Date(s.updatedAt).getTime()))
    projects.forEach((p) => p.updatedAt && timestamps.push(new Date(p.updatedAt).getTime()))
    certifications.forEach((c) => c.updatedAt && timestamps.push(new Date(c.updatedAt).getTime()))
    codingProfiles.forEach((cp) => cp.updatedAt && timestamps.push(new Date(cp.updatedAt).getTime()))
    if (resumeAnalysis?.analyzedAt) timestamps.push(new Date(resumeAnalysis.analyzedAt).getTime())
    interviews.forEach((i) => i.completedAt && timestamps.push(new Date(i.completedAt).getTime()))

    const latestDataTimestamp = timestamps.length > 0 ? new Date(Math.max(...timestamps)) : new Date()

    // Aggregate interview performance
    const interviewScores = interviews.map((i) => i.overallScore).filter((s): s is number => typeof s === 'number')
    const avgInterviewScore =
      interviewScores.length > 0
        ? Math.round(interviewScores.reduce((a, b) => a + b, 0) / interviewScores.length)
        : null

    const interviewWeaknesses = interviews.flatMap((i) => i.weaknesses || [])
    const interviewMissingTopics = interviews.flatMap((i) =>
      (i.questions || []).flatMap((q) => q.missingTopics || [])
    )

    const context: DigitalTwinContext = {
      profile: {},
      skills: skills.map((s) => ({
        name: s.name,
        category: s.category,
        proficiency: s.proficiency,
        source: s.source,
      })),
      projects: projects.map((p) => ({
        title: p.title,
        technologies: p.technologies,
        description: p.description,
        projectType: p.projectType,
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
            detectedSkills: resumeAnalysis.skillsDetected || [],
            weaknesses: resumeAnalysis.weaknesses,
            missingSections: resumeAnalysis.missingSections,
          }
        : null,
      interviewPerformance: {
        completedCount: interviews.length,
        averageScore: avgInterviewScore,
        weaknesses: Array.from(new Set(interviewWeaknesses)),
        missingTopics: Array.from(new Set(interviewMissingTopics)),
      },
    }

    return { context, latestDataTimestamp }
  }

  /**
   * Generates or re-runs a skill gap analysis for the authenticated student.
   */
  static async analyzeSkillGap(userId: string, targetRoleInput?: string): Promise<ISkillGapAnalysis> {
    const student = await StudentService.getOrCreateStudent(userId)

    const targetRole = (
      targetRoleInput ||
      student.careerGoal ||
      (student.preferredJobRoles && student.preferredJobRoles[0]) ||
      ''
    ).trim()

    if (!targetRole) {
      throw ApiError.badRequest('Select a target role to generate a personalized skill analysis.')
    }

    const { context, latestDataTimestamp } = await this.gatherDigitalTwinContext(student._id)
    context.profile = {
      department: student.department,
      degree: student.degree,
      graduationYear: student.graduationYear,
      careerGoal: student.careerGoal,
      preferredJobRoles: student.preferredJobRoles,
      preferredDomains: student.preferredDomains,
    }

    // Invoke AI analysis
    const aiOutput = await SkillGapAiService.analyzeSkillGap(context, targetRole)

    // Persist analysis
    const analysis = new SkillGapAnalysis({
      studentId: student._id,
      targetRole: aiOutput.targetRole,
      roleSummary: aiOutput.roleSummary,
      overallMatchScore: aiOutput.overallMatchScore,
      strengths: aiOutput.strengths,
      gaps: aiOutput.gaps,
      missingSkills: aiOutput.missingSkills,
      aiModel: env.GEMINI_MODEL,
      analysisVersion: 1,
      generatedAt: new Date(),
      profileUpdatedAtSnapshot: latestDataTimestamp,
    })

    await analysis.save()
    return analysis
  }

  /**
   * Retrieves the latest skill gap analysis with stale detection.
   */
  static async getLatestSkillGap(userId: string): Promise<{
    analysis: ISkillGapAnalysis | null
    isStale: boolean
    staleReason: string | null
  }> {
    const student = await StudentService.getOrCreateStudent(userId)

    const analysis = await SkillGapAnalysis.findOne({ studentId: student._id }).sort({ createdAt: -1 })

    if (!analysis) {
      return { analysis: null, isStale: false, staleReason: null }
    }

    // Stale analysis check: check if any student data was updated after analysis generation
    const { latestDataTimestamp } = await this.gatherDigitalTwinContext(student._id)
    const isStale = Boolean(
      latestDataTimestamp &&
        analysis.generatedAt &&
        new Date(latestDataTimestamp).getTime() > new Date(analysis.generatedAt).getTime()
    )

    return {
      analysis,
      isStale,
      staleReason: isStale
        ? 'Your profile data (skills, projects, certifications, or interviews) has been updated since this analysis was created.'
        : null,
    }
  }

  /**
   * Retrieves historical skill gap analyses for the student.
   */
  static async getSkillGapHistory(userId: string): Promise<ISkillGapAnalysis[]> {
    const student = await StudentService.getOrCreateStudent(userId)
    return await SkillGapAnalysis.find({ studentId: student._id }).sort({ createdAt: -1 })
  }

  /**
   * Generates a personalized learning path based on the latest skill gap analysis.
   */
  static async generateLearningPath(
    userId: string,
    skillGapAnalysisId?: string
  ): Promise<ILearningPath> {
    const student = await StudentService.getOrCreateStudent(userId)

    let analysis: ISkillGapAnalysis | null = null
    if (skillGapAnalysisId && Types.ObjectId.isValid(skillGapAnalysisId)) {
      analysis = await SkillGapAnalysis.findOne({
        _id: skillGapAnalysisId,
        studentId: student._id,
      })
    }

    if (!analysis) {
      analysis = await SkillGapAnalysis.findOne({ studentId: student._id }).sort({ createdAt: -1 })
    }

    if (!analysis) {
      throw ApiError.badRequest(
        'Please generate a Skill Gap Analysis before creating a personalized learning path.'
      )
    }

    const { context } = await this.gatherDigitalTwinContext(student._id)
    context.profile = {
      department: student.department,
      degree: student.degree,
      careerGoal: student.careerGoal,
    }

    const aiPath = await SkillGapAiService.generateLearningPath(
      {
        targetRole: analysis.targetRole,
        roleSummary: analysis.roleSummary,
        overallMatchScore: analysis.overallMatchScore ?? 70,
        strengths: analysis.strengths,
        gaps: analysis.gaps,
        missingSkills: analysis.missingSkills,
      },
      context
    )

    const learningPath = new LearningPath({
      studentId: student._id,
      skillGapAnalysisId: analysis._id,
      targetRole: analysis.targetRole,
      title: aiPath.title,
      description: aiPath.description,
      totalEstimatedWeeks: aiPath.totalEstimatedWeeks,
      stages: aiPath.stages,
      status: LearningStageStatus.NOT_STARTED,
      progress: 0,
      aiModel: env.GEMINI_MODEL,
      version: 1,
      generatedAt: new Date(),
    })

    await learningPath.save()
    return learningPath
  }

  /**
   * Retrieves the active / latest learning path for the authenticated student.
   */
  static async getLearningPath(userId: string): Promise<ILearningPath | null> {
    const student = await StudentService.getOrCreateStudent(userId)
    return await LearningPath.findOne({ studentId: student._id }).sort({ createdAt: -1 })
  }

  /**
   * Updates stage progress (0–100) and status for a specific stage.
   * Recalculates overall learning path progress deterministically.
   */
  static async updateStageProgress(
    userId: string,
    learningPathId: string,
    stageNumber: number,
    payload: UpdateStageProgressDto
  ): Promise<ILearningPath> {
    const student = await StudentService.getOrCreateStudent(userId)

    if (!Types.ObjectId.isValid(learningPathId)) {
      throw ApiError.badRequest('Invalid learning path ID format.')
    }

    const learningPath = await LearningPath.findOne({
      _id: learningPathId,
      studentId: student._id,
    })

    if (!learningPath) {
      throw ApiError.notFound('Learning path not found or access denied.')
    }

    if (payload.progress !== undefined) {
      if (typeof payload.progress !== 'number' || payload.progress < 0 || payload.progress > 100) {
        throw ApiError.badRequest('Stage progress must be a number between 0 and 100.')
      }
    }

    const stage = learningPath.stages.find((s) => s.stageNumber === stageNumber)
    if (!stage) {
      throw ApiError.notFound(`Stage number ${stageNumber} not found in this learning path.`)
    }

    // Update stage progress and status
    if (payload.progress !== undefined) {
      stage.progress = Math.round(payload.progress)
    }

    if (payload.status) {
      stage.status = payload.status
    }

    // Auto-sync status with progress
    if (stage.progress === 100) {
      stage.status = LearningStageStatus.COMPLETED
    } else if (stage.progress > 0 && stage.status === LearningStageStatus.NOT_STARTED) {
      stage.status = LearningStageStatus.IN_PROGRESS
    }

    // Calculate deterministic overall progress
    const totalProgressSum = learningPath.stages.reduce((acc, s) => acc + (s.progress || 0), 0)
    const overallProgress =
      learningPath.stages.length > 0
        ? Math.round(totalProgressSum / learningPath.stages.length)
        : 0

    learningPath.progress = overallProgress

    // Update overall path status
    const allCompleted = learningPath.stages.every((s) => s.status === LearningStageStatus.COMPLETED)
    if (allCompleted) {
      learningPath.status = LearningStageStatus.COMPLETED
    } else if (overallProgress > 0 || learningPath.stages.some((s) => s.status === LearningStageStatus.IN_PROGRESS)) {
      learningPath.status = LearningStageStatus.IN_PROGRESS
    }

    await learningPath.save()
    return learningPath
  }
}
