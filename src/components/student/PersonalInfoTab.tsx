import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Phone, Calendar, GraduationCap, Building2, BookOpen, Award, CheckCircle2, AlertCircle } from 'lucide-react'
import { studentService } from '@/services/student.service'
import type { StudentProfile } from '@/types/student'

interface PersonalInfoTabProps {
  profile: StudentProfile | null
  onProfileUpdated: (updated: StudentProfile) => void
}

export function PersonalInfoTab({ profile, onProfileUpdated }: PersonalInfoTabProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'PREFER_NOT_TO_SAY' as 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY',
    college: '',
    degree: '',
    department: '',
    batch: '',
    currentSemester: '',
    graduationYear: '',
    cgpa: '',
    bio: '',
    avatarUrl: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        phoneNumber: profile.phoneNumber || '',
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        gender: profile.gender || 'PREFER_NOT_TO_SAY',
        college: profile.college || '',
        degree: profile.degree || '',
        department: profile.department || '',
        batch: profile.batch || '',
        currentSemester: profile.currentSemester ? String(profile.currentSemester) : '',
        graduationYear: profile.graduationYear ? String(profile.graduationYear) : '',
        cgpa: profile.cgpa !== undefined && profile.cgpa !== null ? String(profile.cgpa) : '',
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || '',
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFeedback(null)

    // Validate CGPA
    let cgpaNum: number | undefined = undefined
    if (formData.cgpa) {
      cgpaNum = parseFloat(formData.cgpa)
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        setIsLoading(false)
        setFeedback({ type: 'error', message: 'CGPA must be a valid number between 0.0 and 10.0' })
        return
      }
    }

    // Validate Semester
    let semNum: number | undefined = undefined
    if (formData.currentSemester) {
      semNum = parseInt(formData.currentSemester, 10)
      if (isNaN(semNum) || semNum < 1 || semNum > 12) {
        setIsLoading(false)
        setFeedback({ type: 'error', message: 'Semester must be between 1 and 12' })
        return
      }
    }

    // Validate Graduation Year
    let gradYearNum: number | undefined = undefined
    if (formData.graduationYear) {
      gradYearNum = parseInt(formData.graduationYear, 10)
      if (isNaN(gradYearNum) || gradYearNum < 2000 || gradYearNum > 2040) {
        setIsLoading(false)
        setFeedback({ type: 'error', message: 'Graduation year must be a valid 4-digit year' })
        return
      }
    }

    try {
      const updated = await studentService.updateProfile({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender,
        college: formData.college || undefined,
        degree: formData.degree || undefined,
        department: formData.department || undefined,
        batch: formData.batch || undefined,
        currentSemester: semNum,
        graduationYear: gradYearNum,
        cgpa: cgpaNum,
        bio: formData.bio || undefined,
        avatarUrl: formData.avatarUrl || undefined,
      })

      onProfileUpdated(updated)
      setFeedback({ type: 'success', message: 'Personal profile and academic parameters saved successfully!' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-h3 font-bold text-foreground font-display">
          Personal & Academic Affiliation
        </h2>
        <p className="text-body-sm text-foreground-muted mt-1">
          Provide accurate demographic and university parameters. These form the primary vector of your Digital Twin.
        </p>
      </div>

      {feedback && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Identity */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider text-primary">
            1. Identity & Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                Full Legal Name *
              </label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                leftIcon={<User className="w-4 h-4" />}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                Phone Number
              </label>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                Date of Birth
              </label>
              <Input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                leftIcon={<Calendar className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                Gender Identity
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                aria-label="Gender Identity"
                className="w-full h-10 px-3 rounded-xl bg-surface-raised border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                Avatar / Photo URL
              </label>
              <Input
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>
        </div>

        {/* Section 2: College Affiliation */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider text-secondary">
            2. College & Academic Standing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                College / University Name
              </label>
              <Input
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. National Institute of Technology"
                leftIcon={<Building2 className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                Degree Program
              </label>
              <Input
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. B.Tech / B.E."
                leftIcon={<GraduationCap className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                Department / Branch
              </label>
              <Input
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science and Engineering"
                leftIcon={<BookOpen className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                Batch (Cohort)
              </label>
              <Input
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                placeholder="e.g. 2022 - 2026"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                Current Semester (1-12)
              </label>
              <Input
                type="number"
                min={1}
                max={12}
                name="currentSemester"
                value={formData.currentSemester}
                onChange={handleChange}
                placeholder="e.g. 6"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                Expected Graduation Year
              </label>
              <Input
                type="number"
                min={2020}
                max={2035}
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="e.g. 2026"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground-muted mb-1.5">
                Cumulative CGPA (0.00 - 10.00)
              </label>
              <Input
                type="number"
                step="0.01"
                min={0}
                max={10}
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="e.g. 8.75"
                leftIcon={<Award className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Biography */}
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider text-accent">
            3. About & Professional Bio
          </h3>
          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1.5">
              Professional Bio / Summary
            </label>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Aspiring software engineer passionate about distributed systems and cloud architecture..."
              className="w-full p-3 rounded-xl bg-surface-raised border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-y"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="submit"
            variant="gradient"
            isLoading={isLoading}
          >
            Save Personal Information
          </Button>
        </div>
      </form>
    </Card>
  )
}
