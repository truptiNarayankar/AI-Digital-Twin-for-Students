import { useState, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Calendar,
  HardDrive,
  Sparkles,
  AlertCircle,
  FileCheck,
  Clock,
} from 'lucide-react'
import { studentService } from '@/services/student.service'
import type { ResumeMetadata } from '@/types/student'

interface ResumeTabProps {
  resume: ResumeMetadata | null
  onResumeUpdated: () => void
}

export function ResumeTab({ resume, onResumeUpdated }: ResumeTabProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.pdf') && file.type !== 'application/pdf') {
      setFeedback({ type: 'error', message: 'Only PDF resume documents are currently supported.' })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'File size exceeds maximum limit of 10MB.' })
      return
    }

    setIsUploading(true)
    setFeedback(null)

    try {
      // In Phase 5, file storage metadata is saved to MongoDB
      await studentService.uploadResumeMetadata({
        originalFileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/pdf',
        storageUrl: `https://storage.digitaltwin.edu/resumes/${encodeURIComponent(file.name)}`,
      })

      setFeedback({
        type: 'success',
        message: `Resume "${file.name}" uploaded and registered into your Digital Twin records!`,
      })
      onResumeUpdated()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register resume'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-h3 font-bold text-foreground font-display flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Master Resume & Document Foundation
        </h2>
        <p className="text-body-sm text-foreground-muted mt-1">
          Store and version your canonical PDF resume for placement drives and digital twin indexing.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            feedback.type === 'success'
              ? 'bg-success/10 border-success/30 text-success'
              : 'bg-danger/10 border-danger/30 text-danger'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Active Resume Card */}
      {resume ? (
        <Card className="p-6 border-primary/30 bg-surface">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <FileCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    {resume.originalFileName}
                  </h3>
                  <Badge variant="success" size="sm">
                    v{resume.version} Active
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground-muted mt-1">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5" />
                    {formatFileSize(resume.fileSize)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Uploaded on {new Date(resume.uploadedAt || resume.lastUploadedAt || resume.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Status: {resume.analysisStatus}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                isLoading={isUploading}
                leftIcon={<UploadCloud className="w-4 h-4" />}
              >
                Upload New Version
              </Button>
            </div>
          </div>

          {/* AI Notice for Phase 6 */}
          <div className="mt-6 rounded-xl bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent border border-primary/20 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  AI Resume Analysis (Phase 6 Preview)
                </h4>
                <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
                  In Phase 6, our Gemini multimodal engine will perform semantic parsing of this document:
                  extracting quantified achievements, scoring ATS readability, detecting missing keywords,
                  and synchronizing skills directly into your Digital Twin.
                </p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        /* Upload Area */
        <Card className="p-10 text-center border-dashed border-2 hover:border-primary/50 transition-colors">
          <UploadCloud className="w-14 h-14 text-foreground-muted mx-auto mb-3" />
          <h3 className="text-lg font-bold text-foreground font-display">
            Upload Master PDF Resume
          </h3>
          <p className="text-body-sm text-foreground-muted max-w-md mx-auto mt-1 mb-6">
            Upload your latest 1-page or 2-page PDF resume. We index file parameters to complete your profile foundation.
          </p>

          <Button
            variant="gradient"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
            leftIcon={<UploadCloud className="w-4 h-4" />}
          >
            Select PDF Document
          </Button>

          <p className="text-[11px] text-foreground-muted mt-3">
            Supported format: PDF up to 10MB
          </p>
        </Card>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  )
}
