import { z } from 'zod'

const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
const cepRegex = /^\d{5}-\d{3}$/

export const clientSchema = z.object({
  name: z.string().min(3, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().regex(phoneRegex, 'Telefone inválido'),
  secondaryPhone: z.string().regex(/^$|^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone alternativo inválido'),
  document: z.string().min(14, 'CPF/CNPJ inválido'),
  zipCode: z.string().regex(cepRegex, 'CEP inválido'),
  address: z.string().min(3, 'Endereço obrigatório'),
  addressNumber: z.string().min(1, 'Número obrigatório').regex(/^\d+$/, 'Número inválido'),
})

export type ClientInput = z.infer<typeof clientSchema>
