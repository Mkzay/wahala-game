import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGameSocket } from '../hooks/useGameSocket'
import { useGamePhaseRouting } from '../hooks/useGamePhaseRouting'
import { useGameStore } from '../store/gameStore'
import { useAuthStore } from '../store/authStore'
import { socketService } from '../services/socketService'
import { playUiSound } from '../lib/sound'
import { useWebMcp } from '../hooks/useWebMcp'

export default function RoundEnd() {
  const { gameId = '' } = useParams()
  const navigate = useNavigate()

  // Keep socket and WebMCP connected during intermission
  useGameSocket({ gameId, enabled: gameId.length > 0 })
  useGamePhaseRouting()
  useWebMcp({ gameId, enabled: gameId.length > 0 })

  const gameState = useGameStore((s) => s.gameState)
  const user = useAuthStore((s) => s.user)

  const [countdown, setCountdown] = useState(8)
  const hasEmittedNextRound = useRef(false)

  const roundNumber = gameState?.round ?? 1
  const totalRounds = gameState?.totalRounds ?? 5
  const isFinalRound = Boolean(gameState?.mode === 'progression' && totalRounds && roundNumber >= totalRounds)

  // Sound effect on entrance
  useEffect(() => {
    playUiSound('fanfare')
  }, [])

  // Auto-advance countdown timer (8s) - only for non-final rounds
  useEffect(() => {
    if (isFinalRound) return

    if (countdown <= 0) {
      if (!hasEmittedNextRound.current && gameId) {
        hasEmittedNextRound.current = true
        socketService.emit('round:next', { gameId })
        socketService.emit('game:state:request', { gameId })
      }
      return
    }

    const timer = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown, gameId, isFinalRound])

  const handleNextRound = () => {
    if (!gameId) return
    if (isFinalRound) {
      navigate(`/game/${gameId}/game-end`)
      return
    }
    if (hasEmittedNextRound.current) return
    hasEmittedNextRound.current = true
    playUiSound('select')
    socketService.emit('round:next', { gameId })
    socketService.emit('game:state:request', { gameId })
  }

  const players = gameState?.players ?? []
  const roundWinner =
    players.find((p) => p.userId === gameState?.roundWinnerId) ??
    [...players].sort((a, b) => (a.cardValueSum ?? 0) - (b.cardValueSum ?? 0))[0]

  const isCurrentWinner = roundWinner?.userId === user?.id
  const sortedPlayers = [...players].sort((a, b) => (a.cardValueSum ?? 0) - (b.cardValueSum ?? 0))

  return (
    <main className="relative min-h-screen w-full felt-table-bg text-[#fffdf8] flex flex-col justify-center px-4 pt-6 pb-24 md:pb-8 select-none">
      <div className="table-spotlight absolute inset-0 pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c48d28]/40 bg-[#071d17]/80 px-4 py-1 shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#ea580c] animate-ping" />
            <span className="font-display text-[11px] font-black uppercase tracking-widest text-[#ea580c]">
              {isFinalRound ? `Final Round ${roundNumber} of ${totalRounds} Complete` : `Round ${roundNumber} of ${totalRounds} Complete`}
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-black tracking-wide text-[#fffdf8]">
            {isFinalRound ? 'Tournament Concluded. Standings are locked.' : (
              <>Round Over. Here is the <span className="text-[#ea580c]">damage.</span></>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#c2d6ce] mt-2">
            Points are calculated from remaining card values in hands. Lower load secures tournament standing.
          </p>
        </header>

        {/* Widescreen split panels */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left Side: Highlighted Winner Card (occupies 5 cols) */}
          <article className="col-span-1 md:col-span-5 rounded-3xl border-2 border-[#e8ab32] bg-gradient-to-br from-[#0a271f] via-[#071d17] to-[#041511] p-6 sm:p-7 flex flex-col justify-between shadow-[0_16px_36px_rgba(0,0,0,0.5),0_0_30px_rgba(232,171,50,0.2)] text-[#fffdf8] relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#e8ab32] to-transparent" />

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#e8ab32] px-2.5 py-1 rounded-full bg-[#e8ab32]/10 border border-[#e8ab32]/30">
                  Round Victor
                </span>
                <span className="text-xl">🏆</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-black mt-4 text-[#fffdf8]">
                {roundWinner ? (isCurrentWinner ? `${roundWinner.username} (You)` : roundWinner.username) : 'Match Contender'}
              </h2>

              <p className="text-xs font-display font-black text-[#ea580c] uppercase tracking-wider mt-1">
                Archetype: {roundWinner?.class ? roundWinner.class.toUpperCase() : 'NEO-TACTICIAN'}
              </p>

              <p className="mt-3 text-xs text-[#c2d6ce] leading-relaxed">
                {roundWinner?.cardCount === 0
                  ? '👑 CHECK-UP ACHIEVED! Cleared every card from hand first to take the round clean with 0 penalty points.'
                  : `Held the lowest remaining penalty load (${roundWinner?.cardValueSum ?? 0} pts) when the market deck was exhausted.`}
              </p>
            </div>

            <div className="mt-6 border-t border-[#1b3b33] pt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-[#8ba79e]">Round Reward</span>
                <p className="font-display text-xl font-black text-[#e8ab32]">+100 XP · 50 Cowries</p>
              </div>
              <div className="h-10 w-10 rounded-full border border-[#e8ab32]/40 bg-[#e8ab32]/20 flex items-center justify-center text-[#e8ab32] shadow-sm font-black">
                ★
              </div>
            </div>
          </article>

          {/* Right Side: Scorecard / Damage breakdown (occupies 7 cols) */}
          <div className="col-span-1 md:col-span-7 rounded-3xl border border-[#1b3b33] bg-[#071d17]/90 p-6 sm:p-7 shadow-[0_16px_36px_rgba(0,0,0,0.4)] flex flex-col justify-between backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between border-b border-[#1b3b33] pb-3 mb-4">
                <h3 className="font-display text-xs font-black uppercase tracking-wider text-[#e8ab32]">
                  Live Round Scorecard & Penalty Load
                </h3>
                <span className="text-[11px] font-mono font-bold text-[#8ba79e]">
                  Auto in {countdown}s
                </span>
              </div>

              <div className="space-y-2.5">
                {sortedPlayers.map((player) => {
                  const isYou = player.userId === user?.id
                  const isWinner = player.userId === roundWinner?.userId
                  const isEliminated = player.status === 'eliminated'

                  return (
                    <article
                      key={player.userId}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition-all ${
                        isWinner
                          ? 'border-[#e8ab32]/60 bg-[#0a271f]/90 shadow-sm'
                          : 'border-[#1b3b33] bg-[#041511]/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-display font-black text-xs text-[#8ba79e] w-4">
                          {isWinner ? '👑' : '•'}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`font-semibold ${isYou ? 'text-[#e8ab32] font-black' : 'text-[#fffdf8]'}`}>
                              {player.username} {isYou ? '(You)' : ''}
                            </span>
                            {player.class && (
                              <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-[#1b3b33] text-[#8ba79e]">
                                {player.class}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#8ba79e]">
                            Cumulative: {player.cumulativeScore ?? 0} pts
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isWinner
                              ? 'text-[#e8ab32] bg-[#e8ab32]/10 border-[#e8ab32]/40'
                              : isEliminated
                              ? 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/40'
                              : 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/40'
                          }`}
                        >
                          {isWinner ? 'Winner' : isEliminated ? 'Eliminated' : 'Safe'}
                        </span>
                        <div className="text-right min-w-[50px]">
                          <span className="font-display font-black text-sm text-[#fffdf8]">
                            +{player.cardValueSum ?? 0}
                          </span>
                          <span className="text-[10px] text-[#8ba79e] block -mt-0.5">pts</span>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextRound}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#e8ab32] to-[#ea580c] hover:brightness-110 px-5 py-3.5 font-display text-xs sm:text-sm font-black uppercase tracking-wider text-[#041511] shadow-[0_8px_20px_rgba(234,88,12,0.35)] transition-[transform,filter] active:scale-[0.97]"
            >
              {isFinalRound
                ? '🏆 View Final Championship Standings'
                : (countdown > 0 ? `Ready for Next Round (Auto in ${countdown}s)` : 'Starting Next Round...')}
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
