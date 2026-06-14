import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { Toaster } from 'sonner'
import { RegisterPage } from './pages/RegisterPage'

export default function App() {
    return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  )
}