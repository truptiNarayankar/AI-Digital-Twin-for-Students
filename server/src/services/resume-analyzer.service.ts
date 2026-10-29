import { z } from 'zod'
import { Resume, type IResume } from '../models/Resume.js'
import { ResumeAnalysis, type IResumeAnalysis } from '../models/ResumeAnalysis.js'
import { Student } from '../models/Student.js'
import { GeminiService } from './gemini.service.js'
import { ResumeAnalysisStatus } from '../types/index.js'
import { ApiError } from '../utils/apiError.js'
import { env } from '../config/env.js'

// Zod Schema to strictly validate Gemini output
export const SectionScoresSchema = z.object({
  summary: z.number().int().min(0).max(100),
  experience: z.number().int().min(0).max(100),
  projects: z.number().int().min(0).max(100),
  skills: z.number().int().min(0).max(100),
  education: z.number().int().min(0).max(100),
  certifications: z.number().int().min(0).max(100),
  formatting: z.number().int().min(0).max(100),
})

export const ImprovementSuggestionSchema = z.object({
  section: z.string().min(1),
  problem: z.string().min(1),
  suggestion: z.string().min(1),
  exampleBefore: z.string().optional().default(''),
  exampleAfter: z.string().optional().default(''),
})

export const ResumeAnalysisOutputSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  sectionScores: SectionScoresSchema,
  strengths: z.array(z.string().min(1)).min(1),
  weaknesses: z.array(z.string().min(1)).min(1),
  missingSections: z.array(z.string()).default([]),
  skillsDetected: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  projectFeedback: z.string().default(''),
  experienceFeedback: z.string().default(''),
  educationFeedback: z.string().default(''),
  summaryFeedback: z.string().default(''),
  formattingFeedback: z.string().default(''),
  atsRecommendations: z.array(z.string().min(1)).min(1),
  improvementSuggestions: z.array(ImprovementSuggestionSchema).default([]),
  targetRole: z.string().default('Software Engineer'),
})

export type ResumeAnalysisOutput = z.infer<typeof ResumeAnalysisOutputSchema>

export class ResumeAnalyzerService {
  /**
   * Analyzes an existing resume document for a student.
   */
  static async analyzeResume(
    resumeId: string,
    studentId: string,
    requestedTargetRole?: string
  ): Promise<{ analysis: IResumeAnalysis; resume: IResume }> {
    const resume = await Resume.findOne({ _id: resumeId, studentId })
    if (!resume) {
      throw ApiError.notFound('Resume record not found or access denied.')
    }

    // Rate limiting & duplicate prevention: avoid overlapping analysis runs
    if (resume.analysisStatus === ResumeAnalysisStatus.PROCESSING) {
      throw new ApiError(
        'Resume analysis is already currently in progress. Please wait for completion.',
        429,
        'RATE_LIMITED'
      )
    }

    if (!resume.extractedText || resume.extractedText.trim().length < 50) {
      throw ApiError.badRequest(
        'Resume does not contain sufficient machine-readable text to perform AI analysis. Please re-upload a text-based resume.'
      )
    }

    // Resolve student contextual targets
    const student = await Student.findById(studentId)
    const targetRole =
      requestedTargetRole?.trim() ||
      (student?.preferredJobRoles && student.preferredJobRoles[0]) ||
      student?.careerGoal ||
      'Software Engineer'

    const context = {
      targetRole,
      department: student?.department,
      degree: student?.degree,
      graduationYear: student?.graduationYear,
      careerGoal: student?.careerGoal,
    }

    // Transition status to PROCESSING
    resume.analysisStatus = ResumeAnalysisStatus.PROCESSING
    await resume.save()

    try {
      // 1. Request analysis from Gemini
      const rawAiResponse = await GeminiService.analyzeResumeText(resume.extractedText, context)

      // 2. Parse JSON
      let parsedJson: unknown
      try {
        // Strip markdown code fences if Gemini wrapped it in ```json ... ```
        const cleanedJsonStr = rawAiResponse
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim()
        parsedJson = JSON.parse(cleanedJsonStr)
      } catch (parseErr) {
        console.error('[ResumeAnalyzerService] Failed to parse Gemini response as JSON:', parseErr)
        throw new ApiError('AI response could not be parsed as valid JSON.', 502, 'AI_PARSE_ERROR')
      }

      // 3. Validate against Zod schema
      const validationResult = ResumeAnalysisOutputSchema.safeParse(parsedJson)
      if (!validationResult.success) {
        console.error(
          '[ResumeAnalyzerService] Zod validation failed on Gemini output:',
          validationResult.error.format()
        )
        throw new ApiError('AI response format failed schema verification.', 502, 'AI_VALIDATION_ERROR')
      }

      const validData = validationResult.data

      // 4. Save analysis to MongoDB
      const analysis = await ResumeAnalysis.create({
        studentId: student!._id,
        resumeId: resume._id,
        overallScore: Math.min(100, Math.max(0, validData.overallScore)),
        sectionScores: {
          summary: Math.min(100, Math.max(0, validData.sectionScores.summary)),
          experience: Math.min(100, Math.max(0, validData.sectionScores.experience)),
          projects: Math.min(100, Math.max(0, validData.sectionScores.projects)),
          skills: Math.min(100, Math.max(0, validData.sectionScores.skills)),
          education: Math.min(100, Math.max(0, validData.sectionScores.education)),
          certifications: Math.min(100, Math.max(0, validData.sectionScores.certifications)),
          formatting: Math.min(100, Math.max(0, validData.sectionScores.formatting)),
        },
        strengths: validData.strengths,
        weaknesses: validData.weaknesses,
        missingSections: validData.missingSections,
        skillsDetected: validData.skillsDetected,
        keywords: validData.keywords,
        projectFeedback: validData.projectFeedback,
        experienceFeedback: validData.experienceFeedback,
        educationFeedback: validData.educationFeedback,
        summaryFeedback: validData.summaryFeedback,
        formattingFeedback: validData.formattingFeedback,
        atsRecommendations: validData.atsRecommendations,
        improvementSuggestions: validData.improvementSuggestions,
        targetRole,
        aiModel: env.GEMINI_MODEL,
        analysisVersion: '1.0',
        analyzedAt: new Date(),
      })

      // 5. Update Resume status to COMPLETED
      resume.analysisStatus = ResumeAnalysisStatus.COMPLETED
      resume.lastAnalyzedAt = new Date()
      resume.analysisVersion = '1.0'
      await resume.save()

      return { analysis, resume }
    } catch (err) {
      // Mark resume as FAILED on error
      resume.analysisStatus = ResumeAnalysisStatus.FAILED
      await resume.save().catch(() => {})
      throw err
    }
  }

  /**
   * Retrieves the most recent analysis for a given resume or student.
   */
  static async getLatestAnalysis(
    resumeId: string,
    studentId: string
  ): Promise<IResumeAnalysis | null> {
    return await ResumeAnalysis.findOne({ resumeId, studentId }).sort({ analyzedAt: -1 })
  }
}
