import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  X,
  Code,
  Layers,
  Database,
  Wrench,
  Lightbulb,
  HeartHandshake,
} from 'lucide-react'
import { studentService } from '@/services/student.service'
import type { Skill, SkillCategory, SkillProficiency } from '@/types/student'

interface SkillsTabProps {
  skills: Skill[]
  onSkillsUpdated: () => void
}

const CATEGORY_ICONS: Record<SkillCategory, React.ReactNode> = {
  LANGUAGES: <Code className="w-3.5 h-3.5 text-primary" />,
  FRAMEWORKS: <Layers className="w-3.5 h-3.5 text-secondary" />,
  DATABASES: <Database className="w-3.5 h-3.5 text-accent" />,
  TOOLS: <Wrench className="w-3.5 h-3.5 text-warning" />,
  CONCEPTS: <Lightbulb className="w-3.5 h-3.5 text-info" />,
  SOFT_SKILLS: <HeartHandshake className="w-3.5 h-3.5 text-success" />,
  OTHER: <Sparkles className="w-3.5 h-3.5 text-foreground-muted" />,
}

export function SkillsTab({ skills, onSkillsUpdated }: SkillsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [category, setCategory] = useState<SkillCategory>('LANGUAGES')
  const [proficiency, setProficiency] = useState<SkillProficiency>('INTERMEDIATE')

  const categories: { label: string; value: string }[] = [
    { label: 'All Categories', value: 'ALL' },
    { label: 'Languages', value: 'LANGUAGES' },
    { label: 'Frameworks', value: 'FRAMEWORKS' },
    { label: 'Databases', value: 'DATABASES' },
    { label: 'Tools', value: 'TOOLS' },
    { label: 'Core Concepts', value: 'CONCEPTS' },
    { label: 'Soft Skills', value: 'SOFT_SKILLS' },
    { label: 'Other', value: 'OTHER' },
  ]

  const openAddModal = () => {
    setEditingSkill(null)
    setName('')
    setCategory('LANGUAGES')
    setProficiency('INTERMEDIATE')
    setFeedback(null)
    setIsModalOpen(true)
  }

  const openEditModal = (s: Skill) => {
    setEditingSkill(s)
    setName(s.name)
    setCategory(s.category)
    setProficiency(s.proficiency)
    setFeedback(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    setFeedback(null)

    try {
      if (editingSkill) {
        await studentService.updateSkill(editingSkill._id, {
          name: name.trim(),
          category,
          proficiency,
        })
      } else {
        await studentService.createSkill({
          name: name.trim(),
          category,
          proficiency,
        })
      }

      setIsModalOpen(false)
      onSkillsUpdated()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save skill'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, skillName: string) => {
    if (!window.confirm(`Delete skill "${skillName}"?`)) return
    try {
      await studentService.deleteSkill(id)
      onSkillsUpdated()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete skill')
    }
  }

  const filteredSkills =
    selectedCategory === 'ALL'
      ? skills
      : skills.filter((s) => s.category === selectedCategory)

  const getProficiencyBadge = (prof: SkillProficiency) => {
    switch (prof) {
      case 'EXPERT':
        return <Badge variant="success" size="sm">Expert</Badge>
      case 'ADVANCED':
        return <Badge variant="primary" size="sm">Advanced</Badge>
      case 'INTERMEDIATE':
        return <Badge variant="secondary" size="sm">Intermediate</Badge>
      default:
        return <Badge variant="outline" size="sm">Beginner</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-h3 font-bold text-foreground font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Skills & Competency Matrix
          </h2>
          <p className="text-body-sm text-foreground-muted mt-1">
            Verified technical competencies, frameworks, databases, and proficiency telemetry.
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          onClick={openAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Technical Skill
        </Button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 pb-1">
        {categories.map((c) => {
          const count = c.value === 'ALL' ? skills.length : skills.filter((s) => s.category === c.value).length
          const isActive = selectedCategory === c.value
          return (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-glow-primary'
                  : 'bg-surface border-border text-foreground-muted hover:text-foreground hover:bg-surface-raised'
              }`}
            >
              {c.label}
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20' : 'bg-surface-raised'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <Card className="p-12 text-center">
          <Sparkles className="w-12 h-12 text-foreground-muted mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground">No Skills in this Category</h3>
          <p className="text-body-sm text-foreground-muted max-w-md mx-auto mt-1 mb-6">
            Add your primary programming languages, libraries, and tools to enrich your Twin profile.
          </p>
          <Button variant="outline" size="sm" onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
            Add Skill
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <Card key={skill._id} className="p-4 hover:border-primary/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {CATEGORY_ICONS[skill.category]}
                    <span className="text-xs font-medium text-foreground-muted">
                      {skill.category.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(skill)}
                      aria-label="Edit skill"
                      className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface-raised"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id, skill.name)}
                      aria-label="Delete skill"
                      className="p-1 rounded text-foreground-muted hover:text-danger hover:bg-surface-raised"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-base font-bold text-foreground mb-3 font-display">
                  {skill.name}
                </h4>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                {getProficiencyBadge(skill.proficiency)}
                <span className="text-[10px] text-foreground-muted font-mono uppercase">
                  {skill.source}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
              <h3 className="text-h3 font-bold text-foreground font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {editingSkill ? 'Edit Skill' : 'Add Technical Skill'}
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
                  Skill Name *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. TypeScript, React, Docker, Kubernetes"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SkillCategory)}
                  className="w-full h-10 px-3 rounded-xl bg-surface-raised border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                >
                  <option value="LANGUAGES">Languages</option>
                  <option value="FRAMEWORKS">Frameworks & Libraries</option>
                  <option value="DATABASES">Databases & Storage</option>
                  <option value="TOOLS">Tools & DevOps</option>
                  <option value="CONCEPTS">Core CS Concepts</option>
                  <option value="SOFT_SKILLS">Soft Skills</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">
                  Proficiency Level *
                </label>
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value as SkillProficiency)}
                  className="w-full h-10 px-3 rounded-xl bg-surface-raised border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                >
                  <option value="BEGINNER">Beginner (Foundational)</option>
                  <option value="INTERMEDIATE">Intermediate (Hands-on)</option>
                  <option value="ADVANCED">Advanced (Production Experience)</option>
                  <option value="EXPERT">Expert (Specialist / Architecture)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" size="sm" isLoading={isSubmitting}>
                  {editingSkill ? 'Save Changes' : 'Add Skill'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
