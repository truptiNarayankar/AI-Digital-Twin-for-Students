import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'

export interface ISubject {
  name: string
  code?: string
  marks?: number
  grade?: string
  credits?: number
}

export interface IAcademicRecord extends Document {
  studentId: Types.ObjectId
  semester: number
  academicYear?: string
  sgpa?: number
  subjects: ISubject[]
  cgpa: number
  percentage?: number
  backlogs: number
  totalCredits?: number
  remarks?: string
  attendance?: number
  createdAt: Date
  updatedAt: Date
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    marks: { type: Number, min: 0, max: 100 },
    grade: { type: String, trim: true },
    credits: { type: Number, min: 0, max: 20 },
  },
  { _id: false }
)

const AcademicRecordSchema = new Schema<IAcademicRecord>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Associated Student ID is required'],
      index: true,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be at least 1'],
      max: [12, 'Semester cannot exceed 12'],
    },
    academicYear: {
      type: String,
      trim: true,
    },
    sgpa: {
      type: Number,
      min: [0, 'SGPA cannot be negative'],
      max: [10, 'SGPA cannot exceed 10.0'],
    },
    subjects: [SubjectSchema],
    cgpa: {
      type: Number,
      required: [true, 'CGPA is required'],
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10.0'],
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    backlogs: {
      type: Number,
      default: 0,
      min: [0, 'Backlogs cannot be negative'],
    },
    totalCredits: {
      type: Number,
      min: 0,
      max: 200,
    },
    remarks: {
      type: String,
      trim: true,
    },
    attendance: {
      type: Number,
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

// Compound unique index ensuring only one record per student per semester
AcademicRecordSchema.index({ studentId: 1, semester: 1 }, { unique: true })

export const AcademicRecord: Model<IAcademicRecord> =
  mongoose.models.AcademicRecord ||
  mongoose.model<IAcademicRecord>('AcademicRecord', AcademicRecordSchema)
