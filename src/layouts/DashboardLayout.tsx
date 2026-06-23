import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { Building2, FileText, LayoutDashboard, LogOut, Sparkles, Users2 } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients', label: 'Clientes', icon: Building2 },
  { to: '/proposals', label: 'Propostas', icon: FileText },
]

export const DashboardLayout = () => {
  const { user, logout } = useAuth()

  return (
    <div className='relative min-h-screen overflow-hidden text-foreground'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.12),_transparent_30%),radial-gradient(circle_at_top_right,_hsl(187_92%_43%/_0.12),_transparent_28%)]' />
      <div className='pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl' />
      <div className='pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl' />

      <header className='sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl'>
        <div className='container flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex items-center gap-3'>
            <Link
              to='/'
              className='flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-500/20'
            >
              <Sparkles className='h-5 w-5' />
            </Link>
            <div>
              <Link to='/' className='font-display text-xl font-bold tracking-tight'>
                Proposta Express
              </Link>
              <p className='text-xs text-muted-foreground'>Fluxo comercial com aparência premium</p>
            </div>
          </div>

          <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
            <div className='hidden items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur md:flex'>
              <Users2 className='h-4 w-4 text-primary' />
              Olá, {user?.name}
            </div>
            <Button variant='outline' size='sm' onClick={logout}>
              <LogOut className='h-4 w-4' />
              Sair
            </Button>
          </div>
        </div>

        <div className='container pb-4 lg:hidden'>
          <nav className='flex gap-2 overflow-x-auto pb-1'>
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  [
                    'inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all',
                    isActive
                      ? 'border-primary/20 bg-primary/10 text-primary shadow-sm'
                      : 'border-border/70 bg-card/75 text-muted-foreground hover:border-primary/20 hover:text-foreground',
                  ].join(' ')
                }
              >
                <Icon className='h-4 w-4' />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <div className='container grid gap-6 py-6 md:grid-cols-[240px,1fr] lg:gap-8'>
        <aside className='sticky top-28 hidden h-[calc(100dvh-9rem)] self-start md:block'>
          <div className='flex h-full flex-col rounded-3xl border border-border/70 bg-card/85 p-3 shadow-xl shadow-slate-900/5 backdrop-blur-sm'>
            <div className='mb-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4 text-white shadow-lg'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80'>Workspace</p>
              <h2 className='mt-2 font-display text-2xl font-bold tracking-tight'>Painel de vendas</h2>
              <p className='mt-2 text-sm text-slate-300'>
                Acompanhe clientes, propostas e fechamento em um só lugar.
              </p>
            </div>

            <nav className='space-y-1'>
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    [
                      'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-primary/10 text-primary shadow-sm'
                        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                    ].join(' ')
                  }
                >
                  <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-background/80 text-current shadow-sm transition group-hover:bg-card'>
                    <Icon className='h-4 w-4' />
                  </span>
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <main className='min-w-0 pb-10'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
