import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ChartDataPoint } from '@/types'
import { DEMO_PERFORMANCE_DATA } from '@/constants'

interface PerformanceLineChartProps {
  data?: ChartDataPoint[]
  className?: string
}

export function PerformanceLineChart({
  data = DEMO_PERFORMANCE_DATA,
  className,
}: PerformanceLineChartProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', minHeight: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="codingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-subtle))" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--foreground-subtle))"
            tick={{ fill: 'hsl(var(--foreground-muted))', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[40, 100]}
            stroke="hsl(var(--foreground-subtle))"
            tick={{ fill: 'hsl(var(--foreground-muted))', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--surface-raised))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '12px',
              fontSize: '12px',
              color: 'hsl(var(--foreground))',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            name="Overall Readiness"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#readinessGrad)"
          />
          <Area
            type="monotone"
            dataKey="coding"
            name="Coding Index"
            stroke="hsl(var(--secondary))"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#codingGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
