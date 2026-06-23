import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description: string
  actionLabel?: string
  actionIcon?: LucideIcon
  onAction?: () => void
}

export const PageHeader = ({ title, description, actionLabel, actionIcon: ActionIcon, onAction }: PageHeaderProps) => (
  <div className='mb-6 flex flex-col gap-4 rounded-3xl border border-border/70 bg-card/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:p-6 lg:flex-row lg:items-end lg:justify-between'>
    <div className='max-w-3xl'>
      <p className='mb-2 inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-primary'>
        Workspace
      </p>
      <h1 className='font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>{title}</h1>
      <p className='mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base'>{description}</p>
    </div>
    {actionLabel && onAction ? (
      <Button className='w-full lg:w-auto' onClick={onAction}>
        {ActionIcon ? <ActionIcon className='h-4 w-4' /> : null}
        {actionLabel}
      </Button>
    ) : null}
  </div>
)
