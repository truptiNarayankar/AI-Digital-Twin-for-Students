export type UserRole = 'STUDENT' | 'PLACEMENT_OFFICER' | 'ADMIN'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  lastLoginAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface AuthResponseData {
  user: AuthUser
  token: string
}

export interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<AuthUser>
  register: (credentials: RegisterCredentials) => Promise<AuthUser>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}
