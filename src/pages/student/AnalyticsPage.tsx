import { BarChart3 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'

/**
 * AnalyticsPage — Phase 6
 * Route: /student/analytics
 *
 * Displays deterministic analytics for the student's Digital Twin.
 * All metrics are transparent calculations based on student-provided data.
 * No AI predictions, no fake demo values.
 */
export function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-h1 font-bold text-foreground font-display">
              Digital Twin Analytics
            </h1>
            <Badge variant="success" size="sm">LIVE DATA</Badge>
          </div>
          <p className="text-body-sm text-foreground-muted mt-1">
            Transparent analytics calculated from your academic records, skills, coding activity,
            projects, and certifications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-foreground-subtle px-3 py-1.5 rounded-lg border border-border bg-surface">
            <BarChart3 className="w-3.5 h-3.5" />
            Deterministic calculations · No AI
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />
    </div>
  )
}
