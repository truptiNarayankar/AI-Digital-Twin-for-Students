import type { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/apiError.js'
import { UserRole } from '../types/auth.types.js'

/**
 * Role-Based Authorization Middleware
 * Enforces that the authenticated user possesses one of the specified roles.
 */
export function authorizeRoles(...allowedRoles: (UserRole | string)[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError('Authentication is required before authorization check.', 401, 'UNAUTHORIZED'))
      return
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(
        new ApiError(
          `Access forbidden: Role '${req.user.role}' is not authorized to access this resource.`,
          403,
          'FORBIDDEN'
        )
      )
      return
    }

    next()
  }
}

/**
 * Student Data Isolation Middleware
 * Enforces that a STUDENT can strictly only access their own student resources.
 * Placement Officers and Admins are permitted to view student records.
 *
 * @param paramName The route parameter containing the target student/user ID (e.g. 'studentId' or 'id')
 */
export function requireStudentSelf(paramName = 'studentId') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError('Authentication is required.', 401, 'UNAUTHORIZED'))
      return
    }

    // Admins and Placement Officers have cross-student inspection authorization
    if (req.user.role === UserRole.ADMIN || req.user.role === UserRole.PLACEMENT_OFFICER) {
      next()
      return
    }

    // For STUDENT role, enforce exact ownership
    const targetId = req.params[paramName]
    if (targetId && targetId !== req.user.id) {
      next(
        new ApiError(
          'Access forbidden: Students are only permitted to view their own resources.',
          403,
          'STUDENT_DATA_ISOLATION_VIOLATION'
        )
      )
      return
    }

    next()
  }
}
