import { useAuth } from '@/context/useAuth'
import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi, type Mock } from 'vitest'
import { useSignalR } from './useSignalR'
import * as signalR from '@microsoft/signalr'
import { toast } from 'sonner'
import { NotificationType } from '@/types'

const { mockConnection, mockInvalidateQueries, MockHubConnectionBuilderSpy } = vi.hoisted(() => {
  const mockConnection = {
    on: vi.fn(),
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
  }

  const MockHubConnectionBuilderSpy = vi.fn(function () {
    return {
      withUrl() {
        return this
      },
      withAutomaticReconnect() {
        return this
      },
      configureLogging() {
        return this
      },
      build() {
        return mockConnection
      },
    }
  })

  return {
    mockConnection,
    mockInvalidateQueries: vi.fn(),
    MockHubConnectionBuilderSpy,
  }
})

vi.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder: MockHubConnectionBuilderSpy,
  LogLevel: { Warning: 2 },
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()

  return {
    ...actual,
    useQueryClient: vi.fn(() => ({
      invalidateQueries: mockInvalidateQueries,
    })),
  }
})

vi.mock('sonner', () => ({
  toast: { info: vi.fn(), error: vi.fn() },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

describe('useSignalR', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockConnection.start.mockResolvedValue(undefined)
  })

  test('does not create connection when there is no token', () => {
    ;(useAuth as Mock).mockReturnValue({ token: null })

    renderHook(() => useSignalR())

    expect(signalR.HubConnectionBuilder).not.toHaveBeenCalled()
  })

  test('creates and starts the connection when a token is present', async () => {
    ;(useAuth as Mock).mockReturnValue({ token: 'fake-token' })

    renderHook(() => useSignalR())

    await vi.waitFor(() => {
      expect(signalR.HubConnectionBuilder).toHaveBeenCalled()
      expect(mockConnection.start).toHaveBeenCalled()
    })
  })

  test('shows error toast when connection fails to start', async () => {
    ;(useAuth as Mock).mockReturnValue({ token: 'fake-token' })
    mockConnection.start.mockRejectedValueOnce(new Error('connection failed'))

    renderHook(() => useSignalR())

    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('notifications.connectionError')
    })
  })

  test('invalidates queries and shows toast when notification is received', async () => {
    ;(useAuth as Mock).mockReturnValue({ token: 'fake-token' })

    renderHook(() => useSignalR())

    await vi.waitFor(() => {
      expect(mockConnection.on).toHaveBeenCalledWith('ReceiveNotification', expect.any(Function))
    })

    const callback = mockConnection.on.mock.calls[0][1]

    callback({ type: NotificationType.OrderRegistered })

    expect(mockInvalidateQueries).toHaveBeenCalledTimes(2)
    expect(toast.info).toHaveBeenCalledWith('notifications.orderRegistered')
  })

  test('stops the connection on unmount', async () => {
    ;(useAuth as Mock).mockReturnValue({ token: 'fake-token' })

    const { unmount } = renderHook(() => useSignalR())

    await vi.waitFor(() => {
      expect(mockConnection.start).toHaveBeenCalled()
    })

    unmount()

    expect(mockConnection.stop).toHaveBeenCalled()
  })
})
