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

    socketService.connect()

    const requestStateSnapshot = () => {
      socketService.emit('game:join', { gameId })
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
    socketService.on('card:played', onCardPlayed)
    socketService.on('turn:changed', onTurnChanged)
    socketService.on('rule:activated', onRuleActivated)
    socketService.on('round:ended', onRoundEnded)
    socketService.on('game:ended', onGameEnded)
    socketService.on('player:disconnected', onPlayerDisconnected)
    socketService.on('reaction:window:opened', onReactionWindowOpened)
    socketService.on('ability:used', onAbilityUsed)

    if (socketService.isConnected()) {
      handleConnect()
    }

    return () => {
      socketService.off('connect', handleConnect)
      socketService.off('disconnect', handleDisconnect)
      socketService.off('game:stateSnapshot', applyStateSnapshot)
      socketService.off('card:played', onCardPlayed)
      socketService.off('turn:changed', onTurnChanged)
      socketService.off('rule:activated', onRuleActivated)
      socketService.off('round:ended', onRoundEnded)
      socketService.off('game:ended', onGameEnded)
      socketService.off('player:disconnected', onPlayerDisconnected)
      socketService.off('reaction:window:opened', onReactionWindowOpened)
      socketService.off('ability:used', onAbilityUsed)
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
