import * as React from 'react'
import { cn } from '@/utils/cn'

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => (
    <input
      className={cn(
        'flex h-11 w-full rounded-xl border border-input/80 bg-background/90 px-4 py-2.5 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/80 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
