import rateLimit from 'express-rate-limit'
import { env } from '../config/env.js'

/**
 * Rate limiter middleware for authentication routes (login, register).
 * Prevents automated brute-force attacks and credential stuffing.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.isTest ? 1000 : 100, // relaxed in test mode to allow test suites to run
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
    },
    timestamp: new Date().toISOString(),
  },
})
