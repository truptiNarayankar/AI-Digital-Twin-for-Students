import { api } from './api'
import type {
  StudentProfile,
  AcademicRecord,
  Skill,
  CodingProfile,
  Project,
  Certification,
  ResumeMetadata,
  DigitalTwinSummary,
  UpdateProfilePayload,
  AcademicRecordPayload,
  SkillPayload,
  CodingProfilePayload,
  ProjectPayload,
  CertificationPayload,
  CareerGoalsPayload,
  ResumePayload,
} from '../types/student'
import type { StudentAnalytics } from '../types/analytics'
import type { ResumeAnalysis } from '../types/resume'
import type {
  InterviewSession,
  CreateInterviewPayload,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
} from '../types/interview'
import type { SkillGapAnalysis, SkillGapLatestResponse } from '../types/skill-gap'
import type { LearningPath, LearningStageStatus } from '../types/learning-path'
import { placementService } from './placement.service'

type EntityWithId = { _id?: string; id?: string }

function normalizeEntityId<T extends EntityWithId>(entity: T): T & { _id: string } {
  const id = entity._id || entity.id
  if (!id) {
    throw new Error('The server returned a student record without an identifier.')
  }

  return { ...entity, _id: id }
}

function normalizeStudentProfile(profile: StudentProfile): StudentProfile {
  const normalized = normalizeEntityId(profile)
  const raw = profile as StudentProfile & {
    phone?: string
    profilePhoto?: string
    preferredJobRoles?: string[]
  }

  return {
    ...normalized,
    phoneNumber: normalized.phoneNumber ?? raw.phone ?? '',
    avatarUrl: normalized.avatarUrl ?? raw.profilePhoto ?? '',
    preferredRoles: normalized.preferredRoles ?? raw.preferredJobRoles ?? [],
    preferredJobRoles: normalized.preferredJobRoles ?? raw.preferredJobRoles ?? [],
    preferredDomains: normalized.preferredDomains ?? [],
  }
}

export const studentService = {
  // Profile
  async getProfile(): Promise<StudentProfile> {
    const res = await api.get<{ student: StudentProfile }>('/student/profile')
    return normalizeStudentProfile(res.data!.student)
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<StudentProfile> {
    const res = await api.put<{ student: StudentProfile }>('/student/profile', payload)
    return normalizeStudentProfile(res.data!.student)
  },

  // Academic Records
  async getAcademicRecords(): Promise<AcademicRecord[]> {
    const res = await api.get<{ records: AcademicRecord[] }>('/student/academic')
    return (res.data?.records || []).map(normalizeEntityId)
  },

  async createAcademicRecord(payload: AcademicRecordPayload): Promise<AcademicRecord> {
    const res = await api.post<{ record: AcademicRecord }>('/student/academic', payload)
    return normalizeEntityId(res.data!.record)
  },

  async updateAcademicRecord(id: string, payload: Partial<AcademicRecordPayload>): Promise<AcademicRecord> {
    const res = await api.put<{ record: AcademicRecord }>(`/student/academic/${id}`, payload)
    return normalizeEntityId(res.data!.record)
  },

  async deleteAcademicRecord(id: string): Promise<void> {
    await api.delete(`/student/academic/${id}`)
  },

  // Skills
  async getSkills(): Promise<Skill[]> {
    const res = await api.get<{ skills: Skill[] }>('/student/skills')
    return (res.data?.skills || []).map(normalizeEntityId)
  },

  async createSkill(payload: SkillPayload): Promise<Skill> {
    const res = await api.post<{ skill: Skill }>('/student/skills', payload)
    return normalizeEntityId(res.data!.skill)
  },

  async updateSkill(id: string, payload: Partial<SkillPayload>): Promise<Skill> {
    const res = await api.put<{ skill: Skill }>(`/student/skills/${id}`, payload)
    return normalizeEntityId(res.data!.skill)
  },

  async deleteSkill(id: string): Promise<void> {
    await api.delete(`/student/skills/${id}`)
  },

  // Coding Profiles
  async getCodingProfiles(): Promise<CodingProfile[]> {
    const res = await api.get<{ profiles: CodingProfile[] }>('/student/coding-profiles')
    return (res.data?.profiles || []).map(normalizeEntityId)
  },

  async createCodingProfile(payload: CodingProfilePayload): Promise<CodingProfile> {
    const res = await api.post<{ profile: CodingProfile }>('/student/coding-profiles', payload)
    return normalizeEntityId(res.data!.profile)
  },

  async updateCodingProfile(id: string, payload: Partial<CodingProfilePayload>): Promise<CodingProfile> {
    const res = await api.put<{ profile: CodingProfile }>(`/student/coding-profiles/${id}`, payload)
    return normalizeEntityId(res.data!.profile)
  },

  async deleteCodingProfile(id: string): Promise<void> {
    await api.delete(`/student/coding-profiles/${id}`)
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const res = await api.get<{ projects: Project[] }>('/student/projects')
    return (res.data?.projects || []).map(normalizeEntityId)
  },

  async createProject(payload: ProjectPayload): Promise<Project> {
    const res = await api.post<{ project: Project }>('/student/projects', payload)
    return normalizeEntityId(res.data!.project)
  },

  async updateProject(id: string, payload: Partial<ProjectPayload>): Promise<Project> {
    const res = await api.put<{ project: Project }>(`/student/projects/${id}`, payload)
    return normalizeEntityId(res.data!.project)
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/student/projects/${id}`)
  },

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    const res = await api.get<{ certifications: Certification[] }>('/student/certifications')
    return (res.data?.certifications || []).map(normalizeEntityId)
  },

  async createCertification(payload: CertificationPayload): Promise<Certification> {
    const res = await api.post<{ certification: Certification }>('/student/certifications', payload)
    return normalizeEntityId(res.data!.certification)
  },

  async updateCertification(id: string, payload: Partial<CertificationPayload>): Promise<Certification> {
    const res = await api.put<{ certification: Certification }>(`/student/certifications/${id}`, payload)
    return normalizeEntityId(res.data!.certification)
  },

  async deleteCertification(id: string): Promise<void> {
    await api.delete(`/student/certifications/${id}`)
  },

  // Career Goals
  async getCareerGoals(): Promise<{ careerGoal?: string; preferredRoles: string[]; preferredDomains: string[] }> {
    const res = await api.get<{
      careerGoals?: {
        careerGoal?: string
        preferredJobRoles?: string[]
        preferredDomains?: string[]
      }
    }>('/student/career-goals')
    const careerGoals = res.data?.careerGoals
    if (!careerGoals) {
      throw new Error('The server returned an invalid career goals response.')
    }

    return {
      careerGoal: careerGoals.careerGoal || '',
      preferredRoles: careerGoals.preferredJobRoles || [],
      preferredDomains: careerGoals.preferredDomains || [],
    }
  },

  async updateCareerGoals(payload: CareerGoalsPayload): Promise<{ careerGoal?: string; preferredRoles: string[]; preferredDomains: string[] }> {
    const res = await api.put<{
      careerGoals?: {
        careerGoal?: string
        preferredJobRoles?: string[]
        preferredDomains?: string[]
      }
    }>('/student/career-goals', {
      careerGoal: payload.careerGoal,
      preferredJobRoles: payload.preferredRoles,
      preferredDomains: payload.preferredDomains,
    })
    const careerGoals = res.data?.careerGoals
    if (!careerGoals) {
      throw new Error('The server returned an invalid career goals response.')
    }

    return {
      careerGoal: careerGoals.careerGoal || '',
      preferredRoles: careerGoals.preferredJobRoles || [],
      preferredDomains: careerGoals.preferredDomains || [],
    }
  },

  // Resume & AI Analyzer — Phase 7
  async getResume(): Promise<{ resume: ResumeMetadata | null; hasResume: boolean }> {
    const res = await api.get<{ resume: ResumeMetadata | null; hasResume: boolean }>('/student/resume')
    return res.data!
  },

  async uploadResumeFile(file: File): Promise<{ resume: ResumeMetadata }> {
    const formData = new FormData()
    formData.append('resume', file)
    const res = await api.postForm<{ resume: ResumeMetadata }>('/student/resume', formData)
    return res.data!
  },

  async deleteResume(): Promise<{ success: boolean }> {
    const res = await api.delete<{ success: boolean }>('/student/resume')
    return res.data!
  },

  async analyzeResume(targetRole?: string): Promise<{ analysis: ResumeAnalysis; resume: ResumeMetadata }> {
    const res = await api.post<{ analysis: ResumeAnalysis; resume: ResumeMetadata }>('/student/resume/analyze', { targetRole })
    return res.data!
  },

  async getResumeAnalysis(): Promise<{ analysis: ResumeAnalysis | null; resume: ResumeMetadata | null }> {
    const res = await api.get<{ analysis: ResumeAnalysis | null; resume: ResumeMetadata | null }>('/student/resume/analysis')
    return res.data!
  },

  async reanalyzeResume(targetRole?: string): Promise<{ analysis: ResumeAnalysis; resume: ResumeMetadata }> {
    const res = await api.post<{ analysis: ResumeAnalysis; resume: ResumeMetadata }>('/student/resume/reanalyze', { targetRole })
    return res.data!
  },

  // Backward-compatible Phase 5 method
  async uploadResumeMetadata(payload: ResumePayload): Promise<ResumeMetadata> {
    const res = await api.post<ResumeMetadata>('/student/resume', payload)
    return res.data!
  },

  // Digital Twin Aggregated Summary
  async getDigitalTwin(): Promise<DigitalTwinSummary> {
    type ApiCompleteness = {
      profileCompletionPercentage: number
      checklist: Array<{ key: string; completed: boolean; weight: number }>
    }
    type ApiDigitalTwin = Omit<DigitalTwinSummary, 'student' | 'hasResume' | 'completeness'> & {
      student?: StudentProfile
      profile?: StudentProfile
      hasResume?: boolean
      completeness: DigitalTwinSummary['completeness'] | ApiCompleteness
    }

    const res = await api.get<ApiDigitalTwin>('/student/digital-twin')
    const twin = res.data!
    const student = twin.student || twin.profile
    if (!student) {
      throw new Error('The server response did not include the student profile.')
    }

    const rawCompleteness = twin.completeness
    const completeness = 'profileCompletionPercentage' in rawCompleteness
      ? {
          percentage: rawCompleteness.profileCompletionPercentage,
          breakdown: {
            personal: 0,
            academics: 0,
            skills: 0,
            projects: 0,
            codingProfiles: 0,
            certifications: 0,
            careerGoals: 0,
            ...Object.fromEntries(
              rawCompleteness.checklist.map(({ key, completed, weight }) => [
                key === 'career' ? 'careerGoals' : key,
                completed ? weight : 0,
              ])
            ),
          },
          status: rawCompleteness.profileCompletionPercentage >= 75
            ? 'EXCELLENT' as const
            : rawCompleteness.profileCompletionPercentage >= 50
              ? 'GOOD' as const
              : rawCompleteness.profileCompletionPercentage >= 25
                ? 'MODERATE' as const
                : 'INCOMPLETE' as const,
        }
      : rawCompleteness

    return {
      ...twin,
      student: normalizeStudentProfile(student),
      academics: (twin.academics || []).map(normalizeEntityId),
      skills: (twin.skills || []).map(normalizeEntityId),
      codingProfiles: (twin.codingProfiles || []).map(normalizeEntityId),
      projects: (twin.projects || []).map(normalizeEntityId),
      certifications: (twin.certifications || []).map(normalizeEntityId),
      hasResume: twin.hasResume ?? Boolean(twin.resume),
      completeness,
    }
  },

  // Phase 6 — Analytics (deterministic calculations, no AI)
  async getAnalytics(): Promise<StudentAnalytics> {
    const res = await api.get<StudentAnalytics>('/student/analytics')
    return res.data!
  },

  // Phase 8 — AI Mock Interview System
  async getInterviews(): Promise<InterviewSession[]> {
    const res = await api.get<{ interviews: InterviewSession[] }>('/student/interviews')
    return res.data?.interviews || []
  },

  async createInterview(payload: CreateInterviewPayload): Promise<InterviewSession> {
    const res = await api.post<{ interview: InterviewSession }>('/student/interviews', payload)
    return res.data!.interview
  },

  async getInterview(id: string): Promise<InterviewSession> {
    const res = await api.get<{ interview: InterviewSession }>(`/student/interviews/${id}`)
    return res.data!.interview
  },

  async submitInterviewAnswer(
    id: string,
    payload: SubmitAnswerPayload
  ): Promise<SubmitAnswerResponse> {
    const res = await api.post<SubmitAnswerResponse>(`/student/interviews/${id}/answer`, payload)
    return res.data!
  },

  async completeInterview(id: string): Promise<InterviewSession> {
    const res = await api.post<{ interview: InterviewSession }>(`/student/interviews/${id}/complete`, {})
    return res.data!.interview
  },

  async abandonInterview(id: string): Promise<InterviewSession> {
    const res = await api.post<{ interview: InterviewSession }>(`/student/interviews/${id}/abandon`, {})
    return res.data!.interview
  },

  async getInterviewResult(id: string): Promise<InterviewSession> {
    const res = await api.get<{ interview: InterviewSession }>(`/student/interviews/${id}/result`)
    return res.data!.interview
  },

  // Phase 9 — AI Skill Gap Detection & Personalized Learning Path
  async analyzeSkillGap(targetRole?: string): Promise<SkillGapAnalysis> {
    const res = await api.post<{ analysis: SkillGapAnalysis }>('/student/skill-gap/analyze', { targetRole })
    return res.data!.analysis
  },

  async getLatestSkillGap(): Promise<SkillGapLatestResponse> {
    const res = await api.get<SkillGapLatestResponse>('/student/skill-gap/latest')
    return res.data!
  },

  async getSkillGapHistory(): Promise<SkillGapAnalysis[]> {
    const res = await api.get<{ history: SkillGapAnalysis[] }>('/student/skill-gap/history')
    return res.data?.history || []
  },

  async generateLearningPath(skillGapAnalysisId?: string): Promise<LearningPath> {
    const res = await api.post<{ learningPath: LearningPath }>('/student/learning-path/generate', {
      skillGapAnalysisId,
    })
    return res.data!.learningPath
  },

  async getLearningPath(): Promise<LearningPath | null> {
    const res = await api.get<{ learningPath: LearningPath | null }>('/student/learning-path')
    return res.data?.learningPath ?? null
  },

  async updateStageProgress(
    pathId: string,
    stageNumber: number,
    payload: { status?: LearningStageStatus; progress?: number }
  ): Promise<LearningPath> {
    const res = await api.put<{ learningPath: LearningPath }>(
      `/student/learning-path/${pathId}/stage/${stageNumber}`,
      payload
    )
    return res.data!.learningPath
  },

  // Phase 10 — AI Placement Readiness & Estimated Placement Probability
  assessPlacement: placementService.assessPlacement,
  getLatestPlacementAssessment: placementService.getLatestAssessment,
  getPlacementHistory: placementService.getAssessmentHistory,
  getPlacementReadinessSummary: placementService.getReadinessSummary,
}
