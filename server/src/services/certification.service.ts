import { Certification, type ICertification } from '../models/Certification.js'
import { StudentService } from './student.service.js'
import { ApiError } from '../utils/apiError.js'
import { Types } from 'mongoose'

export class CertificationService {
  static async getCertifications(userId: string): Promise<ICertification[]> {
    const student = await StudentService.getOrCreateStudent(userId)
    return await Certification.find({ studentId: student._id }).sort({ issueDate: -1 })
  }

  static async createCertification(
    userId: string,
    data: Partial<ICertification>
  ): Promise<ICertification> {
    const student = await StudentService.getOrCreateStudent(userId)

    const certification = await Certification.create({
      ...data,
      studentId: student._id,
      name: data.name?.trim(),
      issuingOrganization: data.issuingOrganization?.trim() || data.issuer?.trim(),
      issuer: data.issuingOrganization?.trim() || data.issuer?.trim(),
    })

    return certification
  }

  static async updateCertification(
    userId: string,
    certId: string,
    data: Partial<ICertification>
  ): Promise<ICertification> {
    const student = await StudentService.getOrCreateStudent(userId)

    if (!Types.ObjectId.isValid(certId)) {
      throw ApiError.badRequest('Invalid certification identifier.')
    }

    const existing = await Certification.findById(certId)
    if (!existing) {
      throw ApiError.notFound('Certification not found.')
    }

    if (existing.studentId.toString() !== student._id.toString()) {
      throw ApiError.forbidden('Access forbidden: You do not own this certification.')
    }

    const updatePayload = {
      ...data,
      ...(data.issuingOrganization ? { issuer: data.issuingOrganization } : {}),
    }

    const updated = await Certification.findByIdAndUpdate(
      certId,
      { $set: updatePayload },
      { new: true, runValidators: true }
    )

    if (!updated) {
      throw ApiError.notFound('Certification not found.')
    }

    return updated
  }

  static async deleteCertification(userId: string, certId: string): Promise<void> {
    const student = await StudentService.getOrCreateStudent(userId)

    if (!Types.ObjectId.isValid(certId)) {
      throw ApiError.badRequest('Invalid certification identifier.')
    }

    const existing = await Certification.findById(certId)
    if (!existing) {
      throw ApiError.notFound('Certification not found.')
    }

    if (existing.studentId.toString() !== student._id.toString()) {
      throw ApiError.forbidden('Access forbidden: You do not own this certification.')
    }

    await Certification.findByIdAndDelete(certId)
  }
}
