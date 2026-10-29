import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { AuthLoadingScreen } from './AuthLoadingScreen'

export function PublicOnlyRoute() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <AuthLoadingScreen message="Checking session..." />
  }

  if (isAuthenticated && user) {
    if (user.role === 'STUDENT') {
      return <Navigate to="/student/dashboard" replace />
    }
    if (user.role === 'PLACEMENT_OFFICER') {
      return <Navigate to="/officer/dashboard" replace />
    }
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/student/dashboard" replace />
  }

  return <Outlet />
}
