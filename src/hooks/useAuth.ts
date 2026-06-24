import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const token = useAuthStore((state) => state.token)
  const role = useAuthStore((state) => state.role)
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const logout = useAuthStore((state) => state.logout)
  const hydrateUser = useAuthStore((state) => state.hydrateUser)
  const isSuperAdmin = useAuthStore((state) => state.isSuperAdmin)

  return {
    token,
    role,
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    hydrateUser,
    isSuperAdmin,
  }
}
