import { useEffect, useState } from 'react'
import {
  Download,
  GraduationCap,
  Search,
  ShieldCheck,
  Users,
  TrendingUp,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Button } from '@/components/ui/Button'
import { officerService } from '@/services/officer.service'
import type { OfficerCohortAnalytics, OfficerStudent } from '@/types/officer'

const PAGE_SIZE = 25

function csvCell(value: string | number | null): string {
  const text = value === null ? '' : String(value)
  const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text
  return `"${safeText.replace(/"/g, '""')}"`
}

function downloadStudents(students: OfficerStudent[], page: number) {
  const columns: Array<[string, (student: OfficerStudent) => string | number | null]> = [
    ['Student ID', (student) => student.studentId],
    ['Name', (student) => student.fullName],
    ['Email', (student) => student.email],
    ['Department', (student) => student.department],
    ['Degree', (student) => student.degree],
    ['Graduation year', (student) => student.graduationYear],
    ['CGPA', (student) => student.cgpa],
    ['Profile completion (%)', (student) => student.profileCompletion],
    ['Readiness score (%)', (student) => student.readinessScore],
    ['Placement probability (%)', (student) => student.placementProbability],
    ['Readiness level', (student) => student.readinessLevel],
    ['Target role', (student) => student.targetRole],
  ]
  const rows = [
    columns.map(([label]) => csvCell(label)).join(','),
    ...students.map((student) =>
      columns.map(([, getValue]) => csvCell(getValue(student))).join(',')
    ),
  ]
  const file = new Blob([`\uFEFF${rows.join('\r\n')}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = `placement-students-page-${page}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function formatReadinessLevel(level: string | null): string {
  if (!level) return 'Not assessed'
  return level
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function OfficerDashboard() {
  const [analytics, setAnalytics] = useState<OfficerCohortAnalytics | null>(null)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [page, setPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const timeout = window.setTimeout(() => {
      setLoading(true)
      setError('')
      officerService
        .getCohortAnalytics({
          page,
          pageSize: PAGE_SIZE,
          search: search.trim() || undefined,
          department: department || undefined,
          graduationYear: graduationYear ? Number(graduationYear) : undefined,
        })
        .then((data) => {
          if (active) {
            setAnalytics(data)
            if (data.pagination.totalPages > 0 && page > data.pagination.totalPages) {
              setPage(data.pagination.totalPages)
            }
          }
        })
        .catch((requestError: unknown) => {
          if (active) {
            setError(
              requestError instanceof Error
                ? requestError.message
                : 'Unable to load placement cohort data.'
            )
          }
        })
        .finally(() => {
          if (active) setLoading(false)
        })
    }, 200)

    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [department, graduationYear, page, refreshKey, search])

  const summary = analytics?.summary
  const students = analytics?.students ?? []
  const totalPages = analytics?.pagination.totalPages ?? 0
  const firstResult = analytics && students.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0
  const lastResult = analytics ? firstResult + students.length - 1 : 0

  const handleFilterChange = (change: () => void) => {
    setPage(1)
    change()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-h1 font-bold font-display text-foreground">
              Placement Officer Dashboard
            </h1>
          </div>
          <p className="mt-1 text-body-sm text-foreground-muted">
            Monitor student readiness and find candidates across your graduating cohorts.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="h-4 w-4" />}
          disabled={students.length === 0}
          onClick={() => downloadStudents(students, page)}
        >
          Export this page
        </Button>
      </div>

      <section aria-label="Cohort overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Students in cohort"
          value={loading && !analytics ? '—' : summary?.totalStudents ?? 0}
          subtext="Student profiles"
          icon={<Users className="h-5 w-5 text-primary" />}
          color="primary"
        />
        <StatCard
          label="Average readiness"
          value={
            summary?.averageReadinessScore === null || summary?.averageReadinessScore === undefined
              ? '—'
              : `${summary.averageReadinessScore}%`
          }
          subtext={`${summary?.assessedStudents ?? 0} assessments`}
          icon={<TrendingUp className="h-5 w-5 text-secondary" />}
          color="secondary"
        />
        <StatCard
          label="Placement ready"
          value={loading && !analytics ? '—' : summary?.placementReadyStudents ?? 0}
          subtext="Readiness score ≥ 80%"
          icon={<ShieldCheck className="h-5 w-5 text-success" />}
          color="success"
        />
        <StatCard
          label="Departments"
          value={loading && !analytics ? '—' : summary?.departments.length ?? 0}
          subtext="Represented in the cohort"
          icon={<GraduationCap className="h-5 w-5 text-accent" />}
          color="accent"
        />
      </section>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-h3 font-bold font-display text-foreground">Student directory</h2>
              <p className="mt-1 text-body-sm text-foreground-muted">
                Search by student name, email, or student ID and filter by cohort.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="relative block sm:col-span-1">
                <span className="sr-only">Search students</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => handleFilterChange(() => setSearch(event.target.value))}
                  placeholder="Search students"
                  className="w-full rounded-xl border border-border bg-surface-raised py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>
              <label>
                <span className="sr-only">Filter by department</span>
                <select
                  value={department}
                  onChange={(event) =>
                    handleFilterChange(() => setDepartment(event.target.value))
                  }
                  className="w-full rounded-xl border border-border bg-surface-raised px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="">All departments</option>
                  {(summary?.departments ?? []).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="sr-only">Filter by graduation year</span>
                <select
                  value={graduationYear}
                  onChange={(event) =>
                    handleFilterChange(() => setGraduationYear(event.target.value))
                  }
                  className="w-full rounded-xl border border-border bg-surface-raised px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="">All graduation years</option>
                  {Array.from({ length: 8 }, (_, index) => new Date().getFullYear() + index - 2).map(
                    (year) => <option key={year} value={year}>{year}</option>
                  )}
                </select>
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div role="alert" className="m-5 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
            <p>{error}</p>
            <Button
              className="mt-3"
              variant="outline"
              size="sm"
              onClick={() => setRefreshKey((currentKey) => currentKey + 1)}
            >
              Retry
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-surface-raised text-xs uppercase tracking-wide text-foreground-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Student</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Graduation</th>
                <th className="px-5 py-3 font-semibold">CGPA</th>
                <th className="px-5 py-3 font-semibold">Readiness</th>
                <th className="px-5 py-3 font-semibold">Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-foreground-muted">
                    Loading placement cohort…
                  </td>
                </tr>
              )}
              {!loading && !error && students.map((student) => (
                <tr key={student.id} className="transition-colors hover:bg-surface-raised/60">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">{student.fullName}</p>
                    <p className="mt-0.5 text-xs text-foreground-muted">
                      {student.studentId} · {student.email}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-foreground">{student.department || '—'}</td>
                  <td className="px-5 py-4 text-foreground">{student.graduationYear}</td>
                  <td className="px-5 py-4 text-foreground">{student.cgpa.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    {student.readinessScore === null ? (
                      <span className="text-foreground-muted">Not assessed</span>
                    ) : (
                      <div>
                        <span className="font-semibold text-foreground">{student.readinessScore}%</span>
                        <span className="ml-2 text-xs text-foreground-muted">
                          {formatReadinessLevel(student.readinessLevel)}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-foreground-muted">
                    {student.assessmentDate
                      ? new Date(student.assessmentDate).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
              {!loading && !error && students.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="font-semibold text-foreground">No students found</p>
                    <p className="mt-1 text-sm text-foreground-muted">
                      Try changing or clearing the current filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-sm text-foreground-muted">
            {loading
              ? 'Refreshing student list…'
              : `Showing ${firstResult}–${lastResult} of ${analytics?.pagination.totalStudents ?? 0} students`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            >
              Previous
            </Button>
            <span className="min-w-20 text-center text-sm text-foreground-muted">
              Page {page} of {Math.max(totalPages, 1)}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((currentPage) => currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
