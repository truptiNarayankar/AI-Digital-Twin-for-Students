import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'

export interface ICertification extends Document {
  studentId: Types.ObjectId
  name: string
  issuingOrganization: string
  issuer?: string
  credentialId?: string
  credentialUrl?: string
  issueDate?: Date
  expiryDate?: Date
  skills: string[]
  createdAt: Date
  updatedAt: Date
}

const CertificationSchema = new Schema<ICertification>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Associated Student ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Certification name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    issuingOrganization: {
      type: String,
      required: [true, 'Issuing organization is required'],
      trim: true,
      maxlength: [150, 'Issuing organization cannot exceed 150 characters'],
    },
    issuer: {
      type: String,
      trim: true,
    },
    credentialId: {
      type: String,
      trim: true,
    },
    credentialUrl: {
      type: String,
      trim: true,
    },
    issueDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    skills: {
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

export const Certification: Model<ICertification> =
  mongoose.models.Certification ||
  mongoose.model<ICertification>('Certification', CertificationSchema)
