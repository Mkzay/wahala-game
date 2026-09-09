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

export default function GameBoard() {
  const { gameId = '' } = useParams()
  useGameSocket({ gameId, enabled: gameId.length > 0 })
  useGamePhaseRouting()
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
    <main className="min-h-screen w-full bg-w-bg px-3 pb-52 pt-3 text-w-text sm:px-5 sm:pb-56">
      {/* Parlor Header */}
      <header className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-3 border-b border-w-border/70 pb-3">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            className="grid h-9 w-9 place-items-center rounded-xl border border-w-border bg-w-surface text-w-text-2 transition-transform duration-160 hover:border-w-orange hover:text-w-orange hover:scale-105 active:scale-95"
            aria-label="Leave table"
          >
            ←
          </Link>
          <div>
            <p className="font-display text-lg font-black tracking-[0.16em] text-w-text">
              WAHALA<span className="text-w-orange">.</span>
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-w-text-3">
              Afro-Arcade Tabletop
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="rounded-full border border-w-border bg-w-surface px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-w-text-2 shadow-tactile-sm">
            {gameState.mode} expedition
          </span>
          <span className="rounded-full border border-[#e8ab32]/40 bg-w-yellow/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-w-yellow shadow-tactile-sm">
            Round {roundLabel}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-w-success/35 bg-w-success/10 px-3 py-1.5 text-[10px] font-bold text-w-success shadow-tactile-sm">
            <i className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            {isConnected ? 'Connected' : 'Reconnecting'}
          </span>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-w-text-3">
            {isMyTurn ? 'Contender Turn' : 'Table Status'}
          </p>
          <p
            className={`font-display text-sm font-black ${
              isMyTurn ? 'text-w-yellow animate-pulse' : 'text-w-text-2'
            }`}
          >
            {isMyTurn ? 'Cast Your Card' : 'Awaiting Play'}
          </p>
        </div>
      </header>

      {/* Main Table + Telemetry Grid */}
      <section className="mx-auto mt-4 grid w-full max-w-[1500px] gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <GameBoardTable
            players={players}
            currentTurnPlayerId={currentTurnPlayerId}
            activeCard={activeCard}
            marketCount={gameState.market?.length ?? 0}
            reactionWindowEndsAtMs={gameState.reactionWindow?.expiresAtMs ?? null}
            onDrawCard={handleDrawCard}
            onReactionResponse={handleReactionResponse}
            localUserId={userId}
            declaredSuit={gameState?.declaredSuit ?? null}
            turnTimerSeconds={gameState.timerSeconds}
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
              <div className="flex items-end -space-x-5 pb-1 sm:-space-x-7">
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
