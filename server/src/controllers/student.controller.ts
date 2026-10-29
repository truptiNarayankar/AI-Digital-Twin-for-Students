import type { Request, Response, NextFunction } from 'express'
import { StudentService } from '../services/student.service.js'
import { ApiResponse } from '../utils/apiResponse.js'

export class StudentController {
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await StudentService.getProfile(req.user!.id)
      ApiResponse.success(res, 'Student profile retrieved successfully.', { student })
    } catch (error) {
      next(error)
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await StudentService.updateProfile(req.user!.id, req.body)
      ApiResponse.success(res, 'Student profile updated successfully.', { student })
    } catch (error) {
      next(error)
    }
  }

  static async getCareerGoals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await StudentService.getProfile(req.user!.id)
      ApiResponse.success(res, 'Career aspirations retrieved successfully.', {
        careerGoals: {
          careerGoal: student.careerGoal || '',
          preferredJobRoles: student.preferredJobRoles || [],
          preferredDomains: student.preferredDomains || [],
          preferredLocations: student.preferredLocations || [],
        },
      })
    } catch (error) {
      next(error)
    }
  }

  static async updateCareerGoals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await StudentService.updateCareerGoals(req.user!.id, req.body)
      ApiResponse.success(res, 'Career aspirations updated successfully.', {
        careerGoals: {
          careerGoal: student.careerGoal,
          preferredJobRoles: student.preferredJobRoles,
          preferredDomains: student.preferredDomains,
          preferredLocations: student.preferredLocations,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  static async getDigitalTwin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const digitalTwin = await StudentService.getDigitalTwinSummary(req.user!.id)
      ApiResponse.success(res, 'Digital Twin data foundation retrieved successfully.', digitalTwin)
    } catch (error) {
      next(error)
    }
  }
}
