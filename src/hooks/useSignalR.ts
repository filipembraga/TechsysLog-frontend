import { useEffect } from 'react'
import * as signalR from '@microsoft/signalr'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { queryKeys } from '@/lib/queryClient'
import { NotificationType, type AppNotification } from '@/types'
import { apiClient } from '@/api/client'
import { useTranslation } from 'react-i18next'

const HUB_URL = `${apiClient.defaults.baseURL}/hubs/notifications`

const NOTIFICATION_I18N: Record<NotificationType, string> = {
  [NotificationType.OrderRegistered]: 'notifications.orderRegistered',
  [NotificationType.OrderDelivered]: 'notifications.orderDelivered',
}

export function useSignalR() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  useEffect(() => {
    if (!token) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        // WebSockets don't support custom headers — token goes via query string factory
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    connection.on('ReceiveNotification', (notification: AppNotification) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread })

      const i18nKey = NOTIFICATION_I18N[notification.type]
      toast.info(t(i18nKey))
    })

    connection.start().catch(() => {
      toast.error(t('notifications.connectionError'))
    })

    // Cleanup on unmount — closes connection on logout
    return () => {
      connection.stop()
    }
  }, [token, queryClient])
}
