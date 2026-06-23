import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Lock, Mail, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { type RegisterInput, registerSchema } from '@/validators/auth.schema'

export const RegisterPage = () => {
  const { register, isLoading } = useAuth()
  const navigate = useNavigate()

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: RegisterInput) => {
    try {
      await register(data)
      toast.success('Conta criada com sucesso!')
      navigate('/')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Falha no cadastro')
    }
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <p className='inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-primary'>
          Crie sua conta
        </p>
        <h1 className='font-display text-3xl font-bold tracking-tight text-foreground'>Cadastrar</h1>
        <p className='text-sm leading-6 text-muted-foreground'>
          Entre no sistema com uma experiência de cadastro rápida, limpa e consistente.
        </p>
      </div>

      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-2'>
          <Label htmlFor='name'>Nome</Label>
          <div className='relative'>
            <UserRound className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input id='name' className='pl-10' placeholder='Seu nome' {...form.register('name')} />
          </div>
          <p className='text-xs text-destructive'>{form.formState.errors.name?.message}</p>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>E-mail</Label>
          <div className='relative'>
            <Mail className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input id='email' type='email' className='pl-10' placeholder='voce@empresa.com' {...form.register('email')} />
          </div>
          <p className='text-xs text-destructive'>{form.formState.errors.email?.message}</p>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='password'>Senha</Label>
          <div className='relative'>
            <Lock className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input id='password' type='password' className='pl-10' placeholder='••••••••' {...form.register('password')} />
          </div>
          <p className='text-xs text-destructive'>{form.formState.errors.password?.message}</p>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='confirmPassword'>Confirmar senha</Label>
          <div className='relative'>
            <Lock className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              id='confirmPassword'
              type='password'
              className='pl-10'
              placeholder='Repita sua senha'
              {...form.register('confirmPassword')}
            />
          </div>
          <p className='text-xs text-destructive'>{form.formState.errors.confirmPassword?.message}</p>
        </div>

        <Button className='w-full' disabled={isLoading} type='submit'>
          {isLoading ? 'Criando conta...' : 'Cadastrar'}
          {!isLoading ? <ArrowRight className='h-4 w-4' /> : null}
        </Button>
      </form>

      <p className='text-sm text-muted-foreground'>
        Já possui conta?{' '}
        <Link to='/login' className='font-semibold text-primary transition hover:text-primary/80'>
          Fazer login
        </Link>
      </p>
    </div>
  )
}
