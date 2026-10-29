import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'
import { LearningStageStatus, LearningResourceType } from '../types/index.js'

export interface ILearningResource {
  title: string
  type: LearningResourceType
  url: string
}

export interface ILearningStage {
  stageNumber: number
  title: string
  objective: string
  skills: string[]
  estimatedDuration: string
  prerequisites: string[]
  recommendedResources: ILearningResource[]
  practiceTasks: string[]
  projectTask: string
  status: LearningStageStatus
  progress: number
}

export interface ILearningPath extends Document {
  studentId: Types.ObjectId
  skillGapAnalysisId?: Types.ObjectId
  targetRole: string
  title: string
  description: string
  totalEstimatedWeeks: number
  stages: ILearningStage[]
  status: LearningStageStatus
  progress: number
  progressPercentage?: number // alias
  aiModel: string
  version: number
  generatedAt: Date
  createdAt: Date
  updatedAt: Date
}

const LearningResourceSchema = new Schema<ILearningResource>(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: Object.values(LearningResourceType),
      default: LearningResourceType.DOCUMENTATION,
      required: true,
    },
    url: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const LearningStageSchema = new Schema<ILearningStage>(
  {
    stageNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    objective: { type: String, required: true, trim: true },
    skills: { type: [String], default: [] },
    estimatedDuration: { type: String, default: '1-2 weeks', trim: true },
    prerequisites: { type: [String], default: [] },
    recommendedResources: { type: [LearningResourceSchema], default: [] },
    practiceTasks: { type: [String], default: [] },
    projectTask: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(LearningStageStatus),
      default: LearningStageStatus.NOT_STARTED,
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Stage progress cannot be less than 0'],
      max: [100, 'Stage progress cannot exceed 100'],
    },
  },
  { _id: false }
)

const LearningPathSchema = new Schema<ILearningPath>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Associated Student ID is required'],
      index: true,
    },
    skillGapAnalysisId: {
      type: Schema.Types.ObjectId,
      ref: 'SkillGapAnalysis',
    },
    targetRole: {
      type: String,
      required: [true, 'Target role is required'],
      trim: true,
      maxlength: [120, 'Target role cannot exceed 120 characters'],
    },
    title: {
      type: String,
      required: [true, 'Learning path title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    totalEstimatedWeeks: {
      type: Number,
      default: 8,
      min: [1, 'Estimated weeks must be at least 1'],
      max: [52, 'Estimated weeks cannot exceed 52'],
    },
    stages: {
      type: [LearningStageSchema],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(LearningStageStatus),
      default: LearningStageStatus.NOT_STARTED,
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Overall progress cannot be less than 0'],
      max: [100, 'Overall progress cannot exceed 100'],
    },
    aiModel: {
      type: String,
      default: 'gemini-3.6-flash',
    },
    version: {
      type: Number,
      default: 1,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
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

// Backward compatibility virtual
LearningPathSchema.virtual('progressPercentage').get(function (this: ILearningPath) {
  return this.progress
})

LearningPathSchema.index({ studentId: 1, createdAt: -1 })
LearningPathSchema.index({ studentId: 1, targetRole: 1 })

export const LearningPath: Model<ILearningPath> =
  mongoose.models.LearningPath || mongoose.model<ILearningPath>('LearningPath', LearningPathSchema)
