import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGameSocket } from '../hooks/useGameSocket'
import { useGamePhaseRouting } from '../hooks/useGamePhaseRouting'
import { GameCard } from '../components/game/GameCard'
import { GameBoardTable } from '../components/game/GameBoardTable'
import { AbilitiesPanel } from '../components/game/AbilitiesPanel'
import type { CardSuit, CardType } from '../components/game/GameCard'
import type { RuleType } from '../types/game'

export default function GameBoard() {
  const { gameId = '' } = useParams()
  
  // Real socket integration (will fallback to mock if backend is down)
  const { isConnected: realIsConnected } = useGameSocket({ gameId, enabled: gameId.length > 0 })
  useGamePhaseRouting()

  // User details
  const localUserId = 'you-id'
  const localUsername = 'Mkzay'

  // --- MOCK INTERACTIVE GAME LOOP STATE ---
  const [isConnected, setIsConnected] = useState<boolean>(true)
  const [showDisconnectOverlay, setShowDisconnectOverlay] = useState<boolean>(false)
  const [reconnectCountdown, setReconnectCountdown] = useState<number>(3)

  const [_round] = useState<number>(2)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [shakingCardId, setShakingCardId] = useState<string | null>(null)
  const [marketCount, setMarketCount] = useState<number>(24)
  const [activeRules, setActiveRules] = useState<RuleType[]>(['light'])
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string | null>(localUserId)
  
  const [reactionEndsAt, setReactionEndsAt] = useState<number | null>(null)

  // Player standings/state
  const [players, setPlayers] = useState([
    { id: localUserId, username: `${localUsername} (You)`, points: 120, cardCount: 5, status: 'active' as const },
    { id: 'esther-id', username: 'Esther', points: 95, cardCount: 6, status: 'active' as const },
    { id: 'happiness-id', username: 'Happiness', points: 154, cardCount: 4, status: 'active' as const },
    { id: 'roseanne-id', username: 'Roseanne', points: 88, cardCount: 8, status: 'active' as const },
  ])

  // Your cards in hand
  const [myHand, setMyHand] = useState<CardType[]>([
    { id: 'card-1', suit: 'circle', value: 7 },
    { id: 'card-2', suit: 'star', value: 4 },
    { id: 'card-3', suit: 'triangle', value: 12 },
    { id: 'card-4', suit: 'cross', value: 5 },
    { id: 'card-5', suit: 'whot', value: 20 },
  ])

  // Active discard pile card
  const [activeCard, setActiveCard] = useState<CardType | null>({
    id: 'card-init',
    suit: 'circle',
    value: 3,
  })

  // Match Feed Logs helper (logs removed from ongoing UI)
  const addLog = (_text: string) => {
    // No-op logger for game events
  }

  // Handle local connection sync
  useEffect(() => {
    setIsConnected(realIsConnected)
  }, [realIsConnected])

  // Reconnection simulation triggers
  useEffect(() => {
    if (!isConnected) {
      setShowDisconnectOverlay(true)
      setReconnectCountdown(3)
      const counter = setInterval(() => {
        setReconnectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(counter)
            setIsConnected(true)
            setShowDisconnectOverlay(false)
            addLog('WebSocket reconnected. Game state synched with server.')
            return 3
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(counter)
    }
  }, [isConnected])

  // Automated AI simulation loop
  useEffect(() => {
    if (currentTurnPlayerId === localUserId || !isConnected) return

    const timer = setTimeout(() => {
      const activePlayer = players.find((p) => p.id === currentTurnPlayerId)
      if (!activePlayer) return

      // AI Logic: plays card or draws
      const randValue = Math.floor(Math.random() * 14) + 1
      const suits: CardSuit[] = ['circle', 'triangle', 'star', 'cross', 'square']
      const randSuit = suits[Math.floor(Math.random() * suits.length)]
      
      const newCard: CardType = {
        id: `card-ai-${Date.now()}`,
        suit: randSuit,
        value: randValue,
      }

      setActiveCard(newCard)
      addLog(`${activePlayer.username} played ${randSuit.toUpperCase()} ${randValue}`)

      // Update AI card count
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === activePlayer.id
            ? { ...p, cardCount: Math.max(1, p.cardCount - 1) }
            : p,
        ),
      )

      // Move turn forward
      const currentIndex = players.findIndex((p) => p.id === currentTurnPlayerId)
      const nextIndex = (currentIndex + 1) % players.length
      const nextPlayer = players[nextIndex]
      setCurrentTurnPlayerId(nextPlayer.id)
      addLog(`It is now ${nextPlayer.username === `${localUsername} (You)` ? 'your' : nextPlayer.username + "'s"} turn.`)
    }, 4000)

    return () => clearTimeout(timer)
  }, [currentTurnPlayerId, players, isConnected])

  // Play a card logic
  const handlePlayCard = (card: CardType) => {
    if (currentTurnPlayerId !== localUserId) {
      addLog('Cannot play card: it is not your turn!')
      return
    }

    // Check if card fits suit or value
    const matchSuit = activeCard?.suit === card.suit || card.suit === 'whot'
    const matchValue = activeCard?.value === card.value

    if (!matchSuit && !matchValue) {
      addLog(`Cannot play ${card.suit.toUpperCase()} ${card.value}: card does not match active card.`)
      return
    }

    // Play card
    setActiveCard(card)
    setMyHand((prev) => prev.filter((c) => c.id !== card.id))
    addLog(`You played ${card.suit.toUpperCase()} ${card.value}`)

    // Update your card count in players list
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === localUserId
          ? { ...p, cardCount: Math.max(0, p.cardCount - 1) }
          : p,
      ),
    )

    // Trigger reaction window for special card plays
    if (card.value === 8 || card.suit === 'whot' || card.value === 2) {
      setReactionEndsAt(Date.now() + 5000)
      addLog('Special card played: Reaction window opened for 5 seconds!')
    }

    // Pass turn
    const currentIndex = players.findIndex((p) => p.id === localUserId)
    const nextIndex = (currentIndex + 1) % players.length
    const nextPlayer = players[nextIndex]
    setCurrentTurnPlayerId(nextPlayer.id)
    addLog(`It is now ${nextPlayer.username}'s turn.`)
  }

  // Draw card logic
  const handleDrawCard = () => {
    if (currentTurnPlayerId !== localUserId) return

    const suits: CardSuit[] = ['circle', 'triangle', 'star', 'cross', 'square']
    const randSuit = suits[Math.floor(Math.random() * suits.length)]
    const randValue = Math.floor(Math.random() * 14) + 1
    const newCard: CardType = {
      id: `card-${Date.now()}`,
      suit: randSuit,
      value: randValue,
    }

    setMyHand((prev) => [...prev, newCard])
    setMarketCount((prev) => Math.max(0, prev - 1))
    addLog('You drew a card from the market')

    // Update your player card count
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === localUserId
          ? { ...p, cardCount: p.cardCount + 1 }
          : p,
      ),
    )

    // Pass turn
    const currentIndex = players.findIndex((p) => p.id === localUserId)
    const nextIndex = (currentIndex + 1) % players.length
    const nextPlayer = players[nextIndex]
    setCurrentTurnPlayerId(nextPlayer.id)
    addLog(`It is now ${nextPlayer.username}'s turn.`)
  }

  // Reaction response handler
  const handleReactionResponse = (agree: boolean) => {
    setReactionEndsAt(null)
    if (agree) {
      addLog('You counter reacted: HOLD ON!')
      // Draw or logic change
    } else {
      addLog('You passed on the reaction window.')
    }
  }

  // Ability activation handler
  const handleActivateAbility = (abilityName: string) => {
    addLog(`You activated ability: ${abilityName}!`)
    if (abilityName === 'Chaos Leap') {
      const suits: CardSuit[] = ['circle', 'triangle', 'star', 'cross', 'square']
      const randSuit = suits[Math.floor(Math.random() * suits.length)]
      if (activeCard) {
        setActiveCard({ ...activeCard, suit: randSuit })
      }
      addLog(`Chaos Leap: Suit randomly swapped to ${randSuit.toUpperCase()}`)
      
      // Update rules as side effect
      if (!activeRules.includes('chaotic')) {
        setActiveRules((prev) => [...prev, 'chaotic' as RuleType].slice(-2))
        addLog('Chaos Leap triggered Chaotic dynamic rule!')
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between relative overflow-x-hidden p-2 sm:p-4">
      
      {/* Floating Leave Table Back Icon Button */}
      <div className="absolute top-3 left-3 z-40">
        <Link
          to="/home"
          aria-label="Leave Table"
          title="Leave Table"
          className="h-8 w-8 rounded-full border border-w-border bg-w-surface/90 backdrop-blur-md hover:bg-w-surface-2 hover:border-w-orange text-w-text-2 hover:text-w-orange transition-all flex items-center justify-center shadow-tactile-md"
        >
          <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      {/* Main Section: Full-Screen Felt Board Arena */}
      <section className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-6 pt-3 pb-36 flex flex-col items-stretch relative">
        
        {/* Felt Board Table Component (Fills Main Viewport) */}
        <div className="flex-1 w-full flex flex-col">
          <GameBoardTable
            players={players}
            currentTurnPlayerId={currentTurnPlayerId}
            activeCard={activeCard}
            marketCount={marketCount}
            reactionWindowEndsAtMs={reactionEndsAt}
            onDrawCard={handleDrawCard}
            onReactionResponse={handleReactionResponse}
            localUserId={localUserId}
          />
        </div>

        {/* Floating Player Hand Bar (Fixed at Bottom of Viewport) */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-w-bg via-w-bg/95 to-transparent backdrop-blur-md border-t border-w-border/40 pt-1.5 pb-2 px-2 shadow-[0_-10px_30px_rgba(0,0,0,0.4)]">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-0.5">
            
            {/* Hand Header & 2-Tap Guide Badge */}
            <div className="flex items-center gap-2">
              {selectedCardId ? (
                <span className="text-[10px] bg-w-orange text-w-text font-bold px-3 py-0.5 rounded-full shadow-md animate-bounce">
                  Tap card again to play
                </span>
              ) : (
                <>
                  <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-w-text-3">
                    Your Hand ({myHand.length})
                  </span>
                  {currentTurnPlayerId === localUserId && (
                    <span className="text-[10px] bg-w-orange/15 border border-w-orange/30 px-2 py-0.5 rounded-full text-w-orange font-bold animate-pulse">
                      It's Your Turn!
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Floating Hand Fan Container */}
            <div className="relative w-full overflow-x-auto overflow-y-hidden no-scrollbar pt-1 pb-0 px-2 min-h-[110px] sm:min-h-[145px]">
              {myHand.length === 0 ? (
                <div className="text-center p-3 text-w-text-3 text-xs border border-dashed border-w-border rounded-xl w-full">
                  No cards in hand. Click the market deck to draw!
                </div>
              ) : (
                <div className="flex w-max min-w-full justify-center items-end -space-x-4 sm:-space-x-8 hover:space-x-1 transition-all duration-300 pb-1 px-6">
                  {myHand.map((card, idx) => {
                    const isSelected = selectedCardId === card.id
                    const isShaking = shakingCardId === card.id
                    const isPlayable =
                      currentTurnPlayerId === localUserId &&
                      (activeCard?.suit === card.suit ||
                        card.suit === 'whot' ||
                        activeCard?.value === card.value)

                    const angle = (idx - (myHand.length - 1) / 2) * 3
                    // On mobile: unselected cards translate down (+16px peek). On iPad/Desktop: standard height
                    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
                    const baseTranslateY = isMobile
                      ? (isSelected ? -32 : Math.abs(idx - (myHand.length - 1) / 2) * 2 + 16)
                      : (isSelected ? -24 : Math.abs(idx - (myHand.length - 1) / 2) * 2)

                    const handleCardClick = () => {
                      if (!isPlayable) {
                        // Unplayable card clicked -> Drop previous selection & Nod shake!
                        setSelectedCardId(null)
                        setShakingCardId(card.id)
                        setTimeout(() => setShakingCardId(null), 450)
                        return
                      }

                      if (isSelected) {
                        // 2nd tap on the SAME card: Play it!
                        handlePlayCard(card)
                        setSelectedCardId(null)
                      } else {
                        // 1st tap on a NEW card: Drops previous card & Raises the new card UP!
                        setSelectedCardId(card.id)
                      }
                    }

                    return (
                      <div
                        key={card.id}
                        style={{
                          transform: `rotate(${isSelected ? 0 : angle}deg) translateY(${baseTranslateY}px)`,
                        }}
                        className={`transition-all duration-300 flex-shrink-0 relative ${
                          isSelected ? 'z-30 scale-110' : 'z-10 hover:z-20'
                        }`}
                      >
                        <GameCard
                          card={card}
                          isPlayable={isPlayable}
                          isShaking={isShaking}
                          onClick={handleCardClick}
                          size={isMobile ? "sm" : "md"}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Action Power Orb + Glassmorphic Sheet Drawer Component */}
        <AbilitiesPanel
          classNameType="mastermind"
          onActivateAbility={handleActivateAbility}
          isMyTurn={currentTurnPlayerId === localUserId}
        />
      </section>

      {/* Disconnection/Reconnecting Glassmorphic Overlay */}
      {showDisconnectOverlay && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="text-center max-w-sm p-6 rounded-3xl border border-w-border bg-w-surface shadow-[0_0_50px_rgba(226,75,74,0.1)]">
            {/* pulsing danger icon */}
            <div className="h-16 w-16 mx-auto mb-4 bg-w-danger/10 border border-w-danger/25 text-w-danger rounded-full flex items-center justify-center animate-pulse">
              <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
              </svg>
            </div>
            
            <h2 className="font-display text-lg font-bold text-w-text">
              CONNECTION INTERRUPTED
            </h2>
            <p className="mt-1 text-xs text-w-text-2 leading-relaxed">
              Lost link to room. Reconnecting automatically in <span className="font-display font-bold text-w-orange">{reconnectCountdown}s</span>...
            </p>

            <button
              onClick={() => {
                setIsConnected(true)
                setShowDisconnectOverlay(false)
                addLog('Manual reconnection forced.')
              }}
              className="mt-5 w-full rounded-xl bg-w-orange hover:bg-w-orange/90 px-4 py-2.5 text-xs font-display font-bold text-w-text shadow"
            >
              Force Reconnect
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
