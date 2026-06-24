import type { ProposalStatus } from '@/@types'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { ProposalCardSkeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProposals } from '@/hooks/useProposals'
import { formatCurrencyBRL } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { Inbox, MoreVertical, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export const ProposalsPage = () => {
  const { proposals, isLoading, fetchProposals, deleteProposal, sendProposal } =
    useProposals()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | ProposalStatus>('all')
  const [proposalIdToDelete, setProposalIdToDelete] = useState<string | null>(
    null,
  )

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
    toast.success('Proposta removida com sucesso')
  }

  const handleSend = async (id: string) => {
    await sendProposal(id)
    toast.success('Proposta enviada com sucesso')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Propostas"
        description="Veja todas as suas propostas e acompanhe o progresso."
        action={
          <Button
            onClick={() => navigate('/proposals/new')}
            size="sm"
            className="text-xs sm:text-sm"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Nova proposta
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs
          defaultValue="all"
          value={filter}
          onValueChange={(value) => setFilter(value as 'all' | ProposalStatus)}
        >
          <TabsList className="h-auto p-1">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="draft">Rascunhos</TabsTrigger>
            <TabsTrigger value="sent">Enviadas</TabsTrigger>
            <TabsTrigger value="accepted">Aceitas</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {isLoading ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div key={i} variants={itemVariants}>
              <ProposalCardSkeleton />
            </motion.div>
          ))}
        </motion.div>
      ) : filteredProposals.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Nenhuma proposta encontrada"
          description="Crie sua primeira proposta e acelere o fechamento de negócios."
          ctaLabel="Criar proposta"
          onCtaClick={() => navigate('/proposals/new')}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="overflow-x-auto rounded-xl sm:rounded-2xl border border-border/40"
        >
          <Table className="min-w-[600px] sm:min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell className="font-medium text-foreground">
                    {proposal.title}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={proposal.status} />
                  </TableCell>
                  <TableCell>{formatDate(proposal.validUntil)}</TableCell>
                  <TableCell>{formatCurrencyBRL(proposal.total)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/proposals/${proposal.id}`)}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSend(proposal.id)}
                        >
                          Enviar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(`/v/${proposal.publicToken}`, '_blank')
                          }
                        >
                          Link público
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setProposalIdToDelete(proposal.id)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}

      <ConfirmDialog
        open={Boolean(proposalIdToDelete)}
        title="Excluir proposta?"
        description="A proposta será removida permanentemente."
        confirmLabel="Excluir"
        onCancel={() => setProposalIdToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
