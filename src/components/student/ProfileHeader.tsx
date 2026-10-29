import { Brain, GraduationCap, Building2, BookOpen, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { StudentProfile, DigitalTwinSummary } from '@/types/student'

interface ProfileHeaderProps {
  profile: StudentProfile | null
  digitalTwin: DigitalTwinSummary | null
  isLoading?: boolean
  onRefresh?: () => void
}

export function ProfileHeader({
  profile,
  digitalTwin,
  isLoading = false,
  onRefresh,
}: ProfileHeaderProps) {
  if (!profile) return null

  const completion = digitalTwin?.completeness?.percentage ?? profile.profileCompletion ?? 0
  const completionStatus = digitalTwin?.completeness?.status ?? 'INCOMPLETE'

  const getStatusBadge = () => {
    switch (completionStatus) {
      case 'EXCELLENT':
        return <Badge variant="success" size="sm">Profile Ready (90%+)</Badge>
      case 'GOOD':
        return <Badge variant="primary" size="sm">Good Standing (70-89%)</Badge>
      case 'MODERATE':
        return <Badge variant="warning" size="sm">Needs Attention (40-69%)</Badge>
      default:
        return <Badge variant="danger" size="sm">Incomplete (&lt;40%)</Badge>
    }
  }

  const getProgressBarColor = () => {
    if (completion >= 85) return 'bg-success'
    if (completion >= 60) return 'bg-primary'
    if (completion >= 35) return 'bg-warning'
    return 'bg-danger'
  }

  const initials = profile.fullName
    ? profile.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ST'

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-surface via-surface-raised to-surface p-6 shadow-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Avatar + Basic Info */}
        <div className="flex items-start sm:items-center gap-5">
          <div className="relative flex-shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/30 shadow-glow-primary"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white shadow-glow-primary">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 p-1 bg-surface rounded-full border border-border">
              <Brain className="w-4 h-4 text-primary" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-h2 font-bold text-foreground font-display">
                {profile.fullName || 'Student'}
              </h1>
              <Badge variant="outline" size="sm">
                ID: {profile.studentId}
              </Badge>
              {getStatusBadge()}
            </div>

            <p className="text-body-sm text-foreground-muted">
              {profile.email}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-foreground-muted pt-1">
              {profile.college && (
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  {profile.college}
                </span>
              )}
              {profile.department && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-secondary" />
                  {profile.department} {profile.degree ? `(${profile.degree})` : ''}
                </span>
              )}
              {profile.currentSemester && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-accent" />
                  Semester {profile.currentSemester}
                </span>
              )}
              {typeof profile.cgpa === 'number' && profile.cgpa > 0 && (
                <span className="font-semibold text-foreground px-2 py-0.5 rounded bg-surface-raised border border-border">
                  CGPA: {profile.cgpa.toFixed(2)} / 10.0
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Completeness Score & Quick Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 border-border pt-4 lg:pt-0">
          <div className="w-full sm:w-64 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-foreground-muted flex items-center gap-1.5">
                Digital Twin Completeness
              </span>
              <span className="text-foreground font-bold">{completion}%</span>
            </div>

            <div className="w-full h-2.5 bg-surface-raised rounded-full overflow-hidden border border-border">
              <div
                className={`h-full ${getProgressBarColor()} transition-all duration-700 ease-out`}
                style={{ width: `${completion}%` }}
              />
            </div>

            <p className="text-[11px] text-foreground-muted">
              {completion < 70
                ? 'Fill academics, projects, and skills to train your AI twin.'
                : 'Twin profile meets comprehensive data standards.'}
            </p>
          </div>

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              isLoading={isLoading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Sync Profile Data
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
