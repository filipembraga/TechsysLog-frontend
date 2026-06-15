import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { apiClient } from '@/api/client'
import { queryKeys } from '@/lib/queryClient'
import { queryClient } from '@/lib/queryClient'
import { useViaCep } from '@/hooks/useViaCep'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  description: z.string().min(1, 'Required'),
  amount: z.number().positive('Must be greater than zero'),
  zipCode: z.string().length(8, 'ZIP code must have 8 digits'),
  street: z.string().min(1, 'Required'),
  number: z.string().min(1, 'Required'),
  neighborhood: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  state: z.string().length(2, 'Use 2-letter state code'),
})

type FormData = z.infer<typeof schema>

export function NewOrderPage() {
  const navigate = useNavigate()
  const { setCep, result, isLoading: cepLoading, notFound } = useViaCep()

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const zipCode = watch('zipCode')

  // Triggers ViaCEP lookup when ZIP code changes
  useEffect(() => {
    if (zipCode) setCep(zipCode)
  }, [zipCode, setCep])

  // Auto-fills address fields when ViaCEP returns a result
  useEffect(() => {
    if (result) {
      setValue('street', result.street)
      setValue('neighborhood', result.neighborhood)
      setValue('city', result.city)
      setValue('state', result.state)
    }
  }, [result, setValue])

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { data: order } = await apiClient.post('/api/Orders', {
        description: data.description,
        amount: data.amount,
        deliveryAddress: {
          zipCode: data.zipCode,
          street: data.street,
          number: data.number,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
        },
      })
      return order
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
      toast.success('Order created successfully')
      navigate('/')
    },
    onError: () => {
      toast.error('Failed to create order')
    },
  })

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-content-primary">New Order</h1>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-6">

        {/* Order data */}
        <div className="bg-surface-card border border-surface-border rounded-lg p-6 flex flex-col gap-4">
          <h2 className="text-sm font-medium text-content-secondary">Order Details</h2>
          <Input label="Description" error={errors.description?.message} {...register('description')} />
          <Input label="Amount" type="number" step="0.01" min="0.01" error={errors.amount?.message} {...register('amount', { valueAsNumber: true })} />
        </div>

        {/* Address */}
        <div className="bg-surface-card border border-surface-border rounded-lg p-6 flex flex-col gap-4">
          <h2 className="text-sm font-medium text-content-secondary">Delivery Address</h2>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ZIP Code"
              maxLength={8}
              placeholder="00000000"
              hint={cepLoading ? 'Looking up address...' : notFound ? 'ZIP code not found' : undefined}
              error={errors.zipCode?.message}
              {...register('zipCode')}
            />
            <Input label="Number" error={errors.number?.message} {...register('number')} />
          </div>

          <Input label="Street" error={errors.street?.message}       {...register('street')} />
          <Input label="Neighborhood" error={errors.neighborhood?.message} {...register('neighborhood')} />

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input label="City" error={errors.city?.message}  {...register('city')} />
            </div>
            <Input label="State" maxLength={2} placeholder="UF" error={errors.state?.message} {...register('state')} />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={() => navigate('/')}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>Create Order</Button>
        </div>
      </form>
    </div>
  )
}