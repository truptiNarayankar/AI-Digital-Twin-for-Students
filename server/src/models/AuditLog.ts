import mongoose, { Schema, type Document, type Model, Types } from 'mongoose'

export interface IAuditLog extends Document {
  userId?: Types.ObjectId
  action: string
  resource: string
  resourceId?: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // Index for looking up audit trail for a specific user
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Action name is required'],
      trim: true,
      maxlength: [100, 'Action cannot exceed 100 characters'],
    },
    resource: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
      maxlength: [100, 'Resource cannot exceed 100 characters'],
    },
    resourceId: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      // Index for chronological compliance auditing
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      // Strict reminder: NEVER store passwords, secrets, or raw bearer tokens here
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
)

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema)
