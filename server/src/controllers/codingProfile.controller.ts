import type { Request, Response, NextFunction } from 'express'
import { CodingProfileService } from '../services/codingProfile.service.js'
import { ApiResponse } from '../utils/apiResponse.js'

export class CodingProfileController {
  static async getProfiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profiles = await CodingProfileService.getProfiles(req.user!.id)
      ApiResponse.success(res, 'Coding profiles retrieved successfully.', { profiles })
    } catch (error) {
      next(error)
    }
  }

  static async createProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await CodingProfileService.createProfile(req.user!.id, req.body)
      ApiResponse.success(res, 'Coding profile linked successfully.', { profile }, 201)
    } catch (error) {
      next(error)
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await CodingProfileService.updateProfile(req.user!.id, req.params.id as string, req.body)
      ApiResponse.success(res, 'Coding profile updated successfully.', { profile })
    } catch (error) {
      next(error)
    }
  }

  static async deleteProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await CodingProfileService.deleteProfile(req.user!.id, req.params.id as string)
      ApiResponse.success(res, 'Coding profile deleted successfully.', null)
    } catch (error) {
      next(error)
    }
  }
}
