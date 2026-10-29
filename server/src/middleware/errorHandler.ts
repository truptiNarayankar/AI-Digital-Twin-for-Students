import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { logger } from '../utils/logger.js'
import { env } from '../config/env.js'

interface MongoError extends Error {
  code?: number
  keyValue?: Record<string, unknown>
  errors?: Record<string, { message: string }>
}

export function errorHandler(
  err: Error | ApiError | ZodError | MongoError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Handled custom ApiError
  if (err instanceof ApiError) {
    logger.warn(`ApiError [${err.statusCode} - ${err.code}]: ${err.message} (${req.method} ${req.originalUrl})`)
    ApiResponse.error(
      res,
      err.message,
      err.code,
      err.statusCode,
      err.details,
      env.isDevelopment ? err.stack : undefined
    )
    return
  }

  // 2. Zod validation error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }))

    logger.warn(`ValidationError: ${req.method} ${req.originalUrl}`, formattedErrors)
    ApiResponse.error(
      res,
      'Validation failed',
      'VALIDATION_ERROR',
      400,
      formattedErrors
    )
    return
  }

  // 3. Mongoose Duplicate Key Error (code 11000)
  const mongoErr = err as MongoError
  if (mongoErr.code === 11000 && mongoErr.keyValue) {
    const duplicateField = Object.keys(mongoErr.keyValue)[0]
    const message = `A record with this ${duplicateField} already exists`
    logger.warn(`DuplicateKeyError [11000]: ${message}`)
    ApiResponse.error(res, message, 'DUPLICATE_KEY_ERROR', 409, mongoErr.keyValue)
    return
  }

  // 4. Mongoose ValidationError
  if (err.name === 'ValidationError' && mongoErr.errors) {
    const errorDetails = Object.values(mongoErr.errors).map((e) => e.message)
    logger.warn(`Mongoose ValidationError: ${errorDetails.join(', ')}`)
    ApiResponse.error(res, 'Database validation error', 'DB_VALIDATION_ERROR', 400, errorDetails)
    return
  }

  // 5. Mongoose CastError (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    logger.warn(`Mongoose CastError: ${err.message}`)
    ApiResponse.error(res, 'Invalid resource identifier format', 'INVALID_ID_FORMAT', 400)
    return
  }

  // 6. Generic unhandled error
  logger.error(`Unhandled Internal Server Error: ${err.message}`, err.stack)

  const responseMessage = env.isProduction
    ? 'An unexpected internal server error occurred'
    : err.message

  ApiResponse.error(
    res,
    responseMessage,
    'INTERNAL_SERVER_ERROR',
    500,
    undefined,
    env.isDevelopment ? err.stack : undefined
  )
}
