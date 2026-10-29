// ============================================================
// AI DIGITAL TWIN BACKEND — GLOBAL TYPES & CONTRACTS
// ============================================================

export type Environment = 'development' | 'production' | 'test'

export enum UserRole {
  STUDENT = 'STUDENT',
  PLACEMENT_OFFICER = 'PLACEMENT_OFFICER',
  ADMIN = 'ADMIN',
}

export enum SkillCategory {
  PROGRAMMING = 'PROGRAMMING',
  WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
  DATABASE = 'DATABASE',
  CLOUD = 'CLOUD',
  DEVOPS = 'DEVOPS',
  AI_ML = 'AI_ML',
  DATA_SCIENCE = 'DATA_SCIENCE',
  SOFT_SKILL = 'SOFT_SKILL',
  TOOLS = 'TOOLS',
  TECHNICAL = 'TECHNICAL',
  SOFT = 'SOFT',
  OTHER = 'OTHER',
}

export enum SkillProficiency {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export enum SkillSource {
  SELF_REPORTED = 'SELF_REPORTED',
  PROJECT = 'PROJECT',
  CERTIFICATION = 'CERTIFICATION',
  ASSESSMENT = 'ASSESSMENT',
}

export enum CodingPlatform {
  LEETCODE = 'LEETCODE',
  CODECHEF = 'CODECHEF',
  CODEFORCES = 'CODEFORCES',
  HACKERRANK = 'HACKERRANK',
  GEEKSFORGEEKS = 'GEEKSFORGEEKS',
  GITHUB = 'GITHUB',
  OTHER = 'OTHER',
}

export enum ProjectType {
  ACADEMIC = 'ACADEMIC',
  PERSONAL = 'PERSONAL',
  INTERNSHIP = 'INTERNSHIP',
  HACKATHON = 'HACKATHON',
  OPEN_SOURCE = 'OPEN_SOURCE',
  OTHER = 'OTHER',
}

export enum ProjectStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum ResumeAnalysisStatus {
  NOT_ANALYZED = 'NOT_ANALYZED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  SYSTEM = 'SYSTEM',
}

export enum InterviewType {
  TECHNICAL = 'TECHNICAL',
  BEHAVIORAL = 'BEHAVIORAL',
  HR = 'HR',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
  MIXED = 'MIXED',
}

export enum InterviewDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum InterviewStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

// Phase 9: AI Skill Gap & Learning Path Enums
export enum SkillGapLevel {
  NONE = 'NONE',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum SkillGapPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum LearningStageStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum LearningResourceType {
  DOCUMENTATION = 'DOCUMENTATION',
  COURSE = 'COURSE',
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
  PRACTICE = 'PRACTICE',
  PROJECT = 'PROJECT',
}

// Phase 10: AI Placement Readiness & Estimated Probability Enums
export enum ReadinessLevel {
  NOT_READY = 'NOT_READY',
  DEVELOPING = 'DEVELOPING',
  NEAR_READY = 'NEAR_READY',
  PLACEMENT_READY = 'PLACEMENT_READY',
}

export enum BlockerSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ActionPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum EvidenceImpact {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE',
}

// Standard API Response Interfaces
export interface ApiSuccessResponse<T = unknown> {
  success: true
  message: string
  data?: T
  timestamp: string
}

export interface ApiErrorResponse {
  success: false
  message: string
  error: {
    code: string
    details?: unknown
    stack?: string
  }
  timestamp: string
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse
