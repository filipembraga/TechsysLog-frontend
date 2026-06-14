import { apiClient } from './client'

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await apiClient.post('/api/Auth/login', { email, password })
    return data
  },

  register: async (name: string, email: string, password: string) => {
    const { data } = await apiClient.post('/api/Auth/register', { name, email, password })
    return data
  },
}