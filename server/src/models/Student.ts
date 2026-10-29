import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'

export interface IStudent extends Document {
  userId: Types.ObjectId
  studentId: string
  fullName: string
  email: string
  phone?: string
  dateOfBirth?: Date
  gender?: string
  college: string
  department: string
  degree: string
  specialization?: string
  graduationYear: number
  currentSemester: number
  cgpa: number
  profilePhoto?: string
  location?: string
  bio?: string
  careerGoal?: string
  preferredJobRoles: string[]
  preferredLocations: string[]
  preferredDomains: string[]
  profileCompletion: number
  createdAt: Date
  updatedAt: Date
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Associated User ID is required'],
      unique: true,
      index: true,
    },
    studentId: {
      type: String,
      required: [true, 'Student ID / Roll number is required'],
      unique: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      trim: true,
    },
    college: {
      type: String,
      required: [true, 'College / Institution name is required'],
      trim: true,
      default: 'University Institute of Technology',
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      default: 'Computer Science & Engineering',
      index: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
      default: 'B.Tech',
    },
    specialization: {
      type: String,
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required'],
      min: [2020, 'Graduation year must be 2020 or later'],
      max: [2040, 'Graduation year cannot exceed 2040'],
      default: () => new Date().getFullYear() + 1,
      index: true,
    },
    currentSemester: {
      type: Number,
      required: [true, 'Current semester is required'],
      min: [1, 'Semester must be at least 1'],
      max: [12, 'Semester cannot exceed 12'],
      default: 6,
    },
    cgpa: {
      type: Number,
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10.0'],
      default: 0,
    },
    profilePhoto: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    careerGoal: {
      type: String,
      trim: true,
      maxlength: [300, 'Career goal cannot exceed 300 characters'],
    },
    preferredJobRoles: {
      type: [String],
      default: [],
    },
    preferredLocations: {
      type: [String],
      default: [],
    },
    preferredDomains: {
      type: [String],
      default: [],
    },
    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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

export const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema)
