import type { ProposalStatus } from '@/@types'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProposals } from '@/hooks/useProposals'
import { formatCurrencyBRL } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { Inbox, MoreVertical, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const ProposalsPage = () => {
  const { proposals, isLoading, fetchProposals, deleteProposal, sendProposal } = useProposals()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | ProposalStatus>('all')
  const [proposalIdToDelete, setProposalIdToDelete] = useState<string | null>(null)

  useEffect(() => {
    void fetchProposals()
  }, [fetchProposals])

  const filteredProposals = useMemo(() => {
    if (filter === 'all') return proposals
    return proposals.filter((proposal) => proposal.status === filter)
  }, [filter, proposals])

  const handleDelete = async () => {
    if (!proposalIdToDelete) return
    await deleteProposal(proposalIdToDelete)
    setProposalIdToDelete(null)
    toast.success('Proposta removida')
  }

  const handleSend = async (id: string) => {
    await sendProposal(id)
    toast.success('Proposta enviada com sucesso')
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Propostas'
        description='Acompanhe o status e o desempenho das propostas enviadas em uma visualização clara e responsiva.'
        actionLabel='Nova proposta'
        actionIcon={Plus}
        onAction={() => navigate('/proposals/new')}
      />

      <Tabs defaultValue='all' value={filter} onValueChange={(value) => setFilter(value as 'all' | ProposalStatus)}>
        <TabsList>
          <TabsTrigger value='all'>Todas</TabsTrigger>
          <TabsTrigger value='draft'>Rascunhos</TabsTrigger>
          <TabsTrigger value='sent'>Enviadas</TabsTrigger>
          <TabsTrigger value='accepted'>Aceitas</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : filteredProposals.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title='Nenhuma proposta encontrada'
          description='Crie sua primeira proposta e acelere o fechamento de negócios.'
          ctaLabel='Criar proposta'
          onCtaClick={() => navigate('/proposals/new')}
        />
      ) : (
        <Table className='min-w-[880px]'>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className='text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProposals.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell className='font-medium text-foreground'>{proposal.title}</TableCell>
                <TableCell>
                  <StatusBadge status={proposal.status} />
                </TableCell>
                <TableCell>{formatDate(proposal.validUntil)}</TableCell>
                <TableCell>{formatCurrencyBRL(proposal.total)}</TableCell>
                <TableCell className='text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline' size='sm'>
                        <MoreVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => navigate(`/proposals/${proposal.id}`)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSend(proposal.id)}>Enviar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(`/v/${proposal.publicToken}`, '_blank')}>
                        Link público
                      </DropdownMenuItem>
                      <DropdownMenuItem className='text-destructive' onClick={() => setProposalIdToDelete(proposal.id)}>
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ConfirmDialog
        open={Boolean(proposalIdToDelete)}
        title='Excluir proposta?'
        description='A proposta será removida permanentemente.'
        confirmLabel='Excluir'
        onCancel={() => setProposalIdToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
