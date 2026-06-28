import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PackagePlus, PackageCheck } from 'lucide-react'
import { notificationsService } from '@/api/services'
import { queryClient, queryKeys } from '@/lib/queryClient'
import { NotificationType, type AppNotification } from '@/types'

const NOTIFICATION_CONFIG: Record<
  NotificationType,
  {
    icon: React.ReactElement
    i18nKey: string
  }
> = {
  [NotificationType.OrderRegistered]: {
    icon: <PackagePlus className="h-4 w-4" />,
    i18nKey: 'notifications.orderRegistered',
  },
  [NotificationType.OrderDelivered]: {
    icon: <PackageCheck className="h-4 w-4" />,
    i18nKey: 'notifications.orderDelivered',
  },
}

export function NotificationsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: notificationsService.getAll,
  })

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread })
    },
  })

  function handleClick(notification: AppNotification) {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id)
    }
    void navigate(`/orders/${notification.orderId}`)
  }

  if (isLoading) {
    return <p className="text-content-secondary p-8">{t('common.loading')}</p>
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-content-primary text-xl font-semibold">{t('notifications.title')}</h1>
      </div>

      <div className="bg-surface-card border-surface-border overflow-hidden rounded-lg border">
        {notifications.length === 0 ? (
          <p className="text-content-muted py-12 text-center">{t('notifications.noData')}</p>
        ) : (
          <ul>
            {notifications.map((notification) => {
              const config = NOTIFICATION_CONFIG[notification.type]

              return (
                <li
                  key={notification.id}
                  onClick={() => handleClick(notification)}
                  className={`border-surface-border hover:bg-surface-elevated flex cursor-pointer items-start gap-4 border-b px-6 py-4 transition-colors last:border-0 ${
                    !notification.isRead ? 'bg-brand-muted' : ''
                  }`}
                >
                  <span className={`mt-0.5 ${!notification.isRead ? 'text-brand-light' : 'text-content-muted'}`}>
                    {config.icon}
                  </span>

                  <div className="flex flex-1 flex-col gap-1">
                    <p
                      className={`text-sm ${!notification.isRead ? 'text-content-primary font-medium' : 'text-content-secondary'}`}
                    >
                      {t(config.i18nKey)}
                    </p>

                    <div className="flex gap-4">
                      <span className="text-content-muted text-xs">
                        {new Date(notification.createdAt).toLocaleString('pt-BR')}
                      </span>
                      {notification.isRead && notification.readAt && (
                        <span className="text-content-muted text-xs">
                          {t('notifications.markAsRead')}: {new Date(notification.readAt).toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>

                  {!notification.isRead && <span className="bg-brand-light mt-1.5 h-2 w-2 shrink-0 rounded-full" />}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
