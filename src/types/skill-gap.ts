export type SkillGapLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
export type SkillGapPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface SkillStrength {
  skill: string
  level: string
  reason: string
}

export interface SkillGapItem {
  skill: string
  category: string
  currentLevel: string
  requiredLevel: string
  gapLevel: SkillGapLevel
  priority: SkillGapPriority
  reason: string
  evidence: string
  recommendedAction: string
}

export interface MissingSkill {
  skill: string
  priority: SkillGapPriority
  reason: string
}

export interface SkillGapAnalysis {
  _id: string
  studentId: string
  targetRole: string
  roleSummary: string
  overallMatchScore: number
  strengths: SkillStrength[]
  gaps: SkillGapItem[]
  missingSkills: MissingSkill[]
  aiModel?: string
  analysisVersion?: number
  generatedAt: string
  isStale?: boolean
  staleReason?: string | null
}

export interface SkillGapLatestResponse {
  analysis: SkillGapAnalysis | null
  isStale: boolean
  staleReason: string | null
}
