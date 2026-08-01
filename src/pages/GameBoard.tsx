import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGameSocket } from '../hooks/useGameSocket'
import { useGamePhaseRouting } from '../hooks/useGamePhaseRouting'
import { useGameStore } from '../store/gameStore'
import { useAuthStore } from '../store/authStore'
import { socketService } from '../services/socketService'
import { mapCard } from '../utils/cardMapper'
import { GameCard } from '../components/game/GameCard'
import { GameBoardTable } from '../components/game/GameBoardTable'
import { AbilitiesPanel } from '../components/game/AbilitiesPanel'
import type { CardType } from '../components/game/GameCard'
import { toast } from '../store/toastStore'

export default function GameBoard() {
  const { gameId = '' } = useParams()

  useGameSocket({ gameId, enabled: gameId.length > 0 })
  useGamePhaseRouting()

  const gameState = useGameStore((s) => s.gameState)
  const isConnected = useGameStore((s) => s.isConnected)
  const user = useAuthStore((s) => s.user)

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [shakingCardId, setShakingCardId] = useState<string | null>(null)

  const userId = user?.id ?? ''
  const players = gameState?.players ?? []
  const activeCard = gameState?.activeCard ? mapCard(gameState.activeCard) : null
  const marketCount = gameState?.market?.length ?? 0
  const rawHand = gameState?.playerHands?.[userId] ?? []
  const myHand: CardType[] = rawHand.map(mapCard)
  const currentTurnPlayerId = gameState?.currentTurnPlayerId ?? null
  const isMyTurn = currentTurnPlayerId === userId

  const requestState = () => {
    socketService.emit('game:state:request', { gameId })
  }

  const handlePlayCard = (card: CardType) => {
    if (!isMyTurn) {
      toast.warning('Wait for your turn!', 'Out of Turn')
      return
    }

    const matchSuit = activeCard?.suit === card.suit || card.suit === 'whot'
    const matchValue = activeCard?.value === card.value

    if (!matchSuit && !matchValue) {
      setShakingCardId(card.id)
      setTimeout(() => setShakingCardId(null), 450)
      toast.error(`Cannot play ${card.suit.toUpperCase()} ${card.value}: card does not match active suit/value.`, 'Invalid Move')
      return
    }

    socketService.emit('game:card:play', { gameId, cardId: card.id })
    setSelectedCardId(null)
    setTimeout(requestState, 300)
  }

  const handleDrawCard = () => {
    if (!isMyTurn) return
    socketService.emit('game:card:draw', { gameId })
    setTimeout(requestState, 300)
  }

  const handleReactionResponse = (agree: boolean) => {
    socketService.emit('reaction:respond', { gameId, playerId: userId, agree })
  }

  const handleActivateAbility = (abilityName: string) => {
    socketService.emit('game:ability:use', { gameId, abilityId: abilityName })
  }

  const isPlayable = (card: CardType) => {
    if (!isMyTurn) return false
    if (!activeCard) return true
    return activeCard.suit === card.suit || card.suit === 'whot' || activeCard.value === card.value
  }

  if (!gameState) {
    return (
      <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col items-center justify-center gap-4 select-none">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-w-orange to-w-yellow flex items-center justify-center font-display text-2xl font-black text-w-surface shadow-tactile-lg animate-pulse">
          ⚡
        </div>
        <svg className="h-8 w-8 animate-spin text-w-orange" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="font-display text-xs font-bold text-w-text-3 uppercase tracking-widest">
          Loading Game Arena…
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between relative overflow-x-hidden p-2 sm:p-4">
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

      <section className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-6 pt-3 pb-36 flex flex-col items-stretch relative">
        <div className="flex-1 w-full flex flex-col">
          <GameBoardTable
            players={players}
            currentTurnPlayerId={currentTurnPlayerId}
            activeCard={activeCard}
            marketCount={marketCount}
            reactionWindowEndsAtMs={gameState.reactionWindow?.expiresAtMs ?? null}
            onDrawCard={handleDrawCard}
            onReactionResponse={handleReactionResponse}
            localUserId={userId}
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-w-bg via-w-bg/95 to-transparent backdrop-blur-md border-t border-w-border/40 pt-3 pb-2 px-2 shadow-[0_-10px_30px_rgba(0,0,0,0.4)]">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-2 mb-1">
              {selectedCardId ? (
                <span className="text-[10px] bg-w-orange text-w-text font-bold px-3 py-0.5 rounded-full shadow-md animate-bounce">
                  Tap card again to play
                </span>
              ) : (
                <>
                  <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-w-text-3">
                    Your Hand ({myHand.length})
                  </span>
                  {isMyTurn && (
                    <span className="text-[10px] bg-w-orange/15 border border-w-orange/30 px-2 py-0.5 rounded-full text-w-orange font-bold animate-pulse">
                      It's Your Turn!
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="relative w-full overflow-x-auto overflow-y-visible no-scrollbar pt-6 sm:pt-8 pb-3 px-4 min-h-[140px] sm:min-h-[180px]">
              {myHand.length === 0 ? (
                <div className="text-center p-3 text-w-text-3 text-xs border border-dashed border-w-border rounded-xl w-full">
                  No cards in hand. Click the market deck to draw!
                </div>
              ) : (
                <div className="flex w-max min-w-full justify-center items-end -space-x-4 sm:-space-x-8 hover:space-x-1 transition-all duration-300 pb-1 px-6">
                  {myHand.map((card, idx) => {
                    const isSelected = selectedCardId === card.id
                    const isShaking = shakingCardId === card.id
                    const playable = isPlayable(card)
                    const angle = (idx - (myHand.length - 1) / 2) * 3
                    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
                    const baseTranslateY = isMobile
                      ? (isSelected ? -24 : Math.abs(idx - (myHand.length - 1) / 2) * 2 + 12)
                      : (isSelected ? -22 : Math.abs(idx - (myHand.length - 1) / 2) * 2)

                    const handleCardClick = () => {
                      if (!playable) {
                        setSelectedCardId(null)
                        setShakingCardId(card.id)
                        setTimeout(() => setShakingCardId(null), 450)
                        return
                      }

                      if (isSelected) {
                        handlePlayCard(card)
                        setSelectedCardId(null)
                      } else {
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
                          isPlayable={playable}
                          isShaking={isShaking}
                          onClick={handleCardClick}
                          size={isMobile ? 'sm' : 'md'}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <AbilitiesPanel
          classNameType="mastermind"
          onActivateAbility={handleActivateAbility}
          isMyTurn={isMyTurn}
        />
      </section>

      {!isConnected && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="text-center max-w-sm p-6 rounded-3xl border border-w-border bg-w-surface shadow-[0_0_50px_rgba(226,75,74,0.1)]">
            <div className="h-16 w-16 mx-auto mb-4 bg-w-danger/10 border border-w-danger/25 text-w-danger rounded-full flex items-center justify-center animate-pulse">
              <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
              </svg>
            </div>

            <h2 className="font-display text-lg font-bold text-w-text">
              CONNECTION INTERRUPTED
            </h2>
            <p className="mt-1 text-xs text-w-text-2 leading-relaxed">
              Lost link to room. Attempting to reconnect…
            </p>

            <button
              onClick={() => {
                socketService.connect()
                setTimeout(requestState, 500)
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
