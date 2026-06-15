import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/api/services'
import { queryKeys } from '@/lib/queryClient'
import { type Order } from '@/types'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { StatusBadge } from '@/components/ui'

export function OrdersPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { data: orders = [], isLoading } = useQuery({
        queryKey: queryKeys.orders.all,
        queryFn: ordersService.getAll,
    })

    if (isLoading) {
        return <p className="text-content-secondary p-8">{t('common.loading')}</p>
    }

    return (
        <div className="p-8">

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-content-primary">{t('orders.title')}</h1>
                <Button onClick={() => navigate('/orders/new')}>
                    {t('orders.newOrder')}
                </Button>
            </div>

            <div className="bg-surface-card border border-surface-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-surface-border">
                            <th className="text-left px-4 py-3 text-content-muted font-medium">{t('orders.orderNumber')}</th>
                            <th className="text-left px-4 py-3 text-content-muted font-medium">{t('orders.description')}</th>
                            <th className="text-left px-4 py-3 text-content-muted font-medium">{t('orders.amount')}</th>
                            <th className="text-left px-4 py-3 text-content-muted font-medium">{t('orders.location')}</th>
                            <th className="text-left px-4 py-3 text-content-muted font-medium">{t('orders.status')}</th>
                            <th className="text-left px-4 py-3 text-content-muted font-medium">{t('orders.created')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: Order) => (
                            <tr
                                key={order.id}
                                onClick={() => navigate(`/orders/${order.id}`)}
                                className="border-b border-surface-border last:border-0 hover:bg-surface-elevated transition-colors cursor-pointer"
                            >
                                <td className="px-4 py-3 font-mono text-brand-light">{order.orderNumber}</td>
                                <td className="px-4 py-3 text-content-primary">{order.description || '—'}</td>
                                <td className="px-4 py-3 text-content-primary">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.amount)}
                                </td>
                                <td className="px-4 py-3 text-content-secondary">
                                    {order.deliveryAddress.city && order.deliveryAddress.state
                                        ? `${order.deliveryAddress.city} / ${order.deliveryAddress.state}`
                                        : '—'}
                                </td>
                                <td className={`px-4 py-3 font-medium`}>
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-4 py-3 text-content-secondary">
                                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orders.length === 0 && (
                    <p className="text-center text-content-muted py-12">
                        {t('orders.notFound')}
                    </p>
                )}
            </div>
        </div>
    )
}