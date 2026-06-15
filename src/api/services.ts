import type { AppNotification, Order } from '@/types'
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

export const ordersService = {
  getAll: async (): Promise<Order[]> => {
    const { data } = await apiClient.get('/api/Orders')
    return data
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get(`/api/Orders/${id}`)
    return data
  },
}

export const notificationsService = {
  getAll: async (): Promise<AppNotification[]> => {
    const { data } = await apiClient.get('/api/Notifications')
    return data
  },

  getUnread: async (): Promise<AppNotification[]> => {
    const { data } = await apiClient.get('/api/Notifications/unread')
    return data
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/Notifications/${id}/read`)
  },
}