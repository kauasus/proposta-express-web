import { useProposalStore } from '@/store/proposalStore'

export const useProposals = () => {
  const proposals = useProposalStore((state) => state.proposals)
  const isLoading = useProposalStore((state) => state.isLoadingProposals)
  const fetchProposals = useProposalStore((state) => state.fetchProposals)
  const createProposal = useProposalStore((state) => state.createProposal)
  const updateProposal = useProposalStore((state) => state.updateProposal)
  const deleteProposal = useProposalStore((state) => state.deleteProposal)
  const sendProposal = useProposalStore((state) => state.sendProposal)

  return {
    proposals,
    isLoading,
    fetchProposals,
    createProposal,
    updateProposal,
    deleteProposal,
    sendProposal,
  }
}
