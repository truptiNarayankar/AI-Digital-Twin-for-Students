import type { Request, Response, NextFunction } from 'express'
import { InterviewService } from '../services/interview.service.js'
import { ApiResponse } from '../utils/apiResponse.js'

export class InterviewController {
  static async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const interview = await InterviewService.createSession(req.user!.id, req.body)
      ApiResponse.success(res, 'Interview session initialized successfully.', { interview }, 201)
    } catch (error) {
      next(error)
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const interviews = await InterviewService.getHistory(req.user!.id)
      ApiResponse.success(res, 'Interview history retrieved successfully.', { interviews })
    } catch (error) {
      next(error)
    }
  }

  static async getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string
      const interview = await InterviewService.getSession(req.user!.id, sessionId)
      ApiResponse.success(res, 'Interview session retrieved successfully.', { interview })
    } catch (error) {
      next(error)
    }
  }

  static async submitAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string
      const result = await InterviewService.submitAnswer(req.user!.id, sessionId, req.body)
      ApiResponse.success(res, 'Answer evaluated successfully.', result)
    } catch (error) {
      next(error)
    }
  }

  static async completeInterview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string
      const interview = await InterviewService.completeInterview(req.user!.id, sessionId)
      ApiResponse.success(res, 'Interview session completed and evaluated successfully.', { interview })
    } catch (error) {
      next(error)
    }
  }

  static async abandonInterview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string
      const interview = await InterviewService.abandonInterview(req.user!.id, sessionId)
      ApiResponse.success(res, 'Interview session marked as abandoned.', { interview })
    } catch (error) {
      next(error)
    }
  }

  static async getResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id as string
      const interview = await InterviewService.getResult(req.user!.id, sessionId)
      ApiResponse.success(res, 'Interview evaluation report retrieved successfully.', { interview })
    } catch (error) {
      next(error)
    }
  }
}
