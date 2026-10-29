import type { Request, Response, NextFunction } from 'express'
import { PlacementService } from '../services/placement.service.js'
import { ApiResponse } from '../utils/apiResponse.js'

export class PlacementController {
  /**
   * Generates or refreshes a placement assessment for the authenticated student.
   * POST /api/v1/students/placement/assess
   */
  static async assessPlacement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetRole = req.body?.targetRole as string | undefined
      const forceRefresh = Boolean(req.body?.forceRefresh)

      const assessment = await PlacementService.assessPlacement(req.user!.id, {
        targetRole,
        forceRefresh,
      })

      ApiResponse.success(res, 'Placement readiness assessment generated successfully.', { assessment }, 201)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Retrieves the most recent placement assessment with staleness status.
   * GET /api/v1/students/placement/latest
   */
  static async getLatestAssessment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PlacementService.getLatestAssessment(req.user!.id)
      ApiResponse.success(res, 'Latest placement readiness assessment retrieved successfully.', result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Retrieves chronological assessment history for the authenticated student.
   * GET /api/v1/students/placement/history
   */
  static async getAssessmentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const history = await PlacementService.getAssessmentHistory(req.user!.id)
      ApiResponse.success(res, 'Placement assessment history retrieved successfully.', { history })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Retrieves a lightweight placement readiness summary for dashboard widgets.
   * GET /api/v1/students/placement/readiness
   */
  static async getReadinessSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await PlacementService.getReadinessSummary(req.user!.id)
      ApiResponse.success(res, 'Placement readiness summary retrieved successfully.', summary)
    } catch (error) {
      next(error)
    }
  }
}
