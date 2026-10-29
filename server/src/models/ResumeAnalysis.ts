import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'

export interface ISectionScores {
  summary: number
  experience: number
  projects: number
  skills: number
  education: number
  certifications: number
  formatting: number
}

export interface IImprovementSuggestion {
  section: string
  problem: string
  suggestion: string
  exampleBefore?: string
  exampleAfter?: string
}

export interface IResumeAnalysis {
  studentId: Types.ObjectId
  resumeId: Types.ObjectId
  overallScore: number
  sectionScores: ISectionScores
  strengths: string[]
  weaknesses: string[]
  missingSections: string[]
  skillsDetected: string[]
  keywords: string[]
  projectFeedback: string
  experienceFeedback: string
  educationFeedback: string
  summaryFeedback: string
  formattingFeedback: string
  atsRecommendations: string[]
  improvementSuggestions: IImprovementSuggestion[]
  targetRole?: string
  aiModel: string
  analysisVersion: string
  analyzedAt: Date
  createdAt: Date
  updatedAt: Date
}

export type IResumeAnalysisDocument = IResumeAnalysis & Document

const SectionScoresSchema = new Schema<ISectionScores>(
  {
    summary: { type: Number, required: true, min: 0, max: 100 },
    experience: { type: Number, required: true, min: 0, max: 100 },
    projects: { type: Number, required: true, min: 0, max: 100 },
    skills: { type: Number, required: true, min: 0, max: 100 },
    education: { type: Number, required: true, min: 0, max: 100 },
    certifications: { type: Number, required: true, min: 0, max: 100 },
    formatting: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
)

const ImprovementSuggestionSchema = new Schema<IImprovementSuggestion>(
  {
    section: { type: String, required: true, trim: true },
    problem: { type: String, required: true, trim: true },
    suggestion: { type: String, required: true, trim: true },
    exampleBefore: { type: String, trim: true },
    exampleAfter: { type: String, trim: true },
  },
  { _id: false }
)

const ResumeAnalysisSchema = new Schema<IResumeAnalysisDocument>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      index: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
      required: [true, 'Resume ID is required'],
      index: true,
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    sectionScores: {
      type: SectionScoresSchema,
      required: true,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    missingSections: {
      type: [String],
      default: [],
    },
    skillsDetected: {
      type: [String],
      default: [],
    },
    keywords: {
      type: [String],
      default: [],
    },
    projectFeedback: {
      type: String,
      default: '',
    },
    experienceFeedback: {
      type: String,
      default: '',
    },
    educationFeedback: {
      type: String,
      default: '',
    },
    summaryFeedback: {
      type: String,
      default: '',
    },
    formattingFeedback: {
      type: String,
      default: '',
    },
    atsRecommendations: {
      type: [String],
      default: [],
    },
    improvementSuggestions: {
      type: [ImprovementSuggestionSchema],
      default: [],
    },
    targetRole: {
      type: String,
      trim: true,
      default: 'Software Engineer',
    },
    aiModel: {
      type: String,
      required: true,
      default: 'gemini-3.6-flash',
    },
    analysisVersion: {
      type: String,
      required: true,
      default: '1.0',
    },
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id
        const sanitized = ret as Record<string, unknown>
        sanitized.model = ret.aiModel
        delete sanitized._id
        delete sanitized.__v
        return ret
      },
    },
  }
)

export const ResumeAnalysis: Model<IResumeAnalysisDocument> =
  mongoose.models.ResumeAnalysis ||
  mongoose.model<IResumeAnalysisDocument>('ResumeAnalysis', ResumeAnalysisSchema)
