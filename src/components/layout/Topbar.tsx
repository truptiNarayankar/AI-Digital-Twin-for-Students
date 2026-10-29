import { Search, Bell, Moon, Sun, Menu, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import { DEMO_PROFILE } from '@/constants'

interface TopbarProps {
  onOpenMobileMenu?: () => void
  title?: string
}

export function Topbar({ onOpenMobileMenu, title }: TopbarProps) {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const displayName = user?.name || DEMO_PROFILE.name
  const displayRole = user?.role || 'STUDENT'
  const displaySubtitle = user?.email || `${DEMO_PROFILE.branch.split(' ')[0]} • Year 3`

  const handleSignOut = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-raised transition-colors"
            aria-label="Open sidebar drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {title && (
          <h1 className="text-base sm:text-lg font-semibold text-foreground font-display">
            {title}
          </h1>
        )}
      </div>

      {/* Center Search Input */}
      <div className="hidden lg:flex items-center relative max-w-sm w-full mx-4">
        <Search className="w-4 h-4 text-foreground-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search skills, companies, roadmap..."
          className="w-full h-9 rounded-xl border border-border bg-surface-raised pl-9 pr-4 text-xs text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Pill */}
        <Badge
          variant={user ? 'primary' : 'demo'}
          size="sm"
          className="hidden sm:inline-flex text-[10px] tracking-wider uppercase font-semibold"
        >
          {user ? displayRole.replace('_', ' ') : 'DEMO MODE'}
        </Badge>

        {/* Theme Toggle */}
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

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-raised transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>

        <div className="h-5 w-px bg-border hidden sm:block" />

        {/* Profile Avatar & Info */}
        <div className="flex items-center gap-2.5">
          <Avatar name={displayName} size="sm" online />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-foreground leading-tight">
              {displayName}
            </span>
            <span className="text-[10px] text-foreground-subtle leading-tight truncate max-w-[140px]">
              {displaySubtitle}
            </span>
          </div>

          {user && (
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-danger hover:bg-danger/10 transition-colors ml-1"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
