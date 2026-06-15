import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PackagePlus, PackageCheck } from 'lucide-react'
import { notificationsService } from '@/api/services'
import { queryClient, queryKeys } from '@/lib/queryClient'
import { NotificationType, type AppNotification } from '@/types'

const NOTIFICATION_CONFIG: Record<NotificationType, {
  icon: React.ReactElement
  i18nKey: string
}> = {
  [NotificationType.OrderRegistered]: {
    icon:    <PackagePlus className="w-4 h-4" />,
    i18nKey: 'notifications.orderRegistered',
  },
  [NotificationType.OrderDelivered]: {
    icon:    <PackageCheck className="w-4 h-4" />,
    i18nKey: 'notifications.orderDelivered',
  },
}

export function NotificationsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn:  notificationsService.getAll,
  })

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread })
    },
  })

  function handleClick(notification: AppNotification) {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id)
    }
    navigate(`/orders/${notification.orderId}`)
  }

  if (isLoading) {
    return <p className="text-content-secondary p-8">{t('common.loading')}</p>
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-content-primary">{t('notifications.title')}</h1>
      </div>

      <div className="bg-surface-card border border-surface-border rounded-lg overflow-hidden">
        {notifications.length === 0 ? (
          <p className="text-center text-content-muted py-12">{t('notifications.noData')}</p>
        ) : (
          <ul>
            {notifications.map((notification) => {
              const config = NOTIFICATION_CONFIG[notification.type]

              return (
                <li
                  key={notification.id}
                  onClick={() => handleClick(notification)}
                  className={`flex items-start gap-4 px-6 py-4 border-b border-surface-border last:border-0 cursor-pointer transition-colors hover:bg-surface-elevated ${
                    !notification.isRead ? 'bg-brand-muted' : ''
                  }`}
                >
                  <span className={`mt-0.5 ${!notification.isRead ? 'text-brand-light' : 'text-content-muted'}`}>
                    {config.icon}
                  </span>

                  <div className="flex-1 flex flex-col gap-1">
                    <p className={`text-sm ${!notification.isRead ? 'text-content-primary font-medium' : 'text-content-secondary'}`}>
                      {t(config.i18nKey)}
                    </p>

                    <div className="flex gap-4">
                      <span className="text-xs text-content-muted">
                        {new Date(notification.createdAt).toLocaleString('pt-BR')}
                      </span>
                      {notification.isRead && notification.readAt && (
                        <span className="text-xs text-content-muted">
                          {t('notifications.markAsRead')}: {new Date(notification.readAt).toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>

                  {!notification.isRead && (
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-light shrink-0" />
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}