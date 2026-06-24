import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

export const AdminRoute = () => {
  const { isAuthenticated, isSuperAdmin } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isSuperAdmin()) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
