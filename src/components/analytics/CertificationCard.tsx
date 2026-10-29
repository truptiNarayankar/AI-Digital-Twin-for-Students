import { Award, CheckCircle2, Clock, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { CertificationAnalytics } from '@/types/analytics'

interface CertificationCardProps {
  data: CertificationAnalytics
}

export function CertificationCard({ data }: CertificationCardProps) {
  if (!data.hasData) {
    return (
      <Card variant="default" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-warning" />
          <h3 className="text-base font-bold text-foreground font-display">Certifications</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-surface-raised flex items-center justify-center">
            <Award className="w-7 h-7 text-foreground-subtle" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No certifications added yet.</p>
            <p className="text-xs text-foreground-muted mt-1 mb-3">
              Add industry certifications to strengthen your profile.
            </p>
            <Link to="/student/certifications">
              <Button variant="outline" size="sm">
                Add Certification
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card variant="default" className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center">
            <Award className="w-4 h-4 text-warning" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground font-display">Certifications</h3>
            <p className="text-xs text-foreground-muted">
              {data.totalCertifications} certification{data.totalCertifications !== 1 ? 's' : ''} recorded
            </p>
          </div>
        </div>
        <Badge variant="warning" size="sm">
          {data.totalCertifications} total
        </Badge>
      </div>

      {/* Active / Expired */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl p-3 bg-success/10 border border-success/20 text-center">
          <CheckCircle2 className="w-4 h-4 text-success mx-auto mb-1" />
          <p className="text-xl font-bold font-display text-success">{data.activeCertifications}</p>
          <p className="text-xs text-foreground-muted mt-0.5">Active</p>
        </div>
        <div className="rounded-xl p-3 bg-surface-raised border border-border text-center">
          <Clock className="w-4 h-4 text-foreground-muted mx-auto mb-1" />
          <p className="text-xl font-bold font-display text-foreground-muted">
            {data.expiredCertifications}
          </p>
          <p className="text-xs text-foreground-muted mt-0.5">Expired</p>
        </div>
      </div>

      {/* By Organization */}
      {data.byOrganization.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
            By Organization
          </h4>
          {data.byOrganization.slice(0, 5).map((org) => (
            <div
              key={org.organization}
              className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
            >
              <span className="text-xs text-foreground truncate max-w-[70%]">
                {org.organization}
              </span>
              <Badge variant="muted" size="sm">
                {org.count}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Skills covered */}
      {data.skillsCovered.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">
            Skills Covered
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {data.skillsCovered.slice(0, 8).map((skill) => (
              <span
                key={skill}
                className="text-xs px-2 py-0.5 rounded-md bg-surface-raised border border-border text-foreground-muted"
              >
                {skill}
              </span>
            ))}
            {data.skillsCovered.length > 8 && (
              <span className="text-xs px-2 py-0.5 text-foreground-subtle">
                +{data.skillsCovered.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4">
        <Link to="/student/certifications">
          <Button variant="ghost" size="sm" className="text-xs w-full" rightIcon={<ExternalLink className="w-3 h-3" />}>
            View All Certifications
          </Button>
        </Link>
      </div>
    </Card>
  )
}
