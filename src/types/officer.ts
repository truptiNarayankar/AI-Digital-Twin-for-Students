export interface OfficerStudent {
  id: string
  studentId: string
  fullName: string
  email: string
  department: string
  degree: string
  graduationYear: number
  cgpa: number
  profileCompletion: number
  readinessScore: number | null
  placementProbability: number | null
  readinessLevel: string | null
  targetRole: string | null
  assessmentDate: string | null
}

export interface OfficerCohortAnalytics {
  summary: {
    totalStudents: number
    assessedStudents: number
    averageReadinessScore: number | null
    placementReadyStudents: number
    departments: string[]
  }
  students: OfficerStudent[]
  pagination: {
    page: number
    pageSize: number
    totalStudents: number
    totalPages: number
  }
}

export interface OfficerCohortQuery {
  page: number
  pageSize: number
  department?: string
  search?: string
  graduationYear?: number
}
