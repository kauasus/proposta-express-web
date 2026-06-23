import type { Proposal } from '@/@types'
import { proposalService } from '@/api/services/proposal.service'
import { ProposalPdfDocument } from '@/components/pdf/ProposalPdfDocument'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useClients } from '@/hooks/useClients'
import { useProposals } from '@/hooks/useProposals'
import { formatCurrencyBRL } from '@/utils/currency'
import { zodResolver } from '@hookform/resolvers/zod'
import { PDFViewer } from '@react-pdf/renderer'
import { CircleDollarSign, FileText, Layers3, Plus, Printer, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { type ProposalInput, proposalSchema } from '@/validators/proposal.schema'

const defaultValues: ProposalInput = {
  title: '',
  clientId: '',
  validUntil: '',
  notes: '',
  discount: 0,
  items: [{ description: '', quantity: 1, unitPrice: 0 }],
}

export const ProposalEditorPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { clients, fetchClients } = useClients()
  const { createProposal, updateProposal } = useProposals()
  const [loadedProposal, setLoadedProposal] = useState<Proposal | null>(null)

  const form = useForm<ProposalInput>({
    resolver: zodResolver(proposalSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' })

  useEffect(() => {
    void fetchClients()
  }, [fetchClients])

  useEffect(() => {
    if (!id) return

    const loadProposal = async () => {
      try {
        const proposal = await proposalService.getById(id)
        setLoadedProposal(proposal)
        form.reset({
          title: proposal.title,
          clientId: proposal.clientId,
          validUntil: proposal.validUntil.slice(0, 10),
          notes: proposal.notes ?? '',
          discount: proposal.discount,
          items: proposal.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            id: item.id,
          })),
        })
      } catch {
        toast.error('Proposta não encontrada')
        navigate('/proposals')
      }
    }

    void loadProposal()
  }, [form, id, navigate])

  const watchedItems = useWatch({ control: form.control, name: 'items' })
  const watchedDiscount = useWatch({ control: form.control, name: 'discount' })
  const watchedTitle = useWatch({ control: form.control, name: 'title' })
  const watchedClientId = useWatch({ control: form.control, name: 'clientId' })
  const watchedNotes = useWatch({ control: form.control, name: 'notes' })

  const subtotal = useMemo(
    () => watchedItems.reduce((acc, item) => acc + Number(item.quantity) * Number(item.unitPrice), 0),
    [watchedItems],
  )
  const total = useMemo(() => Math.max(0, subtotal - Number(watchedDiscount || 0)), [subtotal, watchedDiscount])

  const selectedClient = useMemo(() => clients.find((client) => client.id === watchedClientId), [clients, watchedClientId])

  const onSubmit = async (data: ProposalInput) => {
    try {
      if (id) {
        await updateProposal(id, data)
        toast.success('Proposta atualizada com sucesso')
      } else {
        await createProposal(data)
        toast.success('Proposta criada com sucesso')
      }
      navigate('/proposals')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Falha ao salvar proposta')
    }
  }

  const summaryCards = [
    { label: 'Subtotal', value: formatCurrencyBRL(subtotal), icon: Layers3 },
    { label: 'Desconto', value: formatCurrencyBRL(Number(watchedDiscount || 0)), icon: CircleDollarSign },
    { label: 'Total', value: formatCurrencyBRL(total), icon: Printer },
  ]

  return (
    <div className='space-y-6'>
      <PageHeader
        title={id ? 'Editar proposta' : 'Nova proposta'}
        description='Monte a proposta com cálculos em tempo real e preview de PDF com leitura profissional.'
      />

      <section className='grid gap-4 md:grid-cols-3'>
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className='p-5'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>{label}</p>
                  <p className='font-display mt-2 text-2xl font-bold tracking-tight'>{value}</p>
                </div>
                <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
                  <Icon className='h-5 w-5' />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className='grid gap-6 xl:grid-cols-[1.08fr,0.92fr]'>
        <Card>
          <CardHeader>
            <CardTitle>Dados da proposta</CardTitle>
            <CardDescription>Organize os detalhes do orçamento antes de gerar o PDF.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2 md:col-span-2'>
                  <Label>Título</Label>
                  <Input placeholder='Ex.: Proposta de implantação' {...form.register('title')} />
                </div>

                <div className='space-y-2'>
                  <Label>Cliente</Label>
                  <Controller
                    control={form.control}
                    name='clientId'
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione um cliente' />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className='space-y-2'>
                  <Label>Válida até</Label>
                  <Input type='date' {...form.register('validUntil')} />
                </div>
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label>Desconto (R$)</Label>
                  <Input type='number' step='0.01' min='0' {...form.register('discount', { valueAsNumber: true })} />
                </div>
                <div className='space-y-2'>
                  <Label>Observações</Label>
                  <textarea
                    className='min-h-[110px] w-full rounded-xl border border-input/80 bg-background/90 px-4 py-3 text-sm shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-4 focus:ring-primary/10'
                    placeholder='Condições, prazos, observações do projeto...'
                    {...form.register('notes')}
                  />
                </div>
              </div>

              <div className='space-y-3 rounded-3xl border border-border/70 bg-muted/25 p-4 sm:p-5'>
                <div className='flex items-center justify-between gap-4'>
                  <div>
                    <Label className='text-base'>Itens da proposta</Label>
                    <p className='text-sm text-muted-foreground'>Adicione serviços, produtos e valores com totalização automática.</p>
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
                  >
                    <Plus className='h-4 w-4' />
                    Item
                  </Button>
                </div>

                <div className='space-y-3'>
                  {fields.map((field, index) => (
                    <div key={field.id} className='rounded-2xl border border-border/70 bg-card/85 p-4 shadow-sm'>
                      <div className='mb-3 flex items-center justify-between gap-3'>
                        <span className='text-sm font-semibold text-foreground'>Item {index + 1}</span>
                        <Button type='button' variant='ghost' size='sm' onClick={() => remove(index)} disabled={fields.length === 1}>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>

                      <div className='grid gap-3 md:grid-cols-[1.2fr,0.4fr,0.6fr]'>
                        <Input placeholder='Descrição do item' {...form.register(`items.${index}.description`)} />
                        <Input
                          type='number'
                          min={1}
                          placeholder='Qtd'
                          {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                        />
                        <Input
                          type='number'
                          min={0}
                          step='0.01'
                          placeholder='Valor unitário'
                          {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div className='rounded-2xl border border-border/70 bg-muted/25 px-4 py-3 text-sm text-muted-foreground'>
                  <p className='font-medium text-foreground'>Resumo automático</p>
                  <p>{watchedItems.length} item(ns) na composição atual.</p>
                </div>
                <Button type='submit' className='w-full sm:w-auto'>
                  {loadedProposal ? 'Atualizar proposta' : 'Salvar proposta'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className='xl:sticky xl:top-28'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5 text-primary' />
              Preview PDF em tempo real
            </CardTitle>
            <CardDescription>
              Pré-visualização da proposta com aparência pronta para apresentação ao cliente.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='rounded-3xl border border-border/70 bg-muted/20 p-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
                  <Sparkles className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-semibold'>{watchedTitle || 'Proposta sem título'}</p>
                  <p className='text-sm text-muted-foreground'>
                    {selectedClient ? selectedClient.name : 'Selecione um cliente para visualizar os dados'}
                  </p>
                </div>
              </div>
            </div>

            <div className='h-[620px] overflow-hidden rounded-3xl border border-border/70 bg-background shadow-inner lg:h-[760px]'>
              <PDFViewer width='100%' height='100%'>
                <ProposalPdfDocument
                  proposal={{
                    title: watchedTitle || 'Proposta sem título',
                    items: watchedItems.map((item, index) => ({
                      id: String(index),
                      description: item.description || 'Item',
                      quantity: Number(item.quantity || 0),
                      unitPrice: Number(item.unitPrice || 0),
                    })),
                    subtotal,
                    discount: Number(watchedDiscount || 0),
                    total,
                    notes: watchedNotes ?? '',
                  }}
                  {...(selectedClient ? { client: selectedClient } : {})}
                />
              </PDFViewer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
