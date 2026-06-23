import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/utils/cn'

export const Tabs = TabsPrimitive.Root

export const TabsList = ({ className, ...props }: TabsPrimitive.TabsListProps) => (
  <TabsPrimitive.List
    className={cn('inline-flex h-auto w-full flex-wrap gap-1 rounded-2xl border border-border/70 bg-muted/60 p-1 shadow-inner sm:w-auto sm:flex-nowrap', className)}
    {...props}
  />
)

export const TabsTrigger = ({ className, ...props }: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    className={cn(
      'inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition-all duration-200 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:shadow-slate-900/5 sm:flex-none',
      className,
    )}
    {...props}
  />
)

export const TabsContent = ({ className, ...props }: TabsPrimitive.TabsContentProps) => (
  <TabsPrimitive.Content className={cn('mt-4', className)} {...props} />
)
