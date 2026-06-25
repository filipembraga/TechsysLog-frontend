import { authService } from '@/api/services'
import { setAccessToken } from '@/lib/tokenStore'
import type { LoginResponseDto, UserDto } from '@/types/dtos'
import { useState, useCallback, useEffect, type ReactNode } from 'react'
import { AuthContext } from './useAuth'


export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<UserDto | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Tries to restore the session via the refresh token cookie on first render.
  // The access token never survives a reload — only the httpOnly cookie does.
  useEffect(() => {
    authService
      .refresh()
      .then((data: LoginResponseDto) => {
        setAccessToken(data.token)
        setToken(data.token)
        setUser(data.user)
      })
      .catch(() => {
        setAccessToken(null)
        setToken(null)
        setUser(null)
      })
      .finally(() => {
        setIsLoaded(true)
      })
  }, [])

  const login = useCallback((newToken: string, newUser: UserDto) => {
    setAccessToken(newToken)
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setAccessToken(null)
      setToken(null)
      setUser(null)
    }
  }, [])

  return <AuthContext.Provider value={{ user, token, isLoaded, login, logout }}>{children}</AuthContext.Provider>
}
