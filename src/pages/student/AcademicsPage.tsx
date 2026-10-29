import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AcademicTab } from '@/components/student/AcademicTab'
import { studentService } from '@/services/student.service'
import type { AcademicRecord } from '@/types/student'
import { AlertCircle } from 'lucide-react'

export function AcademicsPage() {
  const [records, setRecords] = useState<AcademicRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRecords = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await studentService.getAcademicRecords()
      setRecords(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load academic records')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  if (isLoading && records.length === 0) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-surface rounded-xl border border-border w-64" />
        <div className="h-64 bg-surface rounded-2xl border border-border" />
      </div>
    )
  }

  if (error && records.length === 0) {
    return (
      <Card className="p-8 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-danger mx-auto mb-3" />
        <h3 className="text-lg font-bold text-foreground">Error Loading Academics</h3>
        <p className="text-body-sm text-foreground-muted mt-1 mb-4">{error}</p>
        <Button variant="gradient" onClick={loadRecords}>
          Retry
        </Button>
      </Card>
    )
  }

  return (
    <AcademicTab
      records={records}
      onRecordsUpdated={loadRecords}
    />
  )
}
