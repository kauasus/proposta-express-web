import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string().min(4, 'Nome completo precisa ter pelo menos 4 caracteres'),
  email: z.string().min(1, 'Digite o e-mail').email('E-mail inválido'),
  phone: z.string().min(8, 'Telefone precisa ter pelo menos 8 dígitos'),
  companyId: z.string().uuid('Identificador da empresa inválido'),
  otherPhone: z.string().optional(),
  identification: z.string().optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  streetNumber: z.string().optional(),
  sublocality: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
})

export type ClientInput = z.infer<typeof clientSchema>
