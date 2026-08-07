import { apiClient } from '@/api/axios'
import type {
  CompanyDto,
  CreateCompanyRequestDto,
} from '@/api/dtos/company.dto'
import { throwApiError } from '@/api/errors'

export const companyService = {
  async create(payload: CreateCompanyRequestDto): Promise<CompanyDto> {
    try {
      const response = await apiClient.post<CompanyDto>(
        '/company/create',
        payload,
      )
      return response.data
    } catch (error) {
      return throwApiError(error, 'Não foi possível criar a empresa.')
    }
  },

  async getById(companyId: string): Promise<CompanyDto> {
    try {
      const response = await apiClient.get<CompanyDto>(`/company/${companyId}`)
      return response.data
    } catch (error) {
      return throwApiError(error, 'Não foi possível carregar a empresa.')
    }
  },
}
