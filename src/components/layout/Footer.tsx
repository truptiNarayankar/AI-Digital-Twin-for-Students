import { Link } from 'react-router-dom'
import { Brain, Sparkles, Shield, Cpu, Layers } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-surface/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/20">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-foreground font-display">
                AI Digital Twin
              </span>
            </Link>
            <p className="text-body-sm text-foreground-muted leading-relaxed">
              An intelligent platform that helps students understand their career readiness,
              uncover skill gaps, and achieve placement success through dynamic digital twin modeling.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs text-secondary font-medium px-2.5 py-1 rounded-full bg-secondary/10 border border-secondary/20">
                <Sparkles className="w-3 h-3" /> AI-Powered Career Intelligence
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-label uppercase tracking-wider text-foreground font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-body-sm">
              <li>
                <a href="/#product" className="text-foreground-muted hover:text-primary transition-colors">
                  Product Overview
                </a>
              </li>
              <li>
                <a href="/#features" className="text-foreground-muted hover:text-primary transition-colors">
                  Core Features
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-foreground-muted hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#about" className="text-foreground-muted hover:text-primary transition-colors">
                  About Platform
                </a>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="space-y-3">
            <h4 className="text-label uppercase tracking-wider text-foreground font-semibold">
              Account
            </h4>
            <ul className="space-y-2.5 text-body-sm">
              <li>
                <Link to="/login" className="text-foreground-muted hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-foreground-muted hover:text-primary transition-colors">
                  Create Student Account
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-foreground-muted hover:text-primary transition-colors">
                  Placement Officer Portal
                </Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="text-foreground-muted hover:text-primary transition-colors">
                  Demo Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Architecture */}
          <div className="space-y-3">
            <h4 className="text-label uppercase tracking-wider text-foreground font-semibold">
              Architecture
            </h4>
            <ul className="space-y-2.5 text-body-sm text-foreground-muted">
              <li className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary shrink-0" />
                <span>Multi-Dimensional Modeling</span>
              </li>
              <li className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-secondary shrink-0" />
                <span>Live Skill Telemetry</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success shrink-0" />
                <span>Placement Benchmark Analytics</span>
              </li>
            </ul>
            <div className="pt-2">
              <span className="text-xs text-foreground-subtle block">
                Frontend Prototype — Phase 2 Design System
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground-subtle">
          <p>© 2026 AI Digital Twin for Students. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Career Intelligence Engine</span>
            <span>Empowering Next-Gen Students</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
