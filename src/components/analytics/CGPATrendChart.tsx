import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { TrendingUp, Link as LinkIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { AcademicAnalytics } from '@/types/analytics'

interface CGPATrendChartProps {
  data: AcademicAnalytics
}

interface TooltipPayloadItem {
  value: number
  payload: { academicYear?: string }
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null
  const item = payload[0]
  return (
    <div
      style={{
        backgroundColor: 'hsl(var(--surface-raised))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 12,
        padding: '10px 14px',
        fontSize: 12,
        color: 'hsl(var(--foreground))',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <p className="font-semibold text-foreground mb-1">Semester {label}</p>
      <p className="text-primary font-bold text-base">{item.value.toFixed(2)} CGPA</p>
      {item.payload.academicYear && (
        <p className="text-foreground-muted text-xs mt-0.5">{item.payload.academicYear}</p>
      )}
    </div>
  )
}

export function CGPATrendChart({ data }: CGPATrendChartProps) {
  const hasData = data.hasData && data.cgpaTrend.length > 0

  return (
    <Card variant="default" className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground font-display">CGPA Trend</h3>
            <p className="text-xs text-foreground-muted">Semester-by-semester progression</p>
          </div>
        </div>
        {hasData && (
          <Badge variant="muted" size="sm">
            {data.cgpaTrend.length} semesters
          </Badge>
        )}
      </div>

      {!hasData ? (
        <div className="h-52 flex flex-col items-center justify-center gap-3 text-center">
          <TrendingUp className="w-10 h-10 text-foreground-subtle" />
          <div>
            <p className="text-sm font-medium text-foreground">No academic data yet</p>
            <p className="text-xs text-foreground-muted mt-1 mb-3">
              Add your semester results to see your CGPA trend chart.
            </p>
            <Link to="/student/academics">
              <Button variant="outline" size="sm" leftIcon={<LinkIcon className="w-3 h-3" />}>
                Add Academic Record
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data.cgpaTrend}
              margin={{ top: 8, right: 16, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="cgpaGradStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border-subtle))"
                vertical={false}
              />
              <XAxis
                dataKey="semester"
                tickFormatter={(v: number) => `Sem ${v}`}
                stroke="hsl(var(--foreground-subtle))"
                tick={{ fill: 'hsl(var(--foreground-muted))', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[
                  (dataMin: number) => Math.max(0, Math.floor(dataMin - 0.5)),
                  (dataMax: number) => Math.min(10, Math.ceil(dataMax + 0.5)),
                ]}
                stroke="hsl(var(--foreground-subtle))"
                tick={{ fill: 'hsl(var(--foreground-muted))', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickCount={5}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Reference line at average */}
              {data.averageCgpa != null && (
                <ReferenceLine
                  y={data.averageCgpa}
                  stroke="hsl(var(--foreground-subtle))"
                  strokeDasharray="4 4"
                  label={{
                    value: `Avg: ${data.averageCgpa.toFixed(2)}`,
                    position: 'insideTopRight',
                    fill: 'hsl(var(--foreground-muted))',
                    fontSize: 10,
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="cgpa"
                name="CGPA"
                stroke="url(#cgpaGradStroke)"
                strokeWidth={2.5}
                dot={{
                  fill: 'hsl(var(--primary))',
                  stroke: 'hsl(var(--surface))',
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  fill: 'hsl(var(--primary))',
                  stroke: 'hsl(var(--surface))',
                  strokeWidth: 2,
                  r: 6,
                }}
                isAnimationActive
                animationDuration={800}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {hasData && (
        <p className="text-xs text-foreground-subtle mt-3">
          Data sourced from student-submitted academic records. Dashed line indicates average CGPA.
        </p>
      )}
    </Card>
  )
}
