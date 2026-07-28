import { Link } from 'react-router-dom'
import { useGamePhaseRouting } from '../hooks/useGamePhaseRouting'

export default function GameEnd() {
  useGamePhaseRouting()

  const stats = [
    { label: 'Total XP Earned', value: '+372 XP', color: 'text-w-yellow' },
    { label: 'Rounds Won', value: '3 / 5', color: 'text-w-success' },
    { label: 'Coins Acquired', value: '+170 Coins', color: 'text-w-mystic' },
    { label: 'Abilities Activated', value: '8 Times', color: 'text-w-royal' },
  ]

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 pt-6 pb-24 md:pb-8 text-w-text flex flex-col justify-center">
      <header className="text-center mb-8">
        <span className="text-xs font-display font-bold uppercase tracking-widest text-w-yellow animate-pulse">
          Game Over · Match Concluded
        </span>
        <h2 className="mt-1 font-display text-3xl font-black tracking-wide text-w-text">
          Victory Summary
        </h2>
        <p className="text-xs text-w-text-2 mt-2">
          5 rounds completed. Rankings determined by lowest accumulated score.
        </p>
      </header>

      {/* Widescreen split panels */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Winner Hero banner (occupies 5 cols) */}
        <article className="col-span-1 md:col-span-5 rounded-2xl border border-w-yellow bg-gradient-to-br from-w-yellow/15 via-w-surface to-w-surface-2 p-6 flex flex-col justify-between shadow-tactile-md">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-w-yellow/30 bg-w-yellow/20 text-w-yellow text-xl">
              🏆
            </div>
            <h3 className="font-display text-3xl font-black mt-4 text-w-text">
              Mkzay wins!
            </h3>
            <p className="text-xs font-display font-semibold text-w-orange uppercase tracking-wider mt-1.5">
              Chaos King · The Joker Class
            </p>
            <p className="mt-3 text-xs text-w-text-2 leading-relaxed">
              Maintained the lowest score of 24 points throughout 5 rounds by successfully utilizing random card dynamics and reaction intervals.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-w-border/30 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-w-text-3">
              Final standing
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-w-surface border border-w-border">
              Rank #1
            </span>
          </div>
        </article>

        {/* Right Side: Detailed stats grid (occupies 7 cols) */}
        <div className="col-span-1 md:col-span-7 rounded-2xl border border-w-border bg-w-surface p-6 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-w-text-2 border-b border-w-border/40 pb-2 mb-4">
              Match Performance Stats
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <article key={stat.label} className="rounded-xl border border-w-border bg-w-bg p-3">
                  <p className={`font-display text-lg font-black ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-w-text-2 uppercase font-bold tracking-wider mt-1">
                    {stat.label}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <Link
            to="/home"
            className="mt-6 block w-full rounded-xl bg-w-orange hover:bg-w-orange/95 px-4 py-3 text-center font-display text-xs font-bold text-w-text shadow transition-transform hover:scale-[1.01]"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}
