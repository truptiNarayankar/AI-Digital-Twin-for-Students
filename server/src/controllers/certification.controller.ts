import type { Request, Response, NextFunction } from 'express'
import { CertificationService } from '../services/certification.service.js'
import { ApiResponse } from '../utils/apiResponse.js'

export class CertificationController {
  static async getCertifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const certifications = await CertificationService.getCertifications(req.user!.id)
      ApiResponse.success(res, 'Certifications retrieved successfully.', { certifications })
    } catch (error) {
      next(error)
    }
  }

  static async createCertification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const certification = await CertificationService.createCertification(req.user!.id, req.body)
      ApiResponse.success(res, 'Certification added successfully.', { certification }, 201)
    } catch (error) {
      next(error)
    }
  }

  static async updateCertification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const certification = await CertificationService.updateCertification(
        req.user!.id,
        req.params.id as string,
        req.body
      )
      ApiResponse.success(res, 'Certification updated successfully.', { certification })
    } catch (error) {
      next(error)
    }
  }

  static async deleteCertification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await CertificationService.deleteCertification(req.user!.id, req.params.id as string)
      ApiResponse.success(res, 'Certification deleted successfully.', null)
    } catch (error) {
      next(error)
    }
  }
}
