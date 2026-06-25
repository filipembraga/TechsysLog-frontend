import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { Toaster } from 'sonner'
import { RegisterPage } from './pages/RegisterPage'
import { useAuth } from './context/useAuth'
import { useEffect, type ReactNode } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { OrdersPage } from './pages/OrdersPage'
import { NewOrderPage } from './pages/NewOrderPage'
import { OrderDetailPage } from './pages/OrderDetailPage'
import { useTranslation } from 'react-i18next'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { setNavigate } from './lib/navigation'

function NavigationSetup() {
  const navigate = useNavigate()
  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])
  return null
}

export function App() {
  return (
    <BrowserRouter>
      <NavigationSetup />
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<OrdersPage />}/>
          <Route path="/orders/new" element={<NewOrderPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  )
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, isLoaded } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()

  if (!isLoaded) {
    return <div>{t('common.loading')}</div>
  }
  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return <>{children}</>
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { token, isLoaded } = useAuth()
  const { t } = useTranslation()

  if (!isLoaded) {
    return <div>{t('common.loading')}</div>
  }
  if (token) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}