import type { ISocketService } from '../types/socket'
import type { Socket } from 'socket.io-client'

class MockSocketService implements ISocketService {
  private listeners: Map<string, Set<(data: any) => void>> = new Map()
  private connected: boolean = true

  public connect(): Socket | null {
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
    // Echo or simulate backend responses for dev mocking
    if (event === 'game:join') {
      setTimeout(() => {
        this.triggerEvent('game:stateSnapshot', {
          game: {
            gameId: (data as any)?.gameId ?? 'demo-room-id',
            mode: 'classic',
            round: 1,
            totalRounds: 5,
            currentTurnPlayerId: 'you-id',
            marketCount: 24,
            activeRules: ['light'],
            players: [
              { id: 'you-id', username: 'Mkzay (You)', class: 'mastermind', cardCount: 5, status: 'active' },
              { id: 'esther-id', username: 'Esther', class: 'striker', cardCount: 6, status: 'active' },
              { id: 'happiness-id', username: 'Happiness', class: 'wall', cardCount: 4, status: 'active' },
            ],
            myHand: [
              { id: 'card-1', suit: 'circle', value: 7 },
              { id: 'card-2', suit: 'star', value: 4 },
              { id: 'card-3', suit: 'triangle', value: 12 },
              { id: 'card-4', suit: 'cross', value: 5 },
            ],
            activeCard: { id: 'card-init', suit: 'circle', value: 3 },
            reactionWindowEndsAtMs: null,
          },
        })
      }, 50)
    }

    if (event === 'card:play') {
      const payload = data as any
      setTimeout(() => {
        this.triggerEvent('card:played', {
          gameId: payload?.gameId ?? 'demo-room-id',
          playerId: payload?.playerId ?? 'you-id',
          card: payload?.card,
          marketCount: 23,
          nextTurnPlayerId: 'esther-id',
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
