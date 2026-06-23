import { Sidebar } from '@/components/shared/Sidebar'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex min-h-screen bg-background'>
      <Sidebar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className='flex-1 overflow-auto'
      >
        <div className='px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-7xl mx-auto'>{children}</div>
      </motion.main>
    </div>
  )
}
