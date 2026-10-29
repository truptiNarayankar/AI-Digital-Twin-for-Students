import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ============================================================
// CARD
// ============================================================
const cardVariants = cva(
  'rounded-2xl border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-surface border-border',
        raised: 'bg-surface-raised border-border',
        glass: 'glass-card',
        outline: 'bg-transparent border-border',
        glow: 'bg-surface border-primary/30 shadow-glow-primary',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1 hover:shadow-card-hover cursor-pointer',
        glow: 'hover:border-primary/40 hover:shadow-glow-primary cursor-pointer',
        scale: 'hover:scale-[1.01] cursor-pointer',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      hover: 'none',
      padding: 'md',
    },
  }
)

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>,
    VariantProps<typeof cardVariants> {
  animated?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover, padding, animated = false, children, ...props }, ref) => {
    const classes = cn(cardVariants({ variant, hover, padding, className }))

    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={classes}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          {...(props as HTMLMotionProps<'div'>)}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

// ============================================================
// GLASS CARD
// ============================================================
export interface GlassCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  glow?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  animated?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = false, padding = 'md', animated = false, children, ...props }, ref) => {
    const paddingClass = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }[padding]
    const classes = cn(
      'glass-card rounded-2xl',
      paddingClass,
      glow && 'border-primary/30 shadow-glow-primary',
      className
    )

    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={classes}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          {...(props as HTMLMotionProps<'div'>)}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    )
  }
)
GlassCard.displayName = 'GlassCard'

export { cardVariants }
