import {
  GraduationCap,
  Code2,
  Terminal,
  FolderGit2,
  FileText,
  Mic,
  Award,
  Target,
  CheckCircle2,
} from 'lucide-react'
import type { PlacementDimensionScores } from '../../types/placement'

interface PlacementDimensionCardsProps {
  dimensionScores: PlacementDimensionScores
}

interface DimensionConfig {
  key: keyof PlacementDimensionScores
  title: string
  weight: string
  icon: typeof GraduationCap
  description: string
}

export function PlacementDimensionCards({ dimensionScores }: PlacementDimensionCardsProps) {
  const dimensions: DimensionConfig[] = [
    {
      key: 'academics',
      title: 'Academics & CGPA',
      weight: '10%',
      icon: GraduationCap,
      description: 'Semester CGPA performance minus penalties for active backlogs.',
    },
    {
      key: 'technicalSkills',
      title: 'Technical Skills',
      weight: '15%',
      icon: Code2,
      description: 'Skill proficiency breadth combined with role-specific match score.',
    },
    {
      key: 'codingAbility',
      title: 'Coding & DSA',
      weight: '15%',
      icon: Terminal,
      description: 'Problems solved across LeetCode/GFG and contest ratings.',
    },
    {
      key: 'projects',
      title: 'Project Portfolio',
      weight: '15%',
      icon: FolderGit2,
      description: 'Quantity, completion status, and technology diversity in practical projects.',
    },
    {
      key: 'resume',
      title: 'Resume ATS Score',
      weight: '10%',
      icon: FileText,
      description: 'Resume content quality, structure, and keyword optimization.',
    },
    {
      key: 'interviewPerformance',
      title: 'Interview Performance',
      weight: '15%',
      icon: Mic,
      description: 'Evaluated mock interview scores and consistency across technical sessions.',
    },
    {
      key: 'certifications',
      title: 'Certifications',
      weight: '5%',
      icon: Award,
      description: 'Industry-recognized credentials verified on the digital twin.',
    },
    {
      key: 'careerAlignment',
      title: 'Career Alignment',
      weight: '10%',
      icon: Target,
      description: 'Consistency between chosen target role, skills, and goals.',
    },
    {
      key: 'profileCompleteness',
      title: 'Twin Completeness',
      weight: '5%',
      icon: CheckCircle2,
      description: 'Deterministic digital twin profile completion percentage.',
    },
  ]

  const getStatusBadge = (score: number) => {
    if (score >= 80) {
      return {
        label: 'Strong',
        textColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        barColor: 'bg-emerald-500',
      }
    }
    if (score >= 60) {
      return {
        label: 'Competent',
        textColor: 'text-cyan-400',
        badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        barColor: 'bg-cyan-500',
      }
    }
    if (score >= 40) {
      return {
        label: 'Developing',
        textColor: 'text-amber-400',
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        barColor: 'bg-amber-500',
      }
    }
    return {
      label: 'Needs Attention',
      textColor: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      barColor: 'bg-rose-500',
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Dimension Score Breakdown
          </h3>
          <p className="text-xs text-muted-foreground">
            Transparent scoring across all 9 evaluative placement vectors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dimensions.map((dim) => {
          const Icon = dim.icon
          const score = dimensionScores[dim.key] ?? 0
          const status = getStatusBadge(score)

          return (
            <div
              key={dim.key}
              className="rounded-xl border border-border/70 bg-card/50 p-4 backdrop-blur-sm hover:border-primary/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{dim.title}</h4>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Weight: {dim.weight}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.badgeBg}`}>
                    {status.label}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {dim.description}
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">Score</span>
                  <span className={`text-base font-extrabold font-mono ${status.textColor}`}>
                    {score} <span className="text-xs text-muted-foreground">/ 100</span>
                  </span>
                </div>
                <div className="w-full bg-muted/40 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`${status.barColor} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
