import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { AnimatedBackground } from '@/components/animation/AnimatedBackground'
import { PageTransition } from '@/components/animation'

export function StudentLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-background text-foreground relative overflow-x-hidden">
      <AnimatedBackground variant="dashboard" intensity="low" />

      {/* Desktop Collapsible Sidebar */}
      <div className="hidden md:block shrink-0 relative z-30">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
      </div>

      {/* Mobile Drawer Backdrop and Drawer */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative z-50 h-full">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileDrawerOpen(false)}
              isMobileDrawer
              onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-20">
        <Topbar onOpenMobileMenu={() => setMobileDrawerOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  )
}
