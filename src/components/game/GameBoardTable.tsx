import { useEffect, useState, useRef } from 'react'
import type { GamePlayer } from '../../types/game'
import type { CardType } from './GameCard'
import { GameCard } from './GameCard'
import { playUiSound } from '../../lib/sound'

interface GameBoardTableProps {
  players: GamePlayer[]
  currentTurnPlayerId: string | null
  activeCard: CardType | null
  marketCount: number
  reactionWindowEndsAtMs: number | null
  onDrawCard: () => void
  onReactionResponse: (agree: boolean) => void
  localUserId: string
  declaredSuit?: string | null
  turnTimerSeconds?: number | null
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
  declaredSuit = null,
  turnTimerSeconds = null,
}: GameBoardTableProps) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [turnSecondsLeft, setTurnSecondsLeft] = useState<number>(turnTimerSeconds ?? 20)
  const lastActiveCardId = useRef<string | null>(null)
  const [slamActive, setSlamActive] = useState(false)
  const opponents = players.filter((player) => player.userId !== localUserId)
  const isMyTurn = currentTurnPlayerId === localUserId
  const hasAutoDrawn = useRef(false)

  // Turn timer countdown and auto-draw trigger
  useEffect(() => {
    if (!turnTimerSeconds) return
    setTurnSecondsLeft(turnTimerSeconds)
    hasAutoDrawn.current = false

    const interval = window.setInterval(() => {
      setTurnSecondsLeft((prev) => {
        if (prev <= 0) {
          return 0
        }
        const next = prev - 1
        if (next <= 5 && next > 0) {
          playUiSound('tick')
        }
        if (next === 0 && isMyTurn && !hasAutoDrawn.current) {
          hasAutoDrawn.current = true
          onDrawCard()
        }
        return next
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [turnTimerSeconds, currentTurnPlayerId, isMyTurn, onDrawCard])

  // Card slam impact trigger when activeCard updates
  useEffect(() => {
    if (activeCard && activeCard.id !== lastActiveCardId.current) {
      lastActiveCardId.current = activeCard.id
      setSlamActive(true)
      playUiSound('thud')
      const timer = window.setTimeout(() => setSlamActive(false), 320)
      return () => window.clearTimeout(timer)
    }
  }, [activeCard?.id])

  // Reaction countdown timer with mechanical tension tick audio
  useEffect(() => {
    if (!reactionWindowEndsAtMs) {
      setTimeLeft(0)
      return
    }
    const updateTimer = () => {
      const remaining = Math.max(0, reactionWindowEndsAtMs - Date.now())
      setTimeLeft(remaining)
      if (
        remaining > 0 &&
        remaining <= 5000 &&
        Math.floor(remaining / 1000) !== Math.floor((remaining - 80) / 1000)
      ) {
        playUiSound('tick')
      }
    }
    updateTimer()
    const interval = window.setInterval(updateTimer, 80)
    return () => window.clearInterval(interval)
  }, [reactionWindowEndsAtMs])

  const positionClass = (index: number) => {
    if (opponents.length === 1) return 'opponent-top'
    if (opponents.length === 2) return index === 0 ? 'opponent-left' : 'opponent-right'
    return ['opponent-left', 'opponent-top', 'opponent-right'][index % 3]
  }

  return (
    <div className="relative min-h-[440px] flex-1 overflow-hidden rounded-[26px] border-4 border-[#e8ab32]/90 shadow-[0_12px_0_#1c130b,0_32px_56px_rgba(0,0,0,0.45)] felt-table-bg sm:min-h-[530px] sm:rounded-[32px]">
      {/* Brass insets & parlor oval rings */}
      <div className="absolute inset-3 rounded-[22px] border border-[#f7d884]/40 pointer-events-none sm:inset-4 sm:rounded-[26px]" />
      <div className="absolute inset-8 rounded-[50%] border border-[#e8ab32]/25 pointer-events-none sm:inset-10" />
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(247,216,132,0.5) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Central spotlight illuminating active discard and market deck */}
      <div className="absolute left-1/2 top-1/2 h-[68%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] table-spotlight shadow-[inset_0_0_90px_rgba(2,44,37,0.85)] pointer-events-none" />

      {/* Live Table Badge */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full border border-[#e8ab32]/50 bg-[#022c25]/85 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#fffdf8] backdrop-blur-md shadow-tactile-sm sm:left-5 sm:top-5 sm:px-3.5 sm:text-[10px]">
        <span className="h-2 w-2 rounded-full bg-w-success shadow-[0_0_10px_var(--color-success)] animate-pulse" />
        Parlor Table
      </div>

      {/* Opponents Layout around parlor oval */}
      {opponents.map((player, index) => {
        const isTurn = player.userId === currentTurnPlayerId
        return (
          <div
            key={player.userId}
            className={`absolute z-10 flex flex-col items-center gap-1.5 transition-transform duration-200 ${positionClass(
              index
            )} ${isTurn ? 'is-turn' : ''}`}
          >
            <div
              className={`relative grid h-12 w-12 place-items-center rounded-2xl border-2 transition-all duration-200 ${
                isTurn
                  ? 'border-w-yellow bg-[#064e43] shadow-[0_0_28px_rgba(232,171,50,0.6)] scale-105'
                  : 'border-w-border/80 bg-w-surface/95'
              } backdrop-blur-md sm:h-14 sm:w-14`}
            >
              <span
                className={`font-display text-xs font-black sm:text-sm ${
                  isTurn ? 'text-w-yellow' : 'text-w-text'
                }`}
              >
                {player.username.slice(0, 2).toUpperCase()}
              </span>
              <span
                className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center rounded-full border border-[#e8ab32] bg-w-orange text-[9px] font-black text-[#fffdf8] shadow-md sm:h-6 sm:w-6 sm:text-[10px]"
                title={`${player.cardCount} cards in hand`}
              >
                {player.cardCount}
              </span>
            </div>
            <div className="max-w-[84px] truncate rounded-full border border-[#e8ab32]/30 bg-[#022c25]/80 px-2.5 py-0.5 text-[9px] font-bold text-[#fffdf8] backdrop-blur-md sm:max-w-[105px] sm:text-[10px]">
              {player.username.split(' ')[0]}
            </div>
            {isTurn && (
              <span className="rounded-full bg-w-yellow/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.14em] text-w-yellow sm:text-[9px]">
                Their Turn
              </span>
            )}
          </div>
        )
      })}

      {/* Central Area: Market Deck & Active Discard Pile */}
      <div className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-4 sm:gap-10">
        {/* Market Deck with physical 3D card stack */}
        <button
          type="button"
          onClick={onDrawCard}
          disabled={!isMyTurn}
          aria-label="Draw card from market"
          className={`group relative rounded-2xl transition-transform duration-160 active:scale-[0.97] ${
            isMyTurn ? 'cursor-pointer hover:-translate-y-2' : 'cursor-not-allowed opacity-80'
          }`}
        >
          {/* Simulated 3D stack under deck */}
          <div className="absolute -bottom-1.5 -right-1.5 h-full w-full rounded-2xl border border-[#78350f] bg-[#431407]/90 -z-10" />
          <div className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl border border-[#78350f] bg-[#431407]/80 -z-20 shadow-xl" />

          <GameCard
            card={{ id: 'market-top', suit: 'whot', value: 0 }}
            isFlipped
            isPlayable={false}
            size="md"
          />

          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#e8ab32] bg-[#022c25] px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-w-yellow shadow-md sm:px-3 sm:text-[9px]">
            Market · {marketCount}
          </span>

          {isMyTurn && (
            <>
              <span className="absolute -inset-3 rounded-2xl border-2 border-dashed border-w-yellow/70 animate-pulse pointer-events-none" />
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-w-yellow px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#18221c] shadow-md sm:text-[9px]">
                Draw Card
              </span>
            </>
          )}
        </button>

        {/* Active Discard Pile with Card Slam Animation */}
        <div className="relative">
          {declaredSuit && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-w-yellow bg-[#022c25] px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-w-yellow shadow-[0_0_14px_rgba(232,171,50,0.6)] animate-pulse z-30">
              ✦ Demanded: {declaredSuit}
            </div>
          )}
          {activeCard ? (
            <div className={`relative ${slamActive ? 'animate-card-slam' : ''} drop-shadow-[0_0_18px_rgba(232,171,50,0.35)]`}>
              <GameCard card={activeCard} isPlayable={false} size="md" />
            </div>
          ) : (
            <div className="grid h-[156px] w-[108px] place-items-center rounded-2xl border-2 border-dashed border-[#e8ab32]/40 bg-[#064e43]/40 text-[10px] uppercase tracking-wider text-w-yellow/70">
              No active card
            </div>
          )}
          <span className="absolute -bottom-7 inset-x-0 text-center text-[9px] font-black uppercase tracking-[0.2em] text-[#fffdf8]/90 font-bold">
            Active Sigil
          </span>
        </div>
      </div>

      {/* Turn Indicator Banner at Bottom of Table */}
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#e8ab32]/60 bg-[#022c25]/85 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] shadow-tactile-md backdrop-blur-md">
        {isMyTurn ? (
          <span className="text-w-yellow flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-w-yellow animate-ping" />
            Your Turn · Play a Card
            {turnTimerSeconds ? (
              <span className={`ml-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-black ${turnSecondsLeft <= 5 ? 'bg-w-danger text-[#fffdf8] animate-pulse' : 'bg-[#e8ab32]/25 text-w-yellow'}`}>
                {turnSecondsLeft}s
              </span>
            ) : null}
          </span>
        ) : (
          <span className="text-[#ebd9b7]/80 flex items-center gap-2">
            <span>Awaiting Contenders</span>
            {turnTimerSeconds ? (
              <span className="ml-1 rounded-full bg-[#064e43] px-2 py-0.5 font-mono text-[9px] text-[#ebd9b7]/60">
                {turnSecondsLeft}s
              </span>
            ) : null}
          </span>
        )}
      </div>

      {/* Reaction Window Modal Counter */}
      {reactionWindowEndsAtMs && timeLeft > 0 && (
        <div className="absolute inset-x-4 top-14 z-40 mx-auto max-w-md animate-fade-in animate-reaction-tension rounded-2xl border-2 border-w-orange bg-[#fffdf8]/95 p-5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-w-orange">
            <span className="h-2.5 w-2.5 rounded-full bg-w-orange animate-ping" />
            Penalty Incoming · {Math.ceil(timeLeft / 1000)}s
          </div>
          <p className="mt-2 text-xs leading-relaxed text-w-text-2">
            A strike is heading your way. Counter with your class power or let it land.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => onReactionResponse(true)}
              className="flex-1 rounded-xl bg-gradient-to-r from-w-orange to-w-yellow px-4 py-2.5 font-display text-xs font-black text-[#fffdf8] shadow-glow-orange transition-transform duration-160 hover:scale-[1.02] active:scale-[0.97]"
            >
              Reflect / Counter
            </button>
            <button
              type="button"
              onClick={() => onReactionResponse(false)}
              className="flex-1 rounded-xl border border-w-border bg-w-surface px-4 py-2.5 font-display text-xs font-bold text-w-text-2 transition-transform duration-160 hover:border-w-orange active:scale-[0.97]"
            >
              Absorb Penalty
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
