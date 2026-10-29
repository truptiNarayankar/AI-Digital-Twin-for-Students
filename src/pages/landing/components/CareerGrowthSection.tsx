import { motion } from 'framer-motion'
import {
  UserCheck,
  Search,
  GraduationCap,
  Code,
  TrendingUp,
  Award,
  ChevronRight,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SlideUp } from '@/components/animation'

export function CareerGrowthSection() {
  const stages = [
    {
      step: '01',
      title: 'Current Profile',
      desc: 'Baseline academic, project, and code metrics ingested.',
      icon: UserCheck,
      color: '#818cf8',
    },
    {
      step: '02',
      title: 'Skill Gaps',
      desc: 'Identified deficit zones mapped against target job criteria.',
      icon: Search,
      color: '#22d3ee',
    },
    {
      step: '03',
      title: 'Learning',
      desc: 'Personalized curriculum targeting identified deficit concepts.',
      icon: GraduationCap,
      color: '#a78bfa',
    },
    {
      step: '04',
      title: 'Practice',
      desc: 'Coding drills, system design practice, and AI mock sessions.',
      icon: Code,
      color: '#34d399',
    },
    {
      step: '05',
      title: 'Improved Performance',
      desc: 'Empirically proven metric growth across all 7 twin vectors.',
      icon: TrendingUp,
      color: '#fbbf24',
    },
    {
      step: '06',
      title: 'Placement Ready',
      desc: 'Peak readiness index for tier-1 campus recruitments.',
      icon: Award,
      color: '#f87171',
    },
  ]

  return (
    <section className="py-24 relative z-10 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SlideUp>
            <span className="text-xs uppercase font-bold tracking-widest text-success px-3 py-1 rounded-full bg-success/10 border border-success/20">
              Evolutionary Path
            </span>
            <h2 className="mt-4 text-h1 font-bold text-foreground font-display tracking-tight">
              A Dynamic Twin That <span className="text-gradient-primary">Evolves With You</span>
            </h2>
            <p className="mt-4 text-body text-foreground-muted">
              Your Digital Twin is not a static resume. It updates with every achievement, commit, and assessment,
              guiding your progression from admission to offer letter.
            </p>
          </SlideUp>
        </div>

        {/* Progression Journey Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
          {stages.map((stage, idx) => {
            const Icon = stage.icon
            return (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative"
              >
                <Card
                  variant="default"
                  className="h-full p-5 rounded-2xl border-border hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Step badge & icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${stage.color}20`, color: stage.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-foreground-subtle font-display">
                        {stage.step}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-foreground font-display mb-1.5 group-hover:text-primary transition-colors">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-foreground-muted leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>

                  {/* Stage completion progress indicator */}
                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5">
                    <div className="h-1 flex-1 rounded-full bg-surface-raised overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${((idx + 1) / stages.length) * 100}%`,
                          backgroundColor: stage.color,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-foreground-subtle font-mono">
                      {Math.round(((idx + 1) / stages.length) * 100)}%
                    </span>
                  </div>
                </Card>

                {/* Arrow connector between stages on desktop */}
                {idx < stages.length - 1 && (
                  <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 text-foreground-subtle opacity-40">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
