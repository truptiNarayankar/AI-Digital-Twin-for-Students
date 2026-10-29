import { motion } from 'framer-motion'
import {
  Zap,
  Target,
  LineChart,
  Award,
  Compass,
  ShieldCheck,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SlideUp, StaggerContainer } from '@/components/animation'

export function BenefitsSection() {
  const benefits = [
    {
      title: 'Understand your strengths',
      desc: 'Uncover your strongest technical and soft skill competencies with empirical AI analysis of your actual code and coursework.',
      icon: Zap,
      color: 'primary',
    },
    {
      title: 'Discover your skill gaps',
      desc: 'Pinpoint the missing technologies and knowledge required for specific high-tier job descriptions before interviews begin.',
      icon: Target,
      color: 'secondary',
    },
    {
      title: 'Track your progress',
      desc: 'Observe real-time telemetry on how every completed project, contest, and mock test elevates your composite readiness index.',
      icon: LineChart,
      color: 'accent',
    },
    {
      title: 'Improve placement readiness',
      desc: 'Systematically transform weak areas into demonstrable competencies tailored to your campus recruitment cycle.',
      icon: Award,
      color: 'success',
    },
    {
      title: 'Get personalized guidance',
      desc: 'Receive targeted AI mentoring recommendations that prioritize what to study next for maximum impact.',
      icon: Compass,
      color: 'warning',
    },
    {
      title: 'Build career confidence',
      desc: 'Enter coding rounds and executive interviews thoroughly prepared, backed by verified digital twin metrics.',
      icon: ShieldCheck,
      color: 'primary',
    },
  ]

  return (
    <section className="py-24 relative z-10 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SlideUp>
            <span className="text-xs uppercase font-bold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              Transformative Outcomes
            </span>
            <h2 className="mt-4 text-h1 font-bold text-foreground font-display tracking-tight">
              Know Where You Stand.{' '}
              <span className="text-gradient-primary">Know What To Improve.</span>
            </h2>
            <p className="mt-4 text-body text-foreground-muted">
              Clear, transparent intelligence that replaces guesswork with actionable career certainty.
            </p>
          </SlideUp>
        </div>

        {/* Benefits Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <Card
                  variant="default"
                  className="h-full p-6 rounded-2xl border-border hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground font-display group-hover:text-primary transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-foreground-muted leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
