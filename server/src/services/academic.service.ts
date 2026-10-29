import { AcademicRecord, type IAcademicRecord } from '../models/AcademicRecord.js'
import { StudentService } from './student.service.js'
import { ApiError } from '../utils/apiError.js'
import { Types } from 'mongoose'

export class AcademicService {
  /**
   * Get all academic records for the authenticated student.
   */
  static async getRecords(userId: string): Promise<IAcademicRecord[]> {
    const student = await StudentService.getOrCreateStudent(userId)
    return await AcademicRecord.find({ studentId: student._id }).sort({ semester: 1 })
  }

  /**
   * Create a new semester academic record.
   */
  static async createRecord(
    userId: string,
    data: Partial<IAcademicRecord>
  ): Promise<IAcademicRecord> {
    const student = await StudentService.getOrCreateStudent(userId)

    // Check duplicate semester
    const existing = await AcademicRecord.findOne({
      studentId: student._id,
      semester: data.semester,
    })
    if (existing) {
      throw new ApiError(
        `Academic record for Semester ${data.semester} already exists.`,
        409,
        'DUPLICATE_SEMESTER_RECORD'
      )
    }

    const record = await AcademicRecord.create({
      ...data,
      studentId: student._id,
    })

    return record
  }

  /**
   * Update an existing academic record with strict ownership verification.
   */
  static async updateRecord(
    userId: string,
    recordId: string,
    data: Partial<IAcademicRecord>
  ): Promise<IAcademicRecord> {
    const student = await StudentService.getOrCreateStudent(userId)

    if (!Types.ObjectId.isValid(recordId)) {
      throw ApiError.badRequest('Invalid academic record identifier.')
    }

    // Strict ownership verification: verify the record belongs to this student
    const existing = await AcademicRecord.findById(recordId)
    if (!existing) {
      throw ApiError.notFound('Academic record not found.')
    }

    if (existing.studentId.toString() !== student._id.toString()) {
      throw ApiError.forbidden('Access forbidden: You do not own this academic record.')
    }

    const updated = await AcademicRecord.findByIdAndUpdate(
      recordId,
      { $set: data },
      { new: true, runValidators: true }
    )

    if (!updated) {
      throw ApiError.notFound('Academic record not found.')
    }

    return updated
  }

  /**
   * Delete an academic record with strict ownership verification.
   */
  static async deleteRecord(userId: string, recordId: string): Promise<void> {
    const student = await StudentService.getOrCreateStudent(userId)

    if (!Types.ObjectId.isValid(recordId)) {
      throw ApiError.badRequest('Invalid academic record identifier.')
    }

    const existing = await AcademicRecord.findById(recordId)
    if (!existing) {
      throw ApiError.notFound('Academic record not found.')
    }

    if (existing.studentId.toString() !== student._id.toString()) {
      throw ApiError.forbidden('Access forbidden: You do not own this academic record.')
    }

    await AcademicRecord.findByIdAndDelete(recordId)
  }
}
