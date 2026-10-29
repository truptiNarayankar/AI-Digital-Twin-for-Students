import { Outlet, Link } from 'react-router-dom'
import { Brain, ArrowLeft, Sun, Moon } from 'lucide-react'
import { AnimatedBackground } from '@/components/animation/AnimatedBackground'
import { useTheme } from '@/hooks/useTheme'

export function AuthLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-x-hidden">
      <AnimatedBackground variant="hero" intensity="low" />

      {/* Auth Top Header */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Brain className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-foreground font-display hidden sm:inline">
              AI Digital Twin
            </span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-raised transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-warning" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>
        </div>
      </header>

      {/* Main Auth Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-5xl">
          <Outlet />
        </div>
      </main>

      {/* Footer minimal info */}
      <footer className="relative z-20 py-4 text-center text-xs text-foreground-subtle">
        <p>© 2026 AI Digital Twin for Students • Phase 2 Prototype UI</p>
      </footer>
    </div>
  )
}
