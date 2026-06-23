import type { Proposal } from '@/@types'
import { proposalService } from '@/api/services/proposal.service'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrencyBRL } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

export const PublicProposalPage = () => {
  const { token } = useParams<{ token: string }>()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!token) return
      try {
        const data = await proposalService.getPublicByToken(token)
        await proposalService.trackView(token)
        setProposal(data)
      } catch {
        toast.error('Proposta não encontrada')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [token])

  const handleAccept = async () => {
    if (!token) return
    const updated = await proposalService.accept(token)
    setProposal(updated)
    toast.success('Proposta aceita com sucesso!')
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center px-4'>
        <div className='flex items-center gap-3 rounded-2xl border border-border/70 bg-card/85 px-5 py-4 shadow-xl backdrop-blur-sm'>
          <Loader2 className='h-5 w-5 animate-spin text-primary' />
          <span className='text-sm font-medium text-muted-foreground'>Carregando proposta...</span>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className='flex min-h-screen items-center justify-center px-4'>
        <Card className='max-w-md'>
          <CardContent className='p-6 text-center'>
            <p className='font-display text-xl font-semibold'>Proposta inválida</p>
            <p className='mt-2 text-sm text-muted-foreground'>Não encontramos uma proposta pública disponível para este link.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.12),_transparent_32%),radial-gradient(circle_at_bottom_right,_hsl(187_92%_43%/_0.12),_transparent_28%)]' />
      <div className='pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl' />

      <div className='relative mx-auto max-w-4xl space-y-6'>
        <div className='rounded-[2rem] border border-border/70 bg-card/85 p-5 shadow-2xl shadow-slate-900/5 backdrop-blur-sm sm:p-6'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div className='space-y-2'>
              <p className='inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary'>
                <Sparkles className='h-3.5 w-3.5' />
                Proposta pública
              </p>
              <h1 className='font-display text-3xl font-bold tracking-tight sm:text-4xl'>{proposal.title}</h1>
              <p className='text-sm text-muted-foreground'>Válida até {formatDate(proposal.validUntil)}</p>
            </div>
            <StatusBadge status={proposal.status} />
          </div>
        </div>

        <section className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardContent className='p-5'>
              <p className='text-sm text-muted-foreground'>Subtotal</p>
              <p className='font-display mt-2 text-2xl font-bold'>{formatCurrencyBRL(proposal.subtotal)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-5'>
              <p className='text-sm text-muted-foreground'>Desconto</p>
              <p className='font-display mt-2 text-2xl font-bold'>{formatCurrencyBRL(proposal.discount)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-5'>
              <p className='text-sm text-muted-foreground'>Total</p>
              <p className='font-display mt-2 text-2xl font-bold'>{formatCurrencyBRL(proposal.total)}</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Itens da proposta</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {proposal.items.map((item) => (
              <div
                key={item.id}
                className='flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-muted/20 p-4'
              >
                <div className='space-y-1'>
                  <p className='font-semibold text-foreground'>{item.description}</p>
                  <p className='text-sm text-muted-foreground'>Quantidade: {item.quantity}</p>
                </div>
                <p className='font-semibold text-foreground'>{formatCurrencyBRL(item.quantity * item.unitPrice)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {proposal.notes ? (
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm leading-6 text-muted-foreground'>{proposal.notes}</p>
            </CardContent>
          </Card>
        ) : null}

        <Button className='w-full' onClick={handleAccept} disabled={proposal.status === 'accepted'}>
          {proposal.status === 'accepted' ? (
            <>
              <CheckCircle2 className='h-4 w-4' />
              Proposta já aceita
            </>
          ) : (
            'Aceitar proposta'
          )}
        </Button>
      </div>
    </div>
  )
}
