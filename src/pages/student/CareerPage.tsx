import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CareerGoalsTab } from '@/components/student/CareerGoalsTab'
import { studentService } from '@/services/student.service'
import { AlertCircle } from 'lucide-react'

export function CareerPage() {
  const [goals, setGoals] = useState<{ careerGoal?: string; preferredRoles: string[]; preferredDomains: string[] }>({
    careerGoal: '',
    preferredRoles: [],
    preferredDomains: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadGoals = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await studentService.getCareerGoals()
      setGoals(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load career goals')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  if (isLoading && !goals.careerGoal && goals.preferredRoles.length === 0) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-surface rounded-xl border border-border w-64" />
        <div className="h-64 bg-surface rounded-2xl border border-border" />
      </div>
    )
  }

  if (error && !goals.careerGoal && goals.preferredRoles.length === 0) {
    return (
      <Card className="p-8 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-danger mx-auto mb-3" />
        <h3 className="text-lg font-bold text-foreground">Error Loading Career Aspirations</h3>
        <p className="text-body-sm text-foreground-muted mt-1 mb-4">{error}</p>
        <Button variant="gradient" onClick={loadGoals}>
          Retry
        </Button>
      </Card>
    )
  }

  return (
    <CareerGoalsTab
      careerGoal={goals.careerGoal}
      preferredRoles={goals.preferredRoles}
      preferredDomains={goals.preferredDomains}
      onGoalsUpdated={loadGoals}
    />
  )
}
