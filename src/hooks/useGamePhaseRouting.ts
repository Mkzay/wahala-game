import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'

const phasePathMap = {
  classSelection: 'class-selection',
  board: 'board',
  roundEnd: 'round-end',
  gameEnd: 'game-end',
} as const

export function useGamePhaseRouting() {
  const navigate = useNavigate()
  const location = useLocation()
  const { gameId } = useParams()
  const gamePhase = useGameStore((state) => state.gamePhase)

  useEffect(() => {
    if (!gameId) {
      return
    }

    const target = `/game/${gameId}/${phasePathMap[gamePhase]}`
    if (location.pathname !== target) {
      navigate(target, { replace: true })
    }
  }, [gameId, gamePhase, location.pathname, navigate])
}
