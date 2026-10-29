import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  icon?: ReactNode
  badge?: string | number
}

interface TabsProps {
  tabs: TabItem[]
  activeTab?: string
  onChange?: (id: string) => void
  className?: string
  variant?: 'pills' | 'underline'
}

export function Tabs({
  tabs,
  activeTab: controlledActiveTab,
  onChange,
  className,
  variant = 'pills',
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '')
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab

  const handleTabClick = (id: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(id)
    }
    onChange?.(id)
  }

  if (variant === 'underline') {
    return (
      <div className={cn('flex items-center gap-6 border-b border-border', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'relative flex items-center gap-2 pb-3 pt-2 text-sm font-medium transition-colors',
                isActive ? 'text-primary' : 'text-foreground-muted hover:text-foreground'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="rounded-full bg-surface-raised px-2 py-0.5 text-xs text-foreground-muted">
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-xl bg-surface-raised p-1 border border-border',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              'relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'text-primary-foreground shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-lg bg-primary"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
              {tab.badge && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-xs',
                    isActive ? 'bg-white/20 text-white' : 'bg-surface text-foreground-muted'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
