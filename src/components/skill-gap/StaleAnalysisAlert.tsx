import { AlertTriangle, RefreshCw } from 'lucide-react'

interface StaleAnalysisAlertProps {
  staleReason?: string | null
  onRefresh: () => void
  isRefreshing: boolean
}

export function StaleAnalysisAlert({
  staleReason,
  onRefresh,
  isRefreshing,
}: StaleAnalysisAlertProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 sm:p-5 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-300">
              Skill Gap Analysis Outdated
            </h4>
            <p className="text-xs text-amber-200/80 mt-0.5">
              {staleReason ||
                'Your Digital Twin profile (skills, projects, certifications, or interview performance) has evolved since this analysis was created.'}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 text-black hover:bg-amber-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Updating Analysis...' : 'Refresh Analysis'}
        </button>
      </div>
    </div>
  )
}
