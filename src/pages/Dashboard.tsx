import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/PageHeader'
import { useClients } from '@/hooks/useClients'
import { useProposals } from '@/hooks/useProposals'
import { formatCurrencyBRL } from '@/utils/currency'
import { ArrowRight, CircleDollarSign, FileText, Layers3, TrendingUp, Users2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const statusConfig = [
  { key: 'draft', label: 'Rascunhos', color: 'bg-slate-400' },
  { key: 'sent', label: 'Enviadas', color: 'bg-sky-500' },
  { key: 'accepted', label: 'Aceitas', color: 'bg-emerald-500' },
  { key: 'rejected', label: 'Rejeitadas', color: 'bg-rose-500' },
] as const

export const DashboardPage = () => {
  const { clients, fetchClients } = useClients()
  const { proposals, fetchProposals } = useProposals()

  useEffect(() => {
    void fetchClients()
    void fetchProposals()
  }, [fetchClients, fetchProposals])

  const totalRevenue = proposals.reduce((acc, proposal) => acc + proposal.total, 0)
  const accepted = proposals.filter((proposal) => proposal.status === 'accepted').length
  const sent = proposals.filter((proposal) => proposal.status === 'sent').length
  const drafts = proposals.filter((proposal) => proposal.status === 'draft').length

  const statCards = useMemo(
    () => [
      {
        label: 'Clientes ativos',
        value: clients.length,
        helper: 'Base pronta para novas propostas',
        icon: Users2,
      },
      {
        label: 'Propostas em fluxo',
        value: proposals.length,
        helper: `${drafts} rascunhos, ${sent} enviadas`,
        icon: FileText,
      },
      {
        label: 'Receita potencial',
        value: formatCurrencyBRL(totalRevenue),
        helper: `${accepted} propostas aceitas`,
        icon: CircleDollarSign,
      },
    ],
    [accepted, clients.length, drafts, proposals.length, sent, totalRevenue],
  )

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Dashboard'
        description='Visão geral da operação comercial com métricas claras e ações rápidas.'
      />

      <section className='grid gap-4 md:grid-cols-3'>
        {statCards.map(({ label, value, helper, icon: Icon }) => (
          <Card key={label} className='group'>
            <CardContent className='p-6'>
              <div className='flex items-start justify-between gap-4'>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>{label}</p>
                  <p className='font-display text-3xl font-bold tracking-tight text-foreground'>{value}</p>
                  <p className='text-sm text-muted-foreground'>{helper}</p>
                </div>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:scale-105'>
                  <Icon className='h-5 w-5' />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className='grid gap-6 xl:grid-cols-[1.15fr,0.85fr]'>
        <Card>
          <CardHeader className='flex flex-row items-start justify-between gap-4'>
            <div>
              <CardTitle>Pipeline comercial</CardTitle>
              <CardDescription>Leitura rápida do avanço das suas propostas.</CardDescription>
            </div>
            <div className='rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground'>
              {proposals.length} oportunidades
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            {statusConfig.map(({ key, label, color }) => {
              const count = proposals.filter((proposal) => proposal.status === key).length
              const percentage = proposals.length ? Math.round((count / proposals.length) * 100) : 0

              return (
                <div key={label} className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='font-medium text-foreground'>{label}</span>
                    <span className='text-muted-foreground'>
                      {count} {count === 1 ? 'proposta' : 'propostas'}
                    </span>
                  </div>
                  <div className='h-2 overflow-hidden rounded-full bg-muted'>
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações rápidas</CardTitle>
            <CardDescription>Atalhos para os fluxos que mais aceleram o uso do sistema.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            <Button asChild className='w-full justify-between'>
              <Link to='/proposals/new'>
                Nova proposta
                <ArrowRight className='h-4 w-4' />
              </Link>
            </Button>
            <Button asChild variant='outline' className='w-full justify-between'>
              <Link to='/clients'>
                Gerenciar clientes
                <Layers3 className='h-4 w-4' />
              </Link>
            </Button>

            <div className='rounded-2xl border border-border/70 bg-muted/30 p-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600'>
                  <TrendingUp className='h-4 w-4' />
                </div>
                <div>
                  <p className='text-sm font-semibold'>Conversão saudável</p>
                  <p className='text-sm text-muted-foreground'>
                    {accepted} propostas aceitas de {proposals.length} criadas.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
