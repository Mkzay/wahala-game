import { useEffect } from 'react'
import { socketService } from '../services/socketService'
import { useGameState } from './useGameState'

interface UseGameSocketOptions {
  gameId: string
  enabled?: boolean
}

interface UseGameSocketResult {
  isConnected: boolean
}

export function useGameSocket({
  gameId,
  enabled = true,
}: UseGameSocketOptions): UseGameSocketResult {
  const {
    isConnected,
    setConnected,
    applyStateSnapshot,
    onCardPlayed,
  } = useGameState()

  useEffect(() => {
    if (!enabled || gameId.length === 0) {
      return
    }

    socketService.connect(gameId)

    const requestStateSnapshot = () => {
      socketService.emit('game:state:request', { gameId })
    }

    const handleConnect = () => {
      setConnected(true)
      requestStateSnapshot()
    }

    const handleDisconnect = () => {
      setConnected(false)
    }

    socketService.on('connect', handleConnect)
    socketService.on('disconnect', handleDisconnect)
    socketService.on('game:stateSnapshot', applyStateSnapshot)
    socketService.on('game:card:played', onCardPlayed)
    socketService.on('game:error', onCardPlayed)

    if (socketService.isConnected()) {
      handleConnect()
    }

    return () => {
      socketService.off('connect', handleConnect)
      socketService.off('disconnect', handleDisconnect)
      socketService.off('game:stateSnapshot', applyStateSnapshot)
      socketService.off('game:card:played', onCardPlayed)
      socketService.off('game:error', onCardPlayed)
      socketService.disconnect()
    }
  }, [
    enabled,
    gameId,
    setConnected,
    applyStateSnapshot,
    onCardPlayed,
  ])

  return { isConnected }
}
