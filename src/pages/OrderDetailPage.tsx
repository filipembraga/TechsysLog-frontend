import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryClient, queryKeys } from '@/lib/queryClient'
import { deliveriesService, ordersService } from '@/api/services'
import { OrderStatus } from '@/types'
import { Button } from '@/components/ui/Button'
import { useTranslation } from 'react-i18next'
import { StatusBadge } from '@/components/ui'

export function OrderDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.orders.byId(id!),
    queryFn: async () => ordersService.getById(id!),
  })

  const deliveryMutation = useMutation({
    mutationFn: async () => deliveriesService.register(id!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.byId(id!) })
      toast.success(t('orders.deliverySuccess'))
      void navigate('/')
    },
    onError: () => {
      toast.error(t('orders.deliveryError'))
    },
  })

  if (isLoading) {
    return <p className="text-content-secondary p-8">{t('common.loading')}</p>
  }

  if (!order) {
    return <p className="text-feedback-error p-8">{t('common.notFound')}</p>
  }

  const canDeliver = order.status === OrderStatus.Pending || order.status === OrderStatus.Shipped

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-content-primary font-mono text-xl font-semibold">{order.orderNumber}</h1>
          <StatusBadge status={order.status} />
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => { void navigate(-1) }}>
            {t('common.back')}
          </Button>
          {canDeliver && (
            <Button onClick={() => deliveryMutation.mutate()} loading={deliveryMutation.isPending}>
              {t('orders.registerDelivery')}
            </Button>
          )}
        </div>
      </div>

      <div className="bg-surface-card border-surface-border mb-4 flex flex-col gap-4 rounded-lg border p-6">
        <h2 className="text-content-secondary text-sm font-medium">{t('orders.orderDetails')}</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t('orders.description')} value={order.description || '—'} />
          <Field label={t('orders.amount')} value={formatAmount(order.amount)} />
          <Field label={t('orders.created')} value={formatDate(order.createdAt)} />
        </div>
      </div>

      <div className="bg-surface-card border-surface-border flex flex-col gap-4 rounded-lg border p-6">
        <h2 className="text-content-secondary text-sm font-medium">{t('orders.deliveryAddress')}</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t('orders.zipCode')} value={order.deliveryAddress.zipCode || '—'} />
          <Field label={t('orders.number')} value={order.deliveryAddress.number || '—'} />
          <Field label={t('orders.street')} value={order.deliveryAddress.street || '—'} />
          <Field label={t('orders.neighborhood')} value={order.deliveryAddress.neighborhood || '—'} />
          <Field label={t('orders.city')} value={order.deliveryAddress.city || '—'} />
          <Field label={t('orders.state')} value={order.deliveryAddress.state || '—'} />
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-content-muted mb-1 text-xs">{label}</p>
      <p className="text-content-primary text-sm">{value}</p>
    </div>
  )
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR')
}
