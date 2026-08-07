import type { Client } from '@/@types'
import { apiClient } from '@/api/axios'
import type {
  CreateCustomerRequestDto,
  CustomerDto,
  UpdateCustomerBodyDto,
  UpdateCustomerRequestDto,
} from '@/api/dtos/customer.dto'
import { throwApiError } from '@/api/errors'
import type { ClientInput } from '@/validators/client.schema'

const addOptionalCustomerFields = <T extends UpdateCustomerRequestDto>(
  customer: T,
  payload: ClientInput,
): T => {
  if (payload.otherPhone) customer.otherPhone = payload.otherPhone
  if (payload.identification) customer.identification = payload.identification
  if (payload.zipCode) customer.zipCode = payload.zipCode
  if (payload.address) customer.address = payload.address
  if (payload.streetNumber) customer.streetNumber = payload.streetNumber
  if (payload.sublocality) customer.sublocality = payload.sublocality
  if (payload.city) customer.city = payload.city
  if (payload.state) customer.state = payload.state
  if (payload.country) customer.country = payload.country
  return customer
}

const toCustomerPayload = (
  payload: ClientInput,
): CreateCustomerRequestDto =>
  addOptionalCustomerFields({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    companyId: payload.companyId,
  }, payload)

const toCustomerUpdatePayload = (
  payload: ClientInput,
): UpdateCustomerRequestDto =>
  addOptionalCustomerFields({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
  }, payload)

const normalizeApiClient = (customer: CustomerDto): Client => ({
  id: customer.customerId,
  customerId: customer.customerId,
  name: customer.name,
  email: customer.email,
  phone: customer.phone,
  companyId: customer.companyId,
  secondaryPhone: customer.otherPhone ?? '',
  document: customer.identification ?? '',
  zipCode: customer.zipCode ?? '',
  address: customer.address ?? '',
  addressNumber: customer.streetNumber ?? '',
  ...(customer.otherPhone ? { otherPhone: customer.otherPhone } : {}),
  ...(customer.identification
    ? { identification: customer.identification }
    : {}),
  ...(customer.streetNumber ? { streetNumber: customer.streetNumber } : {}),
  ...(customer.sublocality ? { sublocality: customer.sublocality } : {}),
  ...(customer.city ? { city: customer.city } : {}),
  ...(customer.state ? { state: customer.state } : {}),
  ...(customer.country ? { country: customer.country } : {}),
})

export const clientService = {
  async listByCompanyId(companyId: string): Promise<Client[]> {
    try {
      const response = await apiClient.get<CustomerDto[]>(
        `/customers/${companyId}`,
      )

      return response.status === 204 || !Array.isArray(response.data)
        ? []
        : response.data.map(normalizeApiClient)
    } catch (error) {
      return throwApiError(error, 'Não foi possível listar os clientes.')
    }
  },

  async create(payload: ClientInput): Promise<Client> {
    try {
      const response = await apiClient.post<CustomerDto>(
        '/customer/create',
        toCustomerPayload(payload),
      )
      return normalizeApiClient(response.data)
    } catch (error) {
      return throwApiError(error, 'Não foi possível criar o cliente.')
    }
  },

  async update(id: string, payload: ClientInput): Promise<Client> {
    if (!id) throw new Error('ID do cliente não encontrado para atualizar.')

    const body: UpdateCustomerBodyDto = {
      data: toCustomerUpdatePayload(payload),
    }

    try {
      const response = await apiClient.put<CustomerDto>(
        `/customer/${id}`,
        body,
      )
      return normalizeApiClient(response.data)
    } catch (error) {
      return throwApiError(error, 'Não foi possível atualizar o cliente.')
    }
  },

  async remove(id: string): Promise<void> {
    if (!id) throw new Error('ID do cliente não encontrado para remover.')

    try {
      await apiClient.delete(`/customer/${id}`)
    } catch (error) {
      return throwApiError(error, 'Não foi possível remover o cliente.')
    }
  },
}
