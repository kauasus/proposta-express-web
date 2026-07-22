import type { Proposal } from '@/@types'
import { mockDb } from '@/api/mock-db'
import { nowIso } from '@/utils/date'
import type { ProposalInput } from '@/validators/proposal.schema'

const delay = async (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 450))

const calcTotals = (items: ProposalInput['items'], discount: number) => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0,
  )
  return {
    subtotal,
    total: Math.max(0, subtotal - discount),
  }
}

const mapItem = (item: ProposalInput['items'][number]) => ({
  id: item.id ?? crypto.randomUUID(),
  description: item.description,
  quantity: item.quantity,
  unitPrice: item.unitPrice,
})

export const proposalService = {
  async list(): Promise<Proposal[]> {
    await delay()
    return mockDb.getProposals()
  },

  async getById(id: string): Promise<Proposal> {
    await delay()
    const proposal = mockDb.getProposals().find((item) => item.id === id)
    if (!proposal) throw new Error('Proposta não encontrada')
    return proposal
  },

  async create(payload: ProposalInput): Promise<Proposal> {
    await delay()
    const { subtotal, total } = calcTotals(payload.items, payload.discount)

    const base: Proposal = {
      id: crypto.randomUUID(),
      title: payload.title,
      subtitle : payload.subtitle,
      clientId: payload.clientId,
      status: 'draft',
      validUntil: payload.validUntil,
      publicToken: crypto.randomUUID(),
      items: payload.items.map(mapItem),
      subtotal,
      discount: payload.discount,
      total,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    }

    const proposal: Proposal = payload.notes
      ? { ...base, notes: payload.notes }
      : base
    mockDb.saveProposals([proposal, ...mockDb.getProposals()])
    return proposal
  },

  async update(id: string, payload: ProposalInput): Promise<Proposal> {
    await delay()
    const proposals = mockDb.getProposals()
    const index = proposals.findIndex((item) => item.id === id)
    if (index < 0) throw new Error('Proposta não encontrada')

    const current = proposals[index]
    if (!current) throw new Error('Proposta não encontrada')

    const { subtotal, total } = calcTotals(payload.items, payload.discount)

    const base: Proposal = {
      ...current,
      title: payload.title,
      clientId: payload.clientId,
      validUntil: payload.validUntil,
      discount: payload.discount,
      subtotal,
      total,
      items: payload.items.map(mapItem),
      updatedAt: nowIso(),
    }

    let updated: Proposal = { ...base }
    if (payload.notes) {
      updated = { ...updated, notes: payload.notes }
    } else {
      const rest = { ...updated }
      delete rest.notes
      updated = rest
    }

    proposals[index] = updated
    mockDb.saveProposals(proposals)
    return updated
  },

  async remove(id: string): Promise<void> {
    await delay()
    mockDb.saveProposals(mockDb.getProposals().filter((item) => item.id !== id))
  },

  async send(id: string): Promise<Proposal> {
    await delay()
    const proposals = mockDb.getProposals()
    const index = proposals.findIndex((item) => item.id === id)
    if (index < 0) throw new Error('Proposta não encontrada')

    const current = proposals[index]
    if (!current) throw new Error('Proposta não encontrada')

    const updated: Proposal = {
      ...current,
      status: 'sent',
      updatedAt: nowIso(),
    }
    proposals[index] = updated
    mockDb.saveProposals(proposals)
    return updated
  },

  async getPublicByToken(publicToken: string): Promise<Proposal> {
    await delay()
    const proposal = mockDb
      .getProposals()
      .find((item) => item.publicToken === publicToken)
    if (!proposal) throw new Error('Proposta não encontrada')
    return proposal
  },

  async trackView(publicToken: string): Promise<void> {
    await delay()
    const proposals = mockDb.getProposals()
    const index = proposals.findIndex(
      (item) => item.publicToken === publicToken,
    )
    if (index < 0) return

    const current = proposals[index]
    if (!current || current.status !== 'sent') return

    proposals[index] = { ...current, status: 'viewed', updatedAt: nowIso() }
    mockDb.saveProposals(proposals)
  },

  async accept(publicToken: string): Promise<Proposal> {
    await delay()
    const proposals = mockDb.getProposals()
    const index = proposals.findIndex(
      (item) => item.publicToken === publicToken,
    )
    if (index < 0) throw new Error('Proposta não encontrada')

    const current = proposals[index]
    if (!current) throw new Error('Proposta não encontrada')

    const updated: Proposal = {
      ...current,
      status: 'accepted',
      updatedAt: nowIso(),
    }
    proposals[index] = updated
    mockDb.saveProposals(proposals)
    return updated
  },
}
