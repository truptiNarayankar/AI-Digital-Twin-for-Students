import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'
import { InterviewType, InterviewDifficulty, InterviewStatus } from '../types/index.js'

export interface IInterviewQuestion {
  questionId: string
  questionNumber: number
  category: string
  questionText: string
  expectedTopics: string[]
  studentAnswer?: string
  answerScore?: number
  answerFeedback?: string
  strengths: string[]
  improvements: string[]
  missingTopics: string[]
  answeredAt?: Date
}

export interface IInterviewCategoryScores {
  technical?: number
  communication?: number
  problemSolving?: number
  behavioral?: number
  situational?: number
  [key: string]: number | undefined
}

export interface IInterview extends Document {
  studentId: Types.ObjectId
  sessionId: string
  interviewType: InterviewType
  type: InterviewType // alias for backward compatibility
  targetRole: string
  difficulty: InterviewDifficulty
  questionCount: number
  currentQuestionIndex: number
  status: InterviewStatus
  questions: IInterviewQuestion[]
  overallScore?: number
  categoryScores?: IInterviewCategoryScores
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  feedback?: string
  startedAt: Date
  completedAt?: Date
  interviewDate: Date // alias for backward compatibility
  aiModel?: string
  createdAt: Date
  updatedAt: Date
}

const InterviewQuestionSchema = new Schema<IInterviewQuestion>(
  {
    questionId: {
      type: String,
      required: true,
    },
    questionNumber: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    expectedTopics: {
      type: [String],
      default: [],
    },
    studentAnswer: {
      type: String,
      trim: true,
      maxlength: [10000, 'Answer cannot exceed 10,000 characters'],
    },
    answerScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    answerFeedback: {
      type: String,
      trim: true,
    },
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    missingTopics: {
      type: [String],
      default: [],
    },
    answeredAt: {
      type: Date,
    },
  },
  { _id: false }
)

const InterviewSchema = new Schema<IInterview>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Associated Student ID is required'],
      index: true,
    },
    sessionId: {
      type: String,
      required: [true, 'Interview session ID is required'],
      unique: true,
      index: true,
    },
    interviewType: {
      type: String,
      enum: Object.values(InterviewType),
      required: [true, 'Interview type is required'],
      default: InterviewType.TECHNICAL,
    },
    targetRole: {
      type: String,
      required: [true, 'Target job role is required'],
      trim: true,
      maxlength: [120, 'Target role cannot exceed 120 characters'],
    },
    difficulty: {
      type: String,
      enum: Object.values(InterviewDifficulty),
      default: InterviewDifficulty.INTERMEDIATE,
      required: true,
    },
    questionCount: {
      type: Number,
      required: true,
      min: [1, 'Question count must be at least 1'],
      max: [20, 'Question count cannot exceed 20'],
      default: 5,
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(InterviewStatus),
      default: InterviewStatus.IN_PROGRESS,
      index: true,
    },
    questions: {
      type: [InterviewQuestionSchema],
      default: [],
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    categoryScores: {
      type: Schema.Types.Mixed,
      default: {},
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: [5000, 'Feedback cannot exceed 5000 characters'],
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    aiModel: {
      type: String,
      default: 'gemini-3.6-flash',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret.__v
        // expose model safely if present
        if (ret.aiModel) {
          ret.model = ret.aiModel
        }
        return ret
      },
    },
  }
)

// Aliases for compatibility
InterviewSchema.virtual('type').get(function (this: IInterview) {
  return this.interviewType
})

InterviewSchema.virtual('interviewDate').get(function (this: IInterview) {
  return this.startedAt
})

InterviewSchema.index({ studentId: 1, createdAt: -1 })
InterviewSchema.index({ studentId: 1, status: 1 })

export const Interview: Model<IInterview> =
  mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema)
