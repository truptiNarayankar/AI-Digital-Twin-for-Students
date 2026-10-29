import { api } from './api'
import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  AuthResponseData,
} from '../types/auth'

export const authService = {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponseData> {
    const response = await api.post<AuthResponseData>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    })
    if (!response.data) {
      throw new Error('No authentication data received from server.')
    }
    return response.data
  },

  /**
   * Register a new student or placement officer account
   */
  async register(data: RegisterCredentials): Promise<AuthResponseData> {
    const response = await api.post<AuthResponseData>('/auth/register', data)
    if (!response.data) {
      throw new Error('No user data returned from registration.')
    }
    return response.data
  },

  /**
   * Fetch details of currently authenticated user
   */
  async getMe(): Promise<AuthUser> {
    const response = await api.get<{ user: AuthUser }>('/auth/me')
    if (!response.data?.user) {
      throw new Error('Failed to retrieve user profile.')
    }
    return response.data.user
  },

  /**
   * Terminate current session and clear auth cookies
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch {
      // Safely ignore if session was already expired
    }
  },

  /**
   * Refresh session token
   */
  async refreshToken(): Promise<AuthResponseData> {
    const response = await api.post<AuthResponseData>('/auth/refresh')
    if (!response.data) {
      throw new Error('Failed to refresh authentication session.')
    }
    return response.data
  },
}
