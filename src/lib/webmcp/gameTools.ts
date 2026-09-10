import type { WebMcpTool, WebMcpToolResult } from './types'

export interface WebMcpGameContext {
  getGameState: () => any
  getUserId: () => string
  playCard: (
    cardId: string,
    suitDemand?: string
  ) => Promise<{ success: boolean; reason?: string }> | { success: boolean; reason?: string }
  drawCard: () => Promise<{ success: boolean; reason?: string }> | { success: boolean; reason?: string }
  useAbility: (
    abilityId: string,
    payload?: any
  ) => Promise<{ success: boolean; reason?: string }> | { success: boolean; reason?: string }
  respondReaction: (
    action: 'reflect' | 'absorb'
  ) => Promise<{ success: boolean; reason?: string }> | { success: boolean; reason?: string }
  selectClass?: (
    className: string
  ) => Promise<{ success: boolean; reason?: string }> | { success: boolean; reason?: string }
  nextRound?: () => Promise<{ success: boolean; reason?: string }> | { success: boolean; reason?: string }
}

export function createGameTools(ctx: WebMcpGameContext): WebMcpTool[] {
  const getGameStateTool: WebMcpTool = {
    name: 'get_game_state',
    description:
      'Returns a comprehensive, LLM-optimized snapshot of the Wahala game board, including player hand with playable status, table active card, declared suit, turn status, opponents, and pending penalties.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    handler: async (): Promise<WebMcpToolResult> => {
      const state = ctx.getGameState()
      const userId = ctx.getUserId()

      if (!state) {
        return {
          isError: true,
          content: [{ type: 'text', text: 'No active game state available.' }],
        }
      }

      const isMyTurn = state.currentTurnPlayerId === userId
      const myHand = (state.playerHands?.[userId] ?? []).map((c: any) => {
        const isPlayable = checkIsPlayable(c, state, isMyTurn)
        return {
          id: c.id,
          suit: c.suit,
          number: c.number,
          isPlayable,
          action: getActionLabel(c.number),
        }
      })

      const myPlayer = state.players?.find((p: any) => p.userId === userId)
      const opponents = (state.players ?? [])
        .filter((p: any) => p.userId !== userId)
        .map((p: any) => ({
          userId: p.userId,
          username: p.username,
          cardCount: p.cardCount,
          cardValueSum: p.cardValueSum,
          class: p.class,
          isTurn: p.userId === state.currentTurnPlayerId,
          exposedCards: state.playerHands?.[p.userId] ?? null,
        }))

      const summary = {
        phase: state.phase,
        round: state.round,
        totalRounds: state.totalRounds ?? 5,
        turn: {
          currentTurnPlayerId: state.currentTurnPlayerId,
          isMyTurn,
          turnTimeoutSeconds: 20,
        },
        activeCard: state.activeCard
          ? {
              id: state.activeCard.id,
              suit: state.activeCard.suit,
              number: state.activeCard.number,
              action: getActionLabel(state.activeCard.number),
            }
          : null,
        declaredSuit: state.declaredSuit ?? null,
        activeRules: state.activeRules ?? [],
        pendingPenalty: {
          count: state.pendingPenalty ?? 0,
          type: state.pendingPenaltyType ?? null,
          targetUserId: state.targetUserId ?? null,
          reactionWindowActive: Boolean(state.reactionWindow),
        },
        myPlayer: {
          userId,
          class: myPlayer?.class ?? null,
          abilityUsed: myPlayer?.abilityUsed ?? false,
          activeShield: state.activeShield ?? false,
        },
        myHand,
        opponents,
        marketRemaining: Array.isArray(state.market) ? state.market.length : (state.marketCount ?? 0),
        marketTopCard: state.market?.[0]?.suit !== 'hidden' ? state.market?.[0] : null,
      }

      return {
        content: [
          {
            type: 'json',
            data: summary,
          },
          {
            type: 'text',
            text: `Round ${summary.round} (${summary.phase}). Turn: ${isMyTurn ? 'YOUR TURN' : 'Opponent'}. Hand: ${myHand.length} cards (${myHand.filter((c: any) => c.isPlayable).length} playable). Active Card: ${summary.activeCard?.number ?? 'none'} of ${summary.declaredSuit ?? summary.activeCard?.suit ?? 'none'}.`,
          },
        ],
      }
    },
  }

  const playCardTool: WebMcpTool = {
    name: 'play_card',
    description:
      'Plays a card from your hand. If playing a Whot 20 wildcard, suitDemand must be specified as circles, triangles, crosses, squares, or stars.',
    inputSchema: {
      type: 'object',
      properties: {
        cardId: {
          type: 'string',
          description: 'The ID of the card to play from your hand',
        },
        suitDemand: {
          type: 'string',
          description:
            'Required if card is Whot (number 20). One of: circles, triangles, crosses, squares, stars.',
          enum: ['circles', 'triangles', 'crosses', 'squares', 'stars'],
        },
      },
      required: ['cardId'],
    },
    handler: async ({ cardId, suitDemand }: { cardId: string; suitDemand?: string }): Promise<WebMcpToolResult> => {
      const result = await ctx.playCard(cardId, suitDemand)
      if (!result.success) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to play card: ${result.reason ?? 'Invalid move'}` }],
        }
      }
      return {
        content: [{ type: 'text', text: `Successfully played card ${cardId}${suitDemand ? ` (demanded: ${suitDemand})` : ''}.` }],
      }
    },
  }

  const drawCardTool: WebMcpTool = {
    name: 'draw_card',
    description: 'Draws a card from the market deck when unable or unwilling to play a card.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    handler: async (): Promise<WebMcpToolResult> => {
      const result = await ctx.drawCard()
      if (!result.success) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to draw card: ${result.reason ?? 'Market action rejected'}` }],
        }
      }
      return {
        content: [{ type: 'text', text: 'Successfully drew a card from the market.' }],
      }
    },
  }

  const useAbilityTool: WebMcpTool = {
    name: 'use_class_ability',
    description:
      'Triggers a class active ability. Joker: mirror_play, rule_twist (with payload { suit }). Wall: block, hold_ground. Striker: double_down, relentless. Mastermind: perfect_setup (with payload { cardId }), mind_read (with payload { targetUserId }).',
    inputSchema: {
      type: 'object',
      properties: {
        abilityId: {
          type: 'string',
          description: 'The canonical ability ID to activate',
          enum: [
            'mirror_play',
            'rule_twist',
            'block',
            'hold_ground',
            'double_down',
            'relentless',
            'perfect_setup',
            'mind_read',
          ],
        },
        payload: {
          type: 'object',
          description: 'Optional arguments (e.g. suit for rule_twist, targetUserId for mind_read)',
        },
      },
      required: ['abilityId'],
    },
    handler: async ({
      abilityId,
      payload,
    }: {
      abilityId: string
      payload?: any
    }): Promise<WebMcpToolResult> => {
      const result = await ctx.useAbility(abilityId, payload)
      if (!result.success) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Failed to use ability '${abilityId}': ${result.reason ?? 'Rejected'}` }],
        }
      }
      return {
        content: [{ type: 'text', text: `Successfully activated class ability '${abilityId}'.` }],
      }
    },
  }

  const respondToPenaltyTool: WebMcpTool = {
    name: 'respond_to_penalty',
    description:
      'Responds during a 5-second penalty reaction window. Action reflect (Joker only) or absorb (Wall shield or defensive card).',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          description: 'The reaction action to execute',
          enum: ['reflect', 'absorb'],
        },
      },
      required: ['action'],
    },
    handler: async ({ action }: { action: 'reflect' | 'absorb' }): Promise<WebMcpToolResult> => {
      const result = await ctx.respondReaction(action)
      if (!result.success) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Reaction response failed: ${result.reason ?? 'Rejected'}` }],
        }
      }
      return {
        content: [{ type: 'text', text: `Successfully executed reaction: ${action}.` }],
      }
    },
  }

  const selectClassTool: WebMcpTool = {
    name: 'select_class',
    description: 'Selects and locks in a class during the classSelection phase.',
    inputSchema: {
      type: 'object',
      properties: {
        className: {
          type: 'string',
          description: 'The class to select',
          enum: ['joker', 'wall', 'striker', 'mastermind'],
        },
      },
      required: ['className'],
    },
    handler: async ({ className }: { className: string }): Promise<WebMcpToolResult> => {
      if (!ctx.selectClass) {
        return {
          isError: true,
          content: [{ type: 'text', text: 'Class selection is not currently available.' }],
        }
      }
      const result = await ctx.selectClass(className)
      if (!result.success) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Class selection failed: ${result.reason ?? 'Rejected'}` }],
        }
      }
      return {
        content: [{ type: 'text', text: `Successfully selected class '${className}'.` }],
      }
    },
  }

  const nextRoundTool: WebMcpTool = {
    name: 'next_round',
    description: 'Signals readiness to advance to the next round when phase is roundEnded.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    handler: async (): Promise<WebMcpToolResult> => {
      if (!ctx.nextRound) {
        return {
          isError: true,
          content: [{ type: 'text', text: 'Next round transition is not available.' }],
        }
      }
      const result = await ctx.nextRound()
      if (!result.success) {
        return {
          isError: true,
          content: [{ type: 'text', text: `Could not advance round: ${result.reason ?? 'Rejected'}` }],
        }
      }
      return {
        content: [{ type: 'text', text: 'Successfully requested next round.' }],
      }
    },
  }

  return [
    getGameStateTool,
    playCardTool,
    drawCardTool,
    useAbilityTool,
    respondToPenaltyTool,
    selectClassTool,
    nextRoundTool,
  ]
}

function checkIsPlayable(card: any, state: any, isMyTurn: boolean): boolean {
  if (!isMyTurn) return false
  if (
    (state.pendingPenalty ?? 0) > 0 &&
    card.number !== (state.pendingPenaltyType === 'pick_2' ? 2 : 5)
  ) {
    return false
  }
  if (!state.activeCard) return true
  const currentSuit = state.declaredSuit
    ? state.declaredSuit.toLowerCase()
    : state.activeCard.suit?.toLowerCase()

  return (
    card.suit === 'whot' ||
    card.number >= 20 ||
    card.suit?.toLowerCase() === currentSuit ||
    card.number === state.activeCard.number
  )
}

function getActionLabel(num: number): string | null {
  switch (num) {
    case 1:
      return 'Hold On'
    case 2:
      return 'Pick Two'
    case 5:
      return 'Pick Three'
    case 8:
      return 'Suspension'
    case 14:
      return 'General Market'
    case 20:
      return 'Whot · Wild'
    default:
      return null
  }
}
