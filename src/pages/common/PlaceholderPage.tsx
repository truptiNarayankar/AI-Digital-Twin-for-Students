import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Sparkles, ArrowLeft, ArrowRight, Construction } from 'lucide-react'

interface PlaceholderPageProps {
  title: string
  description: string
  icon?: React.ReactNode
  tag?: string
  highlights?: string[]
}

export function PlaceholderPage({
  title,
  description,
  icon = <Construction className="w-8 h-8 text-primary" />,
  tag = 'Phase 3 Feature Preview',
  highlights = [
    'Automated telemetry aggregation and continuous neural modeling',
    'Real-time skill gap analysis mapped to campus recruitment criteria',
    'Intelligent step-by-step personalized learning paths',
  ],
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-h1 font-bold text-foreground font-display">{title}</h1>
            <Badge variant="demo" size="sm">DEMO PLACEHOLDER</Badge>
          </div>
          <p className="text-body-sm text-foreground-muted mt-1">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            {tag}
          </Badge>
        </div>
      </div>

      <Card variant="default" className="p-8 sm:p-12 text-center rounded-3xl border-border flex flex-col items-center justify-center max-w-3xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
          {icon}
        </div>

        <h2 className="text-h2 font-bold text-foreground font-display mb-2">
          {title} Module
        </h2>

        <p className="text-body text-foreground-muted max-w-lg mb-8">
          {description}
        </p>

        <div className="w-full max-w-md text-left p-4 rounded-2xl bg-surface-raised border border-border mb-8 space-y-2">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-2">
            Planned Architecture Capabilities:
          </span>
          {highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-foreground-muted">
              <Sparkles className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
              <span>{h}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/student/dashboard">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Dashboard
            </Button>
          </Link>
          <Link to="/student/digital-twin">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Digital Twin
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
