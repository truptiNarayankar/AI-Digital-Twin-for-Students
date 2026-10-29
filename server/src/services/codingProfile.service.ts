import { CodingProfile, type ICodingProfile } from '../models/CodingProfile.js'
import { StudentService } from './student.service.js'
import { ApiError } from '../utils/apiError.js'
import { Types } from 'mongoose'

type FrontendCodingProfileInput = Partial<ICodingProfile> & {
  handle?: string
  breakdown?: { easy?: number; medium?: number; hard?: number }
  contestCount?: number
  profileUrl?: string
}

export class CodingProfileService {
  private static normalizeProfile(profile: ICodingProfile) {
    const breakdown = {
      easy: profile.easySolved ?? 0,
      medium: profile.mediumSolved ?? 0,
      hard: profile.hardSolved ?? 0,
    }

    return {
      ...profile.toObject(),
      handle: profile.username || '',
      username: profile.username || '',
      profileUrl: profile.profileUrl || '',
      problemsSolved: profile.problemsSolved ?? 0,
      breakdown,
      contestCount: profile.contestsParticipated ?? 0,
      isManual: profile.isManual ?? true,
    }
  }

  private static normalizePayload(data: FrontendCodingProfileInput) {
    const handle = data.handle ?? data.username ?? ''
    const breakdown = data.breakdown ?? {
      easy: data.easySolved ?? 0,
      medium: data.mediumSolved ?? 0,
      hard: data.hardSolved ?? 0,
    }

    const easySolved = breakdown.easy ?? data.easySolved ?? 0
    const mediumSolved = breakdown.medium ?? data.mediumSolved ?? 0
    const hardSolved = breakdown.hard ?? data.hardSolved ?? 0

    return {
      ...data,
      username: handle.trim(),
      profileUrl: data.profileUrl?.trim() ?? data.profileUrl,
      easySolved,
      mediumSolved,
      hardSolved,
      contestsParticipated: data.contestCount ?? data.contestsParticipated ?? 0,
      problemsSolved: data.problemsSolved ?? (easySolved + mediumSolved + hardSolved),
    }
  }

  static async getProfiles(userId: string): Promise<ICodingProfile[]> {
    const student = await StudentService.getOrCreateStudent(userId)
    const profiles = await CodingProfile.find({ studentId: student._id }).sort({ platform: 1 })
    return profiles.map((profile) => this.normalizeProfile(profile) as unknown as ICodingProfile)
  }

  static async createProfile(
    userId: string,
    data: FrontendCodingProfileInput
  ): Promise<ICodingProfile> {
    const student = await StudentService.getOrCreateStudent(userId)
    const payload = this.normalizePayload(data)

    const existing = await CodingProfile.findOne({
      studentId: student._id,
      platform: payload.platform,
    })

    if (existing) {
      throw new ApiError(
        `A coding profile for platform '${payload.platform}' is already linked.`,
        409,
        'DUPLICATE_CODING_PLATFORM'
      )
    }

    const profile = await CodingProfile.create({
      ...payload,
      studentId: student._id,
      username: payload.username?.trim(),
      lastSyncedAt: new Date(),
    })

    return this.normalizeProfile(profile) as unknown as ICodingProfile
  }

  static async updateProfile(
    userId: string,
    profileId: string,
    data: FrontendCodingProfileInput
  ): Promise<ICodingProfile> {
    const student = await StudentService.getOrCreateStudent(userId)

    if (!Types.ObjectId.isValid(profileId)) {
      throw ApiError.badRequest('Invalid coding profile identifier.')
    }

    const existing = await CodingProfile.findById(profileId)
    if (!existing) {
      throw ApiError.notFound('Coding profile not found.')
    }

    if (existing.studentId.toString() !== student._id.toString()) {
      throw ApiError.forbidden('Access forbidden: You do not own this coding profile.')
    }

    const payload = this.normalizePayload(data)
    const updated = await CodingProfile.findByIdAndUpdate(
      profileId,
      { $set: { ...payload, lastSyncedAt: new Date() } },
      { new: true, runValidators: true }
    )

    if (!updated) {
      throw ApiError.notFound('Coding profile not found.')
    }

    return this.normalizeProfile(updated) as unknown as ICodingProfile
  }

  static async deleteProfile(userId: string, profileId: string): Promise<void> {
    const student = await StudentService.getOrCreateStudent(userId)

    if (!Types.ObjectId.isValid(profileId)) {
      throw ApiError.badRequest('Invalid coding profile identifier.')
    }

    const existing = await CodingProfile.findById(profileId)
    if (!existing) {
      throw ApiError.notFound('Coding profile not found.')
    }

    if (existing.studentId.toString() !== student._id.toString()) {
      throw ApiError.forbidden('Access forbidden: You do not own this coding profile.')
    }

    await CodingProfile.findByIdAndDelete(profileId)
  }
}
