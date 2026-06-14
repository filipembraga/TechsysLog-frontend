import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading, children, disabled, className, ...props }, ref) => {
    return (
      <button
        className={twMerge(
          'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-brand text-white hover:bg-brand-hover',
          variant === 'secondary' && 'bg-surface-elevated text-content-primary border border-surface-border hover:bg-surface-card',
          variant === 'ghost' && 'text-content-secondary hover:text-content-primary hover:bg-surface-elevated',
          variant === 'danger' && 'bg-feedback-error text-white hover:bg-red-700',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }