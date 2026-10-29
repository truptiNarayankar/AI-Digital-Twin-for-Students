import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'
import {
  ReadinessLevel,
  BlockerSeverity,
  ActionPriority,
  EvidenceImpact,
} from '../types/index.js'

export interface IPlacementDimensionScores {
  academics: number
  technicalSkills: number
  codingAbility: number
  projects: number
  resume: number
  interviewPerformance: number
  certifications: number
  careerAlignment: number
  profileCompleteness: number
}

export interface IPlacementStrength {
  title: string
  description: string
  evidence: string
}

export interface IPlacementWeakness {
  title: string
  description: string
  evidence: string
}

export interface IPlacementBlocker {
  title: string
  severity: BlockerSeverity
  description: string
  action: string
}

export interface IPlacementAction {
  title: string
  priority: ActionPriority
  description: string
  reason: string
}

export interface IPlacementEvidenceItem {
  dimension: string
  observation: string
  impact: EvidenceImpact
}

export interface IPlacementAssessment extends Document {
  studentId: Types.ObjectId
  targetRole: string
  overallReadinessScore: number
  readinessScore: number // compatibility alias
  estimatedPlacementProbability: number
  placementProbability: number // compatibility alias
  readinessLevel: ReadinessLevel
  dimensionScores: IPlacementDimensionScores
  strengths: IPlacementStrength[]
  weaknesses: IPlacementWeakness[]
  placementBlockers: IPlacementBlocker[]
  recommendedActions: IPlacementAction[]
  evidence: IPlacementEvidenceItem[]
  assessmentSummary: string
  summary?: string // compatibility alias
  aiModel: string
  assessmentVersion: number
  generatedAt: Date
  assessmentDate?: Date // compatibility alias
  profileUpdatedAtSnapshot?: Date
  createdAt: Date
  updatedAt: Date
}

const DimensionScoresSchema = new Schema<IPlacementDimensionScores>(
  {
    academics: { type: Number, required: true, min: 0, max: 100, default: 0 },
    technicalSkills: { type: Number, required: true, min: 0, max: 100, default: 0 },
    codingAbility: { type: Number, required: true, min: 0, max: 100, default: 0 },
    projects: { type: Number, required: true, min: 0, max: 100, default: 0 },
    resume: { type: Number, required: true, min: 0, max: 100, default: 0 },
    interviewPerformance: { type: Number, required: true, min: 0, max: 100, default: 0 },
    certifications: { type: Number, required: true, min: 0, max: 100, default: 0 },
    careerAlignment: { type: Number, required: true, min: 0, max: 100, default: 0 },
    profileCompleteness: { type: Number, required: true, min: 0, max: 100, default: 0 },
  },
  { _id: false }
)

const StrengthSchema = new Schema<IPlacementStrength>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    evidence: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const WeaknessSchema = new Schema<IPlacementWeakness>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    evidence: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const BlockerSchema = new Schema<IPlacementBlocker>(
  {
    title: { type: String, required: true, trim: true },
    severity: {
      type: String,
      enum: Object.values(BlockerSeverity),
      required: true,
      default: BlockerSeverity.MEDIUM,
    },
    description: { type: String, required: true, trim: true },
    action: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const ActionSchema = new Schema<IPlacementAction>(
  {
    title: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: Object.values(ActionPriority),
      required: true,
      default: ActionPriority.MEDIUM,
    },
    description: { type: String, required: true, trim: true },
    reason: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const EvidenceSchema = new Schema<IPlacementEvidenceItem>(
  {
    dimension: { type: String, required: true, trim: true },
    observation: { type: String, required: true, trim: true },
    impact: {
      type: String,
      enum: Object.values(EvidenceImpact),
      required: true,
      default: EvidenceImpact.NEUTRAL,
    },
  },
  { _id: false }
)

const PlacementAssessmentSchema = new Schema<IPlacementAssessment>(
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
      default: 'Full Stack Developer',
    },
    overallReadinessScore: {
      type: Number,
      required: [true, 'Overall readiness score is required'],
      min: [0, 'Readiness score cannot be negative'],
      max: [100, 'Readiness score cannot exceed 100'],
      default: 0,
    },
    readinessScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    estimatedPlacementProbability: {
      type: Number,
      required: [true, 'Estimated placement probability is required'],
      min: [0, 'Probability cannot be negative'],
      max: [100, 'Probability cannot exceed 100'],
      default: 0,
    },
    placementProbability: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    readinessLevel: {
      type: String,
      enum: Object.values(ReadinessLevel),
      required: [true, 'Readiness level is required'],
      default: ReadinessLevel.DEVELOPING,
    },
    dimensionScores: {
      type: DimensionScoresSchema,
      required: true,
      default: () => ({}),
    },
    strengths: {
      type: [StrengthSchema],
      default: [],
    },
    weaknesses: {
      type: [WeaknessSchema],
      default: [],
    },
    placementBlockers: {
      type: [BlockerSchema],
      default: [],
    },
    recommendedActions: {
      type: [ActionSchema],
      default: [],
    },
    evidence: {
      type: [EvidenceSchema],
      default: [],
    },
    assessmentSummary: {
      type: String,
      required: [true, 'Assessment summary is required'],
      trim: true,
      maxlength: [5000, 'Assessment summary cannot exceed 5000 characters'],
    },
    summary: {
      type: String,
      trim: true,
    },
    aiModel: {
      type: String,
      required: true,
      default: 'gemini-3.6-flash',
    },
    assessmentVersion: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    generatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    assessmentDate: {
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
      transform: (_doc, ret: Record<string, any>) => {
        delete ret.__v
        // Ensure compatibility aliases are populated
        if (ret.overallReadinessScore !== undefined && ret.readinessScore === undefined) {
          ret.readinessScore = ret.overallReadinessScore
        }
        if (ret.estimatedPlacementProbability !== undefined && ret.placementProbability === undefined) {
          ret.placementProbability = ret.estimatedPlacementProbability
        }
        if (ret.assessmentSummary && !ret.summary) {
          ret.summary = ret.assessmentSummary
        }
        if (ret.generatedAt && !ret.assessmentDate) {
          ret.assessmentDate = ret.generatedAt
        }
        return ret
      },
    },
  }
)

PlacementAssessmentSchema.index({ studentId: 1, generatedAt: -1 })

export const PlacementAssessment: Model<IPlacementAssessment> =
  mongoose.models.PlacementAssessment ||
  mongoose.model<IPlacementAssessment>('PlacementAssessment', PlacementAssessmentSchema)
