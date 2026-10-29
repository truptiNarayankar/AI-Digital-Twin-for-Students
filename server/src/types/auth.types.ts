import { UserRole } from './index.js'

export { UserRole }

export interface SafeUser {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
  lastLoginAt?: Date
}

export interface JwtUserPayload {
  sub: string
  email: string
  role: UserRole
  name?: string
  iat?: number
  exp?: number
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: string
}

export interface AuthResponseData {
  user: SafeUser
  token: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface LoginDto {
  email: string
  password: string
}

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser
    }
  }
}
