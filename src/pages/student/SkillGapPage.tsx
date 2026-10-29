import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Target,
  Sparkles,
  AlertCircle,
  History,
  BookOpen,
  ArrowRight,
  RefreshCw,
} from 'lucide-react'
import { studentService } from '../../services/student.service'
import { TargetRoleSelector } from '../../components/skill-gap/TargetRoleSelector'
import { StaleAnalysisAlert } from '../../components/skill-gap/StaleAnalysisAlert'
import { SkillGapSummaryCards } from '../../components/skill-gap/SkillGapSummaryCards'
import { SkillGapComparisonList } from '../../components/skill-gap/SkillGapComparisonList'
import { StrengthsSection } from '../../components/skill-gap/StrengthsSection'
import { MissingSkillsSection } from '../../components/skill-gap/MissingSkillsSection'
import type { SkillGapAnalysis } from '../../types/skill-gap'
import type { StudentProfile } from '../../types/student'

export function SkillGapPage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null)
  const [isStale, setIsStale] = useState(false)
  const [staleReason, setStaleReason] = useState<string | null>(null)
  const [history, setHistory] = useState<SkillGapAnalysis[]>([])

  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGeneratingPath, setIsGeneratingPath] = useState(false)
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
        studentService.getLatestSkillGap().catch(() => ({ analysis: null, isStale: false, staleReason: null })),
        studentService.getSkillGapHistory().catch(() => []),
      ])

      setProfile(profileData)
      setAnalysis(latestData.analysis)
      setIsStale(latestData.isStale)
      setStaleReason(latestData.staleReason)
      setHistory(historyData)
    } catch (err: unknown) {
      console.error('Failed to load skill gap data:', err)
      setError('Unable to load skill gap information. Please check your connection.')
    } finally {
      setIsLoadingInitial(false)
    }
  }

  const handleAnalyze = async (targetRole: string) => {
    try {
      setIsAnalyzing(true)
      setError(null)
      const newAnalysis = await studentService.analyzeSkillGap(targetRole)
      setAnalysis(newAnalysis)
      setIsStale(false)
      setStaleReason(null)

      // Refresh history list
      const updatedHistory = await studentService.getSkillGapHistory()
      setHistory(updatedHistory)
    } catch (err: unknown) {
      console.error('Failed to analyze skill gap:', err)
      const message =
        (err as any)?.response?.data?.message ||
        (err as any)?.message ||
        'Failed to generate skill gap analysis. Please try again.'
      setError(message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateLearningPath = async () => {
    if (!analysis) return
    try {
      setIsGeneratingPath(true)
      setError(null)
      await studentService.generateLearningPath(analysis._id)
      navigate('/student/learning')
    } catch (err: unknown) {
      console.error('Failed to generate learning path:', err)
      const message =
        (err as any)?.response?.data?.message ||
        (err as any)?.message ||
        'Failed to generate personalized learning path. Please try again.'
      setError(message)
    } finally {
      setIsGeneratingPath(false)
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-r from-primary/15 via-indigo-500/10 to-amber-500/15 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
              <Target className="w-3.5 h-3.5" />
              Phase 9 • AI Skill Gap Detection & Remediation
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              AI Skill Gap Detection
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Benchmark your verified skills, projects, and interview experiences against real-world engineering expectations to pinpoint exactly what to improve.
            </p>
          </div>

          {/* Quick Header Stats */}
          {analysis && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto shrink-0">
              <div className="p-3 sm:p-4 rounded-xl border border-border/60 bg-background/50 text-center min-w-[85px]">
                <span className="text-xs text-muted-foreground block">Match Score</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-primary">
                  {analysis.overallMatchScore ?? 70}%
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl border border-border/60 bg-background/50 text-center min-w-[85px]">
                <span className="text-xs text-muted-foreground block">Strengths</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                  {analysis.strengths.length}
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl border border-border/60 bg-background/50 text-center min-w-[85px]">
                <span className="text-xs text-muted-foreground block">Skill Gaps</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
                  {analysis.gaps.length}
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl border border-border/60 bg-background/50 text-center min-w-[85px]">
                <span className="text-xs text-muted-foreground block">Missing Tech</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
                  {analysis.missingSkills.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Target Role Selector */}
      <TargetRoleSelector
        onAnalyze={handleAnalyze}
        isLoading={isAnalyzing}
        currentRole={analysis?.targetRole}
        preferredRoles={profile?.preferredRoles}
      />

      {/* Stale Analysis Alert */}
      {isStale && (
        <StaleAnalysisAlert
          staleReason={staleReason}
          onRefresh={() => handleAnalyze(analysis?.targetRole || 'Full Stack Developer')}
          isRefreshing={isAnalyzing}
        />
      )}

      {/* Main Analysis Body */}
      {analysis ? (
        <div className="space-y-8">
          {/* Summary Cards */}
          <SkillGapSummaryCards analysis={analysis} />

          {/* CTA Banner to Generate Learning Path */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/10 via-indigo-500/10 to-purple-500/10 p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Next Step in Your Digital Twin Journey
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  Generate Your Personalized Learning Path
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                  Transform these detected gaps into an ordered, milestone-driven curriculum with project tasks and curated resources.
                </p>
              </div>

              <button
                onClick={handleGenerateLearningPath}
                disabled={isGeneratingPath}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-primary/20 shrink-0"
              >
                <BookOpen className={`w-4 h-4 ${isGeneratingPath ? 'animate-spin' : ''}`} />
                {isGeneratingPath ? 'Generating Curriculum...' : 'Generate Learning Path'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detected Skill Gaps */}
          <SkillGapComparisonList gaps={analysis.gaps} />

          {/* Validated Strengths */}
          <StrengthsSection strengths={analysis.strengths} />

          {/* Missing Core Technologies */}
          <MissingSkillsSection missingSkills={analysis.missingSkills} />

          {/* Analysis History Section */}
          {history.length > 1 && (
            <div className="space-y-4 pt-6 border-t border-border/60">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  Past Role Analyses ({history.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {history.map((h) => (
                  <button
                    key={h._id}
                    onClick={() => setAnalysis(h)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      h._id === analysis._id
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                        : 'border-border/60 bg-card/50 hover:border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-sm text-foreground truncate">
                        {h.targetRole}
                      </span>
                      <span className="font-mono text-xs font-bold text-primary shrink-0">
                        {h.overallMatchScore ?? 70}%
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground block">
                      {new Date(h.generatedAt).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : !isLoadingInitial ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-border/70 p-12 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            No Skill Gap Analysis Yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Choose a target role above or run an analysis on your default profile to see how your skills compare to industry expectations.
          </p>
          <button
            onClick={() => handleAnalyze(profile?.preferredRoles[0] || 'Full Stack Developer')}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isAnalyzing ? 'Analyzing...' : 'Run Quick Analysis'}
          </button>
        </div>
      ) : (
        /* Initial Loading State */
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground font-medium">
            Loading skill gap intelligence...
          </span>
        </div>
      )}
    </div>
  )
}
