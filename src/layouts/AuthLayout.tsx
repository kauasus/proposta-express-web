import { Outlet, useLocation } from 'react-router-dom'

export const AuthLayout = () => {
  const { pathname } = useLocation()
  const isLogin = pathname === '/login'

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_hsl(187_92%_43%/_0.14),_transparent_28%)]" />
      <div className="pointer-events-none absolute left-8 top-8 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

      <div
        className={
          isLogin
            ? 'relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center'
            : 'relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr,0.95fr] lg:gap-8'
        }
      >
        <section className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-400" />
          <div className="rounded-[1.5rem] border border-border/60 bg-background/80 p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Bem-vindo
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    Proposta Express
                  </p>
                </div>
              </div>
            </div>

            <Outlet />
          </div>
        </section>
      </div>
    </div>
  )
}
