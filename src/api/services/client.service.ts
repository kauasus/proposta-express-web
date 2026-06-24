import type { Client } from '@/@types'
import { apiClient } from '@/api/axios'
import type { CreateCustomerRequestDto } from '@/api/dtos/customer.dto'
import { throwApiError } from '@/api/errors'
import { mockDb } from '@/api/mock-db'
import { nowIso } from '@/utils/date'
import type { ClientInput } from '@/validators/client.schema'

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

export const clientService = {
  async list(): Promise<Client[]> {
    return mockDb.getClients()
  },

  async create(payload: ClientInput): Promise<Client> {
    try {
      await apiClient.post('/customer/create', toCustomerPayload(payload))
    } catch (error) {
      return throwApiError(error, 'Não conseguimos criar o cliente.')
    }

    const client = toLocalClient(payload)
    const clients = mockDb.getClients()
    mockDb.saveClients([client, ...clients])
    return client
  },

  async update(id: string, payload: ClientInput): Promise<Client> {
    const clients = mockDb.getClients()
    const index = clients.findIndex((item) => item.id === id)

    if (index < 0) {
      throw new Error('Cliente não encontrado')
    }

    const current = clients[index]
    if (!current) {
      throw new Error('Cliente não encontrado')
    }

    const updated: Client = { ...current, ...toLocalClient(payload), id, createdAt: current.createdAt }
    clients[index] = updated
    mockDb.saveClients(clients)
    return updated
  },

  async remove(id: string): Promise<void> {
    mockDb.saveClients(mockDb.getClients().filter((item) => item.id !== id))
  },
}
