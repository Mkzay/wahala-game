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
    onTurnChanged,
    onRuleActivated,
    onRoundEnded,
    onGameEnded,
    onPlayerDisconnected,
    onReactionWindowOpened,
    onAbilityUsed,
  } = useGameState()

  useEffect(() => {
    if (!enabled || gameId.length === 0) {
      return
    }

    const socket = socketService.connect()

    const requestStateSnapshot = () => {
      socket.emit('game:requestState', { gameId })
    }

    const handleConnect = () => {
      setConnected(true)
      requestStateSnapshot()
    }

    const handleDisconnect = () => {
      setConnected(false)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('game:stateSnapshot', applyStateSnapshot)
    socket.on('game:card:played', onCardPlayed)
    socket.on('game:turn:changed', onTurnChanged)
    socket.on('game:rule:activated', onRuleActivated)
    socket.on('round:ended', onRoundEnded)
    socket.on('game:ended', onGameEnded)
    socket.on('player:disconnected', onPlayerDisconnected)
    socket.on('game:reaction:window:opened', onReactionWindowOpened)
    socket.on('game:ability:activated', onAbilityUsed)

    if (socket.connected) {
      handleConnect()
    }

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('game:stateSnapshot', applyStateSnapshot)
      socket.off('game:card:played', onCardPlayed)
      socket.off('game:turn:changed', onTurnChanged)
      socket.off('game:rule:activated', onRuleActivated)
      socket.off('round:ended', onRoundEnded)
      socket.off('game:ended', onGameEnded)
      socket.off('player:disconnected', onPlayerDisconnected)
      socket.off('game:reaction:window:opened', onReactionWindowOpened)
      socket.off('game:ability:activated', onAbilityUsed)
      socketService.disconnect()
    }
  }, [
    enabled,
    gameId,
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
  ])

  return { isConnected }
}
