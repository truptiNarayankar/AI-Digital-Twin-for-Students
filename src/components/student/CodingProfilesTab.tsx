import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Code2,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Award,
  Trophy,
  AlertCircle,
  X,
} from 'lucide-react'
import { studentService } from '@/services/student.service'
import type { CodingProfile, CodingPlatform } from '@/types/student'

interface CodingProfilesTabProps {
  profiles: CodingProfile[]
  onProfilesUpdated: () => void
}

const PLATFORM_COLORS: Record<CodingPlatform, { bg: string; text: string; border: string }> = {
  LEETCODE: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
  CODECHEF: { bg: 'bg-amber-700/10', text: 'text-amber-600', border: 'border-amber-700/30' },
  CODEFORCES: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30' },
  HACKERRANK: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30' },
  GEEKSFORGEEKS: { bg: 'bg-green-600/10', text: 'text-green-600', border: 'border-green-600/30' },
  GITHUB: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  OTHER: { bg: 'bg-surface-raised', text: 'text-foreground', border: 'border-border' },
}

export function CodingProfilesTab({ profiles, onProfilesUpdated }: CodingProfilesTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<CodingProfile | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Form states
  const [platform, setPlatform] = useState<CodingPlatform>('LEETCODE')
  const [handle, setHandle] = useState('')
  const [profileUrl, setProfileUrl] = useState('')
  const [rating, setRating] = useState('')
  const [ranking, setRanking] = useState('')
  const [problemsSolved, setProblemsSolved] = useState('')
  const [easy, setEasy] = useState('0')
  const [medium, setMedium] = useState('0')
  const [hard, setHard] = useState('0')
  const [contestCount, setContestCount] = useState('0')

  const openAddModal = () => {
    setEditingProfile(null)
    setPlatform('LEETCODE')
    setHandle('')
    setProfileUrl('')
    setRating('')
    setRanking('')
    setProblemsSolved('')
    setEasy('0')
    setMedium('0')
    setHard('0')
    setContestCount('0')
    setFeedback(null)
    setIsModalOpen(true)
  }

  const openEditModal = (p: CodingProfile) => {
    setEditingProfile(p)
    setPlatform(p.platform)
    setHandle(p.handle)
    setProfileUrl(p.profileUrl)
    setRating(p.rating !== undefined ? String(p.rating) : '')
    setRanking(p.ranking !== undefined ? String(p.ranking) : '')
    setProblemsSolved(String(p.problemsSolved))
    setEasy(String(p.breakdown?.easy || 0))
    setMedium(String(p.breakdown?.medium || 0))
    setHard(String(p.breakdown?.hard || 0))
    setContestCount(String(p.contestCount || 0))
    setFeedback(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!handle.trim() || !profileUrl.trim()) return

    setIsSubmitting(true)
    setFeedback(null)

    const parsedEasy = parseInt(easy, 10) || 0
    const parsedMedium = parseInt(medium, 10) || 0
    const parsedHard = parseInt(hard, 10) || 0
    const sumProblems = parsedEasy + parsedMedium + parsedHard
    const totalProblems = problemsSolved ? parseInt(problemsSolved, 10) : sumProblems

    try {
      if (editingProfile) {
        await studentService.updateCodingProfile(editingProfile._id, {
          handle: handle.trim(),
          profileUrl: profileUrl.trim(),
          rating: rating ? parseFloat(rating) : undefined,
          ranking: ranking ? parseInt(ranking, 10) : undefined,
          problemsSolved: totalProblems,
          breakdown: { easy: parsedEasy, medium: parsedMedium, hard: parsedHard },
          contestCount: parseInt(contestCount, 10) || 0,
        })
      } else {
        await studentService.createCodingProfile({
          platform,
          handle: handle.trim(),
          profileUrl: profileUrl.trim(),
          rating: rating ? parseFloat(rating) : undefined,
          ranking: ranking ? parseInt(ranking, 10) : undefined,
          problemsSolved: totalProblems,
          breakdown: { easy: parsedEasy, medium: parsedMedium, hard: parsedHard },
          contestCount: parseInt(contestCount, 10) || 0,
          isManual: true,
        })
      }

      setIsModalOpen(false)
      onProfilesUpdated()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save coding profile'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, plat: string) => {
    if (!window.confirm(`Delete ${plat} profile?`)) return
    try {
      await studentService.deleteCodingProfile(id)
      onProfilesUpdated()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete profile')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-h3 font-bold text-foreground font-display flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            Competitive Programming & Coding Profiles
          </h2>
          <p className="text-body-sm text-foreground-muted mt-1">
            Connect problem solving profiles across LeetCode, CodeChef, Codeforces, and HackerRank.
          </p>
        </div>

        <Button
          variant="gradient"
          size="sm"
          onClick={openAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Link Coding Profile
        </Button>
      </div>

      {/* Profiles Grid */}
      {profiles.length === 0 ? (
        <Card className="p-12 text-center">
          <Code2 className="w-12 h-12 text-foreground-muted mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground">No Coding Platforms Linked</h3>
          <p className="text-body-sm text-foreground-muted max-w-md mx-auto mt-1 mb-6">
            Link your LeetCode, Codeforces, or HackerRank accounts to showcase algorithms and data structure proficiency.
          </p>
          <Button variant="outline" size="sm" onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
            Link LeetCode Account
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => {
            const colors = PLATFORM_COLORS[profile.platform] || PLATFORM_COLORS.OTHER
            const total = profile.problemsSolved || (profile.breakdown?.easy || 0) + (profile.breakdown?.medium || 0) + (profile.breakdown?.hard || 0)
            const easyPct = total > 0 ? ((profile.breakdown?.easy || 0) / total) * 100 : 0
            const medPct = total > 0 ? ((profile.breakdown?.medium || 0) / total) * 100 : 0
            const hardPct = total > 0 ? ((profile.breakdown?.hard || 0) / total) * 100 : 0

            return (
              <Card key={profile._id} className="p-5 flex flex-col justify-between hover:border-primary/40 transition-all">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
                        {profile.platform}
                      </div>
                      {profile.isManual && (
                        <span className="text-[10px] text-foreground-muted bg-surface-raised px-1.5 py-0.5 rounded border border-border">
                          Manual Tracking
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <a
                        href={profile.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded text-foreground-muted hover:text-primary hover:bg-surface-raised"
                        title="Open external profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => openEditModal(profile)}
                        className="p-1 rounded text-foreground-muted hover:text-foreground hover:bg-surface-raised"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(profile._id, profile.platform)}
                        className="p-1 rounded text-foreground-muted hover:text-danger hover:bg-surface-raised"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-foreground font-mono">
                    @{profile.handle}
                  </h4>

                  {/* Rating / Ranking telemetry */}
                  <div className="grid grid-cols-2 gap-2 my-4">
                    <div className="p-2.5 rounded-xl bg-surface-raised border border-border">
                      <div className="flex items-center gap-1 text-[11px] text-foreground-muted">
                        <Trophy className="w-3 h-3 text-amber-500" />
                        Contest Rating
                      </div>
                      <div className="text-sm font-bold text-foreground mt-0.5">
                        {profile.rating !== undefined ? Math.round(profile.rating) : '—'}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-surface-raised border border-border">
                      <div className="flex items-center gap-1 text-[11px] text-foreground-muted">
                        <Award className="w-3 h-3 text-secondary" />
                        Global Ranking
                      </div>
                      <div className="text-sm font-bold text-foreground mt-0.5">
                        {profile.ranking ? `#${profile.ranking.toLocaleString()}` : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Problem Solving Breakdown */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground-muted">Problems Solved</span>
                      <span className="font-bold text-foreground">{total}</span>
                    </div>

                    {/* Multi-segment progress bar */}
                    <div className="w-full h-2 rounded-full bg-surface-raised overflow-hidden flex border border-border">
                      <div style={{ width: `${easyPct}%` }} className="bg-emerald-500 h-full" title="Easy" />
                      <div style={{ width: `${medPct}%` }} className="bg-amber-500 h-full" title="Medium" />
                      <div style={{ width: `${hardPct}%` }} className="bg-rose-500 h-full" title="Hard" />
                    </div>

                    <div className="flex justify-between text-[10px] text-foreground-muted pt-0.5 font-medium">
                      <span className="text-emerald-500">Easy: {profile.breakdown?.easy || 0}</span>
                      <span className="text-amber-500">Med: {profile.breakdown?.medium || 0}</span>
                      <span className="text-rose-500">Hard: {profile.breakdown?.hard || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-border text-[11px] text-foreground-muted flex justify-between">
                  <span>Contests: {profile.contestCount || 0}</span>
                  <span className="font-mono">
                    {profile.lastSyncedAt ? new Date(profile.lastSyncedAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
              <h3 className="text-h3 font-bold text-foreground font-display flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                {editingProfile ? `Edit ${editingProfile.platform} Profile` : 'Link Coding Platform'}
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
                  Platform *
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as CodingPlatform)}
                  disabled={!!editingProfile}
                  className="w-full h-10 px-3 rounded-xl bg-surface-raised border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                >
                  <option value="LEETCODE">LeetCode</option>
                  <option value="CODECHEF">CodeChef</option>
                  <option value="CODEFORCES">Codeforces</option>
                  <option value="HACKERRANK">HackerRank</option>
                  <option value="GEEKSFORGEEKS">GeeksforGeeks</option>
                  <option value="GITHUB">GitHub</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">
                  Username / Handle *
                </label>
                <Input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. touriste_99"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">
                  Profile URL *
                </label>
                <Input
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="https://leetcode.com/u/..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Rating
                  </label>
                  <Input
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="e.g. 1850"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Global Ranking
                  </label>
                  <Input
                    type="number"
                    value={ranking}
                    onChange={(e) => setRanking(e.target.value)}
                    placeholder="e.g. 45000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-emerald-500 mb-1">
                    Easy Solved
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={easy}
                    onChange={(e) => setEasy(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-amber-500 mb-1">
                    Medium Solved
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-rose-500 mb-1">
                    Hard Solved
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={hard}
                    onChange={(e) => setHard(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-muted mb-1">
                  Contests Participated
                </label>
                <Input
                  type="number"
                  min={0}
                  value={contestCount}
                  onChange={(e) => setContestCount(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" size="sm" isLoading={isSubmitting}>
                  {editingProfile ? 'Save Changes' : 'Link Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
