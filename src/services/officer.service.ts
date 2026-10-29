import { api } from './api'
import type { OfficerCohortAnalytics, OfficerCohortQuery } from '@/types/officer'

export const officerService = {
  async getCohortAnalytics(query: OfficerCohortQuery): Promise<OfficerCohortAnalytics> {
    const params = new URLSearchParams({
      page: String(query.page),
      pageSize: String(query.pageSize),
    })
    if (query.department) params.set('department', query.department)
    if (query.search) params.set('search', query.search)
    if (query.graduationYear) params.set('graduationYear', String(query.graduationYear))

    const response = await api.get<OfficerCohortAnalytics>(`/officers/analytics?${params.toString()}`)
    if (!response.data) {
      throw new Error('No placement cohort analytics were returned by the server.')
    }
    return response.data
  },
}
