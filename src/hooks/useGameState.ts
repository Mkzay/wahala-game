import type { GameState } from '../types/game'
import { useGameStore } from '../store/gameStore'
import type { GameStore } from '../store/gameStore'

interface UseGameStateResult {
  gameState: GameState | null
  gamePhase: GameStore['gamePhase']
  canAccessGame: boolean
  isConnected: boolean
  winnerPlayerId: string | null
  lastEvent: string | null
  setGamePhase: GameStore['setGamePhase']
  setGameState: (gameState: GameState | null) => void
  setCanAccessGame: (canAccessGame: boolean) => void
  setConnected: (isConnected: boolean) => void
  applyStateSnapshot: GameStore['applyStateSnapshot']
  onCardPlayed: GameStore['onCardPlayed']
  onTurnChanged: GameStore['onTurnChanged']
  onRuleActivated: GameStore['onRuleActivated']
  onRoundEnded: GameStore['onRoundEnded']
  onGameEnded: GameStore['onGameEnded']
  onPlayerDisconnected: GameStore['onPlayerDisconnected']
  onReactionWindowOpened: GameStore['onReactionWindowOpened']
  onAbilityUsed: GameStore['onAbilityUsed']
  resetGame: () => void
}

export function useGameState(): UseGameStateResult {
  const {
    gameState,
    gamePhase,
    canAccessGame,
    isConnected,
    winnerPlayerId,
    lastEvent,
    setGamePhase,
    setGameState,
    setCanAccessGame,
    setConnected,
    applyStateSnapshot,
    onCardPlayed,
    onTurnChanged,
    onRuleActivated,
    onRoundEnded,
    onGameEnded,
    onPlayerDisconnected,
    onReactionWindowOpened,
    onAbilityUsed,
    resetGame,
  } = useGameStore()

  return {
    gameState,
    gamePhase,
    canAccessGame,
    isConnected,
    winnerPlayerId,
    lastEvent,
    setGamePhase,
    setGameState,
    setCanAccessGame,
    setConnected,
    applyStateSnapshot,
    onCardPlayed,
    onTurnChanged,
    onRuleActivated,
    onRoundEnded,
    onGameEnded,
    onPlayerDisconnected,
    onReactionWindowOpened,
    onAbilityUsed,
    resetGame,
  }
}
