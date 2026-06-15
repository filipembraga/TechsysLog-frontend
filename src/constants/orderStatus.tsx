import { Clock, Truck, CheckCircle, XCircle } from 'lucide-react'

export const ORDER_STATUS = {
  0: {
    i18nKey: 'status.pending',
    color:   'text-status-pending',
    bg:      'bg-status-pending-bg',
    icon:    <Clock className="w-3.5 h-3.5" />,
  },
  1: {
    i18nKey: 'status.shipped',
    color:   'text-status-shipped',
    bg:      'bg-status-shipped-bg',
    icon:    <Truck className="w-3.5 h-3.5" />,
  },
  2: {
    i18nKey: 'status.delivered',
    color:   'text-status-delivered',
    bg:      'bg-status-delivered-bg',
    icon:    <CheckCircle className="w-3.5 h-3.5" />,
  },
  3: {
    i18nKey: 'status.cancelled',
    color:   'text-status-cancelled',
    bg:      'bg-status-cancelled-bg',
    icon:    <XCircle className="w-3.5 h-3.5" />,
  },
} as const