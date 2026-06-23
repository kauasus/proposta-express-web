import type { User } from '@/@types'
import { authService } from '@/api/services/auth.service'
import type { LoginInput, RegisterInput } from '@/validators/auth.schema'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginInput) => Promise<void>
  register: (payload: RegisterInput) => Promise<void>
  hydrateUser: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async ({ email, password }) => {
        set({ isLoading: true })
        try {
          const response = await authService.login({ email, password })
          localStorage.setItem('pe.auth-token', response.token)
          set({
            token: response.token,
            user: response.user,
            isAuthenticated: true,
          })
        } finally {
          set({ isLoading: false })
        }
      },

      register: async ({ name, email, password }) => {
        set({ isLoading: true })
        try {
          const response = await authService.register({ name, email, password })
          localStorage.setItem('pe.auth-token', response.token)
          set({
            token: response.token,
            user: response.user,
            isAuthenticated: true,
          })
        } finally {
          set({ isLoading: false })
        }
      },

      hydrateUser: async () => {
        const token = get().token ?? localStorage.getItem('pe.auth-token')
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null })
          return
        }

        set({ isLoading: true })
        try {
          const user = await authService.me(token)
          set({ user, token, isAuthenticated: true })
        } catch {
          set({ isAuthenticated: false, user: null, token: null })
          localStorage.removeItem('pe.auth-token')
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        localStorage.removeItem('pe.auth-token')
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'pe.auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
