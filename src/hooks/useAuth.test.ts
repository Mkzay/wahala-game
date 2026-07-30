// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from './useAuth'

describe('useAuth hook', () => {
  it('manages local login and logout state correctly', async () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(false)

    act(() => {
      result.current.login({
        id: 'u1',
        username: 'TestUser',
        email: 'test@example.com',
      })
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.username).toBe('TestUser')

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
  })
})
