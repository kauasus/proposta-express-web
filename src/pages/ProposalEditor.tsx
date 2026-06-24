import type { Proposal } from '@/@types'
import { proposalService } from '@/api/services/proposal.service'
import { ProposalPdfDocument } from '@/components/pdf/ProposalPdfDocument'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { defaultProposalPdfBranding } from '@/domain/proposals/pdf/proposal-pdf.mapper'
import type { ProposalPdfBranding } from '@/domain/proposals/pdf/proposal-pdf.types'
import { useClients } from '@/hooks/useClients'
import { useProposals } from '@/hooks/useProposals'
import { formatCurrencyBRL } from '@/utils/currency'
import { zodResolver } from '@hookform/resolvers/zod'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import {
  Building2,
  CircleDollarSign,
  Download,
  FileText,
  Layers3,
  Plus,
  Printer,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  type ProposalInput,
  proposalSchema,
} from '@/validators/proposal.schema'

const defaultValues: ProposalInput = {
  title: '',
  clientId: '',
  validUntil: '',
  notes: '',
  discount: 0,
  items: [{ description: '', quantity: 1, unitPrice: 0 }],
}

const pdfBrandingDefaults: ProposalPdfBranding = defaultProposalPdfBranding

const updateHighlight = (
  current: ProposalPdfBranding,
  index: 0 | 1 | 2,
  value: string,
): ProposalPdfBranding => {
  const highlights = [
    ...current.highlights,
  ] as ProposalPdfBranding['highlights']
  highlights[index] = value
  return { ...current, highlights }
}

export const ProposalEditorPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { clients, fetchClients } = useClients()
  const { createProposal, updateProposal } = useProposals()
  const [loadedProposal, setLoadedProposal] = useState<Proposal | null>(null)
  const [branding, setBranding] =
    useState<ProposalPdfBranding>(pdfBrandingDefaults)

  const form = useForm<ProposalInput>({
    resolver: zodResolver(proposalSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

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
        toast.error('Proposta não encontrada ou foi removida')
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
  const watchedValidUntil = useWatch({
    control: form.control,
    name: 'validUntil',
  })

  const subtotal = useMemo(
    () =>
      watchedItems.reduce(
        (acc, item) => acc + Number(item.quantity) * Number(item.unitPrice),
        0,
      ),
    [watchedItems],
  )
  const total = useMemo(
    () => Math.max(0, subtotal - Number(watchedDiscount || 0)),
    [subtotal, watchedDiscount],
  )
  const selectedClient = useMemo(
    () => clients.find((client) => client.id === watchedClientId),
    [clients, watchedClientId],
  )

  const pdfDocumentData = useMemo(
    () => ({
      proposal: {
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
        validUntil: watchedValidUntil || '',
        status: loadedProposal?.status ?? 'draft',
        createdAt: loadedProposal?.createdAt ?? new Date().toISOString(),
        updatedAt: loadedProposal?.updatedAt ?? new Date().toISOString(),
      },
      branding,
      generatedAt: new Date().toISOString(),
      ...(selectedClient ? { client: selectedClient } : {}),
    }),
    [
      branding,
      loadedProposal,
      selectedClient,
      subtotal,
      total,
      watchedDiscount,
      watchedItems,
      watchedNotes,
      watchedTitle,
      watchedValidUntil,
    ],
  )

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
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não conseguimos salvar a proposta. Tente novamente.',
      )
    }
  }

  const summaryCards = [
    { label: 'Subtotal', value: formatCurrencyBRL(subtotal), icon: Layers3 },
    {
      label: 'Desconto',
      value: formatCurrencyBRL(Number(watchedDiscount || 0)),
      icon: CircleDollarSign,
    },
    { label: 'Total', value: formatCurrencyBRL(total), icon: Printer },
  ]

  const updateBranding = <K extends keyof ProposalPdfBranding>(
    field: K,
    value: ProposalPdfBranding[K],
  ) => {
    setBranding((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={id ? 'Editar proposta' : 'Nova proposta'}
        description="Crie uma proposta e veja o resultado em PDF em tempo real."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {label}
                  </p>
                  <p className="font-display mt-2 text-2xl font-bold tracking-tight">
                    {value}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da proposta</CardTitle>
              <CardDescription>
                Preencha as informações da sua proposta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-5"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Título</Label>
                    <Input
                      placeholder="Ex.: Proposta de implantação"
                      {...form.register('title')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cliente</Label>
                    <Controller
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
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

                  <div className="space-y-2">
                    <Label>Válida até</Label>
                    <Input type="date" {...form.register('validUntil')} />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Desconto (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...form.register('discount', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <textarea
                      className="min-h-[110px] w-full rounded-xl border border-input/80 bg-background/90 px-4 py-3 text-sm shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                      placeholder="Condições, prazos, observações do projeto..."
                      {...form.register('notes')}
                    />
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl border border-border/70 bg-muted/25 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Label className="text-base">Itens da proposta</Label>
                      <p className="text-sm text-muted-foreground">
                        Adicione serviços, produtos e valores com totalização
                        automática.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        append({ description: '', quantity: 1, unitPrice: 0 })
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Item
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="rounded-2xl border border-border/70 bg-card/85 p-4 shadow-sm"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-foreground">
                            Item {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-[1.2fr,0.4fr,0.6fr]">
                          <Input
                            placeholder="Descrição do item"
                            {...form.register(`items.${index}.description`)}
                          />
                          <Input
                            type="number"
                            min={1}
                            placeholder="Qtd"
                            {...form.register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                          />
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="Valor unitário"
                            {...form.register(`items.${index}.unitPrice`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="border-dashed border-border/70 bg-muted/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building2 className="h-5 w-5 text-primary" />
                      Identidade do PDF
                    </CardTitle>
                    <CardDescription>
                      Personalize a apresentação comercial da proposta. Esses
                      dados podem depois vir da API ou das configurações da
                      empresa.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Nome da marca</Label>
                        <Input
                          value={branding.brandName}
                          onChange={(event) =>
                            updateBranding('brandName', event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Razão social</Label>
                        <Input
                          value={branding.legalName}
                          onChange={(event) =>
                            updateBranding('legalName', event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Logo da empresa</Label>
                        <Input
                          value={branding.logoUrl ?? ''}
                          onChange={(event) =>
                            updateBranding('logoUrl', event.target.value)
                          }
                          placeholder="https://... ou data:image/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Slogan</Label>
                        <Input
                          value={branding.slogan ?? ''}
                          onChange={(event) =>
                            updateBranding('slogan', event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>CNPJ</Label>
                        <Input
                          value={branding.cnpj ?? ''}
                          onChange={(event) =>
                            updateBranding('cnpj', event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Website</Label>
                        <Input
                          value={branding.website ?? ''}
                          onChange={(event) =>
                            updateBranding('website', event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>E-mail comercial</Label>
                        <Input
                          value={branding.email ?? ''}
                          onChange={(event) =>
                            updateBranding('email', event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefone comercial</Label>
                        <Input
                          value={branding.phone ?? ''}
                          onChange={(event) =>
                            updateBranding('phone', event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Endereço</Label>
                        <Input
                          value={branding.address ?? ''}
                          onChange={(event) =>
                            updateBranding('address', event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Cidade / UF</Label>
                        <Input
                          value={branding.cityState ?? ''}
                          onChange={(event) =>
                            updateBranding('cityState', event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Diferencial 1</Label>
                        <Input
                          value={branding.highlights[0]}
                          onChange={(event) =>
                            setBranding((current) =>
                              updateHighlight(current, 0, event.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Diferencial 2</Label>
                        <Input
                          value={branding.highlights[1]}
                          onChange={(event) =>
                            setBranding((current) =>
                              updateHighlight(current, 1, event.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Diferencial 3</Label>
                        <Input
                          value={branding.highlights[2]}
                          onChange={(event) =>
                            setBranding((current) =>
                              updateHighlight(current, 2, event.target.value),
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Prazo estimado</Label>
                        <Input
                          value={branding.deliveryEstimate}
                          onChange={(event) =>
                            updateBranding(
                              'deliveryEstimate',
                              event.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Condições de pagamento</Label>
                        <Input
                          value={branding.paymentTerms}
                          onChange={(event) =>
                            updateBranding('paymentTerms', event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Nota de confidencialidade</Label>
                        <textarea
                          className="min-h-[96px] w-full rounded-xl border border-input/80 bg-background/90 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                          value={branding.confidentialityNote}
                          onChange={(event) =>
                            updateBranding(
                              'confidentialityNote',
                              event.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Garantia / suporte</Label>
                        <textarea
                          className="min-h-[96px] w-full rounded-xl border border-input/80 bg-background/90 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
                          value={branding.guaranteeNote}
                          onChange={(event) =>
                            updateBranding('guaranteeNote', event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Nome da assinatura</Label>
                        <Input
                          value={branding.signatureName}
                          onChange={(event) =>
                            updateBranding('signatureName', event.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Cargo / assinatura</Label>
                        <Input
                          value={branding.signatureRole}
                          onChange={(event) =>
                            updateBranding('signatureRole', event.target.value)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="rounded-2xl border border-border/70 bg-muted/25 px-4 py-3 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">
                      Resumo automático
                    </p>
                    <p>{watchedItems.length} item(ns) na composição atual.</p>
                  </div>
                  <Button type="submit" className="w-full sm:w-auto">
                    {loadedProposal ? 'Atualizar proposta' : 'Salvar proposta'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="xl:sticky xl:top-28">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              PDF profissional em tempo real
            </CardTitle>
            <CardDescription>
              Pré-visualização da proposta com layout comercial, identidade
              visual e dados persuasivos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-border/70 bg-muted/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {watchedTitle || 'Proposta sem título'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedClient
                      ? selectedClient.name
                      : 'Selecione um cliente para visualizar os dados'}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <PDFDownloadLink
                  document={<ProposalPdfDocument data={pdfDocumentData} />}
                  fileName={`${(watchedTitle || 'proposta-comercial').toLowerCase().replace(/\s+/g, '-')}.pdf`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  {({ loading }) => (
                    <>
                      <Download className="h-4 w-4" />
                      {loading ? 'Preparando PDF...' : 'Baixar PDF'}
                    </>
                  )}
                </PDFDownloadLink>
              </div>
            </div>

            <div className="h-[620px] overflow-hidden rounded-3xl border border-border/70 bg-background shadow-inner lg:h-[760px]">
              <PDFViewer width="100%" height="100%">
                <ProposalPdfDocument data={pdfDocumentData} />
              </PDFViewer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
