import { companyService } from '@/api/services/company.service'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { companySchema, type CompanyInput } from '@/validators/company.schema'

export const CompanyCreatePage = () => {
  const form = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
    defaultValues: { name: '', identification: '', phone: '', email: '' },
  })

  const onSubmit = async (data: CompanyInput) => {
    try {
      await companyService.create(data)
      toast.success('Empresa criada com sucesso')
      form.reset()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível criar a empresa. Tente novamente.',
      )
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nova empresa"
        description="Apenas super administradores podem acessar este formulário."
      />

      <Card hover={false}>
        <CardContent className="pt-6">
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input placeholder="Nome da empresa" {...form.register('name')} />
              <p className="text-xs text-destructive">
                {form.formState.errors.name?.message}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Identificação</Label>
              <Input
                placeholder="CPF/CNPJ ou identificador"
                {...form.register('identification')}
              />
              <p className="text-xs text-destructive">
                {form.formState.errors.identification?.message}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                placeholder="(00) 00000-0000"
                {...form.register('phone')}
              />
              <p className="text-xs text-destructive">
                {form.formState.errors.phone?.message}
              </p>
            </div>

            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                placeholder="empresa@dominio.com"
                {...form.register('email')}
              />
              <p className="text-xs text-destructive">
                {form.formState.errors.email?.message}
              </p>
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <Building2 className="h-4 w-4" />
                {form.formState.isSubmitting ? 'Criando...' : 'Criar empresa'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
