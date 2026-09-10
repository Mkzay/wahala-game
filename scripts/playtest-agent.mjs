/**
 * Example Autonomous AI Playtester using Wahala's WebMCP capability surface.
 *
 * How to run in browser console, Playwright, or Puppeteer:
 * 1. Open the game in browser: http://localhost:5173/game/:gameId
 * 2. Paste or evaluate this script to let an autonomous agent loop play turns!
 */

export async function runAgentPlaytestLoop({
  maxTurns = 30,
  turnDelayMs = 1200,
  logPrefix = '🤖 [AgentPlaytester]',
} = {}) {
  const mcp = window.wahalaMcp || window.__WAHALA_MCP__ || navigator.modelContext
  if (!mcp) {
    console.error(`${logPrefix} WebMCP capability surface not detected on window or navigator!`)
    return
  }

  console.log(`${logPrefix} Discovered WebMCP Tools:`, mcp.listTools().map((t) => t.name))

  let turnsPlayed = 0

  while (turnsPlayed < maxTurns) {
    // 1. Inspect current table state
    const stateRes = await mcp.callTool('get_game_state', {})
    const stateJson = stateRes.content.find((c) => c.type === 'json')?.data

    if (!stateJson) {
      console.warn(`${logPrefix} Waiting for game state...`)
      await sleep(1500)
      continue
    }

    console.log(`${logPrefix} Phase: ${stateJson.phase} | Round: ${stateJson.round} | MyTurn: ${stateJson.turn.isMyTurn}`)

    // Handle Class Selection
    if (stateJson.phase === 'classSelection') {
      const classes = ['joker', 'wall', 'striker', 'mastermind']
      const chosen = classes[Math.floor(Math.random() * classes.length)]
      console.log(`${logPrefix} Locking in class: ${chosen}`)
      await mcp.callTool('select_class', { className: chosen })
      await sleep(2000)
      continue
    }

    // Handle Round End
    if (stateJson.phase === 'roundEnded') {
      console.log(`${logPrefix} Round concluded. Signaling readiness for next round...`)
      await mcp.callTool('next_round', {})
      await sleep(2500)
      continue
    }

    // Handle Reaction Window
    if (stateJson.pendingPenalty.reactionWindowActive && stateJson.pendingPenalty.targetUserId === stateJson.myPlayer.userId) {
      const action = stateJson.myPlayer.class === 'joker' ? 'reflect' : 'absorb'
      console.log(`${logPrefix} In reaction window! Responding with: ${action}`)
      await mcp.callTool('respond_to_penalty', { action })
      await sleep(1000)
      continue
    }

    // If it's my turn
    if (stateJson.turn.isMyTurn) {
      // Check if Mastermind mind_read ability is ready and we want to peek
      if (
        stateJson.myPlayer.class === 'mastermind' &&
        !stateJson.myPlayer.abilityUsed &&
        stateJson.opponents.length > 0
      ) {
        const target = stateJson.opponents[0].userId
        console.log(`${logPrefix} Using Mastermind 'mind_read' ability on opponent ${target}`)
        await mcp.callTool('use_class_ability', {
          abilityId: 'mind_read',
          payload: { targetUserId: target },
        })
        await sleep(800)
      }

      // Check playable cards
      const playableCards = stateJson.myHand.filter((c) => c.isPlayable)

      if (playableCards.length > 0) {
        // Pick first playable card
        const cardToPlay = playableCards[0]
        const suitDemand = cardToPlay.number === 20 ? 'circles' : undefined

        console.log(`${logPrefix} Playing card:`, cardToPlay.id, `${cardToPlay.suit} ${cardToPlay.number}`, suitDemand ? `(demanding: ${suitDemand})` : '')
        const playRes = await mcp.callTool('play_card', {
          cardId: cardToPlay.id,
          suitDemand,
        })
        console.log(`${logPrefix} Play result:`, playRes.content[0]?.text)
        turnsPlayed++
      } else {
        // No playable cards -> draw from market
        console.log(`${logPrefix} No playable cards found. Drawing from market...`)
        const drawRes = await mcp.callTool('draw_card', {})
        console.log(`${logPrefix} Draw result:`, drawRes.content[0]?.text)
        turnsPlayed++
      }
    }

    await sleep(turnDelayMs)
  }

  console.log(`${logPrefix} Playtest loop finished (${turnsPlayed} turns executed).`)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Automatically attach to window for quick console execution
if (typeof window !== 'undefined') {
  ;(window as any).runAgentPlaytestLoop = runAgentPlaytestLoop
}
