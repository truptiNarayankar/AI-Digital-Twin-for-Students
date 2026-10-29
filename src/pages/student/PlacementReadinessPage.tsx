import { useState, useEffect } from 'react'
import {
  Compass,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Award,
  Layers,
  CheckCircle,
} from 'lucide-react'
import { placementService } from '../../services/placement.service'
import { studentService } from '../../services/student.service'
import { HeroReadinessCard } from '../../components/placement/HeroReadinessCard'
import { DimensionRadarChart } from '../../components/placement/DimensionRadarChart'
import { PlacementDimensionCards } from '../../components/placement/PlacementDimensionCards'
import { PlacementStrengths } from '../../components/placement/PlacementStrengths'
import { PlacementBlockers } from '../../components/placement/PlacementBlockers'
import { PlacementActionPlan } from '../../components/placement/PlacementActionPlan'
import { PlacementEvidence } from '../../components/placement/PlacementEvidence'
import { PlacementHistory } from '../../components/placement/PlacementHistory'
import type { PlacementAssessment } from '../../types/placement'
import type { StudentProfile } from '../../types/student'

const POPULAR_ROLES = [
  'Full Stack Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'Data Scientist',
  'DevOps Engineer',
  'Mobile App Developer',
  'Cloud Architect',
]

export function PlacementReadinessPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [assessment, setAssessment] = useState<PlacementAssessment | null>(null)
  const [isStale, setIsStale] = useState(false)
  const [staleReason, setStaleReason] = useState<string | null>(null)
  const [history, setHistory] = useState<PlacementAssessment[]>([])
  const [targetRole, setTargetRole] = useState('')
  const [customRoleInput, setCustomRoleInput] = useState('')

  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [isAssessing, setIsAssessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoadingInitial(true)
      setError(null)
      const [profileData, latestData, historyData] = await Promise.all([
        studentService.getProfile().catch(() => null),
        placementService.getLatestAssessment().catch(() => ({
          assessment: null,
          isStale: false,
          staleReason: null,
        })),
        placementService.getAssessmentHistory().catch(() => []),
      ])

      setProfile(profileData)
      setAssessment(latestData.assessment)
      setIsStale(latestData.isStale)
      setStaleReason(latestData.staleReason)
      setHistory(historyData)

      const initialRole =
        latestData.assessment?.targetRole ||
        profileData?.careerGoal ||
        (profileData?.preferredRoles && profileData.preferredRoles[0]) ||
        (profileData?.preferredJobRoles && profileData.preferredJobRoles[0]) ||
        'Full Stack Developer'
      setTargetRole(initialRole)
      setCustomRoleInput(initialRole)
    } catch (err: unknown) {
      console.error('Failed to load placement readiness data:', err)
      setError('Unable to load placement readiness information. Please check your connection.')
    } finally {
      setIsLoadingInitial(false)
    }
  }

  const handleAssess = async (forceRefresh = false) => {
    const roleToAssess = customRoleInput.trim() || targetRole || 'Full Stack Developer'
    try {
      setIsAssessing(true)
      setError(null)
      const newAssessment = await placementService.assessPlacement({
        targetRole: roleToAssess,
        forceRefresh,
      })

      setAssessment(newAssessment)
      setTargetRole(newAssessment.targetRole)
      setCustomRoleInput(newAssessment.targetRole)
      setIsStale(false)
      setStaleReason(null)

      // Refresh history list
      const updatedHistory = await placementService.getAssessmentHistory()
      setHistory(updatedHistory)
    } catch (err: unknown) {
      console.error('Failed to generate placement assessment:', err)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = (err as any)?.message || 'Failed to generate placement assessment. Please try again.'
      setError(message)
    } finally {
      setIsAssessing(false)
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Phase 10
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Placement Readiness & Probability
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {profile?.fullName ? `${profile.fullName} • ` : ''}Continuous deterministic evaluation and diagnostic reasoning across 9 candidate dimensions
          </p>
        </div>

        {/* Role Selector Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-start md:self-auto">
          <div className="relative">
            <input
              type="text"
              value={customRoleInput}
              onChange={(e) => setCustomRoleInput(e.target.value)}
              placeholder="Target Role (e.g. Full Stack Developer)"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-card border border-border/80 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 w-full sm:w-64"
            />
          </div>
          <button
            onClick={() => handleAssess(true)}
            disabled={isAssessing || !customRoleInput.trim()}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAssessing ? 'animate-spin' : ''}`} />
            {isAssessing ? 'Assessing...' : 'Assess Role'}
          </button>
        </div>
      </div>

      {/* Role Quick Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-muted-foreground shrink-0 font-medium">Quick Select:</span>
        {POPULAR_ROLES.map((role) => (
          <button
            key={role}
            onClick={() => {
              setCustomRoleInput(role)
              setTargetRole(role)
            }}
            className={`px-3 py-1 rounded-lg border transition-all shrink-0 font-medium ${
              customRoleInput === role
                ? 'bg-primary/20 text-primary border-primary/40 font-semibold'
                : 'bg-card/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-card'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs sm:text-sm text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-rose-200">Assessment Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoadingInitial ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-64 rounded-2xl bg-muted/20 border border-border/40" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 rounded-2xl bg-muted/20 border border-border/40" />
            <div className="h-80 rounded-2xl bg-muted/20 border border-border/40" />
          </div>
        </div>
      ) : !assessment ? (
        /* Empty State: Prompt User to Launch Assessment */
        <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-card/60 to-card/20 p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary border border-primary/30 flex items-center justify-center mx-auto shadow-lg shadow-primary/10">
            <Compass className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Generate Your AI Placement Readiness Evaluation
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Synthesize your academic performance, GitHub projects, DSA problems, ATS resume analysis, and mock interview recordings into a unified 9-dimension placement diagnostic.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
            <div className="p-3 rounded-xl bg-background/50 border border-border/60 space-y-1">
              <Award className="w-4 h-4 text-primary" />
              <h4 className="text-xs font-semibold text-foreground">Readiness Score</h4>
              <p className="text-[11px] text-muted-foreground">0–100 normalized score across 9 weighted vectors</p>
            </div>
            <div className="p-3 rounded-xl bg-background/50 border border-border/60 space-y-1">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-semibold text-foreground">Estimated Probability</h4>
              <p className="text-[11px] text-muted-foreground">Transparent assessment adjusted by verified evidence</p>
            </div>
            <div className="p-3 rounded-xl bg-background/50 border border-border/60 space-y-1">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-semibold text-foreground">Blocker Remediation</h4>
              <p className="text-[11px] text-muted-foreground">Actionable roadmap to unlock placement offers</p>
            </div>
          </div>

          <button
            onClick={() => handleAssess(true)}
            disabled={isAssessing}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-md hover:shadow-primary/20 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isAssessing ? 'Synthesizing Digital Twin...' : 'Launch Placement Evaluation'}
          </button>
        </div>
      ) : (
        /* Populated State with Full Diagnostic Visualizations */
        <div className="space-y-8">
          {/* Hero Readiness Card */}
          <HeroReadinessCard
            assessment={assessment}
            isStale={isStale}
            staleReason={staleReason}
            onAssess={handleAssess}
            isAssessing={isAssessing}
          />

          {/* Radar Chart & Dimension Score Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <DimensionRadarChart dimensionScores={assessment.dimensionScores} />
            </div>
            <div className="lg:col-span-7">
              <PlacementDimensionCards dimensionScores={assessment.dimensionScores} />
            </div>
          </div>

          {/* Placement Blockers */}
          <PlacementBlockers blockers={assessment.placementBlockers} />

          {/* Competitive Strengths & Areas for Improvement */}
          <PlacementStrengths
            strengths={assessment.strengths}
            weaknesses={assessment.weaknesses}
          />

          {/* Prioritized Action Plan */}
          <PlacementActionPlan actions={assessment.recommendedActions} />

          {/* Transparent Evidence Ledger */}
          <PlacementEvidence evidence={assessment.evidence} />

          {/* Version History */}
          <PlacementHistory
            history={history}
            selectedAssessmentId={assessment._id || assessment.id}
            onSelectAssessment={(selected) => setAssessment(selected)}
          />
        </div>
      )}
    </div>
  )
}
