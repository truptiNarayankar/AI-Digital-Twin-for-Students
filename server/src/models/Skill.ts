import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'
import { SkillCategory, SkillProficiency, SkillSource } from '../types/index.js'

export interface ISkill extends Document {
  studentId: Types.ObjectId
  name: string
  category: SkillCategory
  proficiency: SkillProficiency
  yearsOfExperience?: number
  source: SkillSource
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

const SkillSchema = new Schema<ISkill>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Associated Student ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [100, 'Skill name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      enum: Object.values(SkillCategory),
      default: SkillCategory.PROGRAMMING,
      required: true,
      index: true,
    },
    proficiency: {
      type: String,
      enum: Object.values(SkillProficiency),
      default: SkillProficiency.INTERMEDIATE,
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative'],
      default: 1,
    },
    source: {
      type: String,
      enum: Object.values(SkillSource),
      default: SkillSource.SELF_REPORTED,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id
        const sanitized = ret as Record<string, unknown>
        delete sanitized._id
        delete sanitized.__v
        return ret
      },
    },
  }
)

// Ensure unique skill name per student
SkillSchema.index({ studentId: 1, name: 1 }, { unique: true })

export const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema)
