import { generateCorrelationId } from '@/lib/correlationId'
import { getAccessToken, setAccessToken } from '@/lib/tokenStore'
import axios from 'axios'
import { t } from 'i18next'
import { toast } from 'sonner'

export const apiClient = axios.create({
  baseURL: 'https://localhost:7260',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post('/api/auth/refresh')
      .then((response) => {
        const newToken = response.data.token
        setAccessToken(newToken)
        return newToken
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

apiClient.interceptors.request.use((config) => {
  config.headers['X-Correlation-Id'] = generateCorrelationId()
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Handles API errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const correlationId = error.response?.headers['x-correlation-id'] ?? error.config?.headers['X-Correlation-Id']

    const isNetworkOrServerError = !error.response || error.response.status >= 500

    if (isNetworkOrServerError) {
      console.error(`[${correlationId}]`, error)

      toast.error(t('errors.generic'), {
        description: `ID: ${correlationId.slice(0, 8)}...`,
        duration: Infinity,
        action: {
          label: t('errors.copyId'),
          onClick: () => {
            navigator.clipboard.writeText(correlationId)
            toast.success(t('errors.copied'))
          },
        },
      })
    }

   const isAuthEndpoint = error.config?.url?.toLowerCase().includes('/api/auth/')

    if (error.response?.status === 401 && !isAuthEndpoint) {
      try {
        const newToken = await refreshAccessToken()
        error.config.headers.Authorization = `Bearer ${newToken}`
        return apiClient.request(error.config)
      } catch {
        setAccessToken(null)
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)
