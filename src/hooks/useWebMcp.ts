import { useEffect, useRef } from 'react'
import { webMcpRegistry } from '../lib/webmcp/registry'
import { createGameTools, type WebMcpGameContext } from '../lib/webmcp/gameTools'
import { useGameStore } from '../store/gameStore'
import { useAuthStore } from '../store/authStore'
import { socketService } from '../services/socketService'

interface UseWebMcpOptions {
  gameId: string
  enabled?: boolean
}

export function useWebMcp({ gameId, enabled = true }: UseWebMcpOptions) {
  const gameIdRef = useRef(gameId)
  gameIdRef.current = gameId

  useEffect(() => {
    if (!enabled || !gameId) return

    const context: WebMcpGameContext = {
      getGameState: () => useGameStore.getState().gameState,
      getUserId: () => useAuthStore.getState().user?.id ?? '',
      playCard: (cardId: string, suitDemand?: string) => {
        const id = gameIdRef.current
        if (!id) return { success: false, reason: 'No active gameId' }
        socketService.emit('game:card:play', {
          gameId: id,
          cardId,
          ...(suitDemand ? { declaredSuit: suitDemand } : {}),
        })
        socketService.emit('game:state:request', { gameId: id })
        return { success: true }
      },
      drawCard: () => {
        const id = gameIdRef.current
        if (!id) return { success: false, reason: 'No active gameId' }
        socketService.emit('game:card:draw', { gameId: id })
        socketService.emit('game:state:request', { gameId: id })
        return { success: true }
      },
      useAbility: (abilityId: string, payload?: any) => {
        const id = gameIdRef.current
        if (!id) return { success: false, reason: 'No active gameId' }
        socketService.emit('game:ability:use', {
          gameId: id,
          abilityId,
          payload,
        })
        socketService.emit('game:state:request', { gameId: id })
        return { success: true }
      },
      respondReaction: (action: 'reflect' | 'absorb') => {
        const id = gameIdRef.current
        if (!id) return { success: false, reason: 'No active gameId' }
        socketService.emit('game:reaction:respond', {
          gameId: id,
          action,
        })
        return { success: true }
      },
      selectClass: (className: string) => {
        const id = gameIdRef.current
        if (!id) return { success: false, reason: 'No active gameId' }
        socketService.emit('round:class:select', {
          gameId: id,
          className,
        })
        socketService.emit('game:state:request', { gameId: id })
        return { success: true }
      },
      nextRound: () => {
        const id = gameIdRef.current
        if (!id) return { success: false, reason: 'No active gameId' }
        socketService.emit('round:next', { gameId: id })
        socketService.emit('game:state:request', { gameId: id })
        return { success: true }
      },
    }

    const tools = createGameTools(context)
    for (const tool of tools) {
      webMcpRegistry.registerTool(tool)
    }

    return () => {
      for (const tool of tools) {
        webMcpRegistry.unregisterTool(tool.name)
      }
    }
  }, [enabled, gameId])
}
