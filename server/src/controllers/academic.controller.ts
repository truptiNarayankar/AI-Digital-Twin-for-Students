import type { Request, Response, NextFunction } from 'express'
import { AcademicService } from '../services/academic.service.js'
import { ApiResponse } from '../utils/apiResponse.js'

export class AcademicController {
  static async getRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const records = await AcademicService.getRecords(req.user!.id)
      ApiResponse.success(res, 'Academic records retrieved successfully.', { records })
    } catch (error) {
      next(error)
    }
  }

  static async createRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await AcademicService.createRecord(req.user!.id, req.body)
      ApiResponse.success(res, 'Academic semester record created successfully.', { record }, 201)
    } catch (error) {
      next(error)
    }
  }

  static async updateRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await AcademicService.updateRecord(req.user!.id, req.params.id as string, req.body)
      ApiResponse.success(res, 'Academic record updated successfully.', { record })
    } catch (error) {
      next(error)
    }
  }

  static async deleteRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AcademicService.deleteRecord(req.user!.id, req.params.id as string)
      ApiResponse.success(res, 'Academic record deleted successfully.', null)
    } catch (error) {
      next(error)
    }
  }
}
