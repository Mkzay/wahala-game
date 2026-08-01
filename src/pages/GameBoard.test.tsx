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
          roomId: 'room-1',
          mode: 'classic',
          round: 1,
          totalRounds: null,
          phase: 'roundActive',
          turnPhase: 'awaitingPlay',
          status: 'active',
          currentTurnPlayerId: 'p1',
          turnOrder: ['p1'],
          isClockwise: true,
          players: [],
          playerHands: {},
          market: [],
          discardPile: [],
          activeCard: null,
          declaredSuit: null,
          activeRules: [],
          reactionWindow: null,
          timerSeconds: null,
          winnerId: null,
        },
      })
    })

    expect(result.current.gameState?.gameId).toBe('room-1')

    act(() => {
      result.current.onCardPlayed({
        gameId: 'room-1',
        playerId: 'p1',
        marketCount: 29,
        nextTurnPlayerId: 'p2',
        playedAtMs: Date.now(),
      })
    })

    expect(result.current.gameState?.currentTurnPlayerId).toBe('p2')
  })
})
