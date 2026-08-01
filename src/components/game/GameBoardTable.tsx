import { useEffect, useState } from 'react'
import type { GamePlayer } from '../../types/game'
import type { CardType } from './GameCard'
import { GameCard } from './GameCard'

interface GameBoardTableProps {
  players: GamePlayer[]
  currentTurnPlayerId: string | null
  activeCard: CardType | null
  marketCount: number
  reactionWindowEndsAtMs: number | null
  onDrawCard: () => void
  onReactionResponse: (agree: boolean) => void
  localUserId: string
}

export function GameBoardTable({
  players,
  currentTurnPlayerId,
  activeCard,
  marketCount,
  reactionWindowEndsAtMs,
  onDrawCard,
  onReactionResponse,
  localUserId,
}: GameBoardTableProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)

  // Position other players around the table
  const otherPlayers = players.filter((p) => p.userId !== localUserId)

  // Map players to positions around the felt arena:
  // - Pos 0: Left side
  // - Pos 1: Top side
  // - Pos 2: Right side
  const getPlayerPosition = (index: number) => {
    switch (index) {
      case 0:
        return 'left-3 sm:left-6 top-1/2 -translate-y-1/2'
      case 1:
        return 'top-3 sm:top-6 left-1/2 -translate-x-1/2'
      case 2:
        return 'right-3 sm:right-6 top-1/2 -translate-y-1/2'
      default:
        return 'top-3 sm:top-6 left-1/2 -translate-x-1/2'
    }
  }

  // Handle reaction countdown
  useEffect(() => {
    if (!reactionWindowEndsAtMs) {
      setTimeLeft(0)
      return
    }

    const interval = setInterval(() => {
      const now = Date.now()
      const remaining = Math.max(0, reactionWindowEndsAtMs - now)
      setTimeLeft(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [reactionWindowEndsAtMs])

  const showReactionOverlay = reactionWindowEndsAtMs !== null && timeLeft > 0

  return (
    <div className="relative w-full min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] flex-1 rounded-3xl border border-w-border bg-gradient-to-b from-w-surface via-w-bg to-w-surface-2 overflow-hidden flex items-center justify-center shadow-tactile-md">
      {/* Felt background pattern */}
      <div className="absolute inset-2 sm:inset-4 rounded-2xl border border-w-border/30 bg-[radial-gradient(circle_at_center,_var(--color-surface)_0%,_var(--color-surface-2)_100%)] opacity-95" />

      {/* Grid lines representing the grid table */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(45,34,28,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(45,34,28,0.015)_1px,_transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Outer Glow Ring */}
      <div className="absolute inset-6 sm:inset-10 rounded-full border border-w-orange/5 shadow-[0_0_80px_rgba(217,108,45,0.03)] pointer-events-none" />

      {/* Render Opponent Players around the table */}
      {otherPlayers.map((player, idx) => {
        const isTurn = player.userId === currentTurnPlayerId
        const isEliminated = player.status === 'eliminated'
        const isSpectator = player.status === 'spectating'

        return (
          <div
            key={player.userId}
            className={`absolute z-10 flex flex-col items-center select-none transition-all duration-300 ${
              isTurn ? 'scale-110' : 'hover:scale-105'
            } ${getPlayerPosition(idx)}`}
          >
            {/* Avatar Circle Container */}
            <div className="relative">
              {/* Turn Aura Ring */}
              <div
                className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full p-0.5 border-2 flex items-center justify-center transition-all duration-300 shadow-tactile-md ${
                  isTurn
                    ? 'border-w-orange bg-w-orange/20 ring-4 ring-w-orange/30 animate-pulse-subtle'
                    : 'border-w-border bg-w-surface/90'
                }`}
              >
                {/* Initials Circle */}
                <div
                  className={`h-full w-full rounded-full border flex items-center justify-center font-display text-xs sm:text-sm font-black shadow-inner ${
                    isTurn
                      ? 'border-w-orange bg-w-orange text-w-text'
                      : 'border-w-border/60 bg-w-surface-2 text-w-text-2'
                  }`}
                >
                  {player.username.slice(0, 2).toUpperCase()}
                </div>
              </div>

              {/* Overlapping Card Count Badge at bottom center of avatar circle */}
              {!isEliminated && !isSpectator && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-w-yellow text-w-text border border-w-border font-display text-[9px] sm:text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-tactile-sm z-20">
                  {player.cardCount}
                </div>
              )}
            </div>

            {/* Player Name Displayed Directly Below Avatar */}
            <div className="flex flex-col items-center mt-2 text-center max-w-[85px] sm:max-w-[100px]">
              <span className="font-display text-[10px] sm:text-xs font-black text-w-text tracking-wide truncate bg-w-surface/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-w-border/60 shadow-sm">
                {player.username.split(' ')[0]}
              </span>

              {/* Status Tags */}
              {isEliminated && (
                <span className="mt-0.5 text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded bg-w-danger/15 text-w-danger font-semibold border border-w-danger/30">
                  Out
                </span>
              )}
              {isSpectator && (
                <span className="mt-0.5 text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded bg-w-surface-2 text-w-text-3 font-semibold">
                  Spec
                </span>
              )}
            </div>
          </div>
        )
      })}

      {/* Center Cards Play Zone */}
      <div className="relative flex items-center gap-3 sm:gap-8 z-20 scale-90 sm:scale-100">
        {/* Draw Pile (Market) */}
        <button
          onClick={onDrawCard}
          disabled={currentTurnPlayerId !== localUserId}
          aria-label="Market Deck - Tap to Draw Card"
          className={`relative rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-w-yellow transition-transform duration-300 ${
            currentTurnPlayerId === localUserId
              ? 'hover:scale-105 cursor-pointer ring-2 ring-w-yellow/30'
              : 'cursor-not-allowed opacity-80'
          }`}
        >
          {/* Card Back visual */}
          <GameCard
            card={{ id: 'market-top', suit: 'whot', value: 0 }}
            isFlipped={true}
            isPlayable={false}
            size="md"
          />

          {/* Market Counter Overlay */}
          <div className="absolute inset-x-0 bottom-2 sm:bottom-3 text-center">
            <span className="bg-w-bg/95 border border-w-border rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-display font-extrabold text-w-yellow shadow-tactile-sm whitespace-nowrap">
              MKT: {marketCount}
            </span>
          </div>

          {/* Turn Draw Indicator */}
          {currentTurnPlayerId === localUserId && (
            <span className="absolute -inset-1 border border-dashed border-w-yellow/60 rounded-xl animate-ping" style={{ animationDuration: '3s' }} />
          )}
        </button>

        {/* Active Discard Pile Card */}
        <div className="relative">
          {activeCard ? (
            <div className="animate-pop-in">
              <GameCard card={activeCard} isPlayable={false} size="md" />
            </div>
          ) : (
            <div className="h-32 w-20 sm:h-36 sm:w-24 rounded-2xl border-2 border-dashed border-w-border flex items-center justify-center text-w-text-3 font-display text-xs">
              Empty
            </div>
          )}

          {/* Active Card Label */}
          <div className="absolute -bottom-5 inset-x-0 text-center">
            <span className="text-[9px] sm:text-[10px] font-display font-bold uppercase tracking-wider text-w-text-2">
              Active Card
            </span>
          </div>
        </div>
      </div>

      {/* Reaction Window Overlay */}
      {showReactionOverlay && (
        <div className="absolute inset-x-4 top-4 sm:top-6 z-40 animate-fade-in flex flex-col items-center pointer-events-auto">
          <div className="rounded-3xl border-2 border-w-orange bg-w-surface/95 backdrop-blur-md p-4 shadow-tactile-lg max-w-sm w-full text-center flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-display font-black text-w-orange">
              <span className="h-2.5 w-2.5 rounded-full bg-w-orange animate-ping" />
              <span>Reaction Window Active! ({Math.ceil(timeLeft / 1000)}s)</span>
            </div>
            <p className="text-xs text-w-text-2 font-medium leading-relaxed">
              A special card was played. Do you want to play a Hold On / Counter?
            </p>
            <div className="flex gap-2.5 w-full mt-2">
              <button
                type="button"
                onClick={() => onReactionResponse(true)}
                className="flex-1 rounded-2xl bg-w-orange hover:bg-w-orange/90 text-w-surface font-display text-xs font-black py-2.5 shadow-tactile-sm transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
              >
                Counter (Hold On)
              </button>
              <button
                type="button"
                onClick={() => onReactionResponse(false)}
                className="flex-1 rounded-2xl border border-w-border bg-w-bg hover:bg-w-surface-2 text-w-text font-display text-xs font-bold py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
              >
                Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
