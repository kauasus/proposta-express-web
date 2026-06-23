import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'
import { Navigate, Outlet } from 'react-router-dom'

export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center px-4'>
        <div className='flex items-center gap-3 rounded-2xl border border-border/70 bg-card/85 px-5 py-4 shadow-xl backdrop-blur-sm'>
          <Loader2 className='h-5 w-5 animate-spin text-primary' />
          <span className='text-sm font-medium text-muted-foreground'>Carregando sessão...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}
