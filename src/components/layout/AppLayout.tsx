import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuth } from '@/context/useAuth'
import { useTranslation } from 'react-i18next'
import { useSignalR } from '@/hooks/useSignalR'
import { queryKeys } from '@/lib/queryClient'
import { notificationsService } from '@/api/services'
import { useQuery } from '@tanstack/react-query'

const BADGE_LIMIT = 9

export function AppLayout() {
  useSignalR()

  const { data: unread = [] } = useQuery({
    queryKey: queryKeys.notifications.unread,
    queryFn: notificationsService.getUnread,
  })

  const unreadCount = unread.length
  const badgeLabel =
    unreadCount > BADGE_LIMIT ? `${BADGE_LIMIT}+` : String(unreadCount)
  const badgeUrgent = unreadCount > BADGE_LIMIT

  const { t } = useTranslation()
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen flex-row overflow-hidden">
      <aside className="bg-surface-elevated sticky flex h-screen w-56 shrink-0 flex-col py-4">
        <div className="flex flex-col gap-6">
          <span className="text-content-primary px-4 font-mono text-lg font-bold">
            TechsysLog
          </span>
          <nav>
            <ul className="flex flex-col gap-1">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `flex cursor-pointer items-center rounded px-4 py-2 text-base transition-colors ${
                      isActive
                        ? 'text-brand-light bg-brand-muted'
                        : 'text-content-secondary hover:text-content-primary hover:bg-surface-border'
                    }`
                  }
                >
                  {t('orders.title')}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/notifications"
                  className={({ isActive }) =>
                    `flex min-w-0 cursor-pointer items-center justify-between rounded px-4 py-2 text-base transition-colors ${
                      isActive
                        ? 'text-brand-light bg-brand-muted'
                        : 'text-content-secondary hover:text-content-primary hover:bg-surface-border'
                    }`
                  }
                >
                  {t('notifications.title')}
                  {unreadCount > 0 && (
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                        badgeUrgent
                          ? 'bg-feedback-error text-white'
                          : 'bg-brand-light text-white'
                      }`}
                    >
                      {badgeLabel}
                    </span>
                  )}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-surface-border mt-auto flex flex-col gap-1 border-t pt-4">
          <span className="text-content-muted px-4 text-xs">{user?.name}</span>
          <Button
            variant="ghost"
            onClick={() => void handleLogout()}
            className="text-feedback-error w-full cursor-pointer justify-start px-4 text-base hover:text-red-400"
          >
            {t('common.logout')}
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
