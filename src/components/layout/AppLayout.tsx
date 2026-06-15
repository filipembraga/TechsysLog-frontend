import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { Button } from "../ui/Button"
import { useAuth } from "@/context/AuthContext"
import { useTranslation } from "react-i18next"

export function AppLayout() {
    const { t } = useTranslation()
    const { logout, user } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/login')
    }

    return (
        <div className="h-screen flex flex-row">
            <aside className="bg-surface-elevated w-56 h-full flex flex-col py-4">

                <div className="flex flex-col gap-6">
                    <span className="text-content-primary font-mono font-bold text-lg px-3">
                        TechsysLog
                    </span>
                    <nav>
                        <ul className="flex flex-col gap-1">
                            <li>
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) =>
                                        `flex items-center px-3 py-2 rounded text-sm transition-colors cursor-pointer ${isActive
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
                                        `flex items-center px-3 py-2 rounded text-sm transition-colors cursor-pointer ${isActive
                                            ? 'text-brand-light bg-brand-muted'
                                            : 'text-content-secondary hover:text-content-primary hover:bg-surface-border'
                                        }`
                                    }
                                >
                                    {t('notifications.title')}
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="mt-auto flex flex-col gap-1 border-t border-surface-border pt-4">
                    <span className="text-xs text-content-muted px-3">{user?.name}</span>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-feedback-error hover:text-red-400 px-3"
                    >
                        {t('common.logout')}
                    </Button>
                </div>
            </aside>
            <main className="flex-1">
                <Outlet />
            </main>
        </div >
    )
}