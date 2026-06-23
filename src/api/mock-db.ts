import type { Client, Proposal, User } from '@/@types'
import { nowIso } from '@/utils/date'

const STORAGE_KEYS = {
  users: 'pe.users',
  clients: 'pe.clients',
  proposals: 'pe.proposals',
}

const read = <T,>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

const write = <T,>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value))
}

const normalizeClient = (client: Partial<Client> & { id: string; createdAt?: string }): Client => ({
  id: client.id,
  name: client.name ?? '',
  email: client.email ?? '',
  phone: client.phone ?? '',
  secondaryPhone: client.secondaryPhone ?? '',
  document: client.document ?? '',
  zipCode: client.zipCode ?? '',
  address: client.address ?? '',
  addressNumber: client.addressNumber ?? '',
  createdAt: client.createdAt ?? nowIso(),
})

export const mockDb = {
  getUsers: (): User[] => read<User[]>(STORAGE_KEYS.users, []),
  saveUsers: (users: User[]): void => write(STORAGE_KEYS.users, users),
  getClients: (): Client[] => read<Client[]>(STORAGE_KEYS.clients, []).map((client) => normalizeClient(client)),
  saveClients: (clients: Client[]): void => write(STORAGE_KEYS.clients, clients.map((client) => normalizeClient(client))),
  getProposals: (): Proposal[] => read<Proposal[]>(STORAGE_KEYS.proposals, []),
  saveProposals: (proposals: Proposal[]): void => write(STORAGE_KEYS.proposals, proposals),
  seed: (): void => {
    const users = mockDb.getUsers()
    if (users.length === 0) {
      mockDb.saveUsers([
        { id: crypto.randomUUID(), name: 'Admin Proposta Express', email: 'admin@proposta.express' },
      ])
    }

    const clients = mockDb.getClients()
    if (clients.length === 0) {
      mockDb.saveClients([
        {
          id: crypto.randomUUID(),
          name: 'Empresa Exemplo LTDA',
          email: 'contato@empresaexemplo.com.br',
          phone: '(11) 98888-7777',
          secondaryPhone: '(11) 97777-6666',
          document: '12.345.678/0001-90',
          zipCode: '01310-200',
          address: 'Av. Paulista',
          addressNumber: '1000',
          createdAt: nowIso(),
        },
      ])
    }

    const proposals = mockDb.getProposals()
    if (proposals.length === 0) {
      const client = mockDb.getClients()[0]
      if (client) {
        const subtotal = 5000
        mockDb.saveProposals([
          {
            id: crypto.randomUUID(),
            clientId: client.id,
            title: 'Website Institucional + Landing Page',
            status: 'sent',
            validUntil: nowIso(),
            notes: 'Entrega em 30 dias úteis',
            publicToken: crypto.randomUUID(),
            items: [
              { id: crypto.randomUUID(), description: 'Desenvolvimento Frontend', quantity: 1, unitPrice: 3000 },
              { id: crypto.randomUUID(), description: 'Integração API', quantity: 1, unitPrice: 2000 },
            ],
            subtotal,
            discount: 0,
            total: subtotal,
            createdAt: nowIso(),
            updatedAt: nowIso(),
          },
        ])
      }
    }
  },
}
