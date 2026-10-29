import { Project, type IProject } from '../models/Project.js'
import { StudentService } from './student.service.js'
import { ApiError } from '../utils/apiError.js'
import { Types } from 'mongoose'

export class ProjectService {
  static async getProjects(userId: string): Promise<IProject[]> {
    const student = await StudentService.getOrCreateStudent(userId)
    return await Project.find({ studentId: student._id }).sort({ createdAt: -1 })
  }

  static async createProject(userId: string, data: Partial<IProject>): Promise<IProject> {
    const student = await StudentService.getOrCreateStudent(userId)

    const project = await Project.create({
      ...data,
      studentId: student._id,
      title: data.title?.trim(),
      description: data.description?.trim(),
    })

    return project
  }

  static async updateProject(
    userId: string,
    projectId: string,
    data: Partial<IProject>
  ): Promise<IProject> {
    const student = await StudentService.getOrCreateStudent(userId)

    if (!Types.ObjectId.isValid(projectId)) {
      throw ApiError.badRequest('Invalid project identifier.')
    }

    const existing = await Project.findById(projectId)
    if (!existing) {
      throw ApiError.notFound('Project not found.')
    }

    if (existing.studentId.toString() !== student._id.toString()) {
      throw ApiError.forbidden('Access forbidden: You do not own this project.')
    }

    const updated = await Project.findByIdAndUpdate(
      projectId,
      { $set: data },
      { new: true, runValidators: true }
    )

    if (!updated) {
      throw ApiError.notFound('Project not found.')
    }

    return updated
  }

  static async deleteProject(userId: string, projectId: string): Promise<void> {
    const student = await StudentService.getOrCreateStudent(userId)

    if (!Types.ObjectId.isValid(projectId)) {
      throw ApiError.badRequest('Invalid project identifier.')
    }

    const existing = await Project.findById(projectId)
    if (!existing) {
      throw ApiError.notFound('Project not found.')
    }

    if (existing.studentId.toString() !== student._id.toString()) {
      throw ApiError.forbidden('Access forbidden: You do not own this project.')
    }

    await Project.findByIdAndDelete(projectId)
  }
}
