import { create } from 'zustand'
import type {
  AbilityUsedPayload,
  CardPlayedPayload,
  GameEndedPayload,
  GameSocketEvents,
  GameState,
  GameStateSnapshotPayload,
  PlayerDisconnectedPayload,
  ReactionWindowOpenedPayload,
  RoundEndedPayload,
  RuleActivatedPayload,
  TurnChangedPayload,
} from '../types/game'

type LastGameEvent = keyof GameSocketEvents | null
export type GamePhase = 'classSelection' | 'board' | 'roundEnd' | 'gameEnd'

export interface GameStore {
  gameState: GameState | null
  gamePhase: GamePhase
  canAccessGame: boolean
  isConnected: boolean
  winnerPlayerId: string | null
  lastEvent: LastGameEvent
  setGamePhase: (gamePhase: GamePhase) => void
  setGameState: (gameState: GameState | null) => void
  setCanAccessGame: (canAccessGame: boolean) => void
  setConnected: (isConnected: boolean) => void
  applyStateSnapshot: (payload: GameStateSnapshotPayload) => void
  onCardPlayed: (payload: CardPlayedPayload) => void
  onTurnChanged: (payload: TurnChangedPayload) => void
  onRuleActivated: (payload: RuleActivatedPayload) => void
  onRoundEnded: (payload: RoundEndedPayload) => void
  onGameEnded: (payload: GameEndedPayload) => void
  onPlayerDisconnected: (payload: PlayerDisconnectedPayload) => void
  onReactionWindowOpened: (payload: ReactionWindowOpenedPayload) => void
  onAbilityUsed: (payload: AbilityUsedPayload) => void
  resetGame: () => void
}

const phaseMap: Record<string, GamePhase> = {
  classSelection: 'classSelection',
  board: 'board',
  roundActive: 'board',
  shop: 'board',
  roundEnded: 'roundEnd',
  gameEnded: 'gameEnd',
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: null,
  gamePhase: 'board',
  canAccessGame: false,
  isConnected: false,
  winnerPlayerId: null,
  lastEvent: null,
  setGamePhase: (gamePhase) => set({ gamePhase }),
  setGameState: (gameState) => set({ gameState }),
  setCanAccessGame: (canAccessGame) => set({ canAccessGame }),
  setConnected: (isConnected) => set({ isConnected }),
  applyStateSnapshot: ({ game }) =>
    set({
      gameState: game,
      gamePhase: phaseMap[game.phase] ?? 'board',
      canAccessGame: true,
      winnerPlayerId: game.winnerId ?? null,
      lastEvent: 'game:stateSnapshot',
    }),
  onCardPlayed: (payload) =>
    set((state) => {
      if (!state.gameState || state.gameState.gameId !== payload.gameId) {
        return state
      }

      return {
        gameState: {
          ...state.gameState,
          currentTurnPlayerId: payload.nextTurnPlayerId,
        },
        lastEvent: 'card:played',
      }
    }),
  onTurnChanged: (payload) =>
    set((state) => {
      if (!state.gameState || state.gameState.gameId !== payload.gameId) {
        return state
      }

      return {
        gameState: {
          ...state.gameState,
          currentTurnPlayerId: payload.currentTurnPlayerId,
        },
        lastEvent: 'turn:changed',
      }
    }),
  onRuleActivated: (payload) =>
    set((state) => {
      if (!state.gameState || state.gameState.gameId !== payload.gameId) {
        return state
      }

      return { lastEvent: 'rule:activated' }
    }),
  onRoundEnded: (payload) =>
    set((state) => {
      if (!state.gameState || state.gameState.gameId !== payload.gameId) {
        return state
      }

      return {
        gameState: {
          ...state.gameState,
          round: payload.round,
        },
        gamePhase: 'roundEnd',
        lastEvent: 'round:ended',
      }
    }),
  onGameEnded: (payload) =>
    set((state) => {
      if (!state.gameState || state.gameState.gameId !== payload.gameId) {
        return state
      }

      return {
        gamePhase: 'gameEnd',
        winnerPlayerId: payload.winnerPlayerId,
        canAccessGame: true,
        lastEvent: 'game:ended',
      }
    }),
  onPlayerDisconnected: (payload) =>
    set((state) => {
      if (!state.gameState || state.gameState.gameId !== payload.gameId) {
        return state
      }

      return {
        gameState: {
          ...state.gameState,
          players: state.gameState.players.map((player) =>
            player.userId === payload.playerId
              ? { ...player, status: 'spectating' }
              : player,
          ),
        },
        lastEvent: 'player:disconnected',
      }
    }),
  onReactionWindowOpened: (payload) =>
    set((state) => {
      if (!state.gameState || state.gameState.gameId !== payload.gameId) {
        return state
      }

      return {
        gameState: {
          ...state.gameState,
          reactionWindow: state.gameState.reactionWindow
            ? { ...state.gameState.reactionWindow, expiresAtMs: payload.closesAtMs }
            : { targetUserId: '', attackerUserId: '', penaltyType: '', penaltyAmount: 0, expiresAtMs: payload.closesAtMs },
        },
        lastEvent: 'reaction:window:opened',
      }
    }),
  onAbilityUsed: (payload) =>
    set((state) => {
      if (!state.gameState || state.gameState.gameId !== payload.gameId) {
        return state
      }

      return { lastEvent: 'ability:used' }
    }),
  resetGame: () =>
    set({
      gameState: null,
      gamePhase: 'board',
      canAccessGame: false,
      isConnected: false,
      winnerPlayerId: null,
      lastEvent: null,
    }),
}))
