import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GameBoardTable } from '../components/game/GameBoardTable'
import { GameSidebar } from '../components/game/GameSidebar'
import type { CardSuit, CardType } from '../components/game/GameCard'
import type { GamePlayer, RuleType } from '../types/game'

export default function Spectator() {
  const { gameId = 'demo-game-id' } = useParams()

  // Spectator stats
  const [activeRules] = useState<RuleType[]>(['light'])
  const [marketCount] = useState<number>(22)
  const [round] = useState<number>(3)
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string | null>('happiness-id')

  const [players] = useState<GamePlayer[]>([
    { userId: 'mkzay-id', username: 'Mkzay', cardCount: 3, status: 'active', class: null, previousClass: null, abilityUsed: false, activeShield: false, comboBoostActive: false, cardValueSum: 0, cumulativeScore: 140 },
    { userId: 'esther-id', username: 'Esther', cardCount: 6, status: 'active', class: null, previousClass: null, abilityUsed: false, activeShield: false, comboBoostActive: false, cardValueSum: 0, cumulativeScore: 95 },
    { userId: 'happiness-id', username: 'Happiness', cardCount: 4, status: 'active', class: null, previousClass: null, abilityUsed: false, activeShield: false, comboBoostActive: false, cardValueSum: 0, cumulativeScore: 120 },
    { userId: 'roseanne-id', username: 'Roseanne', cardCount: 8, status: 'active', class: null, previousClass: null, abilityUsed: false, activeShield: false, comboBoostActive: false, cardValueSum: 0, cumulativeScore: 210 },
  ])

  const [activeCard, setActiveCard] = useState<CardType | null>({
    id: 'card-live',
    suit: 'star',
    value: 8,
  })

  const [eventLogs, setEventLogs] = useState([
    { id: 's-1', text: 'Round 3 in progress. Spectator view live.', timestamp: '12:10' },
    { id: 's-2', text: 'Happiness played Star 8.', timestamp: '12:11' },
    { id: 's-3', text: 'Esther drew 1 card.', timestamp: '12:12' },
  ])

  // Simulation effect for live match feed
  useEffect(() => {
    const timer = setInterval(() => {
      const pKeys = ['mkzay-id', 'esther-id', 'happiness-id', 'roseanne-id']
      const nextIdx = (pKeys.indexOf(currentTurnPlayerId ?? 'mkzay-id') + 1) % pKeys.length
      const nextId = pKeys[nextIdx]
      setCurrentTurnPlayerId(nextId)

      const activePlayerObj = players.find((p) => p.userId === nextId)
      const suits: CardSuit[] = ['circle', 'triangle', 'cross', 'star', 'square', 'whot']
      const randomSuit = suits[Math.floor(Math.random() * suits.length)]
      const randomVal = Math.floor(Math.random() * 14) + 1

      setActiveCard({ id: `s-card-${Date.now()}`, suit: randomSuit, value: randomVal })
      setEventLogs((prev) => [
        {
          id: `s-log-${Date.now()}`,
          text: `${activePlayerObj?.username || 'Player'} played ${randomSuit.toUpperCase()} ${randomVal}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ])
    }, 5000)

    return () => clearInterval(timer)
  }, [currentTurnPlayerId, players])

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-24 sm:px-6 lg:px-8 lg:pb-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-w-border/80 pb-4">
          <div>
            <span className="text-xs font-display font-bold uppercase tracking-widest text-w-orange">Live Stream</span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-w-text mt-0.5">
              Spectator: <span className="text-w-orange">{gameId.slice(0, 8)}</span>
            </h1>
          </div>
          <Link
            to="/home"
            aria-label="Exit Arena"
            title="Exit Arena"
            className="h-8 w-8 rounded-full border border-w-border bg-w-bg hover:bg-w-surface-2 hover:border-w-orange text-w-text-2 hover:text-w-orange transition-[colors,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange flex items-center justify-center shadow-tactile-sm"
          >
            <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>

        {/* Widescreen Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 flex-1 lg:overflow-hidden items-stretch">
          
          {/* Left Column: Game board visualization (occupies 8 cols) */}
          <section className="col-span-1 lg:col-span-8 flex flex-col gap-4">
            
            {/* Spectator Warning Banner */}
            <article className="rounded-xl border border-[#378ADD]/30 bg-[#0A0F1A]/50 backdrop-blur-sm px-4 py-2.5 text-xs text-[#378ADD] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#378ADD] inline-block animate-ping" />
                You are currently spectating. Cards in hand are hidden for security reasons.
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 hidden md:inline">
                Read-Only Mode
              </span>
            </article>

            {/* Central Game Board Table */}
            <GameBoardTable
              players={players}
              currentTurnPlayerId={currentTurnPlayerId}
              activeCard={activeCard}
              marketCount={marketCount}
              reactionWindowEndsAtMs={null}
              onDrawCard={() => {}}
              onReactionResponse={() => {}}
              localUserId="spectator-id"
            />
          </section>

          {/* Right Column: Statistics & Live Feed Logs (occupies 4 cols) */}
          <section className="col-span-1 lg:col-span-4 rounded-2xl lg:overflow-hidden h-full flex flex-col justify-between">
            <GameSidebar
              activeRules={activeRules}
              eventLogs={eventLogs}
              playerStandings={players.map((p) => ({
                id: p.userId,
                username: p.username,
                points: p.cumulativeScore,
                cardCount: p.cardCount,
              }))}
              mode="classic"
              round={round}
            />
          </section>

        </div>
      </main>

      <footer className="mt-12 text-center text-xs text-w-text-3 border-t border-w-border/30 py-6">
        © 2026 Wahala Entertainment. Live Spectator Console.
      </footer>
    </div>
  )
}
