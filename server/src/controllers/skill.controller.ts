import type { Request, Response, NextFunction } from 'express'
import { SkillService } from '../services/skill.service.js'
import { ApiResponse } from '../utils/apiResponse.js'

export class SkillController {
  static async getSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skills = await SkillService.getSkills(req.user!.id)
      ApiResponse.success(res, 'Skills retrieved successfully.', { skills })
    } catch (error) {
      next(error)
    }
  }

  static async createSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skill = await SkillService.createSkill(req.user!.id, req.body)
      ApiResponse.success(res, 'Skill added successfully.', { skill }, 201)
    } catch (error) {
      next(error)
    }
  }

  static async updateSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skill = await SkillService.updateSkill(req.user!.id, req.params.id as string, req.body)
      ApiResponse.success(res, 'Skill updated successfully.', { skill })
    } catch (error) {
      next(error)
    }
  }

  static async deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await SkillService.deleteSkill(req.user!.id, req.params.id as string)
      ApiResponse.success(res, 'Skill deleted successfully.', null)
    } catch (error) {
      next(error)
    }
  }
}
