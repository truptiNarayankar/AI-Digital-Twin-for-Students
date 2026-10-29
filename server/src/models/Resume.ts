import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'
import { ResumeAnalysisStatus } from '../types/index.js'

export interface IResume extends Document {
  studentId: Types.ObjectId
  fileName: string
  originalFileName: string
  fileUrl: string
  storagePath?: string
  fileType: string
  fileSize: number
  extractedText?: string
  version: number
  uploadedAt: Date
  analysisStatus: ResumeAnalysisStatus
  lastAnalyzedAt?: Date
  analysisVersion?: string
  createdAt: Date
  updatedAt: Date
}

const ResumeSchema = new Schema<IResume>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Associated Student ID is required'],
      index: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    originalFileName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'File storage URL or key is required'],
      trim: true,
    },
    storagePath: {
      type: String,
      trim: true,
    },
    fileType: {
      type: String,
      default: 'application/pdf',
    },
    fileSize: {
      type: Number,
      default: 0,
      min: 0,
    },
    extractedText: {
      type: String,
    },
    version: {
      type: Number,
      default: 1,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    analysisStatus: {
      type: String,
      enum: Object.values(ResumeAnalysisStatus),
      default: ResumeAnalysisStatus.NOT_ANALYZED,
      required: true,
    },
    lastAnalyzedAt: {
      type: Date,
    },
    analysisVersion: {
      type: String,
      default: '1.0',
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
        // Never expose raw storage paths or bulk extracted text unnecessarily to client
        delete sanitized.storagePath
        delete sanitized.extractedText
        return ret
      },
    },
  }
)

export const Resume: Model<IResume> =
  mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema)
