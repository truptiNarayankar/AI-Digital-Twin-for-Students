// ============================================================
// CORE APPLICATION TYPES
// ============================================================

export type Theme = 'dark' | 'light'

export type UserRole = 'student' | 'officer' | 'admin'

export interface NavItem {
  label: string
  path: string
  icon: string
  badge?: string | number
}

export interface StatCardData {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'accent'
  isDemo?: boolean
}

export interface SkillData {
  name: string
  value: number
  fullMark: number
}

export interface TimelineStep {
  number: string
  title: string
  description: string
}

export interface FeatureCard {
  icon: string
  title: string
  description: string
  gradient?: string
}

export interface BenefitItem {
  icon: string
  title: string
  description: string
}

export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}

export interface DemoProfile {
  name: string
  role: string
  college: string
  branch: string
  year: string
  cgpa: number
  placementReadiness: number
  skillGapScore: number
  resumeScore: number
  interviewScore: number
  codingScore: number
  twinHealth: number
  placementProbability: number
}

export interface AnimatedBackgroundProps {
  variant?: 'hero' | 'dashboard' | 'minimal'
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export interface SidebarItem {
  label: string
  path: string
  iconName: string
  badge?: string | number
}
