import { useState, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  UploadCloud,
  FileText,
  AlertCircle,
  X,
  FileCheck2,
} from 'lucide-react'

interface ResumeUploadCardProps {
  onUpload: (file: File) => Promise<void>
  isUploading: boolean
  title?: string
  subtitle?: string
}

export function ResumeUploadCard({
  onUpload,
  isUploading,
  title = 'Upload Resume Document',
  subtitle = 'Upload your latest single or multi-page resume in PDF or DOCX format for deep AI assessment.',
}: ResumeUploadCardProps) {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateAndSetFile = (file: File) => {
    setValidationError(null)

    const validExtensions = ['.pdf', '.docx']
    const hasValidExt = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    )

    if (!hasValidExt) {
      setValidationError('Only PDF (.pdf) and Word (.docx) documents are supported.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setValidationError('File size exceeds the 10 MB maximum limit.')
      return
    }

    setSelectedFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const handleUploadClick = async () => {
    if (!selectedFile) return
    try {
      await onUpload(selectedFile)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch {
      // Error handled by parent or toast
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="text-center max-w-lg mx-auto">
        <h3 className="text-lg font-bold text-foreground font-display">{title}</h3>
        <p className="text-xs text-foreground-muted mt-1 leading-relaxed">{subtitle}</p>
      </div>

      {validationError && (
        <div className="mt-4 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`mt-6 rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          dragOver
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : selectedFile
            ? 'border-primary/40 bg-surface-raised cursor-default'
            : 'border-border hover:border-primary/50 hover:bg-surface-raised/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFileChange}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground max-w-xs truncate">
                {selectedFile.name}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedFile(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="text-foreground-muted hover:text-danger p-1 rounded-md transition-colors"
                title="Remove selected file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground-muted mt-1">
              <span>{formatBytes(selectedFile.size)}</span>
              <span>•</span>
              <Badge variant="primary" size="sm">
                Ready to Process
              </Badge>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button
                variant="gradient"
                size="md"
                onClick={handleUploadClick}
                isLoading={isUploading}
                leftIcon={<UploadCloud className="w-4 h-4" />}
              >
                Confirm & Upload Resume
              </Button>
              <Button
                variant="ghost"
                size="md"
                disabled={isUploading}
                onClick={() => {
                  setSelectedFile(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center text-foreground-muted mb-3 group-hover:text-primary transition-colors">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              Drag & drop your resume file here, or{' '}
              <span className="text-primary underline font-medium">browse files</span>
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs text-foreground-muted">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                PDF or DOCX
              </span>
              <span>•</span>
              <span>Maximum 10 MB</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
