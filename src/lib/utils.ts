import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, decimals = 0): string {
  return num.toLocaleString('en-US', { maximumFractionDigits: decimals })
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function getColorClass(
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'accent'
): string {
  switch (color) {
    case 'primary': return 'text-primary'
    case 'secondary': return 'text-secondary'
    case 'success': return 'text-success'
    case 'warning': return 'text-warning'
    case 'danger': return 'text-danger'
    case 'accent': return 'text-accent'
    default: return 'text-primary'
  }
}
