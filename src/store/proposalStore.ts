import type { Client, Proposal } from '@/@types'
import { clientService } from '@/api/services/client.service'
import { proposalService } from '@/api/services/proposal.service'
import type { ClientInput } from '@/validators/client.schema'
import type { ProposalInput } from '@/validators/proposal.schema'
import { create } from 'zustand'

interface ProposalState {
  clients: Client[]
  proposals: Proposal[]
  isLoadingClients: boolean
  isLoadingProposals: boolean
  fetchClients: (companyId?: string) => Promise<void>
  createClient: (payload: ClientInput) => Promise<void>
  updateClient: (id: string, payload: ClientInput) => Promise<void>
  removeClient: (id: string) => Promise<void>
  fetchProposals: () => Promise<void>
  createProposal: (payload: ProposalInput) => Promise<Proposal>
  updateProposal: (id: string, payload: ProposalInput) => Promise<Proposal>
  deleteProposal: (id: string) => Promise<void>
  sendProposal: (id: string) => Promise<void>
}

export const useProposalStore = create<ProposalState>((set) => ({
  clients: [],
  proposals: [],
  isLoadingClients: false,
  isLoadingProposals: false,

  fetchClients: async (companyId?: string) => {
    set({ isLoadingClients: true })
    try {
      const clients = companyId ? await clientService.listByCompanyId(companyId) : await clientService.list()
      set({ clients })
    } finally {
      set({ isLoadingClients: false })
    }
  },

  createClient: async (payload) => {
    await clientService.create(payload)
    const clients = await clientService.list()
    set({ clients })
  },

  updateClient: async (id, payload) => {
    await clientService.update(id, payload)
    const clients = await clientService.list()
    set({ clients })
  },

  removeClient: async (id) => {
    await clientService.remove(id)
    const clients = await clientService.list()
    set({ clients })
  },

  fetchProposals: async () => {
    set({ isLoadingProposals: true })
    try {
      const proposals = await proposalService.list()
      set({ proposals })
    } finally {
      set({ isLoadingProposals: false })
    }
  },

  createProposal: async (payload) => {
    const proposal = await proposalService.create(payload)
    const proposals = await proposalService.list()
    set({ proposals })
    return proposal
  },

  updateProposal: async (id, payload) => {
    const proposal = await proposalService.update(id, payload)
    const proposals = await proposalService.list()
    set({ proposals })
    return proposal
  },

  deleteProposal: async (id) => {
    await proposalService.remove(id)
    const proposals = await proposalService.list()
    set({ proposals })
  },

  sendProposal: async (id) => {
    await proposalService.send(id)
    const proposals = await proposalService.list()
    set({ proposals })
  },
}))
