import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { apiClient } from '@/api/client'
import { queryKeys } from '@/lib/queryClient'
import { queryClient } from '@/lib/queryClient'
import { useViaCep } from '@/hooks/useViaCep'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { orderSchema, type OrderFormData } from '@/lib/schemas'
import { useTranslation } from 'react-i18next'

export function NewOrderPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setCep, result, isLoading: cepLoading, notFound } = useViaCep()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
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
    mutationFn: async (data: OrderFormData) => {
      const cleanedZip = data.zipCode.replace(/\D/g, '')
      const { data: order } = await apiClient.post('/api/Orders', {
        description: data.description,
        amount: data.amount,
        deliveryAddress: {
          zipCode: cleanedZip.length === 8 ? cleanedZip : data.zipCode,
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
      toast.success(t('orders.createSuccess'))
      navigate('/')
    },
    onError: () => {
      toast.error(t('orders.createError'))
    },
  })

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-content-primary text-xl font-semibold">{t('orders.newOrder')}</h1>
      </div>

      <form noValidate onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-6">
        {/* Order data */}
        <div className="bg-surface-card border-surface-border flex flex-col gap-4 rounded-lg border p-6">
          <h2 className="text-content-secondary text-sm font-medium">{t('orders.orderDetails')}</h2>
          <Input
            label={t('orders.description')}
            placeholder={t('orders.descriptionPlaceholder')}
            error={errors.description?.message}
            {...register('description')}
          />
          <Input
            label={t('orders.amount')}
            type="number"
            step="0.01"
            min="0.01"
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />
        </div>

        {/* Address */}
        <div className="bg-surface-card border-surface-border flex flex-col gap-4 rounded-lg border p-6">
          <h2 className="text-content-secondary text-sm font-medium">{t('orders.deliveryAddress')}</h2>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('orders.zipCode')}
              hint={cepLoading ? t('orders.zipLookup') : notFound ? t('orders.zipNotFound') : undefined}
              error={errors.zipCode?.message}
              {...register('zipCode')}
            />
            <Input label={t('orders.number')} error={errors.number?.message} {...register('number')} />
          </div>

          <Input label={t('orders.street')} error={errors.street?.message} {...register('street')} />
          <Input label={t('orders.neighborhood')} error={errors.neighborhood?.message} {...register('neighborhood')} />

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input label={t('orders.city')} error={errors.city?.message} {...register('city')} />
            </div>
            <Input
              label={t('orders.state')}
              maxLength={2}
              placeholder="UF"
              error={errors.state?.message}
              {...register('state')}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={() => navigate('/')}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            {t('orders.createOrder')}
          </Button>
        </div>
      </form>
    </div>
  )
}
