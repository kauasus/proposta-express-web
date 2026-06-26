import { useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useProposalStore } from '@/store/proposalStore'

export const useClients = () => {
  const { user } = useAuth()
  const clients = useProposalStore((state) => state.clients)
  const isLoading = useProposalStore((state) => state.isLoadingClients)
  const fetchClientsFromStore = useProposalStore((state) => state.fetchClients)
  const createClient = useProposalStore((state) => state.createClient)
  const updateClient = useProposalStore((state) => state.updateClient)
  const removeClient = useProposalStore((state) => state.removeClient)

  const fetchClients = useCallback(async () => {
    return fetchClientsFromStore(user?.companyId)
  }, [fetchClientsFromStore, user?.companyId])

  return {
    clients,
    isLoading,
    fetchClients,
    createClient,
    updateClient,
    removeClient,
  }
}
