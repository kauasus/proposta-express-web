import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { BarChart3, FileText, LogOut, Menu, Users, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', icon: BarChart3, href: '/' },
  { label: 'Propostas', icon: FileText, href: '/proposals' },
  { label: 'Clientes', icon: Users, href: '/clients' },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: { x: '-100%', opacity: 0, transition: { duration: 0.2 } },
  } satisfies Variants

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed left-4 top-4 z-40 lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-border/40 bg-background/80 backdrop-blur-sm hover:bg-muted/80 transition-colors'
        aria-label='Toggle menu'
      >
        {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
      </button>

      <AnimatePresence mode='wait'>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden'
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? 'visible' : 'hidden'}
        className='fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/40 bg-background/95 backdrop-blur-xl flex flex-col pt-6 px-4 lg:relative lg:z-auto lg:pt-0 lg:px-0 lg:border-none lg:bg-transparent lg:backdrop-blur-none'
      >
        <div className='px-4 mb-8 pt-8 lg:pt-6 lg:px-6'>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='flex items-center gap-3'
          >
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold'>
              P
            </div>
            <div className='flex-1'>
              <h1 className='font-bold text-foreground text-sm'>ProposeX</h1>
              <p className='text-xs text-muted-foreground'>Sistema de Propostas</p>
            </div>
          </motion.div>
        </div>

        <nav className='flex-1 space-y-1 px-4 lg:px-6'>
          {navItems.map((item, i) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <motion.div key={item.href} custom={i} variants={itemVariants} initial='hidden' animate='visible'>
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                  )}
                >
                  <Icon className='h-5 w-5 shrink-0' />
                  <span>{item.label}</span>
                  {isActive && <div className='ml-auto h-2 w-2 rounded-full bg-primary' />}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='space-y-4 border-t border-border/40 px-4 py-6 lg:px-6'
          >
            <div className='rounded-xl bg-muted/30 p-3'>
              <p className='text-xs text-muted-foreground'>Usuário</p>
              <p className='font-medium text-sm text-foreground truncate'>{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className='w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors'
            >
              <LogOut className='h-4 w-4' />
              Sair
            </button>
          </motion.div>
        )}
      </motion.aside>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='hidden lg:block'
        />
      )}
    </>
  )
}
