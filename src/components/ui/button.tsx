import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-500 text-white shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/25',
        outline:
          'border border-border/70 bg-background/80 text-foreground shadow-sm hover:border-primary/30 hover:bg-accent/60 hover:text-accent-foreground',
        ghost: 'hover:bg-accent/60 hover:text-accent-foreground',
        destructive:
          'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/25',
      },
      size: {
        default: 'h-11 px-4 py-2.5',
        sm: 'h-10 rounded-xl px-3.5',
        lg: 'h-12 rounded-xl px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'
