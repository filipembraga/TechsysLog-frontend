import type { UserDto } from '@/types/dtos'
import { createContext, useContext } from 'react'

interface AuthContextValue {
  user: UserDto | null
  token: string | null
  isLoaded: boolean
  login: (token: string, user: UserDto) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
