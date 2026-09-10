import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGameSocket } from '../hooks/useGameSocket'
import { useGamePhaseRouting } from '../hooks/useGamePhaseRouting'
import { useWebMcp } from '../hooks/useWebMcp'
import { useGameStore } from '../store/gameStore'
import { useAuthStore } from '../store/authStore'
import { playUiSound } from '../lib/sound'

export default function GameEnd() {
  const { gameId = '' } = useParams()

  useGameSocket({ gameId, enabled: gameId.length > 0 })
  useGamePhaseRouting()
  useWebMcp({ gameId, enabled: gameId.length > 0 })

  const gameState = useGameStore((s) => s.gameState)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    playUiSound('fanfare')
  }, [])

  const players = gameState?.players ?? []
  const sortedPlayers = [...players].sort((a, b) => (a.cumulativeScore ?? 0) - (b.cumulativeScore ?? 0))
  const champion = players.find((p) => p.userId === gameState?.winnerId) ?? sortedPlayers[0]
  const isUserChampion = champion?.userId === user?.id

  return (
    <main className="relative min-h-screen w-full felt-table-bg text-[#fffdf8] flex flex-col justify-center px-4 pt-6 pb-24 md:pb-8 select-none">
      <div className="table-spotlight absolute inset-0 pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <header className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c48d28]/40 bg-[#071d17]/80 px-4 py-1 shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#e8ab32] animate-ping" />
            <span className="font-display text-[11px] font-black uppercase tracking-widest text-[#e8ab32]">
              Match Concluded · Final Reckoning
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-wide text-[#fffdf8]">
            Parlor <span className="text-[#e8ab32]">Victory Summary</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#c2d6ce] mt-2">
            Tournament concluded. Final rankings determined by lowest accumulated point load.
          </p>
        </header>

        {/* Split Panels */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Winner Showcase Card */}
          <article className="col-span-1 md:col-span-5 rounded-3xl border border-[#c48d28]/60 bg-gradient-to-br from-[#0a271f] via-[#071d17] to-[#041511] p-6 sm:p-7 flex flex-col justify-between shadow-[0_16px_36px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#e8ab32] to-transparent" />

            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c48d28]/60 bg-[#c48d28]/20 text-[#e8ab32] text-2xl shadow-[0_0_24px_rgba(232,171,50,0.3)]">
                🏆
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black mt-5 text-[#fffdf8]">
                {champion ? (isUserChampion ? `${champion.username} (You)` : champion.username) : 'Tournament Champion'}
              </h2>
              <p className="text-xs font-display font-black text-[#ea580c] uppercase tracking-wider mt-1.5">
                {champion?.class ? `Archetype: ${champion.class.toUpperCase()}` : 'GRAND MASTER'}
              </p>
              <p className="mt-3 text-xs text-[#c2d6ce] leading-relaxed">
                Maintained the lowest final point count ({champion?.cumulativeScore ?? 0} penalty pts) through tactical card play, reaction defense, and decisive execution.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1b3b33] flex items-center justify-between">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#8ba79e]">
                Final Standing
              </span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#e8ab32]/20 border border-[#e8ab32]/50 text-[#e8ab32]">
                Rank #1 · Champion
              </span>
            </div>
          </article>

          {/* Standings & Actions */}
          <div className="col-span-1 md:col-span-7 rounded-3xl border border-[#1b3b33] bg-[#071d17]/90 p-6 sm:p-7 shadow-[0_16px_36px_rgba(0,0,0,0.4)] flex flex-col justify-between backdrop-blur-md">
            <div>
              <h3 className="font-display text-xs font-black uppercase tracking-wider text-[#e8ab32] border-b border-[#1b3b33] pb-3 mb-4">
                Tournament Final Standings
              </h3>

              <div className="space-y-2.5">
                {sortedPlayers.map((player, idx) => {
                  const isYou = player.userId === user?.id
                  const isFirst = idx === 0

                  return (
                    <article
                      key={player.userId}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs transition-all ${
                        isFirst
                          ? 'border-[#e8ab32]/60 bg-[#0a271f]/90 shadow-sm'
                          : 'border-[#1b3b33] bg-[#041511]/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-display font-black text-xs w-6 ${isFirst ? 'text-[#e8ab32]' : 'text-[#8ba79e]'}`}>
                          #{idx + 1}
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
                            Status: {player.status}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-display font-black text-sm text-[#fffdf8]">
                          {player.cumulativeScore ?? 0}
                        </span>
                        <span className="text-[10px] text-[#8ba79e] block -mt-0.5">pts</span>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>

            <Link
              to="/home"
              onClick={() => playUiSound('select')}
              className="mt-8 block w-full rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#e8ab32] to-[#ea580c] hover:brightness-110 px-5 py-4 text-center font-display text-xs sm:text-sm font-black uppercase tracking-wider text-[#041511] shadow-[0_8px_20px_rgba(234,88,12,0.35)] transition-[transform,filter] active:scale-[0.97]"
            >
              Return to Parlor Hall
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
