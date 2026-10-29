import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'

export interface ICareerRecommendation extends Document {
  studentId: Types.ObjectId
  recommendedRoles: string[]
  industryFitScore: number
  matchedSkills: string[]
  growthPotential?: string
  generatedAt: Date
  createdAt: Date
  updatedAt: Date
}

const CareerRecommendationSchema = new Schema<ICareerRecommendation>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Associated Student ID is required'],
      index: true,
    },
    recommendedRoles: {
      type: [String],
      required: true,
      default: [],
    },
    industryFitScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 70,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    growthPotential: {
      type: String,
      trim: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

export const CareerRecommendation: Model<ICareerRecommendation> =
  mongoose.models.CareerRecommendation ||
  mongoose.model<ICareerRecommendation>('CareerRecommendation', CareerRecommendationSchema)
