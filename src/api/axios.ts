import axios from 'axios'
import { toast } from 'sonner'

const baseURL = (
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:6001/api/v1'
).replace(/\/$/, '')

export const apiClient = axios.create({
  baseURL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('pe.auth-token')
  if (token) {
    config.headers['x-access-token'] = token
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pe.auth-token')
      localStorage.removeItem('pe.auth-role')
      localStorage.removeItem('pe.auth-storage')
      toast.error('Sua sessão expirou. Faça login novamente.')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)
