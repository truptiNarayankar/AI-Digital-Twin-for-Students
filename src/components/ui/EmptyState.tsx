import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <Card
      variant="default"
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 md:p-12 border-dashed border-border',
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-raised border border-border text-foreground-muted">
          {icon}
        </div>
      )}
      <h3 className="text-h4 font-semibold text-foreground font-display">{title}</h3>
      <p className="mt-1.5 max-w-sm text-body-sm text-foreground-muted">{description}</p>
      {actionLabel && (
        <Button
          variant="primary"
          size="sm"
          className="mt-6"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  )
}
