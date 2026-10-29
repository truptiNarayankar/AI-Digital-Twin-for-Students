import type { Request, Response, NextFunction } from 'express'
import { ApiResponse } from '../utils/apiResponse.js'

export function notFoundHandler(req: Request, res: Response, _next: NextFunction): void {
  ApiResponse.error(
    res,
    `API endpoint not found: ${req.method} ${req.originalUrl}`,
    'NOT_FOUND',
    404
  )
}
