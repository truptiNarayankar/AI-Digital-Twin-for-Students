import type { Response } from 'express'
import type { ApiSuccessResponse, ApiErrorResponse } from '../types/index.js'

export class ApiResponse {
  static success<T>(
    res: Response,
    message = 'Request successful',
    data?: T,
    statusCode = 200
  ): Response<ApiSuccessResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    })
  }

  static error(
    res: Response,
    message = 'An error occurred',
    code = 'INTERNAL_ERROR',
    statusCode = 500,
    details?: unknown,
    stack?: string
  ): Response<ApiErrorResponse> {
    return res.status(statusCode).json({
      success: false,
      message,
      error: {
        code,
        ...(details ? { details } : {}),
        ...(stack ? { stack } : {}),
      },
      timestamp: new Date().toISOString(),
    })
  }
}
