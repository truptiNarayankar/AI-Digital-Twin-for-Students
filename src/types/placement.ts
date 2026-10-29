export type ReadinessLevel = 'NOT_READY' | 'DEVELOPING' | 'NEAR_READY' | 'PLACEMENT_READY'
export type BlockerSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type ActionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type EvidenceImpact = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'

export interface PlacementDimensionScores {
  academics: number
  technicalSkills: number
  codingAbility: number
  projects: number
  resume: number
  interviewPerformance: number
  certifications: number
  careerAlignment: number
  profileCompleteness: number
}

export interface PlacementStrength {
  title: string
  description: string
  evidence: string
}

export interface PlacementWeakness {
  title: string
  description: string
  evidence: string
}

export interface PlacementBlocker {
  title: string
  severity: BlockerSeverity
  description: string
  action: string
}

export interface PlacementAction {
  title: string
  priority: ActionPriority
  description: string
  reason: string
}

export interface PlacementEvidenceItem {
  dimension: string
  observation: string
  impact: EvidenceImpact
}

export interface PlacementAssessment {
  _id: string
  id?: string
  studentId: string
  targetRole: string
  overallReadinessScore: number
  readinessScore?: number
  estimatedPlacementProbability: number
  placementProbability?: number
  readinessLevel: ReadinessLevel
  dimensionScores: PlacementDimensionScores
  strengths: PlacementStrength[]
  weaknesses: PlacementWeakness[]
  placementBlockers: PlacementBlocker[]
  recommendedActions: PlacementAction[]
  evidence: PlacementEvidenceItem[]
  assessmentSummary: string
  summary?: string
  aiModel?: string
  assessmentVersion: number
  generatedAt: string
  profileUpdatedAtSnapshot?: string
  createdAt?: string
  updatedAt?: string
}

export interface LatestAssessmentResponse {
  assessment: PlacementAssessment | null
  isStale: boolean
  staleReason: string | null
}

export interface PlacementReadinessSummary {
  hasAssessment: boolean
  overallReadinessScore: number | null
  estimatedPlacementProbability: number | null
  readinessLevel: ReadinessLevel | null
  targetRole: string | null
  generatedAt: string | null
}

export interface AssessPlacementRequest {
  targetRole?: string
  forceRefresh?: boolean
}
