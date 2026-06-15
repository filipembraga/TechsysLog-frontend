import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/api/client'
import { queryClient, queryKeys } from '@/lib/queryClient'
import { ordersService } from '@/api/services'
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
        queryFn: () => ordersService.getById(id!),
    })

    const deliveryMutation = useMutation({
        mutationFn: async () => {
            const { data } = await apiClient.post('/api/Deliveries', { orderId: id })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.byId(id!) })
            toast.success(t('orders.deliverySuccess'))
            navigate('/')
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
        <div className="p-8 max-w-2xl mx-auto">

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-content-primary font-mono">
                        {order.orderNumber}
                    </h1>
                    <StatusBadge status={order.status} />
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => navigate('/')}>
                        {t('common.back')}
                    </Button>
                    {canDeliver && (
                        <Button
                            onClick={() => deliveryMutation.mutate()}
                            loading={deliveryMutation.isPending}
                        >
                            {t('orders.registerDelivery')}
                        </Button>
                    )}
                </div>
            </div>

            <div className="bg-surface-card border border-surface-border rounded-lg p-6 flex flex-col gap-4 mb-4">
                <h2 className="text-sm font-medium text-content-secondary">{t('orders.orderDetails')}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Field label={t('orders.description')} value={order.description || '—'} />
                    <Field label={t('orders.amount')} value={formatAmount(order.amount)} />
                    <Field label={t('orders.created')} value={formatDate(order.createdAt)} />
                </div>
            </div>

            <div className="bg-surface-card border border-surface-border rounded-lg p-6 flex flex-col gap-4">
                <h2 className="text-sm font-medium text-content-secondary">{t('orders.deliveryAddress')}</h2>
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
            <p className="text-xs text-content-muted mb-1">{label}</p>
            <p className="text-sm text-content-primary">{value}</p>
        </div>
    )
}

function formatAmount(amount: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR')
}