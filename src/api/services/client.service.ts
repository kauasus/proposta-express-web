import type { Client } from '@/@types'
import { apiClient } from '@/api/axios'
import type { CreateCustomerRequestDto } from '@/api/dtos/customer.dto'
import { throwApiError } from '@/api/errors'
import { mockDb } from '@/api/mock-db'
import { nowIso } from '@/utils/date'
import type { ClientInput } from '@/validators/client.schema'

type ApiClient = Partial<Client> & {
  customerId?: string
}

type UpdateCustomerRequestDto = Omit<CreateCustomerRequestDto, 'companyId'>

const toCustomerPayload = (payload: ClientInput): CreateCustomerRequestDto => {
  const customer: CreateCustomerRequestDto = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    companyId: payload.companyId,
  }

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

const toCustomerUpdatePayload = (payload: ClientInput): UpdateCustomerRequestDto => {
  const customer: UpdateCustomerRequestDto = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
  }

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

const normalizeApiClient = (client: ApiClient): Client => {
  const id = client.id ?? client.customerId ?? ''

  return {
    id,
    customerId: client.customerId ?? id,
    name: client.name ?? '',
    email: client.email ?? '',
    phone: client.phone ?? '',
    companyId: client.companyId ?? '',
    secondaryPhone: client.secondaryPhone ?? client.otherPhone ?? '',
    document: client.document ?? client.identification ?? '',
    zipCode: client.zipCode ?? '',
    address: client.address ?? '',
    addressNumber: client.addressNumber ?? client.streetNumber ?? '',
    createdAt: client.createdAt ?? nowIso(),
    ...(client.otherPhone ? { otherPhone: client.otherPhone } : {}),
    ...(client.identification ? { identification: client.identification } : {}),
    ...(client.streetNumber ? { streetNumber: client.streetNumber } : {}),
    ...(client.sublocality ? { sublocality: client.sublocality } : {}),
    ...(client.city ? { city: client.city } : {}),
    ...(client.state ? { state: client.state } : {}),
    ...(client.country ? { country: client.country } : {}),
  }
}

const toLocalClient = (payload: ClientInput): Client => {
  const client: Client = {
    id: crypto.randomUUID(),
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    companyId: payload.companyId,
    secondaryPhone: payload.otherPhone ?? '',
    document: payload.identification ?? '',
    addressNumber: payload.streetNumber ?? '',
    zipCode: payload.zipCode ?? '',
    address: payload.address ?? '',
    createdAt: nowIso(),
  }

  if (payload.otherPhone) client.otherPhone = payload.otherPhone
  if (payload.identification) client.identification = payload.identification
  if (payload.streetNumber) client.streetNumber = payload.streetNumber
  if (payload.sublocality) client.sublocality = payload.sublocality
  if (payload.city) client.city = payload.city
  if (payload.state) client.state = payload.state
  if (payload.country) client.country = payload.country

  return client
}

const resolveClientId = (client: Client) => client.customerId ?? client.id

export const clientService = {
  async list(): Promise<Client[]> {
    return mockDb.getClients()
  },

  async listByCompanyId(companyId: string): Promise<Client[]> {
    try {
      const response = await apiClient.get<ApiClient[]>(`/customers/${companyId}`)
      return response.data.map(normalizeApiClient)
    } catch (error) {
      return throwApiError(error, 'Nao foi possivel listar os clientes.')
    }
  },

  async create(payload: ClientInput): Promise<Client> {
    try {
      await apiClient.post('/customer/create', toCustomerPayload(payload))
    } catch (error) {
      return throwApiError(error, 'Nao foi possivel criar o cliente.')
    }

    const client = toLocalClient(payload)
    const clients = mockDb.getClients()
    mockDb.saveClients([client, ...clients])
    return client
  },

  async update(id: string, payload: ClientInput): Promise<Client> {
    if (!id) {
      throw new Error('ID do cliente nao encontrado para atualizar.')
    }

    try {
      await apiClient.put(`/customer/${id}`, {
        data: toCustomerUpdatePayload(payload),
      })
    } catch (error) {
      return throwApiError(error, 'Nao foi possivel atualizar o cliente.')
    }

    const clients = mockDb.getClients()
    const index = clients.findIndex((item) => resolveClientId(item) === id)
    const current = clients[index]
    const updated: Client = {
      ...(current ?? {}),
      ...toLocalClient(payload),
      id,
      customerId: current?.customerId ?? id,
      createdAt: current?.createdAt ?? nowIso(),
    }

    if (index >= 0) {
      clients[index] = updated
    } else {
      clients.unshift(updated)
    }

    mockDb.saveClients(clients)
    return updated
  },

  async remove(id: string): Promise<void> {
    mockDb.saveClients(mockDb.getClients().filter((item) => resolveClientId(item) !== id))
  },
}
