import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
import { validateRequest } from '../middleware/validate.js'
import { registerSchema, loginSchema } from '../validators/auth.validator.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { authRateLimiter } from '../middleware/rateLimiter.js'

const router = Router()

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new student or placement officer
 * @access  Public
 */
router.post('/register', authRateLimiter, validateRequest(registerSchema), AuthController.register)

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user & get tokens
 * @access  Public
 */
router.post('/login', authRateLimiter, validateRequest(loginSchema), AuthController.login)

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user info
 * @access  Protected (Requires Bearer token or cookie)
 */
router.get('/me', authenticate, AuthController.getMe)

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user & clear session cookies
 * @access  Public / Protected
 */
router.post('/logout', AuthController.logout)

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public (Requires valid refresh token)
 */
router.post('/refresh', AuthController.refresh)

export const authRoutes = router
