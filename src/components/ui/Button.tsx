import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading, children, disabled, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled ?? loading}
        className={clsx(
          'px-4 py-2 text-sm font-medium rounded transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-brand text-white hover:bg-brand-hover',
          variant === 'secondary' && 'bg-surface-elevated text-content-primary border border-surface-border',
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