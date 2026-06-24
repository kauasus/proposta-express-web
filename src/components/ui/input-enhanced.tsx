import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

type MotionInputProps = InputHTMLAttributes<HTMLInputElement> & {
  whileFocus?: unknown
  transition?: unknown
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  helperText?: string
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, helperText, icon, className, ...props }, ref) => {
    const MotionInput =
      motion.input as unknown as React.ForwardRefExoticComponent<
        MotionInputProps & React.RefAttributes<HTMLInputElement>
      >

    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}

          <MotionInput
            ref={ref}
            whileFocus={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 outline-none ${
              icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-destructive/60 bg-destructive/5 focus:border-destructive focus:ring-2 focus:ring-destructive/20'
                : success
                  ? 'border-emerald-500/60 bg-emerald-50/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-input/80 bg-background/90 focus:border-primary/40 focus:ring-2 focus:ring-primary/20'
            } ${className}`}
            {...props}
          />

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"
              >
                <CheckCircle className="h-5 w-5" />
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive"
              >
                <AlertCircle className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {(error || helperText) && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`text-xs flex items-center gap-1.5 ${
                error ? 'text-destructive/90' : 'text-muted-foreground'
              }`}
            >
              {error && <AlertCircle className="h-3.5 w-3.5" />}
              {error && <span>{error}</span>}
              {!error && helperText && <Info className="h-3.5 w-3.5" />}
              {!error && helperText && <span>{helperText}</span>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  },
)

Input.displayName = 'Input'
