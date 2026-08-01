import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './gameStore'
import type { GameState } from '../types/game'

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame()
  })

  it('initializes with default empty state', () => {
    const state = useGameStore.getState()
    expect(state.gameState).toBeNull()
    expect(state.canAccessGame).toBe(false)
    expect(state.gamePhase).toBe('board')
  })

  it('applies game state snapshot correctly', () => {
    const mockState: GameState = {
      gameId: 'room-101',
      roomId: 'room-101',
      mode: 'classic',
      round: 1,
      totalRounds: null,
      phase: 'roundActive',
      turnPhase: 'awaitingPlay',
      status: 'active',
      currentTurnPlayerId: 'player-1',
      turnOrder: ['player-1'],
      isClockwise: true,
      players: [
        { userId: 'player-1', username: 'Mkzay', cardCount: 5, status: 'active', class: null, previousClass: null, abilityUsed: false, activeShield: false, comboBoostActive: false, cardValueSum: 0, cumulativeScore: 0 },
      ],
      playerHands: {},
      market: [],
      discardPile: [],
      activeCard: null,
      declaredSuit: null,
      activeRules: [],
      reactionWindow: null,
      timerSeconds: null,
      winnerId: null,
    }

    useGameStore.getState().applyStateSnapshot({ game: mockState })

    const state = useGameStore.getState()
    expect(state.gameState?.gameId).toBe('room-101')
    expect(state.canAccessGame).toBe(true)
    expect(state.lastEvent).toBe('game:stateSnapshot')
  })

  it('handles card:played event and updates marketCount & turn', () => {
    const mockState: GameState = {
      gameId: 'room-101',
      roomId: 'room-101',
      mode: 'classic',
      round: 1,
      totalRounds: null,
      phase: 'roundActive',
      turnPhase: 'awaitingPlay',
      status: 'active',
      currentTurnPlayerId: 'player-1',
      turnOrder: ['player-1'],
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
    }

    useGameStore.getState().applyStateSnapshot({ game: mockState })
    useGameStore.getState().onCardPlayed({
      gameId: 'room-101',
      playerId: 'player-1',
      marketCount: 23,
      nextTurnPlayerId: 'player-2',
      playedAtMs: Date.now(),
    })

    const state = useGameStore.getState()
    expect(state.gameState?.currentTurnPlayerId).toBe('player-2')
    expect(state.lastEvent).toBe('card:played')
  })
})
