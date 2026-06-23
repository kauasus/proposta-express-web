import { cn } from '@/utils/cn'

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-2xl bg-gradient-to-r from-muted via-muted/80 to-muted', className)} />
)
