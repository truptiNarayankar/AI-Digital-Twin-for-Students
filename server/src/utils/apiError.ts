export class ApiError extends Error {
  public statusCode: number
  public code: string
  public details?: unknown

  constructor(
    message: string,
    statusCode = 500,
    code = 'INTERNAL_ERROR',
    details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
    Error.captureStackTrace(this, this.constructor)
  }

  static badRequest(message = 'Bad request', details?: unknown): ApiError {
    return new ApiError(message, 400, 'BAD_REQUEST', details)
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(message, 401, 'UNAUTHORIZED')
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(message, 403, 'FORBIDDEN')
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(message, 404, 'NOT_FOUND')
  }

  static conflict(message = 'Resource conflict'): ApiError {
    return new ApiError(message, 409, 'CONFLICT')
  }

  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(message, 500, 'INTERNAL_SERVER_ERROR')
  }
}
