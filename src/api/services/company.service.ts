import { apiClient } from '@/api/axios'
import type { CreateCompanyRequestDto } from '@/api/dtos/company.dto'
import { throwApiError } from '@/api/errors'

export const companyService = {
  async create(payload: CreateCompanyRequestDto): Promise<void> {
    try {
      await apiClient.post('/company/create', payload)
    } catch (error) {
      return throwApiError(error, 'Não foi possível criar a empresa.')
    }
  },
}
