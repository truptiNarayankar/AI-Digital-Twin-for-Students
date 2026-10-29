import { Sparkles, RefreshCw, ShieldAlert, Award, TrendingUp, Compass } from 'lucide-react'
import type { PlacementAssessment, ReadinessLevel } from '../../types/placement'

interface HeroReadinessCardProps {
  assessment: PlacementAssessment
  isStale?: boolean
  staleReason?: string | null
  onAssess: (forceRefresh: boolean) => void
  isAssessing: boolean
}

export function HeroReadinessCard({
  assessment,
  isStale,
  staleReason,
  onAssess,
  isAssessing,
}: HeroReadinessCardProps) {
  const readinessScore = assessment.overallReadinessScore ?? 0
  const probability = assessment.estimatedPlacementProbability ?? 0

  const getLevelConfig = (level: ReadinessLevel) => {
    switch (level) {
      case 'PLACEMENT_READY':
        return {
          label: 'Placement Ready',
          badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          gradientClass: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
          ringColor: '#10b981',
          description: 'Strong competitive candidate profile meeting top employer expectations.',
        }
      case 'NEAR_READY':
        return {
          label: 'Near Ready',
          badgeClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
          gradientClass: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
          ringColor: '#06b6d4',
          description: 'Solid profile with minor gap closures required before active placements.',
        }
      case 'DEVELOPING':
        return {
          label: 'Developing',
          badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          gradientClass: 'from-amber-500/20 via-amber-500/5 to-transparent',
          ringColor: '#f59e0b',
          description: 'Foundation established. Target specific weaknesses to boost placement probability.',
        }
      case 'NOT_READY':
      default:
        return {
          label: 'Needs Foundation',
          badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          gradientClass: 'from-rose-500/20 via-rose-500/5 to-transparent',
          ringColor: '#f43f5e',
          description: 'Core vectors (projects, resume, coding, or interview practice) require attention.',
        }
    }
  }

  const levelConfig = getLevelConfig(assessment.readinessLevel)

  // Circular gauge calculations
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (readinessScore / 100) * circumference

  return (
    <div className="space-y-4">
      {/* Staleness Banner */}
      {isStale && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 backdrop-blur-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-300">Assessment Update Available</p>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {staleReason || 'Your Digital Twin data has updated since this assessment was generated.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onAssess(true)}
            disabled={isAssessing}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-black transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAssessing ? 'animate-spin' : ''}`} />
            Refresh Assessment
          </button>
        </div>
      )}

      {/* Hero Master Score Card */}
      <div className={`relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br ${levelConfig.gradientClass} bg-card/60 p-6 sm:p-8 backdrop-blur-md shadow-xl`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left Column: Role Details & Readiness Summary */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                <Compass className="w-3.5 h-3.5" />
                Target Role
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {assessment.targetRole}
              </h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${levelConfig.badgeClass}`}>
                {levelConfig.label}
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {assessment.assessmentSummary}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
              <span>
                Generated: <strong className="text-foreground">{new Date(assessment.generatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</strong>
              </span>
              <span>•</span>
              <span>
                Version: <strong className="text-foreground">v{assessment.assessmentVersion}</strong>
              </span>
              <span>•</span>
              <span>
                AI Engine: <strong className="text-foreground">{assessment.aiModel || 'Gemini 2.5'}</strong>
              </span>
            </div>
          </div>

          {/* Right Column: Twin Circular Gauges */}
          <div className="flex flex-row items-center gap-6 sm:gap-8 self-center lg:self-auto shrink-0">
            {/* Overall Readiness Circle */}
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-muted/30"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke={levelConfig.ringColor}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-foreground">
                    {readinessScore}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                    / 100
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-muted-foreground mt-2 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-primary" />
                Readiness Score
              </span>
            </div>

            {/* Estimated Probability Gauge */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-background/50 border border-border/60 min-w-[130px] sm:min-w-[140px] text-center">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Est. Probability
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">
                {probability}%
              </div>
              <div className="w-full bg-muted/40 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${probability}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground mt-1.5">
                Transparent Estimate
              </span>
            </div>
          </div>
        </div>

        {/* Action Header Controls */}
        <div className="mt-6 pt-5 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span>Scores derive continuously from your academic, coding, project, and interview twin records.</span>
          </div>

          <button
            onClick={() => onAssess(true)}
            disabled={isAssessing}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-md hover:shadow-primary/20 flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAssessing ? 'animate-spin' : ''}`} />
            {isAssessing ? 'Evaluating Digital Twin...' : 'Re-Run Placement Assessment'}
          </button>
        </div>
      </div>

      {/* Prominent Ethical & Transparent Disclaimer */}
      <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-xs text-muted-foreground flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-foreground font-semibold">Assessment Disclaimer:</strong> The{' '}
          <span className="text-foreground font-medium">AI Estimated Placement Probability</span> and{' '}
          <span className="text-foreground font-medium">Readiness Score</span> represent an educational readiness assessment derived transparently from your Digital Twin competencies, projects, and interview data. It does not constitute a statistical prediction or a guarantee of employment from any organization.
        </p>
      </div>
    </div>
  )
}
