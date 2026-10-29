import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  AuthContextType,
} from '../types/auth'
import { authService } from '../services/auth.service'
import { tokenStorage } from '../services/api'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(tokenStorage.getToken())
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 1. Initial Session Verification on App Startup
  const checkSession = useCallback(async () => {
    try {
      // Check if we have an active session via cookie or token
      const profile = await authService.getMe()
      setUser(profile)
    } catch {
      // Session invalid or not logged in
      setUser(null)
      tokenStorage.clearToken()
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  // 2. Login
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthUser> => {
    setIsLoading(true)
    try {
      const data = await authService.login(credentials)
      tokenStorage.setToken(data.token, credentials.rememberMe ?? true)
      setUser(data.user)
      setToken(data.token)
      return data.user
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 3. Register
  const register = useCallback(async (credentials: RegisterCredentials): Promise<AuthUser> => {
    setIsLoading(true)
    try {
      const data = await authService.register(credentials)
      tokenStorage.setToken(data.token, true)
      setUser(data.user)
      setToken(data.token)
      return data.user
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 4. Logout
  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await authService.logout()
    } finally {
      tokenStorage.clearToken()
      setUser(null)
      setToken(null)
      setIsLoading(false)
    }
  }, [])

  // 5. Refresh User Profile
  const refreshUser = useCallback(async () => {
    try {
      const profile = await authService.getMe()
      setUser(profile)
    } catch {
      setUser(null)
      tokenStorage.clearToken()
      setToken(null)
    }
  }, [])

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, token, isLoading, login, register, logout, refreshUser]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
