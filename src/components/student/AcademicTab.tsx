import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  BookOpen,
  AlertCircle,
  TrendingUp,
  X,
} from 'lucide-react'
import { studentService } from '@/services/student.service'
import type { AcademicRecord, AcademicSubject } from '@/types/student'

interface AcademicTabProps {
  records: AcademicRecord[]
  onRecordsUpdated: () => void
}

export function AcademicTab({ records, onRecordsUpdated }: AcademicTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<AcademicRecord | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Form states
  const [semester, setSemester] = useState<number>(1)
  const [academicYear, setAcademicYear] = useState<string>('')
  const [sgpa, setSgpa] = useState<string>('')
  const [cgpa, setCgpa] = useState<string>('')
  const [backlogs, setBacklogs] = useState<number>(0)
  const [totalCredits, setTotalCredits] = useState<string>('')
  const [remarks, setRemarks] = useState<string>('')
  const [subjects, setSubjects] = useState<AcademicSubject[]>([])

  const openAddModal = () => {
    setEditingRecord(null)
    const nextSem = records.length > 0 ? Math.max(...records.map((r) => r.semester)) + 1 : 1
    setSemester(nextSem)
    setAcademicYear('')
    setSgpa('')
    setCgpa('')
    setBacklogs(0)
    setTotalCredits('')
    setRemarks('')
    setSubjects([{ name: '', code: '', marks: undefined, grade: '', credits: 3 }])
    setFeedback(null)
    setIsModalOpen(true)
  }

  const openEditModal = (rec: AcademicRecord) => {
    setEditingRecord(rec)
    setSemester(rec.semester)
    setAcademicYear(rec.academicYear || '')
    setSgpa(rec.sgpa !== undefined ? String(rec.sgpa) : '')
    setCgpa(rec.cgpa !== undefined ? String(rec.cgpa) : '')
    setBacklogs(rec.backlogs)
    setTotalCredits(rec.totalCredits !== undefined ? String(rec.totalCredits) : '')
    setRemarks(rec.remarks || '')
    setSubjects(rec.subjects && rec.subjects.length > 0 ? [...rec.subjects] : [])
    setFeedback(null)
    setIsModalOpen(true)
  }

  const handleAddSubjectRow = () => {
    setSubjects((prev) => [...prev, { name: '', code: '', grade: '', credits: 3 }])
  }

  const handleRemoveSubjectRow = (index: number) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubjectChange = (index: number, field: keyof AcademicSubject, value: unknown) => {
    setSubjects((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFeedback(null)

    const parsedSgpa = sgpa ? parseFloat(sgpa) : undefined
    const parsedCgpa = cgpa ? parseFloat(cgpa) : undefined
    const parsedCredits = totalCredits ? parseFloat(totalCredits) : undefined

    if (parsedSgpa !== undefined && (parsedSgpa < 0 || parsedSgpa > 10)) {
      setFeedback({ type: 'error', message: 'SGPA must be between 0.0 and 10.0' })
      setIsSubmitting(false)
      return
    }

    if (parsedCgpa !== undefined && (parsedCgpa < 0 || parsedCgpa > 10)) {
      setFeedback({ type: 'error', message: 'CGPA must be between 0.0 and 10.0' })
      setIsSubmitting(false)
      return
    }

    // Clean empty subjects
    const validSubjects = subjects.filter((s) => s.name && s.name.trim().length > 0)

    try {
      if (editingRecord) {
        await studentService.updateAcademicRecord(editingRecord._id, {
          academicYear: academicYear || undefined,
          sgpa: parsedSgpa,
          cgpa: parsedCgpa,
          backlogs,
          totalCredits: parsedCredits,
          remarks: remarks || undefined,
          subjects: validSubjects,
        })
      } else {
        await studentService.createAcademicRecord({
          semester,
          academicYear: academicYear || undefined,
          sgpa: parsedSgpa,
          cgpa: parsedCgpa,
          backlogs,
          totalCredits: parsedCredits,
          remarks: remarks || undefined,
          subjects: validSubjects,
        })
      }

      setIsModalOpen(false)
      onRecordsUpdated()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save academic record'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, sem: number) => {
    if (!window.confirm(`Are you sure you want to delete records for Semester ${sem}?`)) return
    try {
      await studentService.deleteAcademicRecord(id)
      onRecordsUpdated()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete record')
    }
  }

  const sortedRecords = [...records].sort((a, b) => a.semester - b.semester)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-h3 font-bold text-foreground font-display flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Academic Records & Progression
          </h2>
          <p className="text-body-sm text-foreground-muted mt-1">
            Log semester-by-semester SGPA, cumulative CGPA, backlogs, and subject transcripts.
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          onClick={openAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Semester Record
        </Button>
      </div>

      {/* Progression Ribbon */}
      {sortedRecords.length > 0 && (
        <Card className="p-4 bg-surface-raised/40">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
            <TrendingUp className="w-4 h-4 text-primary" />
            Semester SGPA Progression
          </div>
          <div className="flex items-end gap-3 h-28 pt-4 overflow-x-auto pb-2">
            {sortedRecords.map((r) => {
              const heightPercent = r.sgpa ? (r.sgpa / 10) * 100 : 20
              return (
                <div key={r._id} className="flex flex-col items-center gap-1.5 flex-1 min-w-[60px]">
                  <span className="text-xs font-bold text-foreground">
                    {r.sgpa ? r.sgpa.toFixed(2) : 'N/A'}
                  </span>
                  <div className="w-full bg-surface rounded-t-lg h-16 relative flex items-end overflow-hidden border border-border">
                    <div
                      className="w-full bg-gradient-to-t from-primary to-secondary transition-all duration-500 rounded-t"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-foreground-muted">
                    Sem {r.semester}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Records List */}
      {sortedRecords.length === 0 ? (
        <Card className="p-12 text-center">
          <GraduationCap className="w-12 h-12 text-foreground-muted mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground">No Academic Records Yet</h3>
          <p className="text-body-sm text-foreground-muted max-w-md mx-auto mt-1 mb-6">
            Log your semester marks to establish your academic foundation and verify eligibility.
          </p>
          <Button variant="outline" size="sm" onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
            Add Semester 1 Record
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedRecords.map((record) => (
            <Card key={record._id} className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                    S{record.semester}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-foreground">
                      Semester {record.semester}{' '}
                      {record.academicYear && (
                        <span className="text-xs text-foreground-muted font-normal">
                          ({record.academicYear})
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {record.backlogs === 0 ? (
                        <Badge variant="success" size="sm">0 Backlogs (Clear)</Badge>
                      ) : (
                        <Badge variant="danger" size="sm">{record.backlogs} Active Backlog(s)</Badge>
                      )}
                      {record.totalCredits && (
                        <span className="text-xs text-foreground-muted">
                          {record.totalCredits} Credits
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-foreground-muted">SGPA</div>
                    <div className="text-lg font-bold text-foreground">
                      {record.sgpa !== undefined ? record.sgpa.toFixed(2) : '—'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-foreground-muted">Cumulative CGPA</div>
                    <div className="text-lg font-bold text-primary">
                      {record.cgpa !== undefined ? record.cgpa.toFixed(2) : '—'}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 border-l border-border pl-4">
                    <button
                      onClick={() => openEditModal(record)}
                      aria-label="Edit semester record"
                      className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-raised transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(record._id, record.semester)}
                      aria-label="Delete semester record"
                      className="p-2 rounded-lg text-foreground-muted hover:text-danger hover:bg-surface-raised transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subjects Table if any */}
              {record.subjects && record.subjects.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border/60 text-foreground-muted">
                        <th className="pb-2 font-medium">Course Name</th>
                        <th className="pb-2 font-medium">Code</th>
                        <th className="pb-2 font-medium">Credits</th>
                        <th className="pb-2 font-medium">Marks / %</th>
                        <th className="pb-2 font-medium">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {record.subjects.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-surface-raised/30">
                          <td className="py-2 text-foreground font-medium">{sub.name}</td>
                          <td className="py-2 text-foreground-muted font-mono">{sub.code || '—'}</td>
                          <td className="py-2 text-foreground-muted">{sub.credits ?? '—'}</td>
                          <td className="py-2 text-foreground-muted">{sub.marks ?? '—'}</td>
                          <td className="py-2">
                            <span className="font-semibold text-foreground px-1.5 py-0.5 rounded bg-surface-raised border border-border">
                              {sub.grade || '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {record.remarks && (
                <p className="text-xs text-foreground-muted mt-3 italic">
                  Note: {record.remarks}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <h3 className="text-h3 font-bold text-foreground font-display flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {editingRecord ? `Edit Semester ${editingRecord.semester} Record` : 'Add Semester Record'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-raised"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Semester (1-12) *
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    value={semester}
                    onChange={(e) => setSemester(parseInt(e.target.value, 10))}
                    disabled={!!editingRecord}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Academic Year / Session
                  </label>
                  <Input
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="e.g. 2023-2024"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Semester SGPA (0-10)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    max={10}
                    value={sgpa}
                    onChange={(e) => setSgpa(e.target.value)}
                    placeholder="e.g. 8.45"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Cumulative CGPA (0-10)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    max={10}
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    placeholder="e.g. 8.60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Active Backlogs
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={backlogs}
                    onChange={(e) => setBacklogs(parseInt(e.target.value, 10) || 0)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Total Credits Earned
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    value={totalCredits}
                    onChange={(e) => setTotalCredits(e.target.value)}
                    placeholder="e.g. 22"
                  />
                </div>
              </div>

              {/* Subjects Table Builder */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Subject Grade Transcript (Optional)
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSubjectRow}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Subject
                  </Button>
                </div>

                {subjects.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Subject Name"
                      value={sub.name}
                      onChange={(e) => handleSubjectChange(idx, 'name', e.target.value)}
                      className="flex-1 h-9 px-2.5 rounded-lg bg-surface-raised border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="Code"
                      value={sub.code || ''}
                      onChange={(e) => handleSubjectChange(idx, 'code', e.target.value)}
                      className="w-20 h-9 px-2 rounded-lg bg-surface-raised border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                    <input
                      type="number"
                      placeholder="Credits"
                      value={sub.credits || ''}
                      onChange={(e) => handleSubjectChange(idx, 'credits', parseFloat(e.target.value) || undefined)}
                      className="w-16 h-9 px-2 rounded-lg bg-surface-raised border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="Grade"
                      value={sub.grade || ''}
                      onChange={(e) => handleSubjectChange(idx, 'grade', e.target.value)}
                      className="w-16 h-9 px-2 rounded-lg bg-surface-raised border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSubjectRow(idx)}
                      className="p-2 text-foreground-muted hover:text-danger"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">
                  Remarks / Notes
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Dean's Honour List or Semester topper"
                  className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" size="sm" isLoading={isSubmitting}>
                  {editingRecord ? 'Update Semester' : 'Save Record'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
