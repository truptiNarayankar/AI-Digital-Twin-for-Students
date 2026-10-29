export type ResumeAnalysisStatus =
  | 'NOT_ANALYZED'
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'

export interface ResumeMetadata {
  id: string
  fileName: string
  originalFileName?: string
  fileUrl: string
  fileType: string
  fileSize: number
  version: number
  uploadedAt: string
  lastUploadedAt?: string
  analysisStatus: ResumeAnalysisStatus
  lastAnalyzedAt?: string
  analysisVersion?: string
  createdAt?: string
  updatedAt?: string
}

export interface SectionScores {
  summary: number
  experience: number
  projects: number
  skills: number
  education: number
  certifications: number
  formatting: number
}

export interface ImprovementSuggestion {
  section: string
  problem: string
  suggestion: string
  exampleBefore?: string
  exampleAfter?: string
}

export interface ResumeAnalysis {
  id: string
  studentId: string
  resumeId: string
  overallScore: number
  sectionScores: SectionScores
  strengths: string[]
  weaknesses: string[]
  missingSections: string[]
  skillsDetected: string[]
  keywords: string[]
  projectFeedback: string
  experienceFeedback: string
  educationFeedback: string
  summaryFeedback: string
  formattingFeedback: string
  atsRecommendations: string[]
  improvementSuggestions: ImprovementSuggestion[]
  targetRole: string
  model: string
  analysisVersion: string
  analyzedAt: string
}
