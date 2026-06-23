import { useProposalStore } from '@/store/proposalStore'

export const useClients = () => {
  const clients = useProposalStore((state) => state.clients)
  const isLoading = useProposalStore((state) => state.isLoadingClients)
  const fetchClients = useProposalStore((state) => state.fetchClients)
  const createClient = useProposalStore((state) => state.createClient)
  const updateClient = useProposalStore((state) => state.updateClient)
  const removeClient = useProposalStore((state) => state.removeClient)

  return { clients, isLoading, fetchClients, createClient, updateClient, removeClient }
}
