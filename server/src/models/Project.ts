import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'
import { ProjectType, ProjectStatus } from '../types/index.js'

export interface IProject extends Document {
  studentId: Types.ObjectId
  title: string
  description: string
  technologies: string[]
  role?: string
  projectType: ProjectType
  githubUrl?: string
  liveUrl?: string
  startDate?: Date
  endDate?: Date
  status: ProjectStatus
  teamSize: number
  highlights: string[]
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Associated Student ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    technologies: {
      type: [String],
      required: [true, 'At least one technology is required'],
      validate: [(val: string[]) => val.length > 0, 'Must provide at least one technology'],
    },
    role: {
      type: String,
      trim: true,
      default: 'Full-Stack Developer',
    },
    projectType: {
      type: String,
      enum: Object.values(ProjectType),
      default: ProjectType.PERSONAL,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.COMPLETED,
    },
    teamSize: {
      type: Number,
      default: 1,
      min: [1, 'Team size must be at least 1'],
    },
    highlights: {
      type: [String],
      default: [],
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

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
