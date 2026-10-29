/**
 * Phase 5 - Student Profile & Digital Twin Data Foundation Types
 * Strictly typed interfaces matching backend schemas and responses.
 */

import type { InterviewSession } from './interview'
import type { SkillGapAnalysis } from './skill-gap'
import type { LearningPath } from './learning-path'
import type { PlacementAssessment } from './placement'

export type SkillCategory =
  | 'LANGUAGES'
  | 'FRAMEWORKS'
  | 'DATABASES'
  | 'TOOLS'
  | 'CONCEPTS'
  | 'SOFT_SKILLS'
  | 'OTHER'

export type SkillProficiency = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

export type SkillSource = 'MANUAL' | 'ASSESSMENT' | 'RESUME' | 'GITHUB'

export type CodingPlatform =
  | 'LEETCODE'
  | 'CODECHEF'
  | 'CODEFORCES'
  | 'HACKERRANK'
  | 'GEEKSFORGEEKS'
  | 'GITHUB'
  | 'OTHER'

export type ProjectType = 'ACADEMIC' | 'PERSONAL' | 'INTERNSHIP' | 'HACKATHON' | 'OPEN_SOURCE'

export type ProjectStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED'

export interface AcademicSubject {
  name: string
  code?: string
  marks?: number
  grade?: string
  credits?: number
}

export interface StudentProfile {
  _id: string
  userId: string
  studentId: string
  fullName: string
  email: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  college?: string
  degree?: string
  department?: string
  batch?: string
  currentSemester?: number
  graduationYear?: number
  cgpa?: number
  bio?: string
  avatarUrl?: string
  careerGoal?: string
  preferredRoles: string[]
  preferredJobRoles?: string[]
  preferredDomains: string[]
  profileCompletion: number
  createdAt: string
  updatedAt: string
}

export interface AcademicRecord {
  _id: string
  studentId: string
  semester: number
  academicYear?: string
  sgpa?: number
  cgpa?: number
  backlogs: number
  subjects: AcademicSubject[]
  totalCredits?: number
  remarks?: string
  createdAt: string
  updatedAt: string
}

export interface Skill {
  _id: string
  studentId: string
  name: string
  category: SkillCategory
  proficiency: SkillProficiency
  verified: boolean
  source: SkillSource
  endorsementsCount: number
  createdAt: string
  updatedAt: string
}

export interface CodingBreakdown {
  easy: number
  medium: number
  hard: number
}

export interface CodingProfile {
  _id: string
  studentId: string
  platform: CodingPlatform
  handle: string
  profileUrl: string
  rating?: number
  ranking?: number
  problemsSolved: number
  breakdown: CodingBreakdown
  badges: string[]
  contestCount: number
  lastSyncedAt?: string
  isManual: boolean
  createdAt: string
  updatedAt: string
}

export interface Project {
  _id: string
  studentId: string
  title: string
  description: string
  technologies: string[]
  projectType: ProjectType
  githubUrl?: string
  liveUrl?: string
  status: ProjectStatus
  startDate?: string
  endDate?: string
  teamSize: number
  highlights: string[]
  createdAt: string
  updatedAt: string
}

export interface Certification {
  _id: string
  studentId: string
  name: string
  issuingOrganization: string
  issueDate?: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
  skills: string[]
  verified: boolean
  createdAt: string
  updatedAt: string
}

export interface ResumeMetadata {
  _id?: string
  id?: string
  studentId?: string
  fileName?: string
  originalFileName: string
  fileSize: number
  fileType?: string
  mimeType?: string
  storageUrl?: string
  fileUrl?: string
  version: number
  isActive?: boolean
  skillsExtracted?: string[]
  analysisStatus: 'NOT_ANALYZED' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'PROCESSED' | 'FAILED'
  lastAnalyzedAt?: string
  lastUploadedAt?: string
  uploadedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface CompletenessBreakdown {
  personal: number
  academics: number
  skills: number
  projects: number
  codingProfiles: number
  certifications: number
  careerGoals: number
}

export interface DigitalTwinSummary {
  student: StudentProfile
  academics: AcademicRecord[]
  skills: Skill[]
  codingProfiles: CodingProfile[]
  projects: Project[]
  certifications: Certification[]
  resume: ResumeMetadata | null
  hasResume: boolean
  interviews?: InterviewSession[]
  skillGap?: SkillGapAnalysis | null
  learningPath?: LearningPath | null
  placement?: PlacementAssessment | null
  completeness: {
    percentage: number
    breakdown: CompletenessBreakdown
    status: 'INCOMPLETE' | 'MODERATE' | 'GOOD' | 'EXCELLENT'
  }
}

// Request Payload Types
export interface UpdateProfilePayload {
  fullName?: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  college?: string
  degree?: string
  department?: string
  batch?: string
  currentSemester?: number
  graduationYear?: number
  cgpa?: number
  bio?: string
  avatarUrl?: string
}

export interface AcademicRecordPayload {
  semester: number
  academicYear?: string
  sgpa?: number
  cgpa?: number
  backlogs?: number
  subjects?: AcademicSubject[]
  totalCredits?: number
  remarks?: string
}

export interface SkillPayload {
  name: string
  category: SkillCategory
  proficiency: SkillProficiency
  source?: SkillSource
}

export interface CodingProfilePayload {
  platform: CodingPlatform
  handle: string
  profileUrl: string
  rating?: number
  ranking?: number
  problemsSolved?: number
  breakdown?: CodingBreakdown
  badges?: string[]
  contestCount?: number
  isManual?: boolean
}

export interface ProjectPayload {
  title: string
  description: string
  technologies: string[]
  projectType: ProjectType
  githubUrl?: string
  liveUrl?: string
  status: ProjectStatus
  startDate?: string
  endDate?: string
  teamSize?: number
  highlights?: string[]
}

export interface CertificationPayload {
  name: string
  issuingOrganization: string
  issueDate?: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
  skills?: string[]
}

export interface CareerGoalsPayload {
  careerGoal: string
  preferredRoles: string[]
  preferredDomains: string[]
}

export interface ResumePayload {
  originalFileName: string
  fileSize: number
  mimeType: string
  storageUrl: string
}
