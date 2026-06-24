import type { AuthResponse, User } from '@/@types'
import { authService } from '@/api/services/auth.service'
import type { LoginInput, RegisterInput } from '@/validators/auth.schema'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  role: string | null
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginInput) => Promise<AuthResponse>
  register: (payload: RegisterInput) => Promise<void>
  hydrateUser: () => Promise<void>
  logout: () => void
  isSuperAdmin: () => boolean
}

const isSuperAdminRole = (role?: string | null) =>
  role?.toUpperCase() === 'SUPERADMIN'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      role: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async ({ email, password }) => {
        set({ isLoading: true })
        try {
          const response = await authService.login({ email, password })
          localStorage.setItem('pe.auth-token', response.token)
          localStorage.setItem('pe.auth-role', response.user.role)
          set({
            token: response.token,
            role: response.user.role,
            user: response.user,
            isAuthenticated: true,
          })
          return response
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (payload) => {
        set({ isLoading: true })
        try {
          await authService.register(payload)
        } finally {
          set({ isLoading: false })
        }
      },

      hydrateUser: async () => {
        const token = get().token ?? localStorage.getItem('pe.auth-token')
        const role = get().role ?? localStorage.getItem('pe.auth-role')
        const user = get().user

        if (!token || !user) {
          set({ isAuthenticated: false, user: null, token: null, role: null })
          return
        }

        set({ user, token, role, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('pe.auth-token')
        localStorage.removeItem('pe.auth-role')
        set({ token: null, role: null, user: null, isAuthenticated: false })
      },

      isSuperAdmin: () => isSuperAdminRole(get().role ?? get().user?.role),
    }),
    {
      name: 'pe.auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        role: state.role,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
