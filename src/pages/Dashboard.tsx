import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useClients } from '@/hooks/useClients'
import { useProposals } from '@/hooks/useProposals'
import { formatCurrencyBRL } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { ArrowRight, CircleDollarSign, FileText, Layers3, TrendingUp, Users2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const statusConfig = [
  { key: 'draft', label: 'Rascunhos', color: 'bg-slate-400' },
  { key: 'sent', label: 'Enviadas', color: 'bg-sky-500' },
  { key: 'accepted', label: 'Aceitas', color: 'bg-emerald-500' },
  { key: 'rejected', label: 'Rejeitadas', color: 'bg-rose-500' },
] as const

export const DashboardPage = () => {
  const { clients, fetchClients } = useClients()
  const { proposals, fetchProposals } = useProposals()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      await Promise.all([fetchClients(), fetchProposals()])
      setIsLoading(false)
    }

    void load()
  }, [fetchClients, fetchProposals])

  const totalRevenue = proposals.reduce((acc, proposal) => acc + proposal.total, 0)
  const accepted = proposals.filter((proposal) => proposal.status === 'accepted').length
  const sent = proposals.filter((proposal) => proposal.status === 'sent').length
  const drafts = proposals.filter((proposal) => proposal.status === 'draft').length
  const conversionRate = proposals.length ? Math.round((accepted / proposals.length) * 100) : 0
  const averageTicket = proposals.length ? totalRevenue / proposals.length : 0

  const recentProposals = useMemo(
    () =>
      [...proposals]
        .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
        .slice(0, 4),
    [proposals],
  )

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
      {
        label: 'Taxa de conversão',
        value: `${conversionRate}%`,
        helper: `${accepted} aceitas de ${proposals.length}`,
        icon: TrendingUp,
      },
    ],
    [accepted, clients.length, conversionRate, drafts, proposals.length, sent, totalRevenue],
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35 },
    },
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Dashboard'
        description='Visão geral da operação comercial com métricas claras e ações rápidas.'
      />

      <section className='relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-2xl shadow-slate-900/20 md:p-8'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.15),transparent_28%)]' />
        <div className='relative grid gap-6 lg:grid-cols-[1.35fr,0.9fr] lg:items-end'>
          <div className='space-y-4'>
            <p className='inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80'>
              Painel comercial
            </p>
            <div className='space-y-3'>
              <h2 className='font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl'>
                Tudo o que importa para fechar mais rápido, em um só lugar.
              </h2>
              <p className='max-w-2xl text-sm leading-6 text-white/70 sm:text-base'>
                Acompanhe o volume de propostas, a receita em potencial e a saúde do funil sem sair desta tela.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Button asChild className='bg-white text-slate-950 hover:bg-white/90'>
                <Link to='/proposals/new'>
                  Nova proposta
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </Button>
              <Button
                asChild
                variant='outline'
                className='border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white'
              >
                <Link to='/clients'>Ver clientes</Link>
              </Button>
            </div>
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            <div className='rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm'>
              <p className='text-xs uppercase tracking-[0.18em] text-white/55'>Receita potencial</p>
              <p className='mt-3 font-display text-2xl font-semibold'>{formatCurrencyBRL(totalRevenue)}</p>
              <p className='mt-1 text-sm text-white/70'>Valor total das propostas cadastradas.</p>
            </div>
            <div className='rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm'>
              <p className='text-xs uppercase tracking-[0.18em] text-white/55'>Ticket médio</p>
              <p className='mt-3 font-display text-2xl font-semibold'>{formatCurrencyBRL(averageTicket)}</p>
              <p className='mt-1 text-sm text-white/70'>Uma leitura rápida do tamanho das oportunidades.</p>
            </div>
          </div>
        </div>
      </section>

      {isLoading ? (
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className='h-32 animate-pulse rounded-2xl border border-border/60 bg-card/80'
            />
          ))}
        </motion.div>
      ) : (
        <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {statCards.map(({ label, value, helper, icon: Icon }, index) => (
            <motion.div
              key={label}
              variants={itemVariants}
              initial='hidden'
              animate='visible'
              transition={{ delay: 0.05 * index }}
            >
              <Card className='group border-border/60 bg-card/90 shadow-lg shadow-slate-900/5 backdrop-blur-sm'>
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
            </motion.div>
          ))}
        </section>
      )}

      <section className='grid gap-6 xl:grid-cols-[1.15fr,0.85fr]'>
        <Card className='border-border/60 bg-card/90 shadow-lg shadow-slate-900/5 backdrop-blur-sm'>
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

        <Card className='border-border/60 bg-card/90 shadow-lg shadow-slate-900/5 backdrop-blur-sm'>
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

      <Card className='border-border/60 bg-card/90 shadow-lg shadow-slate-900/5 backdrop-blur-sm'>
        <CardHeader className='flex flex-row items-start justify-between gap-4'>
          <div>
            <CardTitle>Últimas propostas</CardTitle>
            <CardDescription>Os registros mais recentes para retomar o trabalho com contexto.</CardDescription>
          </div>
          <Button asChild variant='ghost' size='sm' className='text-muted-foreground'>
            <Link to='/proposals'>Ver todas</Link>
          </Button>
        </CardHeader>
        <CardContent className='space-y-3'>
          {recentProposals.length === 0 ? (
            <p className='rounded-2xl border border-dashed border-border/70 bg-muted/30 px-4 py-6 text-sm text-muted-foreground'>
              Ainda não há propostas criadas.
            </p>
          ) : (
            recentProposals.map((proposal) => (
              <div
                key={proposal.id}
                className='flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between'
              >
                <div className='space-y-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='font-medium text-foreground'>{proposal.title}</p>
                    <StatusBadge status={proposal.status} />
                  </div>
                  <p className='text-sm text-muted-foreground'>Atualizada em {formatDate(proposal.updatedAt)}</p>
                </div>
                <div className='text-left sm:text-right'>
                  <p className='font-display text-lg font-semibold text-foreground'>
                    {formatCurrencyBRL(proposal.total)}
                  </p>
                  <p className='text-sm text-muted-foreground'>{proposal.items.length} itens</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
