import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ArrowLeft, LogOut, ShieldCheck } from 'lucide-react'
import { AnimatedBackground } from '@/components/animation/AnimatedBackground'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'

export function OfficerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-x-hidden">
      <AnimatedBackground variant="dashboard" intensity="low" />
      <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-xl px-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-secondary to-primary flex items-center justify-center text-white shadow-md shadow-secondary/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-foreground font-display">
              Placement Officer Portal
            </span>
          </Link>
          <Badge variant="secondary" size="sm">Officer Role</Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-foreground-muted sm:inline">{user?.name}</span>
          <Link to="/">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Public Site
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<LogOut className="h-4 w-4" />}
            onClick={handleLogout}
          >
            Sign out
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto relative z-10">
        <Outlet />
      </main>
    </div>
  )
}
