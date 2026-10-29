import { Link } from 'react-router-dom'
import { ArrowRight, Brain, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SlideUp } from '@/components/animation'

export function FinalCtaSection() {
  return (
    <section className="py-24 relative z-10 border-t border-border/40 overflow-hidden">
      {/* Subtle glowing radial background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            'radial-gradient(circle 500px at 50% 50%, hsl(var(--primary)) 0%, transparent 80%)',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SlideUp>
          <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-surface-raised via-surface to-surface border border-primary/30 shadow-2xl text-center relative overflow-hidden">
            {/* Top Icon Pill */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-accent text-white shadow-lg shadow-primary/30 mb-6">
              <Brain className="w-7 h-7" />
            </div>

            {/* Exact Heading from Prompt */}
            <h2 className="text-display font-bold text-foreground font-display tracking-tight max-w-2xl mx-auto leading-tight">
              Build Your Digital Twin.{' '}
              <span className="text-gradient-primary">Shape Your Future.</span>
            </h2>

            {/* Exact Subtext from Prompt */}
            <p className="mt-4 text-body-lg text-foreground-muted max-w-xl mx-auto leading-relaxed">
              Turn your academic and career journey into actionable insights.
            </p>

            {/* Main CTA Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full sm:w-auto px-10 py-6 text-base font-bold shadow-xl shadow-primary/30 group"
                  rightIcon={
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  }
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/student/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 text-base border-border hover:border-primary/40"
                >
                  Explore Demo Dashboard
                </Button>
              </Link>
            </div>

            {/* Guarantees / Micro-trust */}
            <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center justify-center gap-6 text-xs text-foreground-subtle">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                No setup fee
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                Instant readiness scoring
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                Continuous AI updates
              </span>
            </div>
          </div>
        </SlideUp>
      </div>
    </section>
  )
}
