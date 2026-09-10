// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { WebMcpRegistryImpl } from './registry'
import { createGameTools, type WebMcpGameContext } from './gameTools'

describe('WebMCP Registry & Polyfill', () => {
  let registry: WebMcpRegistryImpl

  beforeEach(() => {
    registry = new WebMcpRegistryImpl()
  })

  it('registers and lists tools with their schemas', () => {
    registry.registerTool({
      name: 'ping',
      description: 'Ping test tool',
      inputSchema: {
        type: 'object',
        properties: {
          msg: { type: 'string' },
        },
        required: ['msg'],
      },
      handler: (params) => ({
        content: [{ type: 'text', text: `pong: ${params.msg}` }],
      }),
    })

    const tools = registry.listTools()
    expect(tools).toHaveLength(1)
    expect(tools[0].name).toBe('ping')
    expect(tools[0].description).toBe('Ping test tool')
    expect(tools[0].inputSchema.required).toEqual(['msg'])
  })

  it('validates required arguments when calling a tool', async () => {
    registry.registerTool({
      name: 'echo',
      description: 'Echoes message',
      inputSchema: {
        type: 'object',
        properties: { text: { type: 'string' } },
        required: ['text'],
      },
      handler: ({ text }) => ({
        content: [{ type: 'text', text }],
      }),
    })

    // Calling without required param
    const failResult = await registry.callTool('echo', {})
    expect(failResult.isError).toBe(true)
    expect(failResult.content[0].text).toContain("Missing required parameter 'text'")

    // Calling with required param
    const successResult = await registry.callTool('echo', { text: 'Wahala' })
    expect(successResult.isError).toBeFalsy()
    expect(successResult.content[0].text).toBe('Wahala')
  })

  it('handles unknown tool gracefully', async () => {
    const result = await registry.callTool('non_existent')
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toContain("Tool 'non_existent' not found")
  })

  it('unregisters tools cleanly', () => {
    registry.registerTool({
      name: 'temp',
      description: 'Temporary',
      inputSchema: { type: 'object' },
      handler: () => ({ content: [{ type: 'text', text: 'ok' }] }),
    })
    expect(registry.hasTool('temp')).toBe(true)

    registry.unregisterTool('temp')
    expect(registry.hasTool('temp')).toBe(false)
  })

  it('attaches to window.wahalaMcp and navigator.modelContext in browser environment', () => {
    expect(window.wahalaMcp).toBeDefined()
    expect(navigator.modelContext).toBeDefined()
    expect(typeof navigator.modelContext?.callTool).toBe('function')
  })
})

describe('WebMCP Game Tools', () => {
  const mockState = {
    phase: 'roundActive',
    round: 1,
    totalRounds: 5,
    currentTurnPlayerId: 'user-agent-1',
    activeCard: { id: 'card-1', suit: 'circles', number: 7 },
    declaredSuit: null,
    pendingPenalty: 0,
    players: [
      { userId: 'user-agent-1', username: 'AgentAlpha', cardCount: 2, class: 'mastermind' },
      { userId: 'user-opponent-2', username: 'PlayerBravo', cardCount: 4, class: 'joker' },
    ],
    playerHands: {
      'user-agent-1': [
        { id: 'c-1', suit: 'circles', number: 5 }, // playable (suit match)
        { id: 'c-2', suit: 'stars', number: 8 },    // unplayable
      ],
    },
    market: [{ id: 'm-top', suit: 'triangles', number: 2 }],
  }

  it('provides get_game_state with pre-calculated playability and LLM summary', async () => {
    const mockContext: WebMcpGameContext = {
      getGameState: () => mockState,
      getUserId: () => 'user-agent-1',
      playCard: vi.fn(),
      drawCard: vi.fn(),
      useAbility: vi.fn(),
      respondReaction: vi.fn(),
    }

    const tools = createGameTools(mockContext)
    const getGameState = tools.find((t) => t.name === 'get_game_state')!
    expect(getGameState).toBeDefined()

    const res = await getGameState.handler({})
    expect(res.isError).toBeFalsy()

    const data = res.content.find((c) => c.type === 'json')?.data
    expect(data.turn.isMyTurn).toBe(true)
    expect(data.myHand).toHaveLength(2)
    expect(data.myHand[0].isPlayable).toBe(true)
    expect(data.myHand[1].isPlayable).toBe(false)
    expect(data.opponents).toHaveLength(1)
    expect(data.opponents[0].userId).toBe('user-opponent-2')
  })

  it('dispatches play_card to context', async () => {
    const playCardMock = vi.fn().mockReturnValue({ success: true })
    const mockContext: WebMcpGameContext = {
      getGameState: () => mockState,
      getUserId: () => 'user-agent-1',
      playCard: playCardMock,
      drawCard: vi.fn(),
      useAbility: vi.fn(),
      respondReaction: vi.fn(),
    }

    const tools = createGameTools(mockContext)
    const playCard = tools.find((t) => t.name === 'play_card')!

    const res = await playCard.handler({ cardId: 'c-1' })
    expect(res.isError).toBeFalsy()
    expect(playCardMock).toHaveBeenCalledWith('c-1', undefined)
  })

  it('dispatches use_class_ability to context', async () => {
    const abilityMock = vi.fn().mockReturnValue({ success: true })
    const mockContext: WebMcpGameContext = {
      getGameState: () => mockState,
      getUserId: () => 'user-agent-1',
      playCard: vi.fn(),
      drawCard: vi.fn(),
      useAbility: abilityMock,
      respondReaction: vi.fn(),
    }

    const tools = createGameTools(mockContext)
    const useAbility = tools.find((t) => t.name === 'use_class_ability')!

    const res = await useAbility.handler({
      abilityId: 'mind_read',
      payload: { targetUserId: 'user-opponent-2' },
    })
    expect(res.isError).toBeFalsy()
    expect(abilityMock).toHaveBeenCalledWith('mind_read', { targetUserId: 'user-opponent-2' })
  })

  it('dispatches draw_card and respond_to_penalty to context', async () => {
    const drawMock = vi.fn().mockReturnValue({ success: true })
    const reactMock = vi.fn().mockReturnValue({ success: true })
    const mockContext: WebMcpGameContext = {
      getGameState: () => mockState,
      getUserId: () => 'user-agent-1',
      playCard: vi.fn(),
      drawCard: drawMock,
      useAbility: vi.fn(),
      respondReaction: reactMock,
    }

    const tools = createGameTools(mockContext)
    const drawCard = tools.find((t) => t.name === 'draw_card')!
    const respond = tools.find((t) => t.name === 'respond_to_penalty')!

    await drawCard.handler({})
    expect(drawMock).toHaveBeenCalled()

    await respond.handler({ action: 'reflect' })
    expect(reactMock).toHaveBeenCalledWith('reflect')
  })
})
