import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Target,
  Briefcase,
  Layers,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Compass,
} from 'lucide-react'
import { studentService } from '@/services/student.service'

interface CareerGoalsTabProps {
  careerGoal?: string
  preferredRoles: string[]
  preferredDomains: string[]
  onGoalsUpdated: () => void
}

const COMMON_ROLES = [
  'Full Stack Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'Machine Learning Engineer',
  'Data Scientist',
  'DevOps / SRE Engineer',
  'Cloud Architect',
  'Cybersecurity Analyst',
  'Mobile App Developer (iOS/Android)',
  'Product Manager',
]

const COMMON_DOMAINS = [
  'Artificial Intelligence & ML',
  'FinTech & Banking',
  'HealthTech & BioInformatics',
  'Enterprise SaaS',
  'E-Commerce & Retail',
  'Cybersecurity & Defense',
  'EdTech',
  'Autonomous Vehicles / Robotics',
  'Gaming & WebGL',
]

export function CareerGoalsTab({
  careerGoal = '',
  preferredRoles = [],
  preferredDomains = [],
  onGoalsUpdated,
}: CareerGoalsTabProps) {
  const [goalText, setGoalText] = useState(careerGoal)
  const [roles, setRoles] = useState<string[]>(preferredRoles)
  const [domains, setDomains] = useState<string[]>(preferredDomains)
  const [roleInput, setRoleInput] = useState('')
  const [domainInput, setDomainInput] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    setGoalText(careerGoal || '')
    setRoles(preferredRoles || [])
    setDomains(preferredDomains || [])
  }, [careerGoal, preferredRoles, preferredDomains])

  const handleAddRole = (role: string) => {
    const trimmed = role.trim()
    if (trimmed && !roles.includes(trimmed)) {
      setRoles((prev) => [...prev, trimmed])
      setRoleInput('')
    }
  }

  const handleRemoveRole = (role: string) => {
    setRoles((prev) => prev.filter((r) => r !== role))
  }

  const handleAddDomain = (domain: string) => {
    const trimmed = domain.trim()
    if (trimmed && !domains.includes(trimmed)) {
      setDomains((prev) => [...prev, trimmed])
      setDomainInput('')
    }
  }

  const handleRemoveDomain = (domain: string) => {
    setDomains((prev) => prev.filter((d) => d !== domain))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFeedback(null)

    try {
      await studentService.updateCareerGoals({
        careerGoal: goalText.trim(),
        preferredRoles: roles,
        preferredDomains: domains,
      })

      setFeedback({ type: 'success', message: 'Career aspirations and targeting parameters saved successfully!' })
      onGoalsUpdated()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save career goals'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-h3 font-bold text-foreground font-display flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Career Aspiration & Role Targeting
        </h2>
        <p className="text-body-sm text-foreground-muted mt-1">
          Specify target roles and technical domains. This guides the Digital Twin matching algorithms.
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
        {/* Long term goal text */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-primary" />
            Career Vision / Primary Objective
          </label>
          <textarea
            rows={3}
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            placeholder="e.g. Seeking high-impact software engineering roles in scalable distributed systems or AI-first product companies..."
            className="w-full p-3 rounded-xl bg-surface-raised border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Preferred Job Roles */}
        <div className="pt-4 border-t border-border">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-secondary" />
            Target Job Roles ({roles.length})
          </label>

          {/* Active chips */}
          <div className="flex flex-wrap gap-2 mb-3 min-h-[36px] p-2 rounded-xl bg-surface-raised/40 border border-border">
            {roles.length === 0 ? (
              <span className="text-xs text-foreground-muted italic self-center">
                No roles selected yet. Pick from suggestions below or type custom roles.
              </span>
            ) : (
              roles.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  {r}
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(r)}
                    className="hover:text-danger transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Role Input */}
          <div className="flex gap-2 mb-3">
            <Input
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              placeholder="Type custom role and press Enter or Add..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddRole(roleInput)
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddRole(roleInput)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add
            </Button>
          </div>

          {/* Role Suggestions */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-foreground-muted">Suggested Roles:</span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_ROLES.filter((r) => !roles.includes(r)).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleAddRole(r)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-surface-raised border border-border text-foreground-muted hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  + {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preferred Industry Domains */}
        <div className="pt-4 border-t border-border">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-accent" />
            Target Industry Domains ({domains.length})
          </label>

          {/* Active chips */}
          <div className="flex flex-wrap gap-2 mb-3 min-h-[36px] p-2 rounded-xl bg-surface-raised/40 border border-border">
            {domains.length === 0 ? (
              <span className="text-xs text-foreground-muted italic self-center">
                No domains selected yet. Select preferred sectors below.
              </span>
            ) : (
              domains.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20"
                >
                  {d}
                  <button
                    type="button"
                    onClick={() => handleRemoveDomain(d)}
                    className="hover:text-danger transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Domain Input */}
          <div className="flex gap-2 mb-3">
            <Input
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="Type custom industry domain..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddDomain(domainInput)
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddDomain(domainInput)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add
            </Button>
          </div>

          {/* Domain Suggestions */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-foreground-muted">Suggested Domains:</span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_DOMAINS.filter((d) => !domains.includes(d)).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleAddDomain(d)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-surface-raised border border-border text-foreground-muted hover:text-foreground hover:border-secondary/40 transition-colors"
                >
                  + {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button type="submit" variant="gradient" isLoading={isLoading}>
            Save Career Goals & Targeting
          </Button>
        </div>
      </form>
    </Card>
  )
}
