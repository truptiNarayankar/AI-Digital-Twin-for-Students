import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/apiError.js'
import { verifyAccessToken } from '../utils/jwt.js'
import { User } from '../models/User.js'

/**
 * Authentication Middleware
 * Validates JWT access tokens passed via Authorization Bearer header or httpOnly cookies.
 * Attaches the authenticated safe user to `req.user`.
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined

    // 1. Check Authorization Bearer Header
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim()
    } else if (req.cookies && req.cookies.accessToken) {
      // 2. Fallback to httpOnly Cookie
      token = req.cookies.accessToken
    }

    if (!token) {
      throw new ApiError('Authentication token is missing or required.', 401, 'UNAUTHORIZED')
    }

    // 3. Verify JWT
    let payload
    try {
      payload = verifyAccessToken(token)
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new ApiError('Authentication token has expired.', 401, 'TOKEN_EXPIRED')
      }
      if (err instanceof jwt.JsonWebTokenError) {
        throw new ApiError('Invalid authentication token.', 401, 'INVALID_TOKEN')
      }
      throw new ApiError('Token verification failed.', 401, 'UNAUTHORIZED')
    }

    // 4. Verify user exists in database and is active
    const user = await User.findById(payload.sub)
    if (!user) {
      throw new ApiError('The user belonging to this token no longer exists.', 401, 'USER_NOT_FOUND')
    }

    if (!user.isActive) {
      throw new ApiError('Your account has been deactivated.', 403, 'ACCOUNT_DISABLED')
    }

    // 5. Attach safe user to request
    req.user = user.toSafeUser()
    next()
  } catch (error) {
    next(error)
  }
}
