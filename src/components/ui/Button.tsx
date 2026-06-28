import { Loader2 } from 'lucide-react'
import { type ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

function Button({ variant = 'primary', loading, children, disabled, className, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={twMerge(
        'inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-brand hover:bg-brand-hover text-white',
        variant === 'secondary' &&
          'bg-surface-elevated text-content-primary border-surface-border hover:bg-surface-card border',
        variant === 'ghost' && 'text-content-secondary hover:text-content-primary hover:bg-surface-elevated',
        variant === 'danger' && 'bg-feedback-error text-white hover:bg-red-700',
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

export { Button }
