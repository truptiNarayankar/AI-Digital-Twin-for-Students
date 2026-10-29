import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Calendar,
  Building2,
  AlertCircle,
  X,
} from 'lucide-react'
import { studentService } from '@/services/student.service'
import type { Certification } from '@/types/student'

interface CertificationsTabProps {
  certifications: Certification[]
  onCertificationsUpdated: () => void
}

export function CertificationsTab({
  certifications,
  onCertificationsUpdated,
}: CertificationsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [issuingOrganization, setIssuingOrganization] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [credentialId, setCredentialId] = useState('')
  const [credentialUrl, setCredentialUrl] = useState('')
  const [skillsString, setSkillsString] = useState('')

  const openAddModal = () => {
    setEditingCert(null)
    setName('')
    setIssuingOrganization('')
    setIssueDate('')
    setExpiryDate('')
    setCredentialId('')
    setCredentialUrl('')
    setSkillsString('')
    setFeedback(null)
    setIsModalOpen(true)
  }

  const openEditModal = (c: Certification) => {
    setEditingCert(c)
    setName(c.name)
    setIssuingOrganization(c.issuingOrganization)
    setIssueDate(c.issueDate ? c.issueDate.split('T')[0] : '')
    setExpiryDate(c.expiryDate ? c.expiryDate.split('T')[0] : '')
    setCredentialId(c.credentialId || '')
    setCredentialUrl(c.credentialUrl || '')
    setSkillsString(c.skills?.join(', ') || '')
    setFeedback(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !issuingOrganization.trim()) return

    setIsSubmitting(true)
    setFeedback(null)

    const skills = skillsString
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    try {
      if (editingCert) {
        await studentService.updateCertification(editingCert._id, {
          name: name.trim(),
          issuingOrganization: issuingOrganization.trim(),
          issueDate: issueDate || undefined,
          expiryDate: expiryDate || undefined,
          credentialId: credentialId.trim() || undefined,
          credentialUrl: credentialUrl.trim() || undefined,
          skills,
        })
      } else {
        await studentService.createCertification({
          name: name.trim(),
          issuingOrganization: issuingOrganization.trim(),
          issueDate: issueDate || undefined,
          expiryDate: expiryDate || undefined,
          credentialId: credentialId.trim() || undefined,
          credentialUrl: credentialUrl.trim() || undefined,
          skills,
        })
      }

      setIsModalOpen(false)
      onCertificationsUpdated()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save certification'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, certName: string) => {
    if (!window.confirm(`Delete certification "${certName}"?`)) return
    try {
      await studentService.deleteCertification(id)
      onCertificationsUpdated()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete certification')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-h3 font-bold text-foreground font-display flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Certifications & Industry Credentials
          </h2>
          <p className="text-body-sm text-foreground-muted mt-1">
            Verified vendor accreditations, cloud certifications, and technical examinations.
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          onClick={openAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Certification
        </Button>
      </div>

      {/* Certifications Grid */}
      {certifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Award className="w-12 h-12 text-foreground-muted mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground">No Certifications Recorded</h3>
          <p className="text-body-sm text-foreground-muted max-w-md mx-auto mt-1 mb-6">
            Log your AWS, Google Cloud, Azure, or vendor badges to boost credibility for placement matching.
          </p>
          <Button variant="outline" size="sm" onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
            Add First Certification
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <Card key={cert._id} className="p-5 flex flex-col justify-between hover:border-primary/40 transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                    <Building2 className="w-3.5 h-3.5" />
                    {cert.issuingOrganization}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(cert)}
                      className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface-raised"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert._id, cert.name)}
                      className="p-1 rounded text-foreground-muted hover:text-danger hover:bg-surface-raised"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-base font-bold text-foreground mb-2 font-display">
                  {cert.name}
                </h4>

                {cert.credentialId && (
                  <p className="text-xs text-foreground-muted font-mono mb-3">
                    ID: {cert.credentialId}
                  </p>
                )}

                {/* Skills tags */}
                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {cert.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] bg-surface-raised text-foreground-muted border border-border"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-foreground-muted flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'Active'}
                </span>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Verify
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
              <h3 className="text-h3 font-bold text-foreground font-display flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                {editingCert ? 'Edit Certification' : 'Add Certification'}
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
              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">
                  Certificate / Exam Name *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect - Associate"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">
                  Issuing Organization *
                </label>
                <Input
                  value={issuingOrganization}
                  onChange={(e) => setIssuingOrganization(e.target.value)}
                  placeholder="e.g. Amazon Web Services (AWS)"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Issue Date
                  </label>
                  <Input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Expiry Date
                  </label>
                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">
                  Credential ID / License
                </label>
                <Input
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="e.g. AWS-8374928"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">
                  Verification URL
                </label>
                <Input
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  placeholder="https://www.credly.com/badges/..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">
                  Associated Skills (Comma-separated)
                </label>
                <Input
                  value={skillsString}
                  onChange={(e) => setSkillsString(e.target.value)}
                  placeholder="Cloud Architecture, S3, EC2, IAM"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" size="sm" isLoading={isSubmitting}>
                  {editingCert ? 'Save Changes' : 'Add Credential'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
