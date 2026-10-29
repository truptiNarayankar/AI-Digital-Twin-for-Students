import type { Request, Response, NextFunction } from 'express'
import { OfficerService } from '../services/officer.service.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { ApiError } from '../utils/apiError.js'

function getQueryString(value: unknown, name: string): string | undefined {
  if (value === undefined) return undefined
  if (typeof value !== 'string') {
    throw ApiError.badRequest(`${name} must be a single value.`)
  }
  return value.trim()
}

function getPositiveInteger(value: unknown, name: string, fallback: number): number {
  const raw = getQueryString(value, name)
  if (raw === undefined || raw === '') return fallback
  const parsed = Number(raw)
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw ApiError.badRequest(`${name} must be a positive integer.`)
  }
  return parsed
}

export class OfficerController {
  static async getCohortAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = getPositiveInteger(req.query.page, 'page', 1)
      const pageSize = Math.min(getPositiveInteger(req.query.pageSize, 'pageSize', 25), 100)
      const department = getQueryString(req.query.department, 'department')
      const search = getQueryString(req.query.search, 'search')
      const graduationYear = getPositiveInteger(req.query.graduationYear, 'graduationYear', 0)

      const analytics = await OfficerService.getCohortAnalytics({
        page,
        pageSize,
        department: department || undefined,
        search: search ? search.slice(0, 100) : undefined,
        graduationYear: graduationYear || undefined,
      })
      ApiResponse.success(res, 'Placement cohort analytics retrieved successfully.', analytics)
    } catch (error) {
      next(error)
    }
  }
}
