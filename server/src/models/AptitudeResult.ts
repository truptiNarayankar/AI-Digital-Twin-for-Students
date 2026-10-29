import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'

export interface IAptitudeResult extends Document {
  studentId: Types.ObjectId
  quantitative: number
  logical: number
  verbal: number
  overall: number
  testDate: Date
  createdAt: Date
  updatedAt: Date
}

const AptitudeResultSchema = new Schema<IAptitudeResult>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Associated Student ID is required'],
      index: true,
    },
    quantitative: {
      type: Number,
      required: [true, 'Quantitative score is required'],
      min: 0,
      max: 100,
    },
    logical: {
      type: Number,
      required: [true, 'Logical reasoning score is required'],
      min: 0,
      max: 100,
    },
    verbal: {
      type: Number,
      required: [true, 'Verbal ability score is required'],
      min: 0,
      max: 100,
    },
    overall: {
      type: Number,
      required: [true, 'Overall aptitude score is required'],
      min: 0,
      max: 100,
    },
    testDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

export const AptitudeResult: Model<IAptitudeResult> =
  mongoose.models.AptitudeResult ||
  mongoose.model<IAptitudeResult>('AptitudeResult', AptitudeResultSchema)
