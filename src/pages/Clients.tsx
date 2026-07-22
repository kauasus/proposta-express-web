import type { Client } from '@/@types'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/hooks/useAuth'
import { useClients } from '@/hooks/useClients'
import { zodResolver } from '@hookform/resolvers/zod'
import { Inbox, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type ClientInput, clientSchema } from '@/validators/client.schema'

const onlyDigits = (value: string) => value.replace(/\D/g, '')

const formatPhone = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 14)
  }

  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}

const formatDocument = (value: string) => {
  const digits = onlyDigits(value).slice(0, 14)

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5')
    .slice(0, 18)
}

const formatZipCode = (value: string) => {
  const digits = onlyDigits(value).slice(0, 8)
  return digits.replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9)
}

const emptyClientValues: ClientInput = {
  name: '',
  email: '',
  phone: '',
  companyId: '',
  otherPhone: '',
  identification: '',
  zipCode: '',
  address: '',
  streetNumber: '',
  sublocality: '',
  city: '',
  state: '',
  country: '',
}

const toClientFormValues = (client?: Partial<Client>): ClientInput => ({
  ...emptyClientValues,
  name: client?.name ?? '',
  email: client?.email ?? '',
  phone: client?.phone ?? '',
  companyId: client?.companyId ?? '',
  otherPhone: client?.otherPhone ?? client?.secondaryPhone ?? '',
  identification: client?.identification ?? client?.document ?? '',
  zipCode: client?.zipCode ?? '',
  address: client?.address ?? '',
  streetNumber: client?.streetNumber ?? client?.addressNumber ?? '',
  sublocality: client?.sublocality ?? '',
  city: client?.city ?? '',
  state: client?.state ?? '',
  country: client?.country ?? '',
})

export const ClientsPage = () => {
  const {
    clients,
    isLoading,
    fetchClients,
    createClient,
    updateClient,
    removeClient,
  } = useClients()
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  const form = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
    defaultValues: emptyClientValues,
  })

  useEffect(() => {
    void fetchClients()
  }, [fetchClients])

  const openCreateModal = () => {
    setEditingClient(null)
    form.reset({ ...emptyClientValues, companyId: user?.companyId ?? '' })
    setIsModalOpen(true)
  }

  const openEditModal = (client: Client) => {
    setEditingClient(client)
    form.reset(toClientFormValues(client))
    setIsModalOpen(true)
  }

  const lookupZipCode = async (zipCode: string) => {
    const digits = onlyDigits(zipCode)
    if (digits.length !== 8) return

    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      if (!response.ok) {
        throw new Error('Não foi possível encontrar esse CEP')
      }

      const data = (await response.json()) as {
        erro?: boolean
        logradouro?: string
      }

      if (data.erro) {
        form.setError('zipCode', {
          type: 'validate',
          message: 'CEP não encontrado',
        })
        return
      }

      form.clearErrors('zipCode')
      form.setValue('address', data.logradouro ?? '', {
        shouldDirty: true,
        shouldValidate: true,
      })
    } catch {
      toast.error('Não foi possível preencher o endereço com esse CEP')
    }
  }

  const onSubmit = async (data: ClientInput) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.customerId ?? editingClient.id, data)
        toast.success('Cliente atualizado com sucesso')
      } else {
        await createClient(data)
        toast.success('Cliente criado com sucesso')
      }
      setIsModalOpen(false)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar o cliente. Tente novamente.',
      )
    }
  }

  const handleDelete = async () => {
    if (!clientToDelete) return
    try {
      await removeClient(clientToDelete.customerId ?? clientToDelete.id)
      toast.success('Cliente removido com sucesso')
      setClientToDelete(null)
    } catch {
      toast.error('Não foi possível remover o cliente. Tente novamente.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Mantenha seus contatos organizados e pronto para criar propostas."
        actionLabel="Novo cliente"
        actionIcon={Plus}
        onAction={openCreateModal}
      />

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : clients.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Nenhum cliente cadastrado"
          description="Crie seu primeiro cliente para começar a fazer propostas."
          ctaLabel="Cadastrar cliente"
          onCtaClick={openCreateModal}
        />
      ) : (
        <Table className="min-w-[780px]">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.customerId ?? client.id}>
                <TableCell className="font-medium text-foreground">
                  {client.name}
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{client.phone}</span>
                    {client.otherPhone || client.secondaryPhone ? (
                      <span className="text-xs text-muted-foreground">
                        {client.otherPhone ?? client.secondaryPhone}
                      </span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  {client.identification ?? client.document}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(client)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setClientToDelete(client)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-sky-50/60 shadow-[0_30px_80px_-28px_rgba(15,23,42,0.35)]">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-slate-900">
              {editingClient ? 'Editar cliente' : 'Novo cliente'}
            </DialogTitle>
          </DialogHeader>

          <form
            className="grid gap-4 rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-5 shadow-sm"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  placeholder="Nome do cliente"
                  {...form.register('name')}
                />
                <p className="text-xs text-destructive">
                  {form.formState.errors.name?.message}
                </p>
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  placeholder="cliente@empresa.com"
                  {...form.register('email')}
                />
                <p className="text-xs text-destructive">
                  {form.formState.errors.email?.message}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>ID da empresa</Label>
                <Input
                  className="font-mono text-xs"
                  placeholder="00000000-0000-0000-0000-000000000000"
                  readOnly
                  {...form.register('companyId')}
                />
                <p className="text-xs text-muted-foreground">
                  Preenchido automaticamente com sua empresa
                </p>
              </div>
              <div className="space-y-2">
                <Label>Telefone principal</Label>
                <Controller
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <Input
                      ref={field.ref}
                      inputMode="numeric"
                      placeholder="(00) 00000-0000"
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        field.onChange(formatPhone(event.target.value))
                      }
                    />
                  )}
                />
                <p className="text-xs text-destructive">
                  {form.formState.errors.phone?.message}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Telefone secundário</Label>
                <Controller
                  control={form.control}
                  name="otherPhone"
                  render={({ field }) => (
                    <Input
                      ref={field.ref}
                      inputMode="numeric"
                      placeholder="(00) 00000-0000"
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        field.onChange(formatPhone(event.target.value))
                      }
                    />
                  )}
                />
                <p className="text-xs text-destructive">
                  {form.formState.errors.otherPhone?.message}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>CPF/CNPJ</Label>
                <Controller
                  control={form.control}
                  name="identification"
                  render={({ field }) => (
                    <Input
                      ref={field.ref}
                      inputMode="numeric"
                      placeholder="00.000.000/0000-00"
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) =>
                        field.onChange(formatDocument(event.target.value))
                      }
                    />
                  )}
                />
                <p className="text-xs text-destructive">
                  {form.formState.errors.identification?.message}
                </p>
              </div>
              <div className="space-y-2">
                <Label>CEP</Label>
                <Controller
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <Input
                      ref={field.ref}
                      inputMode="numeric"
                      placeholder="00000-000"
                      value={field.value}
                      onBlur={async () => {
                        field.onBlur()
                        await lookupZipCode(field.value ?? '')
                      }}
                      onChange={(event) => {
                        const nextValue = formatZipCode(event.target.value)
                        field.onChange(nextValue)
                        if (onlyDigits(nextValue).length < 8) {
                          form.clearErrors('zipCode')
                        }
                      }}
                    />
                  )}
                />
                <p className="text-xs text-destructive">
                  {form.formState.errors.zipCode?.message}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr,180px]">
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input
                  placeholder="Rua, avenida, bairro"
                  {...form.register('address')}
                />
                <p className="text-xs text-destructive">
                  {form.formState.errors.address?.message}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Número</Label>
                <Input
                  inputMode="numeric"
                  placeholder="123"
                  {...form.register('streetNumber', {
                    setValueAs: (value) => onlyDigits(String(value)),
                  })}
                />
                <p className="text-xs text-destructive">
                  {form.formState.errors.streetNumber?.message}
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full sm:w-auto sm:self-end">
              {editingClient ? 'Salvar alterações' : 'Cadastrar cliente'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(clientToDelete)}
        title="Remover cliente?"
        description="Essa ação não poderá ser desfeita."
        confirmLabel="Remover"
        onCancel={() => setClientToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
