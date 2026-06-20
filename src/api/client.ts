import { generateCorrelationId } from '@/lib/correlationId'
import axios from 'axios'
import { t } from 'i18next'
import { toast } from 'sonner'

export const apiClient = axios.create({
  baseURL: 'https://localhost:7260',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  config.headers['X-Correlation-Id'] = generateCorrelationId()
  const token = localStorage.getItem('techsyslog_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Handles API errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
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

    if (error.response?.status === 401) {
      localStorage.removeItem('techsyslog_token')
      localStorage.removeItem('techsyslog_user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)
