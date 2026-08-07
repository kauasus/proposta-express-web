import type { AuthResponse, User } from '@/@types'
import { apiClient } from '@/api/axios'
import type {
  AccountDto,
  AccountSummaryDto,
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
      return throwApiError(error, 'Não foi possível fazer o login.')
    }
  },

  async register(payload: SignupRequestDto): Promise<AccountSummaryDto> {
    try {
      const response = await apiClient.post<AccountSummaryDto>(
        '/account/signup',
        payload,
      )
      return response.data
    } catch (error) {
      return throwApiError(error, 'Não foi possível criar a conta.')
    }
  },

  async getById(accountId: string): Promise<AccountDto | null> {
    try {
      const response = await apiClient.get<AccountDto>(`/account/${accountId}`)
      return response.status === 204 ? null : response.data
    } catch (error) {
      return throwApiError(error, 'Não foi possível carregar a conta.')
    }
  },
}
