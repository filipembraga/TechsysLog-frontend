import { Button, Input } from "@/components/ui";
import { registerSchema, type RegisterFormData } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod'
import { authService } from "@/api/services";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";


export function RegisterPage() {

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const mutation = useMutation({
        mutationFn: (data: RegisterFormData) => authService.register(data.name, data.email, data.password),
        onSuccess: () => {
            toast.success('Registration successful. Please log in.')
            navigate('/login')
        },
        onError: (error) => {
            toast.error(error.message || 'Registration failed')
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
                        Register
                    </h1>

                    <form
                        onSubmit={handleSubmit((data) => mutation.mutate(data))}
                        className="flex flex-col gap-4"
                    >
                        <Input
                            label="Name"
                            type="text"
                            placeholder="Your name"
                            error={errors.name?.message}
                            {...register('name')}
                        />
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
                            Register
                        </Button>
                    </form>

                    <p className="text-center text-sm text-content-muted mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-light hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}