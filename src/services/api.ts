/**
 * Reusable Frontend API Client Foundation (Phase 4 Authentication Integrated)
 * Standard HTTP client supporting GET, POST, PUT, PATCH, DELETE
 * with standard JSON response envelopes, automatic Bearer tokens,
 * credentials: 'include' for cookies, and unified error handling.
 */

export interface ApiResponseEnvelope<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: {
    code: string
    details?: unknown
  }
  timestamp: string
}

export class ApiServiceError extends Error {
  public code: string
  public statusCode: number
  public details?: unknown

  constructor(message: string, statusCode: number, code = 'API_ERROR', details?: unknown) {
    super(message)
    this.name = 'ApiServiceError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

// In-memory token storage (with localStorage fallback)
let currentAuthToken: string | null = localStorage.getItem('auth_token')

export const tokenStorage = {
  getToken(): string | null {
    return currentAuthToken || localStorage.getItem('auth_token')
  },
  setToken(token: string | null, persist = true) {
    currentAuthToken = token
    if (token) {
      if (persist) {
        localStorage.setItem('auth_token', token)
      } else {
        sessionStorage.setItem('auth_token', token)
      }
    } else {
      localStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_token')
    }
  },
  clearToken() {
    currentAuthToken = null
    localStorage.removeItem('auth_token')
    sessionStorage.removeItem('auth_token')
  },
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      'http://localhost:5000/api/v1'
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponseEnvelope<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`

    const token = tokenStorage.getToken()
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    }

    const config: RequestInit = {
      credentials: 'include', // Include httpOnly cookies across origins
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)
      let data: ApiResponseEnvelope<T>

      try {
        data = await response.json()
      } catch {
        throw new ApiServiceError(
          response.statusText || 'Unexpected server response',
          response.status,
          'INVALID_RESPONSE'
        )
      }

      if (!response.ok || !data.success) {
        throw new ApiServiceError(
          data.message || 'API request failed',
          response.status,
          data.error?.code || 'REQUEST_FAILED',
          data.error?.details
        )
      }

      return data
    } catch (error: unknown) {
      if (error instanceof ApiServiceError) {
        throw error
      }
      throw new ApiServiceError(
        error instanceof Error ? error.message : 'Network error or server unavailable',
        0,
        'NETWORK_ERROR'
      )
    }
  }

  get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponseEnvelope<T>> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  post<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<ApiResponseEnvelope<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    })
  }

  postForm<T>(endpoint: string, formData: FormData, headers?: Record<string, string>): Promise<ApiResponseEnvelope<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    })
  }

  put<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<ApiResponseEnvelope<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    })
  }

  patch<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<ApiResponseEnvelope<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    })
  }

  delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponseEnvelope<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', headers })
  }
}

export const api = new ApiClient()
