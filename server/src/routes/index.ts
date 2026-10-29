import { Router, type Request, type Response } from 'express'
import { healthRoutes } from './health.routes.js'
import { v1Routes } from './v1/index.js'
import { ApiResponse } from '../utils/apiResponse.js'

const router = Router()

// Root Welcome & Discovery
router.get('/', (_req: Request, res: Response) => {
  ApiResponse.success(res, 'AI Digital Twin for Students Backend API', {
    health: '/health',
    databaseHealth: '/health/db',
    apiV1: '/api/v1',
  })
})

// Health endpoints
router.use('/health', healthRoutes)

// API Version 1
router.use('/api/v1', v1Routes)

export const appRoutes = router
