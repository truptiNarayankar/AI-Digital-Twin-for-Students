import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Activity } from 'lucide-react'
import type { PlacementDimensionScores } from '../../types/placement'

interface DimensionRadarChartProps {
  dimensionScores: PlacementDimensionScores
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: {
      dimension: string
      fullName: string
      score: number
      weight: string
    }
  }>
}

function CustomRadarTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xl border border-border/80 bg-card/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-1">
        <p className="font-bold text-foreground text-sm">{data.fullName}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Score:</span>
          <span className="font-mono font-extrabold text-primary text-sm">{data.score} / 100</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Weight:</span>
          <span className="font-mono text-muted-foreground">{data.weight}</span>
        </div>
      </div>
    )
  }
  return null
}

export function DimensionRadarChart({ dimensionScores }: DimensionRadarChartProps) {
  const chartData = [
    {
      dimension: 'Academics',
      fullName: 'Academic Performance',
      score: dimensionScores.academics,
      weight: '10%',
      fullMark: 100,
    },
    {
      dimension: 'Tech Skills',
      fullName: 'Technical Skills & Depth',
      score: dimensionScores.technicalSkills,
      weight: '15%',
      fullMark: 100,
    },
    {
      dimension: 'Coding',
      fullName: 'Coding & Problem Solving',
      score: dimensionScores.codingAbility,
      weight: '15%',
      fullMark: 100,
    },
    {
      dimension: 'Projects',
      fullName: 'Practical Project Portfolio',
      score: dimensionScores.projects,
      weight: '15%',
      fullMark: 100,
    },
    {
      dimension: 'Resume',
      fullName: 'Resume Quality & ATS Score',
      score: dimensionScores.resume,
      weight: '10%',
      fullMark: 100,
    },
    {
      dimension: 'Interview',
      fullName: 'Mock Interview Performance',
      score: dimensionScores.interviewPerformance,
      weight: '15%',
      fullMark: 100,
    },
    {
      dimension: 'Certs',
      fullName: 'Industry Certifications',
      score: dimensionScores.certifications,
      weight: '5%',
      fullMark: 100,
    },
    {
      dimension: 'Alignment',
      fullName: 'Career & Role Alignment',
      score: dimensionScores.careerAlignment,
      weight: '10%',
      fullMark: 100,
    },
    {
      dimension: 'Completeness',
      fullName: 'Profile Data Completeness',
      score: dimensionScores.profileCompleteness,
      weight: '5%',
      fullMark: 100,
    },
  ]

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 p-5 sm:p-6 backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            9-Dimension Placement Competency Radar
          </h3>
        </div>
        <span className="text-xs text-muted-foreground font-mono">Weighted Aggregation</span>
      </div>

      <div className="w-full h-[320px] sm:h-[380px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.6} />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
              stroke="hsl(var(--border))"
              strokeOpacity={0.4}
            />
            <Radar
              name="Competency"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
            />
            <Tooltip content={<CustomRadarTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary/40 border border-primary" />
          <span>Candidate Digital Twin Profile</span>
        </div>
        <span className="text-border">•</span>
        <span>Polygon center = 0 | Outer edge = 100 benchmark</span>
      </div>
    </div>
  )
}
