import type { Request, Response } from 'express'
import { ApiResponse } from '../utils/apiResponse.js'
import { getDatabaseStatus } from '../config/database.js'
import { env } from '../config/env.js'

export class HealthController {
  /**
   * General API Server Health Check
   * GET /health
   */
  static getHealth(_req: Request, res: Response): void {
    ApiResponse.success(
      res,
      'AI Digital Twin API is running',
      {
        environment: env.NODE_ENV,
        version: '1.0.0',
        uptime: Math.floor(process.uptime()),
      },
      200
    )
  }

  /**
   * Database Connectivity Health Check
   * GET /health/db
   */
  static getDbHealth(_req: Request, res: Response): void {
    const dbStatus = getDatabaseStatus()

    if (!dbStatus.connected) {
      ApiResponse.error(
        res,
        'MongoDB is unreachable or disconnected',
        'DB_UNREACHABLE',
        503,
        {
          status: dbStatus.statusName,
          connected: false,
        }
      )
      return
    }

    ApiResponse.success(
      res,
      'MongoDB is connected and operational',
      {
        status: dbStatus.statusName,
        connected: true,
        readyState: dbStatus.readyState,
      },
      200
    )
  }
}
