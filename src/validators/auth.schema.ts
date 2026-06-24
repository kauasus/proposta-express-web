import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Digite seu e-mail').email('E-mail inválido'),
  password: z.string().min(4, 'A senha precisa ter pelo menos 4 caracteres'),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(4, 'Nome completo precisa ter pelo menos 4 caracteres'),
    email: z.string().min(1, 'Digite seu e-mail').email('E-mail inválido'),
    password: z.string().min(4, 'A senha precisa ter pelo menos 4 caracteres'),
    confirmPassword: z.string().min(4, 'Confirme sua senha'),
    companyId: z.string().uuid('Identificador da empresa inválido'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
