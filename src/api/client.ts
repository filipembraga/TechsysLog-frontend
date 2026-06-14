import axios from 'axios'

export const apiClient = axios.create({
  baseURL: 'https://localhost:7260',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
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
    if (error.response?.status === 401) {
      localStorage.removeItem('techsyslog_token')
      localStorage.removeItem('techsyslog_user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)