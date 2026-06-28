import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/api/services'
import { queryKeys } from '@/lib/queryClient'
import { OrderStatus, type Order } from '@/types'
import { Button, Input } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { StatusBadge } from '@/components/ui'
import { useState } from 'react'
import { ORDER_STATUS } from '@/constants/orderStatus'

export function OrdersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: orders = [], isLoading } = useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: ordersService.getAll,
  })

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.description.toLowerCase().includes(search.toLowerCase()) ||
      order.deliveryAddress.city.toLowerCase().includes(search.toLowerCase()) ||
      order.deliveryAddress.state.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return <p className="text-content-secondary p-8">{t('common.loading')}</p>
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-content-primary text-xl font-semibold">{t('orders.title')}</h1>
        <Button
          onClick={() => {
            void navigate('/orders/new')
          }}
        >
          {t('orders.newOrder')}
        </Button>
      </div>

      <div className="mb-4 flex gap-3">
        <div className="flex-1">
          <Input
            placeholder={t('orders.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="border-surface-border bg-surface-elevated text-content-primary focus:ring-brand rounded border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        >
          <option value="all">{t('orders.allStatuses')}</option>
          {Object.entries(ORDER_STATUS).map(([status, config]) => (
            <option key={status} value={status}>
              {t(config.i18nKey)}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-surface-card border-surface-border overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-surface-border border-b">
              <th className="text-content-muted px-4 py-3 text-left font-medium">{t('orders.orderNumber')}</th>
              <th className="text-content-muted px-4 py-3 text-left font-medium">{t('orders.description')}</th>
              <th className="text-content-muted px-4 py-3 text-left font-medium">{t('orders.amount')}</th>
              <th className="text-content-muted px-4 py-3 text-left font-medium">{t('orders.location')}</th>
              <th className="text-content-muted px-4 py-3 text-left font-medium">{t('orders.created')}</th>
              <th className="text-content-muted px-4 py-3 text-left font-medium">{t('orders.status')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order: Order) => (
              <tr
                key={order.id}
                onClick={() => {
                  void navigate(`/orders/${order.id}`)
                }}
                className="border-surface-border hover:bg-surface-elevated cursor-pointer border-b transition-colors last:border-0"
              >
                <td className="text-brand-light px-4 py-3 font-mono">{order.orderNumber}</td>
                <td className="text-content-primary px-4 py-3">{order.description || '—'}</td>
                <td className="text-content-primary px-4 py-3">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.amount)}
                </td>
                <td className="text-content-secondary px-4 py-3">
                  {order.deliveryAddress.city && order.deliveryAddress.state
                    ? `${order.deliveryAddress.city} / ${order.deliveryAddress.state}`
                    : '—'}
                </td>
                <td className="text-content-secondary px-4 py-3">
                  {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3 font-medium">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <p className="text-content-muted py-12 text-center">
            {orders.length === 0 ? t('orders.notFound') : t('orders.noSearchResults')}
          </p>
        )}
      </div>
    </div>
  )
}
