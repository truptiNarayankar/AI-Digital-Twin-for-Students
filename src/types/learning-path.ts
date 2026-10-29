export type LearningStageStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED'

export type LearningResourceType =
  | 'DOCUMENTATION'
  | 'COURSE'
  | 'VIDEO'
  | 'ARTICLE'
  | 'PRACTICE'
  | 'PROJECT'

export interface LearningResource {
  title: string
  type: LearningResourceType
  url?: string
}

export interface LearningStage {
  stageNumber: number
  title: string
  objective: string
  skills: string[]
  estimatedDuration: string
  prerequisites: string[]
  recommendedResources: LearningResource[]
  practiceTasks: string[]
  projectTask: string
  status: LearningStageStatus
  progress: number
  completedAt?: string
}

export interface LearningPath {
  _id: string
  studentId: string
  targetRole: string
  title: string
  description: string
  totalEstimatedWeeks: number
  stages: LearningStage[]
  progress: number
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED'
  aiModel?: string
  createdAt?: string
  updatedAt: string
}
