import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { ResumeMetadata } from '@/types/resume'
import {
  FileCheck,
  Calendar,
  HardDrive,
  Clock,
  Sparkles,
  UploadCloud,
  Trash2,
  AlertTriangle,
  FileType,
} from 'lucide-react'

interface CurrentResumeCardProps {
  resume: ResumeMetadata
  onAnalyze: () => Promise<void>
  onReplaceClick: () => void
  onDelete: () => Promise<void>
  isAnalyzing: boolean
  isDeleting: boolean
}

export function CurrentResumeCard({
  resume,
  onAnalyze,
  onReplaceClick,
  onDelete,
  isAnalyzing,
  isDeleting,
}: CurrentResumeCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'PROCESSED':
        return <Badge variant="success" size="sm">Analysis Complete</Badge>
      case 'PROCESSING':
        return <Badge variant="primary" size="sm" className="animate-pulse">Analyzing...</Badge>
      case 'FAILED':
        return <Badge variant="danger" size="sm">Analysis Failed</Badge>
      case 'NOT_ANALYZED':
      case 'PENDING':
      default:
        return <Badge variant="warning" size="sm">Ready for Analysis</Badge>
    }
  }

  const uploadDate = resume.uploadedAt || resume.lastUploadedAt || resume.createdAt

  return (
    <>
      <Card className="p-6 border-primary/20 bg-surface">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
          {/* File Information */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <FileCheck className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  {resume.originalFileName || resume.fileName}
                </h3>
                <Badge variant="primary" size="sm">
                  v{resume.version} Active
                </Badge>
                {getStatusBadge(resume.analysisStatus)}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-foreground-muted mt-1.5">
                <span className="flex items-center gap-1">
                  <FileType className="w-3.5 h-3.5" />
                  {resume.fileType?.includes('word') || resume.fileName.endsWith('.docx') ? 'DOCX Document' : 'PDF Document'}
                </span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5" />
                  {formatFileSize(resume.fileSize)}
                </span>
                {uploadDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Uploaded {new Date(uploadDate).toLocaleDateString()}
                  </span>
                )}
                {resume.lastAnalyzedAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Analyzed {new Date(resume.lastAnalyzedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="gradient"
              size="sm"
              onClick={onAnalyze}
              isLoading={isAnalyzing}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              {resume.analysisStatus === 'COMPLETED' ? 'Re-Analyze Resume' : 'Analyze Resume with AI'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onReplaceClick}
              disabled={isAnalyzing || isDeleting}
              leftIcon={<UploadCloud className="w-4 h-4" />}
            >
              Upload New Version
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isAnalyzing || isDeleting}
              className="text-danger hover:bg-danger/10 hover:text-danger"
              title="Delete current resume"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="max-w-md w-full p-6 border-danger/30 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-danger/10 border border-danger/20 text-danger flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-foreground text-center font-display">
              Delete Resume & AI Analysis?
            </h3>
            <p className="text-xs text-foreground-muted text-center mt-2 leading-relaxed">
              This action will permanently delete this resume document (v{resume.version}) and all associated AI feedback records from your Digital Twin.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={async () => {
                  await onDelete()
                  setShowDeleteConfirm(false)
                }}
                isLoading={isDeleting}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Confirm Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
