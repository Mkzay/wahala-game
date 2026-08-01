import type { ISocketService } from '../types/socket'
import type { Socket } from 'socket.io-client'

class MockSocketService implements ISocketService {
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private connected: boolean = true

  public connect(_gameId?: string): Socket | null {
    this.connected = true
    this.triggerEvent('connect', {})
    return null
  }

  public disconnect(): void {
    this.connected = false
    this.triggerEvent('disconnect', {})
  }

  public getSocket(): Socket | null {
    return null
  }

  public isConnected(): boolean {
    return this.connected
  }

  public emit<T = unknown>(event: string, data?: T): void {
    if (event === 'game:state:request') {
      setTimeout(() => {
        this.triggerEvent('game:stateSnapshot', {
          game: {
            gameId: (data as any)?.gameId ?? 'demo-room-id',
            roomId: (data as any)?.gameId ?? 'demo-room-id',
            mode: 'classic',
            round: 1,
            totalRounds: 5,
            phase: 'roundActive',
            turnPhase: 'awaitingPlay',
            status: 'active',
            currentTurnPlayerId: 'you-id',
            turnOrder: ['you-id', 'esther-id', 'happiness-id', 'roseanne-id'],
            isClockwise: true,
            players: [
              { userId: 'you-id', username: 'Mkzay', cardCount: 5, status: 'active', class: 'mastermind', previousClass: null, abilityUsed: false, activeShield: false, comboBoostActive: false, cardValueSum: 0, cumulativeScore: 0 },
              { userId: 'esther-id', username: 'Esther', cardCount: 6, status: 'active', class: 'striker', previousClass: null, abilityUsed: false, activeShield: false, comboBoostActive: false, cardValueSum: 0, cumulativeScore: 0 },
              { userId: 'happiness-id', username: 'Happiness', cardCount: 4, status: 'active', class: 'wall', previousClass: null, abilityUsed: false, activeShield: false, comboBoostActive: false, cardValueSum: 0, cumulativeScore: 0 },
            ],
            playerHands: {
              'you-id': [
                { id: 'card-1', number: 7, suit: 'Circle', type: 'normal' },
                { id: 'card-2', number: 4, suit: 'Star', type: 'normal' },
                { id: 'card-3', number: 12, suit: 'Triangle', type: 'normal' },
                { id: 'card-4', number: 5, suit: 'Cross', type: 'normal' },
              ],
            },
            market: [],
            discardPile: [],
            activeCard: { id: 'card-init', number: 3, suit: 'Circle', type: 'normal' },
            declaredSuit: null,
            activeRules: [],
            reactionWindow: null,
            timerSeconds: null,
            winnerId: null,
          },
        })
      }, 50)
    }

    if (event === 'game:card:play') {
      const payload = data as any
      setTimeout(() => {
        this.triggerEvent('game:card:played', {
          gameId: payload?.gameId ?? 'demo-room-id',
          playerId: 'you-id',
          nextTurnPlayerId: 'esther-id',
          marketCount: 23,
          playedAtMs: Date.now(),
        })
      }, 50)
    }
  }

  public on<T = unknown>(event: string, callback: (data: T) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  public off(event: string, callback?: (...args: any[]) => void): void {
    if (!callback) {
      this.listeners.delete(event)
      return
    }
    const set = this.listeners.get(event)
    if (set) {
      set.delete(callback)
    }
  }

  public triggerEvent(event: string, data: any): void {
    const set = this.listeners.get(event)
    if (set) {
      set.forEach((cb) => cb(data))
    }
  }
}

export const mockSocketService = new MockSocketService()
