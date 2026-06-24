import { z } from 'zod'

export const companySchema = z.object({
  name: z
    .string()
    .min(4, 'Nome da empresa precisa ter pelo menos 4 caracteres'),
  identification: z
    .string()
    .min(11, 'Identificação precisa ter pelo menos 11 caracteres'),
  phone: z.string().min(8, 'Telefone precisa ter pelo menos 8 dígitos'),
  email: z.string().min(1, 'Digite o e-mail').email('E-mail inválido'),
})

export type CompanyInput = z.infer<typeof companySchema>
