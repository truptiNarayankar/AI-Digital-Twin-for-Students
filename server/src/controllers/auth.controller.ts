import type { Request, Response, NextFunction } from 'express'
import type { CookieOptions } from 'express'
import { AuthService } from '../services/auth.service.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { env } from '../config/env.js'
import { ApiError } from '../utils/apiError.js'

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? 'none' : 'lax',
  path: '/',
}

function setAuthCookies(res: Response, accessToken: string, refreshToken?: string): void {
  // 1 hour access token cookie
  res.cookie('accessToken', accessToken, {
    ...baseCookieOptions,
    maxAge: 60 * 60 * 1000,
  })

  // 7 days refresh token cookie
  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      ...baseCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
  }
}

function clearAuthCookies(res: Response): void {
  res.clearCookie('accessToken', baseCookieOptions)
  res.clearCookie('refreshToken', baseCookieOptions)
}

export class AuthController {
  /**
   * POST /api/v1/auth/register
   * Registers a new student or placement officer account.
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body)
      setAuthCookies(res, result.token, result.refreshToken)

      ApiResponse.success(
        res,
        'Account registration successful.',
        {
          user: result.user,
          token: result.token,
        },
        201
      )
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/v1/auth/login
   * Authenticates user with email and password.
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body)
      setAuthCookies(res, result.token, result.refreshToken)

      ApiResponse.success(
        res,
        'Authentication successful.',
        {
          user: result.user,
          token: result.token,
        },
        200
      )
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/auth/me
   * Returns details of the currently authenticated user.
   */
  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) {
        throw ApiError.unauthorized('User identity not found in request.')
      }

      const user = await AuthService.getCurrentUser(req.user.id)
      ApiResponse.success(res, 'Authenticated user profile retrieved successfully.', { user }, 200)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/v1/auth/logout
   * Clears cookies and ends the session.
   */
  static async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      clearAuthCookies(res)
      ApiResponse.success(res, 'Logged out successfully.', null, 200)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/v1/auth/refresh
   * Exchanges a valid refresh token for a new access token.
   */
  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken
      if (!token) {
        throw new ApiError('Refresh token missing.', 401, 'REFRESH_TOKEN_REQUIRED')
      }

      const result = await AuthService.refreshSession(token)
      setAuthCookies(res, result.token, result.refreshToken)

      ApiResponse.success(
        res,
        'Session token refreshed successfully.',
        {
          user: result.user,
          token: result.token,
        },
        200
      )
    } catch (error) {
      next(error)
    }
  }
}
