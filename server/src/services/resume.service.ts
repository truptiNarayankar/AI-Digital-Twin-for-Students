import { Resume, type IResume } from '../models/Resume.js'
import { ResumeAnalysis, type IResumeAnalysis } from '../models/ResumeAnalysis.js'
import { StudentService } from './student.service.js'
import { ResumeAnalysisStatus } from '../types/index.js'
import { storageService } from './storage.service.js'
import { TextExtractionService } from './text-extraction.service.js'
import { ResumeAnalyzerService } from './resume-analyzer.service.js'
import { ApiError } from '../utils/apiError.js'

export class ResumeService {
  /**
   * Retrieves the current/active resume document for a student.
   */
  static async getResume(userId: string): Promise<IResume | null> {
    const student = await StudentService.getOrCreateStudent(userId)
    return await Resume.findOne({ studentId: student._id }).sort({ version: -1, createdAt: -1 })
  }

  /**
   * Uploads and parses a physical resume document (PDF or DOCX).
   */
  static async uploadResumeFile(
    userId: string,
    file: Express.Multer.File
  ): Promise<IResume> {
    if (!file || !file.buffer) {
      throw ApiError.badRequest('No file payload provided for upload.')
    }

    const student = await StudentService.getOrCreateStudent(userId)

    // 1. Extract and validate text locally in Node.js
    const extraction = await TextExtractionService.extractText(
      file.buffer,
      file.originalname,
      file.mimetype
    )

    // 2. Persist binary file securely via storage service
    const stored = await storageService.saveFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      student._id.toString()
    )

    // 3. Compute incremental version
    const latest = await Resume.findOne({ studentId: student._id }).sort({ version: -1 })
    const nextVersion = latest ? latest.version + 1 : 1

    // 4. Save metadata and extracted text
    const resume = await Resume.create({
      studentId: student._id,
      fileName: stored.fileName,
      originalFileName: file.originalname,
      fileUrl: stored.fileUrl,
      storagePath: stored.storagePath,
      fileType: stored.fileType,
      fileSize: stored.fileSize,
      extractedText: extraction.text,
      version: nextVersion,
      analysisStatus: ResumeAnalysisStatus.NOT_ANALYZED,
      uploadedAt: new Date(),
    })

    return resume
  }

  /**
   * Deletes current active resume and its associated storage and analysis records.
   */
  static async deleteResume(userId: string): Promise<boolean> {
    const student = await StudentService.getOrCreateStudent(userId)
    const resumes = await Resume.find({ studentId: student._id })

    if (resumes.length === 0) {
      throw ApiError.notFound('No active resume found to delete.')
    }

    // Clean up physical files and associated analyses
    for (const resume of resumes) {
      if (resume.storagePath) {
        await storageService.deleteFile(resume.storagePath)
      }
      await ResumeAnalysis.deleteMany({ resumeId: resume._id })
    }

    // Delete all resume records for student
    await Resume.deleteMany({ studentId: student._id })

    return true
  }

  /**
   * Triggers Gemini AI analysis of the active resume.
   */
  static async analyzeResume(
    userId: string,
    targetRole?: string
  ): Promise<{ analysis: IResumeAnalysis; resume: IResume }> {
    const student = await StudentService.getOrCreateStudent(userId)
    const resume = await Resume.findOne({ studentId: student._id }).sort({ version: -1 })

    if (!resume) {
      throw ApiError.notFound(
        'No resume document found. Please upload a resume before running AI analysis.'
      )
    }

    return await ResumeAnalyzerService.analyzeResume(
      resume._id.toString(),
      student._id.toString(),
      targetRole
    )
  }

  /**
   * Retrieves the latest analysis for the active resume.
   */
  static async getLatestAnalysis(
    userId: string
  ): Promise<{ analysis: IResumeAnalysis | null; resume: IResume | null }> {
    const student = await StudentService.getOrCreateStudent(userId)
    const resume = await Resume.findOne({ studentId: student._id }).sort({ version: -1 })

    if (!resume) {
      return { analysis: null, resume: null }
    }

    const analysis = await ResumeAnalysis.findOne({
      resumeId: resume._id,
      studentId: student._id,
    }).sort({ analyzedAt: -1 })

    return { analysis, resume }
  }

  /**
   * Backward-compatible helper for Phase 5 metadata recording.
   */
  static async saveResumeMetadata(
    userId: string,
    data: {
      fileName: string
      fileUrl: string
      fileType?: string
      fileSize?: number
      originalFileName?: string
      extractedText?: string
    }
  ): Promise<IResume> {
    const student = await StudentService.getOrCreateStudent(userId)
    const latest = await Resume.findOne({ studentId: student._id }).sort({ version: -1 })
    const nextVersion = latest ? latest.version + 1 : 1

    const resume = await Resume.create({
      studentId: student._id,
      fileName: data.fileName.trim(),
      originalFileName: data.originalFileName || data.fileName.trim(),
      fileUrl: data.fileUrl.trim(),
      fileType: data.fileType || 'application/pdf',
      fileSize: data.fileSize || 1024 * 256,
      extractedText: data.extractedText || 'Technical Skills: React, Node.js, TypeScript. Education: Bachelor of Science in Computer Science.',
      version: nextVersion,
      analysisStatus: ResumeAnalysisStatus.NOT_ANALYZED,
      uploadedAt: new Date(),
    })

    return resume
  }
}
