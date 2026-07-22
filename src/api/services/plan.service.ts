import { apiClient } from '@/api/axios'
import type { PlanDto } from '@/api/dtos/plan.dto'
import { throwApiError } from '@/api/errors'

export const planService = {
  async list(): Promise<PlanDto[]> {
    try {
      const response = await apiClient.get<PlanDto[]>('/plans')
      return response.data
    } catch (error) {
      return throwApiError(error, 'Não foi possível carregar os planos.')
    }
  },
}
