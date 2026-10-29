import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit2,
  GitBranch,
  ExternalLink,
  Users,
  AlertCircle,
  X,
} from 'lucide-react'
import { studentService } from '@/services/student.service'
import type { Project, ProjectType, ProjectStatus } from '@/types/student'

interface ProjectsTabProps {
  projects: Project[]
  onProjectsUpdated: () => void
}

export function ProjectsTab({ projects, onProjectsUpdated }: ProjectsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [techString, setTechString] = useState('')
  const [projectType, setProjectType] = useState<ProjectType>('PERSONAL')
  const [status, setStatus] = useState<ProjectStatus>('COMPLETED')
  const [githubUrl, setGithubUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [teamSize, setTeamSize] = useState('1')
  const [highlightsString, setHighlightsString] = useState('')

  const openAddModal = () => {
    setEditingProject(null)
    setTitle('')
    setDescription('')
    setTechString('')
    setProjectType('PERSONAL')
    setStatus('COMPLETED')
    setGithubUrl('')
    setLiveUrl('')
    setTeamSize('1')
    setHighlightsString('')
    setFeedback(null)
    setIsModalOpen(true)
  }

  const openEditModal = (p: Project) => {
    setEditingProject(p)
    setTitle(p.title)
    setDescription(p.description)
    setTechString(p.technologies?.join(', ') || '')
    setProjectType(p.projectType)
    setStatus(p.status)
    setGithubUrl(p.githubUrl || '')
    setLiveUrl(p.liveUrl || '')
    setTeamSize(String(p.teamSize || 1))
    setHighlightsString(p.highlights?.join('\n') || '')
    setFeedback(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setIsSubmitting(true)
    setFeedback(null)

    const technologies = techString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const highlights = highlightsString
      .split('\n')
      .map((h) => h.trim())
      .filter((h) => h.length > 0)

    try {
      if (editingProject) {
        await studentService.updateProject(editingProject._id, {
          title: title.trim(),
          description: description.trim(),
          technologies,
          projectType,
          status,
          githubUrl: githubUrl.trim() || undefined,
          liveUrl: liveUrl.trim() || undefined,
          teamSize: parseInt(teamSize, 10) || 1,
          highlights,
        })
      } else {
        await studentService.createProject({
          title: title.trim(),
          description: description.trim(),
          technologies,
          projectType,
          status,
          githubUrl: githubUrl.trim() || undefined,
          liveUrl: liveUrl.trim() || undefined,
          teamSize: parseInt(teamSize, 10) || 1,
          highlights,
        })
      }

      setIsModalOpen(false)
      onProjectsUpdated()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save project'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, projectTitle: string) => {
    if (!window.confirm(`Delete project "${projectTitle}"?`)) return
    try {
      await studentService.deleteProject(id)
      onProjectsUpdated()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete project')
    }
  }

  const getStatusBadge = (s: ProjectStatus) => {
    switch (s) {
      case 'COMPLETED':
        return <Badge variant="success" size="sm">Completed</Badge>
      case 'IN_PROGRESS':
        return <Badge variant="primary" size="sm">In Progress</Badge>
      default:
        return <Badge variant="outline" size="sm">Archived</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-h3 font-bold text-foreground font-display flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-primary" />
            Project Portfolio & Engineering Artefacts
          </h2>
          <p className="text-body-sm text-foreground-muted mt-1">
            Showcase real-world implementations, open-source repositories, and system engineering artifacts.
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          onClick={openAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Project
        </Button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderKanban className="w-12 h-12 text-foreground-muted mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground">No Projects Showcased</h3>
          <p className="text-body-sm text-foreground-muted max-w-md mx-auto mt-1 mb-6">
            Add fullstack, AI/ML, or systems projects with live URLs to demonstrate engineering depth.
          </p>
          <Button variant="outline" size="sm" onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
            Add First Project
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project._id} className="p-5 flex flex-col justify-between hover:border-primary/40 transition-all">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" size="sm">
                      {project.projectType}
                    </Badge>
                    {getStatusBadge(project.status)}
                    {project.teamSize > 1 && (
                      <span className="flex items-center gap-1 text-[11px] text-foreground-muted">
                        <Users className="w-3 h-3" />
                        Team of {project.teamSize}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface-raised"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id, project.title)}
                      className="p-1 rounded text-foreground-muted hover:text-danger hover:bg-surface-raised"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-foreground mb-2 font-display">
                  {project.title}
                </h4>

                <p className="text-body-sm text-foreground-muted line-clamp-3 mb-4">
                  {project.description}
                </p>

                {/* Tech Badges */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg text-xs font-mono bg-surface-raised text-foreground-muted border border-border"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Highlights if any */}
                {project.highlights && project.highlights.length > 0 && (
                  <ul className="space-y-1 text-xs text-foreground-muted mb-4 list-disc list-inside">
                    {project.highlights.slice(0, 3).map((h, idx) => (
                      <li key={idx} className="truncate">{h}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Links Footer */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-foreground hover:text-primary transition-colors"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      Repository
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live Demo
                    </a>
                  )}
                </div>

                <span className="text-[11px] text-foreground-muted">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
              <h3 className="text-h3 font-bold text-foreground font-display flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-primary" />
                {editingProject ? 'Edit Project' : 'Add Engineering Project'}
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
                  Project Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Engine"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain architecture, purpose, and key technical decisions..."
                  className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-sm text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Project Type *
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as ProjectType)}
                    className="w-full h-10 px-3 rounded-xl bg-surface-raised border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="PERSONAL">Personal Project</option>
                    <option value="ACADEMIC">Academic / Capstone</option>
                    <option value="INTERNSHIP">Internship Experience</option>
                    <option value="HACKATHON">Hackathon Submission</option>
                    <option value="OPEN_SOURCE">Open Source Contribution</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Development Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    className="w-full h-10 px-3 rounded-xl bg-surface-raised border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="COMPLETED">Completed</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">
                  Technologies Used (Comma-separated)
                </label>
                <Input
                  value={techString}
                  onChange={(e) => setTechString(e.target.value)}
                  placeholder="React, TypeScript, Node.js, Redis, MongoDB"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    GitHub Repository Link
                  </label>
                  <Input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Live Demo Link
                  </label>
                  <Input
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://myproject.vercel.app"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Team Size
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">
                  Bullet Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={highlightsString}
                  onChange={(e) => setHighlightsString(e.target.value)}
                  placeholder="- Designed fault-tolerant replication algorithm&#10;- Benchmarked 10k req/sec throughput"
                  className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" size="sm" isLoading={isSubmitting}>
                  {editingProject ? 'Save Changes' : 'Publish Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
