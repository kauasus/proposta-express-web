import type { Client } from '@/@types'
import { mockDb } from '@/api/mock-db'
import { nowIso } from '@/utils/date'
import type { ClientInput } from '@/validators/client.schema'

const delay = async (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 350))

export const clientService = {
  async list(): Promise<Client[]> {
    await delay()
    return mockDb.getClients()
  },

  async create(payload: ClientInput): Promise<Client> {
    await delay()
    const client: Client = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: nowIso(),
    }
    const clients = mockDb.getClients()
    mockDb.saveClients([client, ...clients])
    return client
  },

  async update(id: string, payload: ClientInput): Promise<Client> {
    await delay()
    const clients = mockDb.getClients()
    const index = clients.findIndex((item) => item.id === id)

    if (index < 0) {
      throw new Error('Cliente não encontrado')
    }

    const current = clients[index]
    if (!current) {
      throw new Error('Cliente não encontrado')
    }

    const updated: Client = { ...current, ...payload }
    clients[index] = updated
    mockDb.saveClients(clients)
    return updated
  },

  async remove(id: string): Promise<void> {
    await delay()
    mockDb.saveClients(mockDb.getClients().filter((item) => item.id !== id))
  },
}
