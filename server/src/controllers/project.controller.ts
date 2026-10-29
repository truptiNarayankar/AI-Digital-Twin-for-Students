import type { Request, Response, NextFunction } from 'express'
import { ProjectService } from '../services/project.service.js'
import { ApiResponse } from '../utils/apiResponse.js'

export class ProjectController {
  static async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await ProjectService.getProjects(req.user!.id)
      ApiResponse.success(res, 'Projects retrieved successfully.', { projects })
    } catch (error) {
      next(error)
    }
  }

  static async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await ProjectService.createProject(req.user!.id, req.body)
      ApiResponse.success(res, 'Project added to portfolio successfully.', { project }, 201)
    } catch (error) {
      next(error)
    }
  }

  static async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await ProjectService.updateProject(req.user!.id, req.params.id as string, req.body)
      ApiResponse.success(res, 'Project updated successfully.', { project })
    } catch (error) {
      next(error)
    }
  }

  static async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ProjectService.deleteProject(req.user!.id, req.params.id as string)
      ApiResponse.success(res, 'Project deleted successfully.', null)
    } catch (error) {
      next(error)
    }
  }
}
