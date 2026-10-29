import { api } from './api'
import type {
  PlacementAssessment,
  LatestAssessmentResponse,
  PlacementReadinessSummary,
  AssessPlacementRequest,
} from '../types/placement'

export const placementService = {
  /**
   * Generates or refreshes an AI Placement Readiness assessment.
   */
  async assessPlacement(payload: AssessPlacementRequest = {}): Promise<PlacementAssessment> {
    const res = await api.post<{ assessment: PlacementAssessment }>('/student/placement/assess', payload)
    return res.data!.assessment
  },

  /**
   * Retrieves the latest assessment along with staleness state.
   */
  async getLatestAssessment(): Promise<LatestAssessmentResponse> {
    const res = await api.get<LatestAssessmentResponse>('/student/placement/latest')
    return res.data!
  },

  /**
   * Retrieves chronological history of assessments for the current student.
   */
  async getAssessmentHistory(): Promise<PlacementAssessment[]> {
    const res = await api.get<{ history: PlacementAssessment[] }>('/student/placement/history')
    return res.data?.history || []
  },

  /**
   * Retrieves a lightweight readiness summary for cards/dashboards.
   */
  async getReadinessSummary(): Promise<PlacementReadinessSummary> {
    const res = await api.get<PlacementReadinessSummary>('/student/placement/readiness')
    return res.data!
  },
}
