import { z } from 'zod'

export const proposalItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(2, 'Descrição obrigatória'),
  quantity: z.number().min(1, 'Qtd mínima: 1'),
  unitPrice: z.number().min(0, 'Valor inválido'),
})

export const proposalSchema = z.object({
  title: z.string().min(3, 'Título obrigatório'),
  clientId: z.string().min(1, 'Selecione um cliente'),
  validUntil: z.string().min(1, 'Informe a validade'),
  subtitle: z.string(),
  notes: z.string().optional(),
  discount: z.number().min(0),
  items: z.array(proposalItemSchema).min(1, 'Adicione pelo menos 1 item'),
})

export type ProposalInput = z.infer<typeof proposalSchema>
