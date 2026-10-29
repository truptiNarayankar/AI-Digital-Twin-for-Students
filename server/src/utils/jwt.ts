import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import type { JwtUserPayload } from '../types/auth.types.js'

/**
 * JWT Authentication Utility
 * Generates and verifies short-lived Access Tokens and long-lived Refresh Tokens.
 * Payloads contain strictly minimal identity information (no passwords/secrets).
 */

export function generateAccessToken(payload: Omit<JwtUserPayload, 'iat' | 'exp'>): string {
  return jwt.sign(
    {
      sub: payload.sub,
      role: payload.role,
      email: payload.email,
      name: payload.name,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      algorithm: 'HS256',
    }
  )
}

export function generateRefreshToken(payload: Pick<JwtUserPayload, 'sub' | 'role' | 'email'>): string {
  return jwt.sign(
    {
      sub: payload.sub,
      role: payload.role,
      email: payload.email,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      algorithm: 'HS256',
    }
  )
}

export function verifyAccessToken(token: string): JwtUserPayload {
  return jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }) as JwtUserPayload
}

export function verifyRefreshToken(token: string): JwtUserPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] }) as JwtUserPayload
}
