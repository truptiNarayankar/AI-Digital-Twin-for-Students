import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl',
    'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-primary-foreground',
          'hover:opacity-90 hover:shadow-glow-primary active:scale-[0.98]',
          'shadow-lg shadow-primary/20',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground',
          'hover:opacity-90 hover:shadow-glow-secondary active:scale-[0.98]',
        ],
        outline: [
          'border border-border bg-transparent text-foreground',
          'hover:bg-surface-raised hover:border-primary/50 active:scale-[0.98]',
        ],
        ghost: [
          'bg-transparent text-foreground',
          'hover:bg-surface-raised active:scale-[0.98]',
        ],
        glass: [
          'glass text-foreground',
          'hover:bg-white/10 active:scale-[0.98]',
        ],
        danger: [
          'bg-danger text-danger-foreground',
          'hover:opacity-90 active:scale-[0.98]',
        ],
        gradient: [
          'bg-gradient-to-r from-primary to-accent text-white',
          'hover:opacity-90 hover:shadow-glow-primary active:scale-[0.98]',
          'shadow-lg shadow-primary/20',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const isSpinnerActive = loading || isLoading
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled ?? isSpinnerActive}
        whileTap={{ scale: 0.97 }}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {isSpinnerActive ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : leftIcon}
        {children}
        {!isSpinnerActive && rightIcon}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'

export { buttonVariants }
