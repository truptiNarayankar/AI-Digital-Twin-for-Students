import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import type { SkillData } from '@/types'
import { DEMO_SKILLS } from '@/constants'

interface SkillRadarChartProps {
  data?: SkillData[]
  className?: string
  color?: string
}

export function SkillRadarChart({
  data = DEMO_SKILLS,
  className,
  color = '#818cf8',
}: SkillRadarChartProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', minHeight: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: 'hsl(var(--foreground-muted))', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Skills"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.35}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
