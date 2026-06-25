import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '@/api/services'
import { useAuth } from '@/context/useAuth'
import { loginSchema, type LoginFormData } from '@/lib/schemas'
import { useTranslation } from 'react-i18next'

export function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data.email, data.password),
    onSuccess: (response) => {
      login(response.token, {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
      })
      toast.success(t('auth.loginSuccess'))
      navigate(from)
    },
    onError: () => {
      toast.error(t('auth.loginError'))
    },
  })

  return (
    <div className="bg-surface-base flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center">
          <span className="text-content-primary font-mono text-2xl font-bold">TechsysLog</span>
        </div>

        <div className="bg-surface-card border-surface-border rounded-lg border p-8">
          <h1 className="text-content-primary mb-6 text-lg font-semibold">{t('auth.signIn')}</h1>

          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} noValidate className="flex flex-col gap-4">
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
              {t('auth.signIn')}
            </Button>
          </form>

          <p className="text-content-muted mt-6 text-center text-sm">
            {t('auth.noAccount')}
            <Link to="/register" className="text-brand-light hover:underline">
              {t('auth.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
