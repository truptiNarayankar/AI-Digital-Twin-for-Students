import { motion } from 'framer-motion'
import {
  Brain,
  Target,
  BookOpen,
  FileText,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { FEATURES } from '@/constants'
import { SlideUp, StaggerContainer } from '@/components/animation'

const ICON_MAP = {
  Brain,
  Target,
  BookOpen,
  FileText,
  MessageSquare,
  TrendingUp,
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SlideUp>
            <span className="text-xs uppercase font-bold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              Core Capabilities
            </span>
            <h2 className="mt-4 text-h1 font-bold text-foreground font-display tracking-tight">
              Everything You Need to Become{' '}
              <span className="text-gradient-primary">Placement Ready</span>
            </h2>
            <p className="mt-4 text-body text-foreground-muted">
              Six foundational AI capabilities working seamlessly together to model your competencies,
              accelerate your learning, and prepare you for competitive recruitment.
            </p>
          </SlideUp>
        </div>

        {/* 6 Feature Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const IconComp = ICON_MAP[feature.icon as keyof typeof ICON_MAP] || Brain

            return (
              <motion.div
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <Card
                  variant="default"
                  className="group relative h-full p-7 rounded-2xl border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover overflow-hidden flex flex-col justify-between"
                >
                  {/* Subtle top corner gradient glow on hover */}
                  <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all duration-500 pointer-events-none" />

                  <div>
                    {/* Icon container */}
                    <div className="w-12 h-12 rounded-xl bg-surface-raised border border-border group-hover:border-primary/40 flex items-center justify-center text-primary group-hover:text-white group-hover:bg-primary transition-all duration-300 shadow-sm">
                      <IconComp className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                    </div>

                    {/* Title */}
                    <h3 className="mt-5 text-h3 font-semibold text-foreground font-display group-hover:text-primary transition-colors flex items-center justify-between">
                      <span>{feature.title}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-primary transition-all duration-200" />
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-body-sm text-foreground-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Feature status badge */}
                  <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-foreground-subtle">
                    <span className="font-medium text-[11px] text-primary">Intelligent Engine</span>
                    <span className="text-[11px]">Feature 0{idx + 1}</span>
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
