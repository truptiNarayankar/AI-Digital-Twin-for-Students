import type { Request, Response, NextFunction } from 'express'
import { ResumeService } from '../services/resume.service.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { ApiError } from '../utils/apiError.js'

export class ResumeController {
  /**
   * GET /api/v1/student/resume
   * Retrieves active resume metadata.
   */
  static async getResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resume = await ResumeService.getResume(req.user!.id)
      ApiResponse.success(res, 'Resume metadata retrieved successfully.', {
        resume,
        hasResume: Boolean(resume),
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/v1/student/resume
   * Uploads physical resume (multipart) or records metadata (JSON).
   */
  static async saveResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // If multipart file was uploaded via Multer
      if (req.file) {
        const resume = await ResumeService.uploadResumeFile(req.user!.id, req.file)
        ApiResponse.success(
          res,
          'Resume file uploaded and processed successfully.',
          { resume },
          201
        )
        return
      }

      // Backward-compatible JSON metadata upload (Phase 5 compatibility)
      if (req.body && req.body.fileName) {
        const resume = await ResumeService.saveResumeMetadata(req.user!.id, req.body)
        ApiResponse.success(res, 'Resume metadata recorded successfully.', { resume }, 201)
        return
      }

      throw ApiError.badRequest('No resume file or valid metadata provided.')
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /api/v1/student/resume
   * Deletes active resume and associated analyses.
   */
  static async deleteResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ResumeService.deleteResume(req.user!.id)
      ApiResponse.success(res, 'Resume and associated analyses deleted successfully.', {
        success: true,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/v1/student/resume/analyze
   * Analyzes active resume using Gemini.
   */
  static async analyzeResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetRole = req.body?.targetRole as string | undefined
      const result = await ResumeService.analyzeResume(req.user!.id, targetRole)
      ApiResponse.success(res, 'AI resume analysis completed successfully.', result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/student/resume/analysis
   * Retrieves latest cached AI analysis without triggering a new Gemini call.
   */
  static async getAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ResumeService.getLatestAnalysis(req.user!.id)
      ApiResponse.success(
        res,
        result.analysis
          ? 'Latest AI resume analysis retrieved.'
          : 'No analysis found for the current resume.',
        result
      )
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/v1/student/resume/reanalyze
   * Re-analyzes the active resume document.
   */
  static async reanalyzeResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetRole = req.body?.targetRole as string | undefined
      const result = await ResumeService.analyzeResume(req.user!.id, targetRole)
      ApiResponse.success(res, 'Resume re-analysis completed successfully.', result)
    } catch (error) {
      next(error)
    }
  }
}
