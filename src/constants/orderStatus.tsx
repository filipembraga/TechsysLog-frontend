import type { OrderStatus } from '@/types'
import { Clock, Truck, CheckCircle, XCircle } from 'lucide-react'

export const ORDER_STATUS: Record<OrderStatus, {
  i18nKey: string
  color: string
  bg: string
  icon: React.ReactElement
}> = {
  Pending: {
    i18nKey: 'status.pending',
    color: 'text-status-pending',
    bg: 'bg-status-pending-bg',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  Shipped: {
    i18nKey: 'status.shipped',
    color: 'text-status-shipped',
    bg: 'bg-status-shipped-bg',
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  Delivered: {
    i18nKey: 'status.delivered',
    color: 'text-status-delivered',
    bg: 'bg-status-delivered-bg',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  Cancelled: {
    i18nKey: 'status.cancelled',
    color: 'text-status-cancelled',
    bg: 'bg-status-cancelled-bg',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
}