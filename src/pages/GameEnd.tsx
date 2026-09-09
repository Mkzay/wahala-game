import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGamePhaseRouting } from '../hooks/useGamePhaseRouting'
import { playUiSound } from '../lib/sound'

export default function GameEnd() {
  useGamePhaseRouting()

  useEffect(() => {
    playUiSound('fanfare')
  }, [])

  const stats = [
    { label: 'Total XP Earned', value: '+372 XP', color: 'text-[#e8ab32]' },
    { label: 'Rounds Won', value: '3 / 5', color: 'text-[#10b981]' },
    { label: 'Coins Acquired', value: '+170 Cowries', color: 'text-[#818cf8]' },
    { label: 'Abilities Cast', value: '8 Times', color: 'text-[#ea580c]' },
  ]

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
            5 tense rounds settled on the felt. Rankings determined by lowest accumulated point load.
          </p>
        </header>

        {/* Split Panels */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Winner Showcase Card */}
          <article className="col-span-1 md:col-span-5 rounded-3xl border border-[#c48d28]/60 bg-gradient-to-br from-[#0a271f] via-[#071d17] to-[#041511] p-6 sm:p-7 flex flex-col justify-between shadow-[0_16px_36px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Top brass highlight line */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#e8ab32] to-transparent" />

            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c48d28]/60 bg-[#c48d28]/20 text-[#e8ab32] text-2xl shadow-[0_0_24px_rgba(232,171,50,0.3)]">
                🏆
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black mt-5 text-[#fffdf8]">
                Table Champion
              </h2>
              <p className="text-xs font-display font-black text-[#ea580c] uppercase tracking-wider mt-1.5">
                Chaos Virtuoso · The Joker Archetype
              </p>
              <p className="mt-3 text-xs text-[#c2d6ce] leading-relaxed">
                Maintained the lowest final point count by cleanly executing suit counters, reaction deflections, and swift card drops.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1b3b33] flex items-center justify-between">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#8ba79e]">
                Final Standing
              </span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#e8ab32]/20 border border-[#e8ab32]/50 text-[#e8ab32]">
                Rank #1
              </span>
            </div>
          </article>

          {/* Stats & Actions */}
          <div className="col-span-1 md:col-span-7 rounded-3xl border border-[#1b3b33] bg-[#071d17]/90 p-6 sm:p-7 shadow-[0_16px_36px_rgba(0,0,0,0.4)] flex flex-col justify-between backdrop-blur-md">
            <div>
              <h3 className="font-display text-xs font-black uppercase tracking-wider text-[#e8ab32] border-b border-[#1b3b33] pb-3 mb-5">
                Match Performance Breakdown
              </h3>

              <div className="grid grid-cols-2 gap-3.5">
                {stats.map((stat) => (
                  <article
                    key={stat.label}
                    className="rounded-2xl border border-[#1b3b33] bg-[#041511]/80 p-3.5 sm:p-4 shadow-sm"
                  >
                    <p className={`font-display text-xl font-black ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-[#8ba79e] uppercase font-black tracking-wider mt-1">
                      {stat.label}
                    </p>
                  </article>
                ))}
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
