// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameStore } from '../store/gameStore'

describe('GameBoard Store & State integration', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame()
  })

  it('updates current turn and market count on card:played socket event', () => {
    const { result } = renderHook(() => useGameStore())

    act(() => {
      result.current.applyStateSnapshot({
        game: {
          gameId: 'room-1',
          mode: 'classic',
          round: 1,
          currentTurnPlayerId: 'p1',
          marketCount: 30,
          activeRules: [],
          players: [],
          reactionWindowEndsAtMs: null,
        },
      })
    })

    expect(result.current.gameState?.marketCount).toBe(30)

    act(() => {
      result.current.onCardPlayed({
        gameId: 'room-1',
        playerId: 'p1',
        marketCount: 29,
        nextTurnPlayerId: 'p2',
        playedAtMs: Date.now(),
      })
    })

    expect(result.current.gameState?.marketCount).toBe(29)
    expect(result.current.gameState?.currentTurnPlayerId).toBe('p2')
  })
})
