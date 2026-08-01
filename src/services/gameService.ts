import { api } from './api'
import type { GameState } from '../types/game'

function transformGame(raw: any): GameState {
  return {
    gameId: raw?.gameId ?? 'game-demo',
    roomId: raw?.roomId ?? 'room-demo',
    mode: raw?.mode ?? 'classic',
    round: raw?.round ?? 1,
    totalRounds: raw?.totalRounds ?? 5,
    phase: raw?.phase ?? 'roundActive',
    turnPhase: raw?.turnPhase ?? 'awaitingPlay',
    status: raw?.status ?? 'active',
    currentTurnPlayerId: raw?.currentTurnPlayerId ?? null,
    turnOrder: raw?.turnOrder ?? [],
    isClockwise: raw?.isClockwise ?? true,
    players: (raw?.players ?? []).map((p: any) => ({
      userId: p.userId ?? p.id ?? 'user-demo',
      username: p.username ?? 'Player',
      cardCount: p.cardCount ?? 0,
      status: p.status ?? 'active',
      class: p.class ?? null,
      previousClass: p.previousClass ?? null,
      abilityUsed: p.abilityUsed ?? false,
      activeShield: p.activeShield ?? false,
      comboBoostActive: p.comboBoostActive ?? false,
      cardValueSum: p.cardValueSum ?? 0,
      cumulativeScore: p.cumulativeScore ?? 0,
    })),
    playerHands: raw?.playerHands ?? {},
    market: raw?.market ?? [],
    discardPile: raw?.discardPile ?? [],
    activeCard: raw?.activeCard ?? null,
    declaredSuit: raw?.declaredSuit ?? null,
    activeRules: raw?.activeRules ?? [],
    reactionWindow: raw?.reactionWindow ?? null,
    timerSeconds: raw?.timerSeconds ?? null,
    winnerId: raw?.winnerId ?? null,
  }
}

export const gameService = {
  async getGameState(gameId: string): Promise<GameState> {
    const response = await api.get<any>(`/games/${gameId}`)
    return transformGame(response.data)
  },
}
