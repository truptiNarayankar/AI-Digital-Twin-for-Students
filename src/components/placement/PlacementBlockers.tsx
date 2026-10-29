import { ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PlacementBlocker, BlockerSeverity } from '../../types/placement'

interface PlacementBlockersProps {
  blockers: PlacementBlocker[]
}

export function PlacementBlockers({ blockers }: PlacementBlockersProps) {
  const getSeverityBadge = (severity: BlockerSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold'
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-semibold'
      case 'MEDIUM':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      case 'LOW':
      default:
        return 'bg-muted/40 text-muted-foreground border-border/40'
    }
  }

  // Suggest relevant target navigation path based on blocker text keywords
  const resolveTargetRoute = (text: string): { label: string; path: string } => {
    const lower = text.toLowerCase()
    if (lower.includes('interview') || lower.includes('mock')) {
      return { label: 'Go to Mock Interviews', path: '/student/interviews' }
    }
    if (lower.includes('resume') || lower.includes('cv')) {
      return { label: 'Go to Resume Analyzer', path: '/student/resume' }
    }
    if (lower.includes('coding') || lower.includes('leetcode') || lower.includes('dsa') || lower.includes('problem')) {
      return { label: 'Go to Coding Profiles', path: '/student/coding' }
    }
    if (lower.includes('project') || lower.includes('portfolio')) {
      return { label: 'Go to Projects', path: '/student/projects' }
    }
    if (lower.includes('skill') || lower.includes('gap')) {
      return { label: 'Go to Skill Gap Detector', path: '/student/skill-gap' }
    }
    return { label: 'Review Digital Twin', path: '/student/digital-twin' }
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card/50 p-5 sm:p-6 backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">Placement Blockers</h3>
            <p className="text-xs text-muted-foreground">
              Critical impediments that must be resolved to unlock placement eligibility
            </p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-muted/40 text-muted-foreground border border-border/40">
          {blockers.length} {blockers.length === 1 ? 'Blocker' : 'Blockers'}
        </span>
      </div>

      {blockers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-2">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
          <h4 className="text-sm font-semibold text-emerald-300">No Critical Blockers Detected</h4>
          <p className="text-xs text-muted-foreground max-w-md">
            Your candidate profile satisfies the minimum gating criteria across verified resume, technical projects, and interview participation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blockers.map((b, idx) => {
            const nav = resolveTargetRoute(b.title + ' ' + b.action)
            return (
              <div
                key={idx}
                className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-3 flex flex-col justify-between hover:border-border transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${getSeverityBadge(b.severity)}`}>
                      {b.severity} Blocker
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">{b.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {b.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40 space-y-2">
                  <p className="text-[11px] text-primary font-medium">
                    Remediation: {b.action}
                  </p>
                  <Link
                    to={nav.path}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>{nav.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
