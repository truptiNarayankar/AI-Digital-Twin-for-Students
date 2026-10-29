import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { studentService } from '@/services/student.service'
import type { ResumeMetadata } from '@/types/resume'
import type { ResumeAnalysis } from '@/types/resume'
import { ResumeUploadCard } from '@/components/resume/ResumeUploadCard'
import { CurrentResumeCard } from '@/components/resume/CurrentResumeCard'
import { ResumeAnalysisDashboard } from '@/components/resume/ResumeAnalysisDashboard'
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react'

export function ResumePage() {
  const [resume, setResume] = useState<ResumeMetadata | null>(null)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showReplaceUpload, setShowReplaceUpload] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [resData, anaData] = await Promise.all([
        studentService.getResume(),
        studentService.getResumeAnalysis(),
      ])

      setResume(resData.resume as ResumeMetadata | null)
      setAnalysis(anaData.analysis)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve resume records'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setFeedback(null)
    try {
      const res = await studentService.uploadResumeFile(file)
      setResume(res.resume as ResumeMetadata)
      setShowReplaceUpload(false)
      setFeedback({
        type: 'success',
        message: `Resume "${file.name}" uploaded successfully! Click "Analyze Resume with AI" to generate feedback.`,
      })
      // Clear old analysis if uploading replacement
      setAnalysis(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload resume file'
      setFeedback({ type: 'error', message: msg })
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  const handleAnalyze = async (customRole?: string) => {
    setIsAnalyzing(true)
    setFeedback(null)
    try {
      const res = await studentService.analyzeResume(customRole)
      setAnalysis(res.analysis)
      setResume(res.resume as ResumeMetadata)
      setFeedback({
        type: 'success',
        message: 'AI Resume analysis completed successfully!',
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to complete AI resume analysis'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setFeedback(null)
    try {
      await studentService.deleteResume()
      setResume(null)
      setAnalysis(null)
      setShowReplaceUpload(false)
      setFeedback({
        type: 'success',
        message: 'Resume document and all associated AI feedback records have been deleted.',
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete resume'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading && !resume) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-surface rounded-xl border border-border w-72" />
        <div className="h-44 bg-surface rounded-2xl border border-border" />
        <div className="h-96 bg-surface rounded-2xl border border-border" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-h1 font-bold text-foreground font-display flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-primary" />
            AI Resume Analyzer
          </h1>
          <p className="text-body-sm text-foreground-muted mt-1">
            Get structured AI feedback to improve your resume for your target role.
          </p>
        </div>

        {resume && !showReplaceUpload && (
          <Button
            variant="gradient"
            size="sm"
            onClick={() => handleAnalyze()}
            isLoading={isAnalyzing}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            {analysis ? 'Re-Analyze Resume' : 'Analyze Resume'}
          </Button>
        )}
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-success/10 border-success/30 text-success'
              : 'bg-danger/10 border-danger/30 text-danger'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>

          <button
            onClick={() => setFeedback(null)}
            className="p-1 rounded-md hover:bg-black/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Primary Section: Upload vs Current Card */}
      {!resume || showReplaceUpload ? (
        <div className="space-y-4">
          {showReplaceUpload && (
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-foreground">
                Uploading Replacement Resume (will become v{resume ? resume.version + 1 : 1})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplaceUpload(false)}
              >
                Cancel & Keep Current Resume
              </Button>
            </div>
          )}

          <ResumeUploadCard
            onUpload={handleUpload}
            isUploading={isUploading}
            title={showReplaceUpload ? 'Upload Updated Resume' : 'Upload Resume Document'}
            subtitle="Upload your PDF or DOCX file (up to 10 MB). Machine-readable text is extracted server-side."
          />
        </div>
      ) : (
        <CurrentResumeCard
          resume={resume}
          onAnalyze={() => handleAnalyze()}
          onReplaceClick={() => setShowReplaceUpload(true)}
          onDelete={handleDelete}
          isAnalyzing={isAnalyzing}
          isDeleting={isDeleting}
        />
      )}

      {/* AI Assessment Dashboard */}
      {resume && !showReplaceUpload && (
        <ResumeAnalysisDashboard
          analysis={analysis}
          isAnalyzing={isAnalyzing}
          currentTargetRole={analysis?.targetRole || 'Software Engineer'}
          onReanalyze={(role) => handleAnalyze(role)}
        />
      )}
    </div>
  )
}
