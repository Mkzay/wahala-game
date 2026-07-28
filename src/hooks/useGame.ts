import { useQuery } from '@tanstack/react-query'
import { gameService } from '../services/gameService'
import type { GameState } from '../types/game'
import type { AppError } from '../types/api'

interface UseGameResult {
  game: GameState | null
  isLoading: boolean
  error: AppError | null
}

export function useGame(gameId: string): UseGameResult {
  const query = useQuery<GameState, AppError>({
    queryKey: ['game', gameId],
    queryFn: () => gameService.getGameState(gameId),
    staleTime: 5000,
    enabled: gameId.length > 0,
  })

  return {
    game: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error ?? null,
  }
}
