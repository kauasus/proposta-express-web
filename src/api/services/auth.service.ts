import type { AuthResponse, User } from '@/@types'
import { apiClient } from '@/api/axios'
import type {
  LoginRequestDto,
  LoginResponseDto,
  SignupRequestDto,
} from '@/api/dtos/auth.dto'
import { throwApiError } from '@/api/errors'

export const mapLoginResponseToAuth = (
  payload: LoginResponseDto,
  email: string,
): AuthResponse => {
  const user: User = {
    id: email,
    name: payload.name,
    email,
    role: payload.role,
    companyId: payload.companyId,
  }

  return {
    token: payload.accessToken,
    user,
  }
}

export const authService = {
  async login(payload: LoginRequestDto): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<LoginResponseDto>(
        '/account/login',
        payload,
      )
      return mapLoginResponseToAuth(response.data, payload.email)
    } catch (error) {
      return throwApiError(error, 'Não conseguimos fazer o login.')
    }
  },

  async register(payload: SignupRequestDto): Promise<void> {
    try {
      await apiClient.post('/account/signup', payload)
    } catch (error) {
      return throwApiError(error, 'Não conseguimos criar a conta.')
    }
  },
}
