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

export function LoginPage() {

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
            toast.success('Login successful')
            navigate('/')
        },
        onError: () => {
            toast.error('Invalid email or password')
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
                        Sign in
                    </h1>

                    <form
                        onSubmit={handleSubmit((data) => mutation.mutate(data))}
                        className="flex flex-col gap-4"
                    >
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            error={errors.password?.message}
                            {...register('password')}
                        />
                        <Button
                            type="submit"
                            className="w-full mt-2"
                            loading={mutation.isPending}
                        >
                            Sign in
                        </Button>
                    </form>

                    <p className="text-center text-sm text-content-muted mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-brand-light hover:underline">
                            Register
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}