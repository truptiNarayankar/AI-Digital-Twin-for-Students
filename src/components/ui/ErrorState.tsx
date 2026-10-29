import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading this section. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <Card
      variant="default"
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border-danger/30 bg-danger/5',
        className
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 border border-danger/20 text-danger">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h4 className="text-h4 font-semibold text-foreground font-display">{title}</h4>
      <p className="mt-1.5 max-w-sm text-body-sm text-foreground-muted">{description}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          className="mt-5 gap-2 border-danger/30 hover:border-danger hover:bg-danger/10"
          onClick={onRetry}
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          Try Again
        </Button>
      )}
    </Card>
  )
}
