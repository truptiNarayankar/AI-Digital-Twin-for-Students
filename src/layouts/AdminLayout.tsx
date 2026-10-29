import { Link, Outlet } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'
import { AnimatedBackground } from '@/components/animation/AnimatedBackground'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-x-hidden">
      <AnimatedBackground variant="dashboard" intensity="low" />
      <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-xl px-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-white shadow-md shadow-accent/20">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-foreground font-display">
              System Admin Console
            </span>
          </Link>
          <Badge variant="accent" size="sm">Admin Role</Badge>
        </div>
        <Link to="/">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Public Site
          </Button>
        </Link>
      </header>
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto relative z-10">
        <Outlet />
      </main>
    </div>
  )
}
