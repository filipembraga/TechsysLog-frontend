import { Button, Input } from '@/components/ui'
import { registerSchema, type RegisterFormData } from '@/lib/schemas'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { authService } from '@/api/services'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormData) => authService.register(data.name, data.email, data.password),
    onSuccess: () => {
      toast.success(t('auth.registerSuccess'))
      void navigate('/login')
    },
    onError: () => {
      toast.error(t('auth.registerError'))
    },
  })

  return (
    <div className="bg-surface-base flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center">
          <span className="text-content-primary font-mono text-2xl font-bold">TechsysLog</span>
        </div>

        <div className="bg-surface-card border-surface-border rounded-lg border p-8">
          <h1 className="text-content-primary mb-6 text-lg font-semibold">{t('auth.register')}</h1>

          <form
            onSubmit={(e) => {
              void handleSubmit((data) => mutation.mutate(data))(e)
            }}
            noValidate
            className="flex flex-col gap-4"
          >
            <Input
              label={t('auth.name')}
              type="text"
              placeholder={t('auth.namePlaceholder')}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label={t('auth.email')}
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label={t('auth.password')}
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" className="mt-2 w-full" loading={mutation.isPending}>
              {t('auth.register')}
            </Button>
          </form>

          <p className="text-content-muted mt-6 text-center text-sm">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-brand-light hover:underline">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
