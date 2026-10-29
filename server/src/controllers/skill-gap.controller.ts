import type { Request, Response, NextFunction } from 'express'
import { SkillGapService } from '../services/skill-gap.service.js'
import { ApiResponse } from '../utils/apiResponse.js'

export class SkillGapController {
  static async analyzeSkillGap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetRole = req.body?.targetRole as string | undefined
      const analysis = await SkillGapService.analyzeSkillGap(req.user!.id, targetRole)
      ApiResponse.success(res, 'Skill gap analysis generated successfully.', { analysis }, 201)
    } catch (error) {
      next(error)
    }
  }

  static async getLatestSkillGap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await SkillGapService.getLatestSkillGap(req.user!.id)
      ApiResponse.success(res, 'Latest skill gap analysis retrieved successfully.', result)
    } catch (error) {
      next(error)
    }
  }

  static async getSkillGapHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const history = await SkillGapService.getSkillGapHistory(req.user!.id)
      ApiResponse.success(res, 'Skill gap analysis history retrieved successfully.', { history })
    } catch (error) {
      next(error)
    }
  }

  static async generateLearningPath(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skillGapAnalysisId = req.body?.skillGapAnalysisId as string | undefined
      const learningPath = await SkillGapService.generateLearningPath(req.user!.id, skillGapAnalysisId)
      ApiResponse.success(res, 'Personalized learning path generated successfully.', { learningPath }, 201)
    } catch (error) {
      next(error)
    }
  }

  static async getLearningPath(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const learningPath = await SkillGapService.getLearningPath(req.user!.id)
      ApiResponse.success(res, 'Personalized learning path retrieved successfully.', { learningPath })
    } catch (error) {
      next(error)
    }
  }

  static async updateStageProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const learningPathId = req.params.id as string
      const stageNumber = parseInt(req.params.stageNumber as string, 10)
      const learningPath = await SkillGapService.updateStageProgress(
        req.user!.id,
        learningPathId,
        stageNumber,
        req.body
      )
      ApiResponse.success(res, 'Learning stage progress updated successfully.', { learningPath })
    } catch (error) {
      next(error)
    }
  }
}
