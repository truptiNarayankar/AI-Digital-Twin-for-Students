import { User } from '../models/User.js'
import { ApiError } from '../utils/apiError.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js'
import { UserRole, type SafeUser, type AuthResponseData } from '../types/auth.types.js'
import type { RegisterInput, LoginInput } from '../validators/auth.validator.js'

export interface AuthSessionResult extends AuthResponseData {
  refreshToken: string
}

export class AuthService {
  /**
   * Register a new user (Student or Placement Officer).
   * Explicitly prevents self-escalation to ADMIN.
   */
  static async register(input: RegisterInput): Promise<AuthSessionResult> {
    const role = input.role || UserRole.STUDENT

    // 1. Strict protection against unauthorized ADMIN registration
    if (role === UserRole.ADMIN) {
      throw new ApiError(
        'Public registration for the ADMIN role is strictly forbidden.',
        403,
        'FORBIDDEN_ROLE_REGISTRATION'
      )
    }

    const normalizedEmail = input.email.trim().toLowerCase()

    // 2. Check for duplicate accounts
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      throw new ApiError(
        'An account with this email address already exists.',
        409,
        'EMAIL_ALREADY_EXISTS'
      )
    }

    // 3. Hash password with Argon2id
    const passwordHash = await hashPassword(input.password)

    // 4. Create user in database
    const user = await User.create({
      name: input.name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
      isActive: true,
      lastLoginAt: new Date(),
    })

    // 5. Generate authentication tokens
    const accessToken = generateAccessToken({
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    })

    const refreshToken = generateRefreshToken({
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    })

    return {
      user: user.toSafeUser(),
      token: accessToken,
      refreshToken,
    }
  }

  /**
   * Authenticate user credentials and issue new tokens.
   * Uses generic error messages to prevent user enumeration.
   */
  static async login(input: LoginInput): Promise<AuthSessionResult> {
    const normalizedEmail = input.email.trim().toLowerCase()

    // 1. Find user including passwordHash (which is hidden by default)
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash')
    if (!user) {
      throw new ApiError('Invalid email or password.', 401, 'INVALID_CREDENTIALS')
    }

    // 2. Check account status
    if (!user.isActive) {
      throw new ApiError(
        'Your account has been deactivated. Please contact an administrator.',
        403,
        'ACCOUNT_DISABLED'
      )
    }

    // 3. Verify Argon2 password hash
    const isPasswordValid = await verifyPassword(user.passwordHash, input.password)
    if (!isPasswordValid) {
      throw new ApiError('Invalid email or password.', 401, 'INVALID_CREDENTIALS')
    }

    // 4. Update last login timestamp
    user.lastLoginAt = new Date()
    await user.save()

    // 5. Generate tokens
    const accessToken = generateAccessToken({
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    })

    const refreshToken = generateRefreshToken({
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    })

    return {
      user: user.toSafeUser(),
      token: accessToken,
      refreshToken,
    }
  }

  /**
   * Get currently authenticated user details.
   */
  static async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await User.findById(userId)
    if (!user) {
      throw new ApiError('User account not found.', 404, 'USER_NOT_FOUND')
    }

    if (!user.isActive) {
      throw new ApiError(
        'Your account has been deactivated.',
        403,
        'ACCOUNT_DISABLED'
      )
    }

    return user.toSafeUser()
  }

  /**
   * Refresh access token using a valid refresh token.
   */
  static async refreshSession(token: string): Promise<AuthSessionResult> {
    let payload
    try {
      payload = verifyRefreshToken(token)
    } catch {
      throw new ApiError('Refresh token is invalid or expired.', 401, 'INVALID_REFRESH_TOKEN')
    }

    const user = await User.findById(payload.sub)
    if (!user || !user.isActive) {
      throw new ApiError('User session is invalid or user is disabled.', 401, 'UNAUTHORIZED')
    }

    const newAccessToken = generateAccessToken({
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    })

    const newRefreshToken = generateRefreshToken({
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    })

    return {
      user: user.toSafeUser(),
      token: newAccessToken,
      refreshToken: newRefreshToken,
    }
  }
}
