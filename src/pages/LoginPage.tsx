import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '@/api/services'
import { useAuth } from '@/context/AuthContext'
import { loginSchema, type LoginFormData } from '@/lib/schemas'
import { useTranslation } from 'react-i18next'

export function LoginPage() {
    const { t } = useTranslation()
    const { login } = useAuth()
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
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
            navigate('/')
        },
        onError: () => {
            toast.error(t('auth.loginError'))
        },
    })

    return (
        <div className="min-h-screen bg-surface-base flex items-center justify-center p-4">
            <div className="w-full max-w-sm">

                <div className="flex items-center justify-center mb-8">
                    <span className="text-2xl font-bold text-content-primary font-mono">
                        TechsysLog
                    </span>
                </div>

                <div className="bg-surface-card border border-surface-border rounded-lg p-8">
                    <h1 className="text-lg font-semibold text-content-primary mb-6">
                        {t('auth.signIn')}
                    </h1>

                    <form
                        onSubmit={handleSubmit((data) => mutation.mutate(data))}
                        noValidate
                        className="flex flex-col gap-4"
                    >
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
                        <Button
                            type="submit"
                            className="w-full mt-2"
                            loading={mutation.isPending}
                        >
                            {t('auth.signIn')}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-content-muted mt-6">
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