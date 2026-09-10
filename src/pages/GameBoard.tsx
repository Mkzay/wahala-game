import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGameSocket } from '../hooks/useGameSocket'
import { useGamePhaseRouting } from '../hooks/useGamePhaseRouting'
import { useGameStore } from '../store/gameStore'
import { useAuthStore } from '../store/authStore'
import { socketService } from '../services/socketService'
import { mapCard, suitMap } from '../utils/cardMapper'
import {
  GameCard,
  CircleSuitGlyph,
  TriangleSuitGlyph,
  CrossSuitGlyph,
  SquareSuitGlyph,
  StarSuitGlyph,
} from '../components/game/GameCard'
import { GameBoardTable } from '../components/game/GameBoardTable'
import { AbilitiesPanel } from '../components/game/AbilitiesPanel'
import type { CardType } from '../components/game/GameCard'
import { toast } from '../store/toastStore'
import { playUiSound } from '../lib/sound'
import type { ClassName } from '../components/game/AbilitiesPanel'
import { useWebMcp } from '../hooks/useWebMcp'

export default function GameBoard() {
  const { gameId = '' } = useParams()
  useGameSocket({ gameId, enabled: gameId.length > 0 })
  useGamePhaseRouting()
  useWebMcp({ gameId, enabled: gameId.length > 0 })
  const gameState = useGameStore((s) => s.gameState)
  const isConnected = useGameStore((s) => s.isConnected)
  const user = useAuthStore((s) => s.user)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [pendingWhotCard, setPendingWhotCard] = useState<CardType | null>(null)
  const [shakingCardId, setShakingCardId] = useState<string | null>(null)
  const userId = user?.id ?? ''
  const players = gameState?.players ?? []
  const activeCard = gameState?.activeCard ? mapCard(gameState.activeCard) : null
  const myHand: CardType[] = (gameState?.playerHands?.[userId] ?? []).map(mapCard)
  const currentTurnPlayerId = gameState?.currentTurnPlayerId ?? null
  const isMyTurn = currentTurnPlayerId === userId
  const myPlayer = players.find((p) => p.userId === userId)
  const isSpectator = !myPlayer
  const roundLabel = gameState?.totalRounds
    ? `${gameState.round} / ${gameState.totalRounds}`
    : `${gameState?.round ?? 1}`

  const requestState = () => socketService.emit('game:state:request', { gameId })

  const isPlayable = (card: CardType) => {
    if (!isMyTurn) return false
    if (
      (gameState?.pendingPenalty ?? 0) > 0 &&
      card.value !== (gameState?.pendingPenaltyType === 'pick_2' ? 2 : 5)
    ) {
      return false
    }
    if (!activeCard) return true
    const currentSuit = gameState?.declaredSuit
      ? suitMap[gameState.declaredSuit] ?? gameState.declaredSuit.toLowerCase()
      : activeCard.suit
    return (
      card.suit === 'whot' ||
      card.value >= 20 ||
      card.suit === currentSuit ||
      card.value === activeCard.value
    )
  }

  const handlePlayCard = (card: CardType) => {
    if (!isMyTurn) {
      playUiSound('error')
      toast.warning('The table is waiting on another contender.', 'Not Your Turn')
      return
    }
    if (!isPlayable(card)) {
      playUiSound('error')
      setShakingCardId(card.id)
      window.setTimeout(() => setShakingCardId(null), 450)
      toast.error(
        `Match ${activeCard?.suit ?? 'the active suit'} or ${activeCard?.value ?? 'the active value'} to play this card.`,
        'Move Rejected'
      )
      return
    }
    if (card.suit === 'whot' || card.value >= 20) {
      playUiSound('tap')
      setPendingWhotCard(card)
      return
    }
    playUiSound('thud')
    socketService.emit('game:card:play', { gameId, cardId: card.id })
    setSelectedCardId(null)
    window.setTimeout(requestState, 250)
  }

  const handleSelectDeclaredSuit = (suit: string) => {
    if (!pendingWhotCard) return
    playUiSound('thud')
    socketService.emit('game:card:play', {
      gameId,
      cardId: pendingWhotCard.id,
      declaredSuit: suit,
    })
    setPendingWhotCard(null)
    setSelectedCardId(null)
    window.setTimeout(requestState, 250)
  }

  const handleDrawCard = () => {
    if (!isMyTurn) return
    // Market riffle on draw
    playUiSound('riffle')
    socketService.emit('game:card:draw', { gameId })
    window.setTimeout(requestState, 250)
  }

  const handleActivateAbility = (abilityName: string) => {
    playUiSound('power')
    socketService.emit('game:ability:use', { gameId, abilityId: abilityName })
    window.setTimeout(requestState, 250)
  }

  const handleReactionResponse = (agree: boolean) => {
    playUiSound(agree ? 'power' : 'tap')
    socketService.emit('game:reaction:respond', {
      gameId,
      action: agree ? 'reflect' : 'absorb',
    })
  }

  if (!gameState) {
    return (
      <div className="grid min-h-screen place-items-center bg-w-bg text-w-text">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-w-orange to-w-yellow font-display text-2xl font-black text-[#fffdf8] shadow-glow-orange animate-pulse">
            W
          </div>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.24em] text-w-text-3">
            Opening the Parlor
          </p>
          <p className="mt-2 text-xs text-w-text-2">Synchronising the table state…</p>
        </div>
      </div>
    )
  }

  return (
    <main
      className={`min-h-screen w-full bg-w-bg text-w-text flex flex-col px-3 sm:px-5 pt-2 ${
        isSpectator ? 'pb-28 sm:pb-32 justify-between' : 'pb-52 sm:pb-56'
      }`}
    >
      {/* Parlor Header */}
      <header className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-2 border-b border-w-border/70 pb-2.5 sm:gap-4 sm:pb-3">
        {/* Left: Branding & Mobile Quick Status */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            to="/home"
            className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl border border-w-border bg-w-surface text-w-text-2 transition-transform duration-160 hover:border-w-orange hover:text-w-orange hover:scale-105 active:scale-95"
            aria-label="Leave table"
          >
            ←
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display text-base sm:text-lg font-black tracking-[0.16em] text-w-text leading-none">
                WAHALA<span className="text-w-orange">.</span>
              </p>
              {/* Mobile-only compact pill badges */}
              <div className="flex items-center gap-1 sm:hidden">
                <span className="rounded-full border border-[#e8ab32]/40 bg-w-yellow/10 px-2 py-0.5 text-[9px] font-black uppercase text-w-yellow whitespace-nowrap">
                  R{roundLabel}
                </span>
                {isSpectator && (
                  <span className="flex items-center gap-1 rounded-full border border-[#38bdf8]/40 bg-[#0c4a6e]/40 px-2 py-0.5 text-[9px] font-black uppercase text-[#38bdf8] whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] animate-ping" />
                    LIVE
                  </span>
                )}
              </div>
            </div>
            <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.18em] text-w-text-3 mt-0.5">
              Afro-Arcade Tabletop
            </p>
          </div>
        </div>

        {/* Center: Tablet (iPad) & Desktop Status Badges */}
        <div className="hidden sm:flex items-center justify-center gap-2 flex-wrap">
          {isSpectator && (
            <span className="flex items-center gap-1.5 rounded-full border border-[#38bdf8]/40 bg-[#0c4a6e]/40 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#38bdf8] shadow-tactile-sm whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] animate-ping" />
              Live Spectator Feed
            </span>
          )}
          <span className="rounded-full border border-w-border bg-w-surface px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-w-text-2 shadow-tactile-sm whitespace-nowrap">
            {gameState.mode} expedition
          </span>
          <span className="rounded-full border border-[#e8ab32]/40 bg-w-yellow/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-w-yellow shadow-tactile-sm whitespace-nowrap">
            Round {roundLabel}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-w-success/35 bg-w-success/10 px-3 py-1 text-[10px] font-bold text-w-success shadow-tactile-sm whitespace-nowrap">
            <i className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            {isConnected ? 'Connected' : 'Reconnecting'}
          </span>
        </div>

        {/* Right: Turn / Match State */}
        <div className="text-right shrink-0">
          <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.18em] text-w-text-3">
            {isSpectator ? 'Arena Broadcast' : isMyTurn ? 'Contender Turn' : 'Table Status'}
          </p>
          <p
            className={`font-display text-xs sm:text-sm font-black whitespace-nowrap ${
              isMyTurn ? 'text-w-yellow animate-pulse' : isSpectator ? 'text-[#38bdf8]' : 'text-w-text-2'
            }`}
          >
            {isSpectator ? '4-Way Live Match' : isMyTurn ? 'Cast Your Card' : 'Awaiting Play'}
          </p>
        </div>
      </header>

      {/* Main Table + Telemetry Grid */}
      <section
        className={`mx-auto w-full max-w-[1500px] flex-1 flex flex-col justify-center ${
          isSpectator ? 'my-auto py-1 sm:py-3' : 'mt-4'
        } xl:grid xl:grid-cols-[minmax(0,1fr)_280px] gap-4`}
      >
        <div className="w-full flex-1 flex flex-col justify-center min-w-0">
          <GameBoardTable
            players={players}
            currentTurnPlayerId={currentTurnPlayerId}
            activeCard={activeCard}
            marketCount={gameState.market?.length ?? 0}
            reactionWindowEndsAtMs={gameState.reactionWindow?.expiresAtMs ?? null}
            reactionWindowTargetId={gameState.reactionWindow?.targetUserId ?? null}
            reactionWindowAttackerId={gameState.reactionWindow?.attackerUserId ?? null}
            onDrawCard={handleDrawCard}
            onReactionResponse={handleReactionResponse}
            localUserId={userId}
            declaredSuit={gameState?.declaredSuit ?? null}
            turnTimerSeconds={gameState.timerSeconds}
            marketTopCard={
              gameState.market?.[0] && (gameState.market[0].suit as string).toLowerCase() !== 'hidden'
                ? mapCard(gameState.market[0])
                : null
            }
            isSpectator={isSpectator}
          />
        </div>

        {/* Sidebar Telemetry */}
        <aside className="hidden space-y-3 xl:block">
          <section className="game-panel rounded-2xl p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-w-text-3">
              Match Telemetry
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-w-border bg-w-bg/70 p-3">
                <p className="text-[9px] uppercase font-bold tracking-wider text-w-text-3">
                  Cards in Hand
                </p>
                <p className="mt-1 font-display text-2xl font-black text-w-text">
                  {myHand.length}
                </p>
              </div>
              <div className="rounded-xl border border-w-border bg-w-bg/70 p-3">
                <p className="text-[9px] uppercase font-bold tracking-wider text-w-text-3">
                  Market Deck
                </p>
                <p className="mt-1 font-display text-2xl font-black text-w-orange">
                  {gameState.market?.length ?? 0}
                </p>
              </div>
            </div>
          </section>

          <section className="game-panel rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-w-text-3">
                Chaos Laws
              </p>
              <span className="rounded-full bg-w-orange/15 px-2 py-0.5 text-[10px] font-black text-w-orange">
                {gameState.activeRules.length}
              </span>
            </div>
            {gameState.activeRules.length ? (
              <div className="mt-3 space-y-2">
                {gameState.activeRules.map((rule) => (
                  <div
                    key={rule.ruleId}
                    className="rounded-xl border border-w-orange/30 bg-w-orange/10 p-3"
                  >
                    <p className="text-xs font-black text-w-orange">{rule.name}</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-w-text-2">
                      {rule.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-w-border p-3 text-[10px] leading-relaxed text-w-text-3">
                Table chaos modifiers activate as play intensifies.
              </p>
            )}
          </section>

          <section className="game-panel rounded-2xl p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-w-text-3">
              Parlor Rules
            </p>
            <p className="mt-3 text-xs leading-relaxed text-w-text-2">
              Match active suit or number. Tap a playable card to focus, then tap again to cast.
            </p>
          </section>
        </aside>
      </section>

      {/* Spectator Arena HUD vs Player Hand Tray */}
      {isSpectator ? (
        <section className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-[#38bdf8]/40 bg-[#071d17]/95 px-3 py-2.5 sm:px-5 sm:py-3 shadow-[0_-18px_45px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          <div className="mx-auto w-full max-w-[1400px]">
            {/* Top row: Live Badge, Round & Active Turn Ticker */}
            <div className="mb-2 flex items-center justify-between gap-2 border-b border-w-border/30 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#38bdf8] animate-ping" />
                <span className="font-display text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#38bdf8]">
                  Esports Spectator Mode
                </span>
                <span className="rounded-full bg-[#38bdf8]/15 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#38bdf8] whitespace-nowrap">
                  Round {roundLabel}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-w-text-2">
                <span className="text-w-text-3 uppercase tracking-wider text-[9px] hidden sm:inline">Active Turn:</span>
                <span className="text-w-yellow font-black flex items-center gap-1 whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-w-yellow animate-pulse" />
                  {players.find((p) => p.userId === currentTurnPlayerId)?.username ?? 'Contender'}
                </span>
                {gameState.timerSeconds && (
                  <span className="rounded-md bg-[#e8ab32]/25 px-1.5 py-0.5 font-mono text-[9px] font-black text-w-yellow whitespace-nowrap">
                    ⏱ {gameState.timerSeconds}s
                  </span>
                )}
              </div>
            </div>

            {/* Players Roster: 4-Column Grid on Tablet/Desktop, 2x2 Grid on Mobile (ZERO scrollbars!) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {players.map((p) => {
                const isCurrent = p.userId === currentTurnPlayerId
                const classColors: Record<string, { badge: string; text: string }> = {
                  striker: { badge: 'bg-red-500/20 text-red-300 border-red-500/40', text: 'text-red-400' },
                  wall: { badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', text: 'text-emerald-400' },
                  mastermind: { badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', text: 'text-indigo-400' },
                  joker: { badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40', text: 'text-purple-400' },
                }
                const cColor = (p.class && classColors[p.class.toLowerCase()]) || {
                  badge: 'bg-w-border/30 text-w-text-3 border-w-border/40',
                  text: 'text-w-text-2',
                }

                return (
                  <div
                    key={p.userId}
                    className={`flex items-center justify-between rounded-xl border p-2 text-xs transition-all ${
                      isCurrent
                        ? 'border-[#e8ab32] bg-[#e8ab32]/20 shadow-[0_0_18px_rgba(232,171,50,0.4)] ring-1 ring-[#e8ab32] scale-[1.01]'
                        : 'border-w-border/50 bg-[#064e43]/40 hover:bg-[#064e43]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div
                        className={`grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-lg font-display text-[11px] sm:text-xs font-black ${
                          isCurrent
                            ? 'bg-w-yellow text-[#18221c]'
                            : 'bg-w-surface border border-w-border text-w-text'
                        }`}
                      >
                        {p.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <p className={`truncate font-bold text-[11px] sm:text-xs ${isCurrent ? 'text-w-yellow font-black' : 'text-w-text'}`}>
                            {p.username}
                          </p>
                          {isCurrent && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-w-yellow animate-pulse" />}
                        </div>
                        {p.class && (
                          <span className={`inline-block rounded px-1 text-[8px] font-black uppercase tracking-wider border ${cColor.badge}`}>
                            {p.class}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-1.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-black/50 px-2 py-0.5 sm:py-1 text-[10px] font-mono font-black text-[#fffdf8] border border-white/10">
                        <span>🎴</span>
                        <span>{p.cardCount}</span>
                      </span>
                      {isCurrent && (
                        <p className="text-[8px] font-black uppercase tracking-wider text-w-yellow mt-0.5">
                          Turn
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Natural Fan Hand Tray */}
          <section className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-[#e8ab32]/40 bg-[#fffdf8]/95 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6">
            <div className="mx-auto w-full max-w-[1500px]">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-w-text-3">
                  Your Grimoire <span className="text-w-text-2">· {myHand.length} cards</span>
                </p>
                {isMyTurn && (
                  <span className="rounded-full bg-gradient-to-r from-w-orange to-w-yellow px-3 py-1 text-[9px] font-black uppercase tracking-wider text-[#fffdf8] shadow-glow-orange animate-pulse">
                    {selectedCardId ? 'Tap again to cast' : 'Choose a card to play'}
                  </span>
                )}
              </div>

              <div className="no-scrollbar flex min-h-[142px] items-end justify-center overflow-x-auto px-6 pb-2 pt-6 sm:min-h-[180px] sm:justify-center">
                {myHand.length ? (
                  <div
                    className={`flex items-end ${
                      myHand.length > 12
                        ? '-space-x-7 sm:-space-x-9'
                        : myHand.length > 8
                          ? '-space-x-6 sm:-space-x-8'
                          : '-space-x-5 sm:-space-x-7'
                    } pb-1`}
                  >
                    {myHand.map((card, index) => {
                      const playable = isPlayable(card)
                      const selected = selectedCardId === card.id
                      const total = myHand.length
                      const center = (total - 1) / 2
                      const maxSpread = Math.min(26, total * 3.2)
                      const angle = total > 1 ? ((index - center) / center) * (maxSpread / 2) : 0
                      const arcY = total > 1 ? Math.pow(Math.abs(index - center), 1.6) * 2.8 : 0

                      return (
                        <div
                          key={card.id}
                          className="relative flex-shrink-0 transition-transform duration-200"
                          style={{
                            zIndex: selected ? 40 : index,
                            transform: `rotate(${selected ? 0 : angle}deg) translateY(${
                              selected ? -28 : arcY
                            }px)`,
                          }}
                        >
                          <GameCard
                            card={card}
                            isPlayable={playable}
                            isSelected={selected}
                            isShaking={shakingCardId === card.id}
                            size="sm"
                            onClick={() => {
                              if (selected) {
                                handlePlayCard(card)
                              } else {
                                // Paper slide on select
                                playUiSound('slide')
                                setSelectedCardId(card.id)
                              }
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="self-center rounded-xl border border-dashed border-w-border px-4 py-3 text-xs text-w-text-3">
                    Your hand is empty — round is concluding.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Floating Abilities Panel */}
          <AbilitiesPanel
            classNameType={(myPlayer?.class as ClassName | null) ?? 'joker'}
            abilityUsed={myPlayer?.abilityUsed ?? false}
            onActivateAbility={handleActivateAbility}
            isMyTurn={isMyTurn}
          />
        </>
      )}

      {/* Disconnect Reconnecting Modal */}
      {!isConnected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#022c25]/80 p-5 backdrop-blur-md">
          <div className="game-panel max-w-sm rounded-3xl p-6 text-center border-2 border-w-danger">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-w-danger/15 text-2xl text-w-danger">
              !
            </div>
            <h2 className="mt-4 font-display text-lg font-black">Link Interrupted</h2>
            <p className="mt-2 text-xs leading-relaxed text-w-text-2">
              The parlor is synchronising with the table. Your state will restore automatically.
            </p>
            <button
              type="button"
              onClick={() => {
                socketService.connect(gameId)
                window.setTimeout(requestState, 500)
              }}
              className="mt-5 w-full rounded-xl bg-w-orange px-4 py-3 font-display text-xs font-black text-[#fffdf8] shadow-glow-orange transition-transform duration-160 hover:scale-[1.02] active:scale-[0.97]"
            >
              Reconnect to Table
            </button>
          </div>
        </div>
      )}
      {/* Whot 20 Suit Declaration Modal - Non-blocking above visible hand */}
      {pendingWhotCard && (
        <>
          {/* Subtle table backdrop dimming that stops above the hand tray */}
          <div
            className="fixed inset-0 bottom-[160px] z-40 bg-black/40 backdrop-blur-[2px] animate-fade-in sm:bottom-[200px]"
            onClick={() => setPendingWhotCard(null)}
          />
          <div className="fixed bottom-[170px] left-1/2 z-40 w-[94%] max-w-md -translate-x-1/2 animate-pop-in sm:bottom-[210px]">
            <div className="rounded-[24px] border-2 border-w-yellow bg-[#064e43]/95 p-5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-6">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-w-yellow">
                Wahala Wildcard
              </span>
              <h3 className="mt-1 font-display text-xl font-black text-[#fffdf8]">
                Demand a Suit
              </h3>
              <p className="mt-1 text-xs text-[#ebd9b7]/80">
                Choose the shape to demand (check your hand below):
              </p>
              <div className="mt-4 grid grid-cols-5 gap-2.5 sm:gap-3">
                {[
                  {
                    name: 'Circle',
                    glyph: <CircleSuitGlyph size={36} />,
                    bg: 'bg-[#059669]/20 border-[#059669] text-[#10b981] hover:bg-[#059669]/35 hover:border-[#34d399]',
                  },
                  {
                    name: 'Triangle',
                    glyph: <TriangleSuitGlyph size={36} />,
                    bg: 'bg-[#0284c7]/20 border-[#0284c7] text-[#38bdf8] hover:bg-[#0284c7]/35 hover:border-[#7dd3fc]',
                  },
                  {
                    name: 'Cross',
                    glyph: <CrossSuitGlyph size={36} />,
                    bg: 'bg-[#e11d48]/20 border-[#e11d48] text-[#fb7185] hover:bg-[#e11d48]/35 hover:border-[#fda4af]',
                  },
                  {
                    name: 'Square',
                    glyph: <SquareSuitGlyph size={36} />,
                    bg: 'bg-[#7c3aed]/20 border-[#7c3aed] text-[#a78bfa] hover:bg-[#7c3aed]/35 hover:border-[#c4b5fd]',
                  },
                  {
                    name: 'Star',
                    glyph: <StarSuitGlyph size={36} />,
                    bg: 'bg-[#d97706]/20 border-[#d97706] text-[#fbbf24] hover:bg-[#d97706]/35 hover:border-[#fde047]',
                  },
                ].map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    aria-label={`Demand ${s.name}`}
                    onClick={() => handleSelectDeclaredSuit(s.name)}
                    className={`flex h-14 items-center justify-center rounded-2xl border-2 ${s.bg} p-2 transition-all duration-160 hover:scale-110 active:scale-95 shadow-md sm:h-16`}
                  >
                    {s.glyph}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPendingWhotCard(null)}
                className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#ebd9b7]/60 hover:text-[#ebd9b7]"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
