import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'react'

export const Table = ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
  <div className='w-full overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-xl shadow-slate-900/5 backdrop-blur-sm'>
    <div className='w-full overflow-x-auto'>
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  </div>
)

export const TableHeader = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn('bg-muted/35 [&_tr]:border-b [&_tr]:border-border/60', className)} {...props} />
)
export const TableBody = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
)
export const TableRow = ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn('border-b border-border/60 transition-colors hover:bg-muted/40', className)} {...props} />
)
export const TableHead = ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn('h-14 px-4 text-left align-middle text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground', className)} {...props} />
)
export const TableCell = ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('p-4 align-middle text-sm text-foreground/90', className)} {...props} />
)
