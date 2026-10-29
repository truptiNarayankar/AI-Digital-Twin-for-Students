import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'
import { CodingPlatform } from '../types/index.js'

export interface ICodingProfile extends Document {
  studentId: Types.ObjectId
  platform: CodingPlatform
  username: string
  profileUrl?: string
  problemsSolved: number
  contestsParticipated: number
  rating?: number
  highestRating?: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  lastSyncedAt?: Date
  isManual: boolean
  createdAt: Date
  updatedAt: Date
}

const CodingProfileSchema = new Schema<ICodingProfile>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Associated Student ID is required'],
      index: true,
    },
    platform: {
      type: String,
      enum: Object.values(CodingPlatform),
      required: [true, 'Platform name is required'],
    },
    username: {
      type: String,
      required: [true, 'Platform username is required'],
      trim: true,
    },
    profileUrl: {
      type: String,
      trim: true,
    },
    problemsSolved: {
      type: Number,
      default: 0,
      min: [0, 'Problems solved cannot be negative'],
    },
    contestsParticipated: {
      type: Number,
      default: 0,
      min: [0, 'Contests participated cannot be negative'],
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be negative'],
    },
    highestRating: {
      type: Number,
      min: [0, 'Highest rating cannot be negative'],
    },
    easySolved: {
      type: Number,
      default: 0,
      min: 0,
    },
    mediumSolved: {
      type: Number,
      default: 0,
      min: 0,
    },
    hardSolved: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastSyncedAt: {
      type: Date,
    },
    isManual: {
      type: Boolean,
      default: true,
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

// Ensure one profile per platform per student
CodingProfileSchema.index({ studentId: 1, platform: 1 }, { unique: true })

export const CodingProfile: Model<ICodingProfile> =
  mongoose.models.CodingProfile ||
  mongoose.model<ICodingProfile>('CodingProfile', CodingProfileSchema)
