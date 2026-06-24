import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'

type MotionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  whileHover?: unknown
  whileTap?: unknown
  transition?: unknown
}

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95',
        outline:
          'border border-input bg-background hover:bg-muted hover:text-foreground active:scale-95',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95',
        ghost: 'hover:bg-muted hover:text-foreground active:scale-95',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-11 rounded-2xl px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const MotionButton =
      motion.button as unknown as React.ForwardRefExoticComponent<
        MotionButtonProps & React.RefAttributes<HTMLButtonElement>
      >

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={buttonVariants({ variant, size, className })}
          {...props}
        />
      )
    }

    return (
      <MotionButton
        className={buttonVariants({ variant, size, className })}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
