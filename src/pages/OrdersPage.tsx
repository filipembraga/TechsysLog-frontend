import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/api/services'
import { queryKeys } from '@/lib/queryClient'
import { OrderStatus, type Order } from '@/types'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

const STATUS_LABEL: Record<number, string> = {
    [OrderStatus.Pending]: 'Pending',
    [OrderStatus.Shipped]: 'Shipped',
    [OrderStatus.Delivered]: 'Delivered',
    [OrderStatus.Cancelled]: 'Cancelled',
}

const STATUS_COLOR: Record<number, string> = {
    [OrderStatus.Pending]: 'text-status-pending',
    [OrderStatus.Shipped]: 'text-status-shipped',
    [OrderStatus.Delivered]: 'text-status-delivered',
    [OrderStatus.Cancelled]: 'text-status-cancelled',
}

export function OrdersPage() {
    const navigate = useNavigate()

    const { data: orders = [], isLoading } = useQuery({
        queryKey: queryKeys.orders.all,
        queryFn: ordersService.getAll,
    })

    if (isLoading) {
        return <p className="text-content-secondary p-8">Loading...</p>
    }

    return (
        <div className="p-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-content-primary">Orders</h1>
                <Button onClick={() => navigate('/orders/new')}>
                    New Order
                </Button>
            </div>

            {/* Table */}
            <div className="bg-surface-card border border-surface-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-surface-border">
                            <th className="text-left px-4 py-3 text-content-muted font-medium">Order #</th>
                            <th className="text-left px-4 py-3 text-content-muted font-medium">Description</th>
                            <th className="text-left px-4 py-3 text-content-muted font-medium">Amount</th>
                            <th className="text-left px-4 py-3 text-content-muted font-medium">Location</th>
                            <th className="text-left px-4 py-3 text-content-muted font-medium">Status</th>
                            <th className="text-left px-4 py-3 text-content-muted font-medium">Created</th>
                            <th className="px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: Order) => (
                            <tr
                                key={order.id}
                                className="border-b border-surface-border last:border-0 hover:bg-surface-elevated transition-colors"
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
                                <td className={`px-4 py-3 font-medium ${STATUS_COLOR[order.status]}`}>
                                    {STATUS_LABEL[order.status]}
                                </td>
                                <td className="px-4 py-3 text-content-secondary">
                                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-4 py-3">
                                    <Button
                                        variant="ghost"
                                        onClick={() => navigate(`/orders/${order.id}`)}
                                    >
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orders.length === 0 && (
                    <p className="text-center text-content-muted py-12">
                        No orders found. Create your first order.
                    </p>
                )}
            </div>
        </div>
    )
}