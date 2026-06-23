import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  actionLabel?: string
  actionIcon?: LucideIcon
  onAction?: () => void
}

export function PageHeader({ title, description, action, actionLabel, actionIcon: ActionIcon, onAction }: PageHeaderProps) {
  const resolvedAction =
    action ??
    (actionLabel && onAction ? (
      <Button onClick={onAction}>
        {ActionIcon ? <ActionIcon className='h-4 w-4' /> : null}
        {actionLabel}
      </Button>
    ) : null)

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-2'
    >
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div className='flex-1'>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className='text-3xl sm:text-4xl font-bold tracking-tight text-foreground'
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className='mt-2 text-base text-muted-foreground'
            >
              {description}
            </motion.p>
          )}
        </div>
        {resolvedAction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {resolvedAction}
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
