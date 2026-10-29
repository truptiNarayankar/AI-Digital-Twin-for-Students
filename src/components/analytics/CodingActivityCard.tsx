import { Code2, ExternalLink, Trophy, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { CodingAnalytics, CodingPlatformStat } from '@/types/analytics'

interface CodingActivityCardProps {
  data: CodingAnalytics
}

const PLATFORM_COLORS: Record<string, string> = {
  LEETCODE: 'text-warning bg-warning/10 border-warning/20',
  CODECHEF: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  CODEFORCES: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  HACKERRANK: 'text-success bg-success/10 border-success/20',
  GEEKSFORGEEKS: 'text-green-400 bg-green-400/10 border-green-400/20',
  GITHUB: 'text-foreground bg-surface-raised border-border',
  OTHER: 'text-foreground-muted bg-surface-raised border-border',
}

const PLATFORM_LABELS: Record<string, string> = {
  LEETCODE: 'LeetCode',
  CODECHEF: 'CodeChef',
  CODEFORCES: 'Codeforces',
  HACKERRANK: 'HackerRank',
  GEEKSFORGEEKS: 'GeeksforGeeks',
  GITHUB: 'GitHub',
  OTHER: 'Other',
}

function PlatformCard({ platform, index }: { platform: CodingPlatformStat; index: number }) {
  const colorClass = PLATFORM_COLORS[platform.platform] || PLATFORM_COLORS.OTHER
  const label = PLATFORM_LABELS[platform.platform] || platform.platform

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="rounded-xl border bg-surface-raised/50 p-3.5 space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className={cn('text-xs font-bold px-2 py-0.5 rounded-md border', colorClass)}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          {platform.isManual && (
            <Badge variant="muted" size="sm">
              Manual
            </Badge>
          )}
          {platform.profileUrl && (
            <a
              href={platform.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-subtle hover:text-primary transition-colors"
              aria-label={`View ${label} profile`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-foreground-muted">@{platform.username}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-foreground-muted">Problems</p>
          <p className="font-bold text-foreground text-sm">{platform.problemsSolved}</p>
        </div>
        <div>
          <p className="text-foreground-muted">Contests</p>
          <p className="font-bold text-foreground text-sm">{platform.contestsParticipated}</p>
        </div>
        {platform.easySolved > 0 && (
          <div>
            <p className="text-success text-xs">Easy: {platform.easySolved}</p>
          </div>
        )}
        {platform.mediumSolved > 0 && (
          <div>
            <p className="text-warning text-xs">Medium: {platform.mediumSolved}</p>
          </div>
        )}
        {platform.hardSolved > 0 && (
          <div>
            <p className="text-danger text-xs">Hard: {platform.hardSolved}</p>
          </div>
        )}
        {platform.highestRating != null && (
          <div>
            <p className="text-foreground-muted">Best Rating</p>
            <p className="font-bold text-primary text-sm">{platform.highestRating}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function CodingActivityCard({ data }: CodingActivityCardProps) {
  if (!data.hasData) {
    return (
      <Card variant="default" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Code2 className="w-5 h-5 text-accent" />
          <h3 className="text-base font-bold text-foreground font-display">Coding Activity</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-surface-raised flex items-center justify-center">
            <Code2 className="w-7 h-7 text-foreground-subtle" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No coding profiles linked yet.</p>
            <p className="text-xs text-foreground-muted mt-1 mb-3">
              Add your LeetCode, Codeforces, or other profiles to track coding activity.
            </p>
            <Link to="/student/coding">
              <Button variant="outline" size="sm">
                Add Coding Profile
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  const summaryStats = [
    {
      label: 'Platforms',
      value: data.totalPlatforms,
      icon: Code2,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'Problems Solved',
      value: data.totalProblemsSolved,
      icon: Zap,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Contests',
      value: data.totalContests,
      icon: Trophy,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    ...(data.highestRating != null
      ? [
          {
            label: 'Best Rating',
            value: data.highestRating,
            icon: Trophy,
            color: 'text-secondary',
            bg: 'bg-secondary/10',
          },
        ]
      : []),
  ]

  return (
    <Card variant="default" className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground font-display">Coding Activity</h3>
            <p className="text-xs text-foreground-muted">
              {data.totalPlatforms} platform{data.totalPlatforms !== 1 ? 's' : ''} linked
            </p>
          </div>
        </div>
        <Badge variant="accent" size="sm">
          {data.totalProblemsSolved} solved
        </Badge>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {summaryStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={cn(
                'rounded-xl p-3 flex flex-col items-center gap-1 text-center',
                stat.bg
              )}
            >
              <Icon className={cn('w-4 h-4', stat.color)} />
              <span className={cn('text-lg font-bold font-display', stat.color)}>
                {stat.value}
              </span>
              <span className="text-xs text-foreground-muted leading-tight">{stat.label}</span>
            </div>
          )
        })}
      </div>

      {/* Per-platform breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
          Platform Breakdown
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.platforms.map((platform, i) => (
            <PlatformCard key={platform.platform} platform={platform} index={i} />
          ))}
        </div>
      </div>

      {data.platforms.some((p) => p.isManual) && (
        <p className="text-xs text-foreground-subtle mt-4">
          * Manually entered data — values reflect what was submitted, not live platform stats.
        </p>
      )}
    </Card>
  )
}
