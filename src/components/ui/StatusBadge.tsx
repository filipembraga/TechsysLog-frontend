import { useTranslation } from 'react-i18next'
import { ORDER_STATUS } from '@/constants/orderStatus'

interface StatusBadgeProps {
  status: number
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t }    = useTranslation()
  const config   = ORDER_STATUS[status as keyof typeof ORDER_STATUS]

  if (!config) return null

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.color} ${config.bg}`}>
      {config.icon}
      {t(config.i18nKey)}
    </span>
  )
}