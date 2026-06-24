import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  ctaLabel?: string
  onCtaClick?: () => void
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  ctaLabel,
  onCtaClick,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 bg-card/70 px-6 py-14 text-center shadow-lg shadow-slate-900/5 backdrop-blur-sm">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <Icon className="h-8 w-8" />
    </div>
    <h3 className="font-display text-xl font-semibold">{title}</h3>
    <p className="mb-5 mt-2 max-w-md text-sm leading-6 text-muted-foreground">
      {description}
    </p>
    {ctaLabel && onCtaClick ? (
      <Button variant="outline" onClick={onCtaClick}>
        {ctaLabel}
      </Button>
    ) : null}
  </div>
)
