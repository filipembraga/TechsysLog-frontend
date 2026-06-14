import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { Toaster } from 'sonner'
import { RegisterPage } from './pages/RegisterPage'
import { useAuth } from './context/AuthContext'
import type { ReactNode } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { OrdersPage } from './pages/OrdersPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<OrdersPage />}/>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  )
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, isLoaded } = useAuth()

  if (!isLoaded) {
    return <div>Loading...</div>
  }
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { token, isLoaded } = useAuth()

  if (!isLoaded) {
    return <div>Loading...</div>
  }
  if (token) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}