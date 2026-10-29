import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'
import { SkillGapLevel, SkillGapPriority } from '../types/index.js'

export interface ISkillStrength {
  skill: string
  level: string
  reason: string
}

export interface ISkillGapItem {
  skill: string
  category: string
  currentLevel: string
  requiredLevel: string
  gapLevel: SkillGapLevel
  priority: SkillGapPriority
  reason: string
  evidence: string
  recommendedAction: string
}

export interface IMissingSkill {
  skill: string
  priority: SkillGapPriority
  reason: string
}

export interface ISkillGapAnalysis extends Document {
  studentId: Types.ObjectId
  targetRole: string
  roleSummary: string
  overallMatchScore: number
  strengths: ISkillStrength[]
  gaps: ISkillGapItem[]
  missingSkills: IMissingSkill[]
  aiModel: string
  analysisVersion: number
  generatedAt: Date
  profileUpdatedAtSnapshot?: Date
  createdAt: Date
  updatedAt: Date
}

const SkillStrengthSchema = new Schema<ISkillStrength>(
  {
    skill: { type: String, required: true, trim: true },
    level: { type: String, required: true, trim: true },
    reason: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const SkillGapItemSchema = new Schema<ISkillGapItem>(
  {
    skill: { type: String, required: true, trim: true },
    category: { type: String, default: 'TOOLS', trim: true },
    currentLevel: { type: String, required: true, trim: true },
    requiredLevel: { type: String, required: true, trim: true },
    gapLevel: {
      type: String,
      enum: Object.values(SkillGapLevel),
      required: true,
      default: SkillGapLevel.MODERATE,
    },
    priority: {
      type: String,
      enum: Object.values(SkillGapPriority),
      required: true,
      default: SkillGapPriority.MEDIUM,
    },
    reason: { type: String, required: true, trim: true },
    evidence: { type: String, required: true, trim: true },
    recommendedAction: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const MissingSkillSchema = new Schema<IMissingSkill>(
  {
    skill: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: Object.values(SkillGapPriority),
      required: true,
      default: SkillGapPriority.MEDIUM,
    },
    reason: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const SkillGapAnalysisSchema = new Schema<ISkillGapAnalysis>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Associated Student ID is required'],
      index: true,
    },
    targetRole: {
      type: String,
      required: [true, 'Target role is required'],
      trim: true,
      maxlength: [120, 'Target role cannot exceed 120 characters'],
    },
    roleSummary: {
      type: String,
      required: true,
      trim: true,
      maxlength: [3000, 'Role summary cannot exceed 3000 characters'],
    },
    overallMatchScore: {
      type: Number,
      required: true,
      min: [0, 'Match score cannot be negative'],
      max: [100, 'Match score cannot exceed 100'],
      default: 70,
    },
    strengths: {
      type: [SkillStrengthSchema],
      default: [],
    },
    gaps: {
      type: [SkillGapItemSchema],
      default: [],
    },
    missingSkills: {
      type: [MissingSkillSchema],
      default: [],
    },
    aiModel: {
      type: String,
      default: 'gemini-3.6-flash',
    },
    analysisVersion: {
      type: Number,
      default: 1,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    profileUpdatedAtSnapshot: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.__v
        if (ret.aiModel) {
          ret.model = ret.aiModel
        }
        return ret
      },
    },
  }
)

SkillGapAnalysisSchema.index({ studentId: 1, createdAt: -1 })
SkillGapAnalysisSchema.index({ studentId: 1, targetRole: 1 })

export const SkillGapAnalysis: Model<ISkillGapAnalysis> =
  mongoose.models.SkillGapAnalysis ||
  mongoose.model<ISkillGapAnalysis>('SkillGapAnalysis', SkillGapAnalysisSchema)
