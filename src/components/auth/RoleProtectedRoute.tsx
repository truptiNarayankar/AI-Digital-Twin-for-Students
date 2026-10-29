import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import type { UserRole } from '../../types/auth'

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[]
}

export function RoleProtectedRoute({ allowedRoles }: RoleProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    // If user's role is not authorized for this specific route, redirect to their home dashboard
    if (user.role === 'STUDENT') {
      return <Navigate to="/student/dashboard" replace />
    }
    if (user.role === 'PLACEMENT_OFFICER') {
      return <Navigate to="/officer/dashboard" replace />
    }
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
