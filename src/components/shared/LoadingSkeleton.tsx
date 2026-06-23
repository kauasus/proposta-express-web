import { Skeleton } from '@/components/ui/skeleton'

export const LoadingSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className='space-y-4 rounded-3xl border border-border/70 bg-card/70 p-5 shadow-lg shadow-slate-900/5 backdrop-blur-sm'>
    {Array.from({ length: rows }).map((_, idx) => (
      <div key={idx} className='space-y-3'>
        <Skeleton className='h-4 w-1/3' />
        <Skeleton className='h-12 w-full' />
      </div>
    ))}
  </div>
)
