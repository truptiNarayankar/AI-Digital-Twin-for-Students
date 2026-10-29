import { Skill, type ISkill } from '../models/Skill.js'
import { StudentService } from './student.service.js'
import { ApiError } from '../utils/apiError.js'
import { Types } from 'mongoose'

export class SkillService {
  static async getSkills(userId: string): Promise<ISkill[]> {
    const student = await StudentService.getOrCreateStudent(userId)
    return await Skill.find({ studentId: student._id }).sort({ category: 1, name: 1 })
  }

  static async createSkill(userId: string, data: Partial<ISkill>): Promise<ISkill> {
    const student = await StudentService.getOrCreateStudent(userId)

    const existing = await Skill.findOne({
      studentId: student._id,
      name: { $regex: new RegExp(`^${data.name?.trim()}$`, 'i') },
    })

    if (existing) {
      throw new ApiError(
        `Skill '${data.name}' is already present in your skills profile.`,
        409,
        'DUPLICATE_SKILL'
      )
    }

    const skill = await Skill.create({
      ...data,
      studentId: student._id,
      name: data.name?.trim(),
    })

    return skill
  }

  static async updateSkill(
    userId: string,
    skillId: string,
    data: Partial<ISkill>
  ): Promise<ISkill> {
    const student = await StudentService.getOrCreateStudent(userId)

    if (!Types.ObjectId.isValid(skillId)) {
      throw ApiError.badRequest('Invalid skill identifier.')
    }

    const existing = await Skill.findById(skillId)
    if (!existing) {
      throw ApiError.notFound('Skill not found.')
    }

    if (existing.studentId.toString() !== student._id.toString()) {
      throw ApiError.forbidden('Access forbidden: You do not own this skill.')
    }

    const updated = await Skill.findByIdAndUpdate(
      skillId,
      { $set: data },
      { new: true, runValidators: true }
    )

    if (!updated) {
      throw ApiError.notFound('Skill not found.')
    }

    return updated
  }

  static async deleteSkill(userId: string, skillId: string): Promise<void> {
    const student = await StudentService.getOrCreateStudent(userId)

    if (!Types.ObjectId.isValid(skillId)) {
      throw ApiError.badRequest('Invalid skill identifier.')
    }

    const existing = await Skill.findById(skillId)
    if (!existing) {
      throw ApiError.notFound('Skill not found.')
    }

    if (existing.studentId.toString() !== student._id.toString()) {
      throw ApiError.forbidden('Access forbidden: You do not own this skill.')
    }

    await Skill.findByIdAndDelete(skillId)
  }
}
