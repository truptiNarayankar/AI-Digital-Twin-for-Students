import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProjectsTab } from '@/components/student/ProjectsTab'
import { studentService } from '@/services/student.service'
import type { Project } from '@/types/student'
import { AlertCircle } from 'lucide-react'

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await studentService.getProjects()
      setProjects(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  if (isLoading && projects.length === 0) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-surface rounded-xl border border-border w-64" />
        <div className="h-64 bg-surface rounded-2xl border border-border" />
      </div>
    )
  }

  if (error && projects.length === 0) {
    return (
      <Card className="p-8 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-danger mx-auto mb-3" />
        <h3 className="text-lg font-bold text-foreground">Error Loading Projects</h3>
        <p className="text-body-sm text-foreground-muted mt-1 mb-4">{error}</p>
        <Button variant="gradient" onClick={loadProjects}>
          Retry
        </Button>
      </Card>
    )
  }

  return (
    <ProjectsTab
      projects={projects}
      onProjectsUpdated={loadProjects}
    />
  )
}
