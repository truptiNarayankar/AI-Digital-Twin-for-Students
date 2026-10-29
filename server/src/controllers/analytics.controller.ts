/**
 * Analytics Controller — Phase 6
 * Handles GET /api/v1/student/analytics
 * Authentication and STUDENT role authorization applied at router level.
 */

import type { Request, Response, NextFunction } from 'express'
import { AnalyticsService } from '../services/analytics.service.js'
import { ApiResponse } from '../utils/apiResponse.js'

export class AnalyticsController {
  /**
   * GET /api/v1/student/analytics
   * Returns aggregated analytics for the authenticated student.
   * Student is resolved from req.user.id — no arbitrary studentId accepted.
   */
  static async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await AnalyticsService.getStudentAnalytics(req.user!.id)
      ApiResponse.success(res, 'Student analytics retrieved successfully.', analytics)
    } catch (error) {
      next(error)
    }
  }
}
