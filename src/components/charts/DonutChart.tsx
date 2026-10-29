import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { ChartDataPoint } from '@/types'
import { DEMO_SKILL_DISTRIBUTION } from '@/constants'

interface DonutChartProps {
  data?: ChartDataPoint[]
  className?: string
  colors?: string[]
}

const DEFAULT_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--warning))',
]

export function DonutChart({
  data = DEMO_SKILL_DISTRIBUTION,
  className,
  colors = DEFAULT_COLORS,
}: DonutChartProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', minHeight: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--surface-raised))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '12px',
              fontSize: '12px',
              color: 'hsl(var(--foreground))',
            }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
