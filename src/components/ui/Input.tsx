import { forwardRef, type InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {

    const { t } = useTranslation()
    // Generates an id from label if not explicitly provided
    // Required to associate <label> with <input> via htmlFor
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-content-secondary"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full rounded border px-3 py-2 text-sm',
            'bg-surface-elevated text-content-primary',
            'placeholder:text-content-muted',
            'focus:outline-none focus:ring-2 focus:ring-brand',
            'transition-colors',
            error
              ? 'border-feedback-error'
              : 'border-surface-border hover:border-brand-light',
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-xs text-feedback-error">{t(error)}</p>
        )}

        {hint && !error && (
          <p className="text-xs text-content-muted">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }