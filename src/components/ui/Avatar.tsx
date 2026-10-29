import { cn } from '@/lib/utils'

// ============================================================
// AVATAR
// ============================================================
interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  online?: boolean
}

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

function getAvatarColor(name: string): string {
  const colors = [
    'from-primary to-accent',
    'from-secondary to-primary',
    'from-success to-secondary',
    'from-warning to-danger',
    'from-accent to-secondary',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export function Avatar({ src, alt, name = '', size = 'md', className, online }: AvatarProps) {
  const initials = name ? getInitials(name) : '?'
  const gradient = getAvatarColor(name || '?')

  return (
    <div className={cn('relative shrink-0', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-semibold text-white',
          sizeMap[size]
        )}
      >
        {src ? (
          <img src={src} alt={alt ?? name} className="w-full h-full object-cover" />
        ) : (
          <div className={cn('w-full h-full bg-gradient-to-br flex items-center justify-center', gradient)}>
            <span className="text-white">{initials}</span>
          </div>
        )}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-background',
            online ? 'bg-success' : 'bg-foreground-subtle',
            size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'
          )}
          aria-label={online ? 'Online' : 'Offline'}
        />
      )}
    </div>
  )
}
