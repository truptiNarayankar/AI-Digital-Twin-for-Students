import { motion } from 'framer-motion'
import { HOW_IT_WORKS_STEPS } from '@/constants'
import { SlideUp } from '@/components/animation'

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative z-10 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <SlideUp>
            <span className="text-xs uppercase font-bold tracking-widest text-secondary px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20">
              Interactive Workflow
            </span>
            <h2 className="mt-4 text-h1 font-bold text-foreground font-display tracking-tight">
              How Your <span className="text-gradient-secondary">Digital Twin</span> Works
            </h2>
            <p className="mt-4 text-body text-foreground-muted">
              From raw academic and coding data to structured, predictive career modeling in 5 continuous stages.
            </p>
          </SlideUp>
        </div>

        {/* Desktop Horizontal Timeline (hidden on mobile/tablet) */}
        <div className="hidden lg:block relative">
          {/* Connecting horizontal line */}
          <div className="absolute top-1/4 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-30 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="flex flex-col items-center text-center px-2 group"
              >
                {/* Step Circle */}
                <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-surface border-2 border-border group-hover:border-primary group-hover:shadow-glow-primary transition-all duration-300 mb-6 shrink-0">
                  <span className="text-base font-bold font-display text-primary group-hover:text-primary-foreground group-hover:bg-primary rounded-xl w-10 h-10 flex items-center justify-center transition-all duration-300">
                    {step.number}
                  </span>
                  {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden xl:block text-foreground-subtle opacity-40">
                      →
                    </div>
                  )}
                </div>

                {/* Step Details */}
                <h3 className="text-base font-bold text-foreground font-display mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Vertical Timeline (displayed on screens < lg) */}
        <div className="lg:hidden relative max-w-md mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent opacity-30 z-0" />

          <div className="space-y-8 relative z-10">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-start gap-5 pl-2"
              >
                {/* Step Number Circle */}
                <div className="w-10 h-10 rounded-xl bg-surface border-2 border-primary/50 text-primary font-bold font-display text-sm flex items-center justify-center shrink-0 shadow-md">
                  {step.number}
                </div>

                {/* Step Details Card */}
                <div className="flex-1 bg-surface border border-border p-4 rounded-xl shadow-sm">
                  <h3 className="text-base font-bold text-foreground font-display mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-foreground-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
