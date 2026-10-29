import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Sparkles, Compass, BarChart2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DigitalTwinViz } from '@/components/digital-twin/DigitalTwinViz'

export function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & CTAs */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-start text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Top Pill */}
            <motion.div variants={itemVariants} className="mb-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
                <span>Next-Gen Student Career Intelligence</span>
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-display font-extrabold tracking-tight text-foreground font-display leading-[1.1]"
            >
              Your AI-Powered{' '}
              <span className="text-gradient-primary">Digital Twin</span> for Career Success
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-body-lg sm:text-xl text-foreground-muted max-w-2xl leading-relaxed font-normal"
            >
              Build a living digital profile that understands your skills, performance, strengths, gaps,
              and career goals — and helps you become placement ready.
            </motion.p>

            {/* Primary & Secondary CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              <Link to="/register">
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full sm:w-auto group shadow-lg shadow-primary/25 text-base font-semibold px-8"
                  rightIcon={
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  }
                >
                  Build My Digital Twin
                </Button>
              </Link>

              <a href="#features">
                <Button
                  variant="glass"
                  size="lg"
                  className="w-full sm:w-auto text-base font-medium px-7 border-border hover:border-primary/40"
                  leftIcon={<Compass className="w-4 h-4 text-secondary" />}
                >
                  Explore Platform
                </Button>
              </a>
            </motion.div>

            {/* Hero Trust Indicators (Product Capabilities, strictly NO fake numbers) */}
            <motion.div
              variants={itemVariants}
              className="mt-12 pt-8 border-t border-border/70 w-full grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="flex items-center gap-2.5 text-sm text-foreground-muted">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground text-xs sm:text-sm">
                    AI-Powered Insights
                  </span>
                  <span className="text-[11px] text-foreground-subtle">Continuous profiling</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-sm text-foreground-muted">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground text-xs sm:text-sm">
                    Personalized Guidance
                  </span>
                  <span className="text-[11px] text-foreground-subtle">Target role alignment</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-sm text-foreground-muted">
                <div className="w-8 h-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-success shrink-0">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground text-xs sm:text-sm">
                    Performance Analytics
                  </span>
                  <span className="text-[11px] text-foreground-subtle">Objective readiness</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive Digital Twin Visual */}
          <motion.div
            className="lg:col-span-5 relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          >
            <DigitalTwinViz interactive />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
