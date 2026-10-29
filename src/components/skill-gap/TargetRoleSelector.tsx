import { useState } from 'react'
import { Target, Sparkles, Briefcase } from 'lucide-react'

interface TargetRoleSelectorProps {
  onAnalyze: (targetRole: string) => void
  isLoading: boolean
  currentRole?: string
  preferredRoles?: string[]
}

const COMMON_ROLES = [
  'Full Stack Developer',
  'Backend Engineer',
  'Frontend Specialist',
  'Cloud & DevOps Engineer',
  'Data Engineer',
  'Mobile Developer',
]

export function TargetRoleSelector({
  onAnalyze,
  isLoading,
  currentRole = '',
  preferredRoles = [],
}: TargetRoleSelectorProps) {
  const [role, setRole] = useState(currentRole || preferredRoles[0] || 'Full Stack Developer')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (role.trim()) {
      onAnalyze(role.trim())
    }
  }

  // Combine preferred roles and standard recommendations (deduplicated)
  const roleSuggestions = Array.from(
    new Set([...preferredRoles.filter(Boolean), ...COMMON_ROLES])
  )

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
        <Target className="w-4 h-4" />
        Target Role Calibration
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-foreground">
        Select Your Target Career Role
      </h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
        Our Gemini AI will benchmark your entire Digital Twin portfolio (skills, projects, coding platform stats, certifications, and mock interview notes) against industry production requirements for this role.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Backend Engineer, React Specialist, Site Reliability Engineer"
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border/80 bg-background/70 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !role.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-primary/20 shrink-0"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Analyzing Portfolio...' : 'Analyze Skill Gaps'}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-2">
          <span className="text-xs text-muted-foreground mr-2">Suggested Roles:</span>
          <div className="inline-flex flex-wrap gap-2 mt-1.5 sm:mt-0">
            {roleSuggestions.slice(0, 6).map((suggestedRole) => (
              <button
                type="button"
                key={suggestedRole}
                onClick={() => setRole(suggestedRole)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  role === suggestedRole
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50'
                }`}
              >
                {suggestedRole}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  )
}
