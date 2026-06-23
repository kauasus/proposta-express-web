import { Toaster, toast as sonnerToast } from 'sonner'

export function AppToaster() {
  return (
    <Toaster
      position='bottom-right'
      richColors
      theme='light'
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            'rounded-xl border border-border/40 backdrop-blur-sm shadow-lg bg-background/95 text-foreground px-4 py-3 text-sm',
          title: 'font-semibold',
          description: 'text-muted-foreground',
          actionButton:
            'bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors',
          cancelButton: 'text-muted-foreground hover:text-foreground transition-colors',
          closeButton: 'text-muted-foreground hover:text-foreground transition-colors',
        },
      }}
    />
  )
}

export function toast(message: string) {
  sonnerToast(message)
}

export function toastSuccess(message: string) {
  sonnerToast.success(message, {
    description: message,
  })
}

export function toastError(message: string) {
  sonnerToast.error(message, {
    description: message,
  })
}

export function toastLoading(message: string) {
  sonnerToast.loading(message)
}
