import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'react'

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 text-card-foreground shadow-xl shadow-slate-900/5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-slate-900/10',
      className,
    )}
    {...props}
  />
)

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 p-6 sm:p-7', className)} {...props} />
)

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('font-display text-lg font-semibold leading-none tracking-tight sm:text-xl', className)} {...props} />
)

export const CardDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
)

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6 pt-0 sm:p-7 sm:pt-0', className)} {...props} />
)

export const CardFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center p-6 pt-0 sm:p-7 sm:pt-0', className)} {...props} />
)
