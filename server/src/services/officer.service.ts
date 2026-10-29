import { PlacementAssessment } from '../models/PlacementAssessment.js'
import { Student } from '../models/Student.js'

export interface CohortQuery {
  page: number
  pageSize: number
  department?: string
  search?: string
  graduationYear?: number
}

interface AssessmentRollup {
  _id: null
  assessedStudents: number
  totalReadiness: number
  placementReadyStudents: number
}

interface LatestAssessment {
  studentId: unknown
  overallReadinessScore: number
  estimatedPlacementProbability: number
  readinessLevel: string
  targetRole: string
  generatedAt: Date
}

export class OfficerService {
  static async getCohortAnalytics(query: CohortQuery) {
    const filter: Record<string, unknown> = {}
    if (query.department) filter.department = query.department
    if (query.graduationYear) filter.graduationYear = query.graduationYear
    if (query.search) {
      const escapedSearch = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const searchRegex = new RegExp(escapedSearch, 'i')
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { studentId: searchRegex },
      ]
    }

    const [students, totalStudents, departments, assessmentRollup, latestAssessments] =
      await Promise.all([
        Student.find(filter)
          .select('studentId fullName email department degree graduationYear cgpa profileCompletion')
          .sort({ graduationYear: 1, fullName: 1 })
          .skip((query.page - 1) * query.pageSize)
          .limit(query.pageSize)
          .lean(),
        Student.countDocuments(filter),
        Student.distinct('department'),
        PlacementAssessment.aggregate<AssessmentRollup>([
          { $sort: { generatedAt: -1 } },
          {
            $group: {
              _id: '$studentId',
              score: { $first: '$overallReadinessScore' },
              readinessLevel: { $first: '$readinessLevel' },
            },
          },
          {
            $group: {
              _id: null,
              assessedStudents: { $sum: 1 },
              totalReadiness: { $sum: '$score' },
              placementReadyStudents: {
                $sum: {
                  $cond: [
                    { $or: [{ $gte: ['$score', 80] }, { $eq: ['$readinessLevel', 'PLACEMENT_READY'] }] },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ]),
        PlacementAssessment.aggregate<LatestAssessment>([
          { $sort: { generatedAt: -1 } },
          { $group: { _id: '$studentId', latest: { $first: '$$ROOT' } } },
          { $replaceRoot: { newRoot: '$latest' } },
          {
            $project: {
              studentId: 1,
              overallReadinessScore: 1,
              estimatedPlacementProbability: 1,
              readinessLevel: 1,
              targetRole: 1,
              generatedAt: 1,
            },
          },
        ]),
      ])

    const assessmentsByStudent = new Map(
      latestAssessments.map((assessment) => [String(assessment.studentId), assessment])
    )
    const summary = assessmentRollup[0]
    const totalPages = Math.ceil(totalStudents / query.pageSize)

    return {
      summary: {
        totalStudents,
        assessedStudents: summary?.assessedStudents ?? 0,
        averageReadinessScore: summary
          ? Math.round(summary.totalReadiness / summary.assessedStudents)
          : null,
        placementReadyStudents: summary?.placementReadyStudents ?? 0,
        departments: departments.filter((item): item is string => typeof item === 'string').sort(),
      },
      students: students.map((student) => {
        const assessment = assessmentsByStudent.get(String(student._id))
        return {
          id: String(student._id),
          studentId: student.studentId,
          fullName: student.fullName,
          email: student.email,
          department: student.department,
          degree: student.degree,
          graduationYear: student.graduationYear,
          cgpa: student.cgpa,
          profileCompletion: student.profileCompletion,
          readinessScore: assessment?.overallReadinessScore ?? null,
          placementProbability: assessment?.estimatedPlacementProbability ?? null,
          readinessLevel: assessment?.readinessLevel ?? null,
          targetRole: assessment?.targetRole ?? null,
          assessmentDate: assessment?.generatedAt ?? null,
        }
      }),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        totalStudents,
        totalPages,
      },
    }
  }
}
