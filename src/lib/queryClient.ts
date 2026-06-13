import { QueryClient } from '@tanstack/react-query'

// Central query keys — ensures consistent cache invalidation
export const queryKeys = {
  orders: {
    all: ['orders'] as const,
    byId: (id: string) => ['orders', id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    unread: ['notifications', 'unread'] as const,
  },
  deliveries: {
    byOrderId: (orderId: string) => ['deliveries', orderId] as const,
  },
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})