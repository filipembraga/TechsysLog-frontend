import type { AppNotification, Order } from '@/types'
import type { CreateOrderRequestDto, LoginResponseDto, UserResponseDto } from '@/types/dtos'
import { apiClient } from './client'

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponseDto> => {
    const { data } = await apiClient.post<LoginResponseDto>('/api/Auth/login', { email, password })
    return data
  },

  register: async (name: string, email: string, password: string): Promise<UserResponseDto> => {
    const { data } = await apiClient.post<UserResponseDto>('/api/Auth/register', { name, email, password })
    return data
  },

  refresh: async (): Promise<LoginResponseDto> => {
    const { data } = await apiClient.post<LoginResponseDto>('/api/Auth/refresh')
    return data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/Auth/logout')
  },
}

export const ordersService = {
  getAll: async (): Promise<Order[]> => {
    const { data } = await apiClient.get<Order[]>('/api/Orders')
    return data
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get<Order>(`/api/Orders/${id}`)
    return data
  },

  create: async (data: CreateOrderRequestDto): Promise<Order> => {
    const { data: order } = await apiClient.post<Order>('/api/Orders', data)
    return order
  },
}

export const deliveriesService = {
  register: async (orderId: string): Promise<void> => {
    await apiClient.post('/api/Deliveries', { orderId })
  },
}

export const notificationsService = {
  getAll: async (): Promise<AppNotification[]> => {
    const { data } = await apiClient.get<AppNotification[]>('/api/Notifications')
    return data
  },

  getUnread: async (): Promise<AppNotification[]> => {
    const { data } = await apiClient.get<AppNotification[]>('/api/Notifications/unread')
    return data
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/api/Notifications/${id}/read`)
  },
}
