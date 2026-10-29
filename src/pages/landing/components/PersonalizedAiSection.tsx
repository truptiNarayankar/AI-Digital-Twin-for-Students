import { motion } from 'framer-motion'
import { Sparkles, Brain, CheckCircle2, Zap } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SlideUp } from '@/components/animation'

export function PersonalizedAiSection() {
  const recommendationChips = [
    { label: 'Build 1 Full-Stack Microservice', type: 'High Priority', color: 'primary' },
    { label: 'Review Database Indexing & B-Trees', type: 'Core Skill', color: 'secondary' },
    { label: 'Schedule 2 Mock System Design Rounds', type: 'Interview Ready', color: 'accent' },
    { label: 'Quantify Git Commits & Production Deployments', type: 'Resume Booster', color: 'success' },
  ]

  return (
    <section className="py-24 relative z-10 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-5 space-y-6">
            <SlideUp>
              <span className="text-xs uppercase font-bold tracking-widest text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                Personalized Intelligence
              </span>
              <h2 className="text-h1 font-bold text-foreground font-display tracking-tight leading-tight">
                Your Career Journey Is Different.{' '}
                <span className="text-gradient-primary">Your Guidance Should Be Too.</span>
              </h2>
              <p className="text-body text-foreground-muted leading-relaxed">
                Generic career advice fails because every student has a unique mix of coursework,
                coding hours, project depth, and soft skills. The Digital Twin evaluates your specific
                fingerprint to deliver surgical recommendations.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-5 h-5 rounded-full bg-success/20 text-success flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Context-aware insights updated after each test and commit</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-5 h-5 rounded-full bg-success/20 text-success flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Benchmark comparisons against top placement cohorts</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-5 h-5 rounded-full bg-success/20 text-success flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Actionable step-by-step roadmap without cognitive overload</span>
                </div>
              </div>
            </SlideUp>
          </div>

          {/* Right Column: Beautiful AI Insight Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <Card
              variant="default"
              className="relative p-6 sm:p-8 rounded-3xl border-primary/30 bg-surface/90 shadow-2xl backdrop-blur-2xl overflow-hidden"
            >
              {/* Corner AI ambient glow */}
              <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

              {/* Panel Top Header */}
              <div className="flex items-center justify-between pb-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/25">
                    <Brain className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground font-display flex items-center gap-2">
                      Twin Career Advisor
                      <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                    </h3>
                    <span className="text-xs text-foreground-subtle">
                      Neural Profile Synthesis Engine
                    </span>
                  </div>
                </div>

                <Badge variant="demo" size="sm">
                  Example AI Insight
                </Badge>
              </div>

              {/* AI Message Card */}
              <div className="mt-6 p-5 rounded-2xl bg-surface-raised border border-primary/20 relative">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Placement Readiness Synthesis
                      </span>
                    </div>
                    {/* Exact text required by prompt */}
                    <p className="text-sm sm:text-base text-foreground leading-relaxed">
                      "Based on your current profile, your strongest areas are frontend development and
                      project experience. Improving backend development and technical interview performance
                      could strengthen your readiness for your target role."
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendation Chips */}
              <div className="mt-6">
                <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider block mb-3">
                  Recommended Immediate Next Steps:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recommendationChips.map((chip, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-surface-raised border border-border hover:border-primary/40 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        <Zap className="w-3.5 h-3.5 text-secondary shrink-0" />
                        <span>{chip.label}</span>
                      </div>
                      <Badge variant="muted" size="sm" className="shrink-0 text-[10px]">
                        {chip.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-foreground-subtle">
                <span>Confidence Score: 94.2%</span>
                <span className="text-primary font-medium">Auto-calibrated vs Target Role: Software Engineer</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
