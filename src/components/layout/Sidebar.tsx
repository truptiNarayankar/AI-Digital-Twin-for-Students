import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  Brain,
  LayoutDashboard,
  User,
  GraduationCap,
  Code2,
  FolderKanban,
  Award,
  Target,
  TrendingUp,
  BookOpen,
  FileText,
  MessageSquare,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BarChart3,
  Compass,
} from 'lucide-react'
import { STUDENT_NAV_ITEMS } from '@/constants'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const ICON_COMPONENTS = {
  LayoutDashboard,
  Brain,
  User,
  GraduationCap,
  Code2,
  FolderKanban,
  Award,
  Target,
  TrendingUp,
  BookOpen,
  FileText,
  MessageSquare,
  Sparkles,
  Settings,
  BarChart3,
  Compass,
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  isMobileDrawer?: boolean
  onCloseMobileDrawer?: () => void
}

export function Sidebar({
  collapsed,
  onToggle,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}: SidebarProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside
      className={cn(
        'relative flex flex-col h-full bg-surface border-r border-border transition-all duration-300 z-40',
        collapsed ? 'w-20' : 'w-64',
        isMobileDrawer && 'w-72'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
        <Link
          to="/"
          className="flex items-center gap-3 overflow-hidden"
          onClick={onCloseMobileDrawer}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shrink-0 shadow-md shadow-primary/25">
            <Brain className="w-5 h-5" />
          </div>
          {(!collapsed || isMobileDrawer) && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-sm text-foreground font-display leading-tight truncate">
                AI Digital Twin
              </span>
              <span className="text-[10px] text-foreground-subtle truncate">
                Student Edition
              </span>
            </div>
          )}
        </Link>

        {!isMobileDrawer && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-raised transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {STUDENT_NAV_ITEMS.map((item) => {
          const IconComp = ICON_COMPONENTS[item.iconName as keyof typeof ICON_COMPONENTS] || Brain

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobileDrawer}
              title={collapsed && !isMobileDrawer ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/25 shadow-sm'
                    : 'text-foreground-muted hover:text-foreground hover:bg-surface-raised'
                )
              }
            >
              <IconComp className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
              {(!collapsed || isMobileDrawer) && (
                <span className="truncate">{item.label}</span>
              )}
              {item.badge && (!collapsed || isMobileDrawer) && (
                <Badge variant="primary" size="sm" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Footer Profile / Logout Area */}
      <div className="p-3 border-t border-border shrink-0">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground-muted hover:text-danger hover:bg-danger/10 transition-colors',
            collapsed && !isMobileDrawer && 'justify-center'
          )}
          title={collapsed && !isMobileDrawer ? 'Sign Out' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(!collapsed || isMobileDrawer) && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
