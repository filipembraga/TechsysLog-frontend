import { Button, Input } from "@/components/ui";
import { registerSchema, type RegisterFormData } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod'
import { authService } from "@/api/services";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";


export function RegisterPage() {
    const { t } = useTranslation()
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const mutation = useMutation({
        mutationFn: (data: RegisterFormData) => authService.register(data.name, data.email, data.password),
        onSuccess: () => {
            toast.success(t('auth.registerSuccess'))
            navigate('/login')
        },
        onError: () => {
            toast.error(t('auth.registerError'))
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
                        {t('auth.register')}
                    </h1>

                    <form
                        onSubmit={handleSubmit((data) => mutation.mutate(data))}
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
                        <Button
                            type="submit"
                            className="w-full mt-2"
                            loading={mutation.isPending}
                        >
                            {t('auth.register')}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-content-muted mt-6">
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