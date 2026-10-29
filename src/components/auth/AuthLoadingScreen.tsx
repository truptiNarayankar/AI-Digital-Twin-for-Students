import { motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'

export function AuthLoadingScreen({ message = 'Verifying Authentication...' }: { message?: string }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20 animate-pulse" />
      <div className="absolute w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20 animate-pulse" />

      <motion.div
        className="flex flex-col items-center gap-6 relative z-10 p-8 rounded-3xl bg-surface/80 border border-border shadow-2xl backdrop-blur-xl max-w-sm w-full text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          {/* Outer pulsing ring */}
          <motion.div
            className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-primary to-accent opacity-30 blur-sm"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Logo container */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-xl shadow-primary/30">
            <Brain className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold font-display text-foreground flex items-center justify-center gap-2">
            <span>AI Digital Twin</span>
            <Sparkles className="w-4 h-4 text-secondary" />
          </h3>
          <p className="text-xs text-foreground-muted">{message}</p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}
