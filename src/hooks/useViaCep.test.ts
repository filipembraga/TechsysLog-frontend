import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useViaCep } from './useViaCep'

describe('useViaCep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    globalThis.fetch = vi.fn()
  })

  test('does not fetch when zip code is incomplete', () => {
    const { result } = renderHook(() => useViaCep())

    act(() => {
      result.current.setCep('0131010') // 7 digits — incomplete
    })

    vi.advanceTimersByTime(600)

    expect(fetch).not.toHaveBeenCalled()
  })

  test('does not fetch before time setted', async () => {
    const { result } = renderHook(() => useViaCep())

    act(() => {
      result.current.setCep('01310100')
    })

    await vi.advanceTimersByTimeAsync(599)

    expect(fetch).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)

    expect(fetch).toHaveBeenCalled()
  })

  test('returns address data on successful lookup', async () => {
    ;(fetch as Mock).mockResolvedValue({
      json: () => ({
        logradouro: 'Rua Conde de Bonfim',
        bairro: 'Tijuca',
        localidade: 'Rio de Janeiro',
        uf: 'RJ',
      }),
    })

    const { result } = renderHook(() => useViaCep())

    act(() => {
      result.current.setCep('20520054')
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(600)
    })

    expect(result.current.result).toEqual({
      street: 'Rua Conde de Bonfim',
      neighborhood: 'Tijuca',
      city: 'Rio de Janeiro',
      state: 'RJ',
    })
  })
})
