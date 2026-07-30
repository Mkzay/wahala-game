// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLobbyStore } from '../store/lobbyStore'

describe('LobbyStore & Lobby integration', () => {
  it('manages lobby members and ready state correctly', () => {
    const { result } = renderHook(() => useLobbyStore())

    expect(result.current.isReady).toBe(false)

    act(() => {
      result.current.toggleReady()
    })

    expect(result.current.isReady).toBe(true)

    act(() => {
      result.current.setMembers([
        { id: 'm1', username: 'Mkzay', isHost: true, isReady: true },
        { id: 'm2', username: 'Esther', isHost: false, isReady: false },
      ])
    })

    expect(result.current.members).toHaveLength(2)
    expect(result.current.members[0].username).toBe('Mkzay')
  })
})
