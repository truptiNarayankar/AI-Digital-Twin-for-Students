import { motion } from 'framer-motion'
import {
  Brain,
  Sparkles,
  Activity,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { SkillRadarChart } from '@/components/charts/SkillRadarChart'
import { ReadinessChart } from '@/components/charts/ReadinessChart'
import { DEMO_PROFILE } from '@/constants'
import { SlideUp } from '@/components/animation'

export function ShowcaseSection() {
  const recentActivities = [
    { title: 'LeetCode Contest 382 Analyzed', time: '2 hours ago', score: '+18 ELO' },
    { title: 'Resume Section 3: Impact Quantified', time: 'Yesterday', score: '+6 pts' },
    { title: 'Mock Tech Interview: System Design', time: '3 days ago', score: '82% Score' },
  ]

  return (
    <section id="product" className="py-24 relative z-10 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SlideUp>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/30 text-warning text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-warning animate-ping" />
              DEMO DATA PREVIEW
            </div>
            <h2 className="text-h1 font-bold text-foreground font-display tracking-tight">
              One Profile. Your Entire <span className="text-gradient-primary">Career Journey</span>.
            </h2>
            <p className="mt-4 text-body text-foreground-muted">
              Here is how the Digital Twin synthesizes multi-dimensional data into continuous placement readiness telemetry.
            </p>
          </SlideUp>
        </div>

        {/* Dashboard Showcase Mockup Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl p-1 bg-gradient-to-b from-primary/30 via-secondary/20 to-border/40 shadow-2xl overflow-hidden"
        >
          {/* Mockup Frame Header */}
          <div className="bg-surface rounded-[22px] p-6 sm:p-8 border border-border/60">
            {/* Top Bar of the Mockup */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground font-display">
                      {DEMO_PROFILE.name}'s Digital Twin
                    </h3>
                    <Badge variant="demo" size="sm">DEMO DATA</Badge>
                  </div>
                  <p className="text-xs text-foreground-muted">
                    {DEMO_PROFILE.college} • {DEMO_PROFILE.branch} (Year 3)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="success" dot size="md">
                  Twin Health: {DEMO_PROFILE.twinHealth}% Active
                </Badge>
              </div>
            </div>

            {/* Metrics Grid inside mockup */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat 1: Placement Readiness */}
              <div className="p-4 rounded-xl bg-surface-raised border border-border flex flex-col justify-between">
                <span className="text-xs text-foreground-muted font-medium">Placement Readiness</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold text-primary font-display">{DEMO_PROFILE.placementReadiness}%</span>
                  <span className="text-xs text-success font-semibold">+12% this term</span>
                </div>
                <Progress value={DEMO_PROFILE.placementReadiness} size="sm" color="primary" className="mt-3" />
              </div>

              {/* Stat 2: Coding Performance */}
              <div className="p-4 rounded-xl bg-surface-raised border border-border flex flex-col justify-between">
                <span className="text-xs text-foreground-muted font-medium">Coding Performance</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold text-secondary font-display">{DEMO_PROFILE.codingScore}%</span>
                  <span className="text-xs text-secondary font-semibold">240+ Problems</span>
                </div>
                <Progress value={DEMO_PROFILE.codingScore} size="sm" color="secondary" className="mt-3" />
              </div>

              {/* Stat 3: Resume Strength */}
              <div className="p-4 rounded-xl bg-surface-raised border border-border flex flex-col justify-between">
                <span className="text-xs text-foreground-muted font-medium">Resume Strength</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold text-accent font-display">{DEMO_PROFILE.resumeScore}%</span>
                  <span className="text-xs text-foreground-subtle">ATS Optimized</span>
                </div>
                <Progress value={DEMO_PROFILE.resumeScore} size="sm" color="accent" className="mt-3" />
              </div>

              {/* Stat 4: Interview Performance */}
              <div className="p-4 rounded-xl bg-surface-raised border border-border flex flex-col justify-between">
                <span className="text-xs text-foreground-muted font-medium">Interview Performance</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold text-warning font-display">{DEMO_PROFILE.interviewScore}%</span>
                  <span className="text-xs text-warning font-semibold">Ready for HR</span>
                </div>
                <Progress value={DEMO_PROFILE.interviewScore} size="sm" color="warning" className="mt-3" />
              </div>
            </div>

            {/* Mid Row: Radar Chart + Readiness Gauge */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Radar Chart (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-surface-raised border border-border flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold text-foreground font-display">
                      Multi-Dimensional Competency Radar
                    </h4>
                  </div>
                  <Badge variant="muted" size="sm">6 Core Vectors</Badge>
                </div>
                <p className="text-xs text-foreground-muted mb-4">
                  Synthetic evaluation across Algorithms, Data Structures, Web, System Design, and Communication.
                </p>
                <div className="flex-1 min-h-[260px] flex items-center justify-center">
                  <SkillRadarChart />
                </div>
              </div>

              {/* Readiness & Timeline (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Readiness Gauge Card */}
                <div className="p-6 rounded-2xl bg-surface-raised border border-border flex flex-col items-center justify-center">
                  <ReadinessChart score={DEMO_PROFILE.placementReadiness} />
                </div>

                {/* Activity timeline mini card */}
                <div className="p-5 rounded-2xl bg-surface-raised border border-border flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-semibold text-foreground">Recent Twin Updates</span>
                  </div>
                  <div className="space-y-2.5">
                    {recentActivities.map((act, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
                        <div className="flex flex-col">
                          <span className="text-foreground font-medium">{act.title}</span>
                          <span className="text-[10px] text-foreground-subtle">{act.time}</span>
                        </div>
                        <span className="text-primary font-semibold text-[11px]">{act.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer Footer */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-foreground-subtle">
              <span>* Notice: Values shown represent synthetic demonstration data for Phase 2 UI prototyping.</span>
              <span className="text-primary font-medium">Model Ver: 1.0-alpha</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
