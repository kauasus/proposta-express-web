import { motion } from 'framer-motion'

export function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      className={`bg-muted ${className}`}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-12 w-12 rounded-2xl' />
      <Skeleton className='h-6 w-2/3 rounded-lg' />
      <Skeleton className='h-4 w-full rounded-lg' />
      <Skeleton className='h-4 w-5/6 rounded-lg' />
    </div>
  )
}

export function ProposalCardSkeleton() {
  return (
    <div className='space-y-3 rounded-2xl border border-border/40 bg-card p-4'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-5 w-2/3 rounded-lg' />
          <Skeleton className='h-4 w-1/2 rounded-lg' />
        </div>
        <Skeleton className='h-6 w-16 rounded-full' />
      </div>
      <Skeleton className='h-3 w-full rounded-full' />
      <Skeleton className='h-4 w-1/3 rounded-lg' />
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className='space-y-3 rounded-2xl border border-border/40 bg-card p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-4 w-1/2 rounded-lg' />
          <Skeleton className='h-8 w-2/3 rounded-lg' />
          <Skeleton className='h-3 w-full rounded-lg' />
        </div>
        <Skeleton className='h-12 w-12 rounded-2xl' />
      </div>
    </div>
  )
}

export function FormFieldSkeleton() {
  return (
    <div className='space-y-2'>
      <Skeleton className='h-4 w-1/4 rounded-lg' />
      <Skeleton className='h-10 w-full rounded-xl' />
    </div>
  )
}
