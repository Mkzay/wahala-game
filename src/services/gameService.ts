import { api } from './api'
import type { GameState } from '../types/game'

function transformGame(raw: any): GameState {
  return {
    gameId: raw.gameId,
    mode: raw.mode,
    round: raw.round,
    currentTurnPlayerId: raw.currentTurnPlayerId ?? null,
    activeRules: raw.activeRules ?? [],
    marketCount: raw.marketCount ?? 0,
    reactionWindowEndsAtMs: raw.reactionWindowEndsAtMs ?? null,
    players: (raw.players ?? []).map((p: any) => ({
      id: p.userId ?? p.id,
      username: p.username,
      cardCount: p.cardCount,
      status: p.status,
    })),
  }
}

export const gameService = {
  async getGameState(gameId: string): Promise<GameState> {
    const response = await api.get<any>(`/games/${gameId}`)
    return transformGame(response.data)
  },
}
