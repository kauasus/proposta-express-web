import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)
  const logout = useAuthStore((state) => state.logout)
  const hydrateUser = useAuthStore((state) => state.hydrateUser)

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    hydrateUser,
  }
}
