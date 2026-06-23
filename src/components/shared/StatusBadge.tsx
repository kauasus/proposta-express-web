import type { ProposalStatus } from '@/@types'
import { Badge } from '@/components/ui/badge'

const statusMap: Record<ProposalStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Rascunho', variant: 'outline' },
  sent: { label: 'Enviada', variant: 'default' },
  viewed: { label: 'Visualizada', variant: 'secondary' },
  accepted: { label: 'Aceita', variant: 'default' },
  rejected: { label: 'Rejeitada', variant: 'destructive' },
}

export const StatusBadge = ({ status }: { status: ProposalStatus }) => {
  const config = statusMap[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
