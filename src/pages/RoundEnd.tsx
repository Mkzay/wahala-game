import { useGameState } from '../hooks/useGameState'
import { useGamePhaseRouting } from '../hooks/useGamePhaseRouting'

export default function RoundEnd() {
  const { setGamePhase } = useGameState()
  useGamePhaseRouting()

  const roundPoints = [
    { username: 'Mkzay (You)', points: 0, status: 'Winner', color: 'text-w-orange' },
    { username: 'Happiness', points: 18, status: 'Safe', color: 'text-w-success' },
    { username: 'Roseanne', points: 31, status: 'Safe', color: 'text-w-success' },
    { username: 'Esther', points: 47, status: 'Eliminated', color: 'text-w-danger' },
  ]

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 pt-6 pb-24 md:pb-8 text-w-text flex flex-col justify-center">
      <header className="text-center mb-8">
        <span className="text-xs font-display font-bold uppercase tracking-widest text-w-orange">
          Round 2 of 5 Complete
        </span>
        <h2 className="mt-1 font-display text-3xl font-black tracking-wide">
          Round Over. Here is the <span className="text-w-orange">damage.</span>
        </h2>
        <p className="text-xs text-w-text-2 mt-2">
          Points are calculated based on remaining card values in hands. Lower is better.
        </p>
      </header>

      {/* Widescreen split panels */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Highlighted Winner Card (occupies 5 cols) */}
        <article className="col-span-1 md:col-span-5 rounded-2xl border border-w-yellow/50 bg-gradient-to-br from-w-yellow/15 via-w-surface to-w-surface-2 p-6 flex flex-col justify-between shadow-tactile-md">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-w-yellow block">
              Round Winner
            </span>
            <h3 className="font-display text-2xl font-black mt-1 text-w-text">
              Mkzay (You)
            </h3>
            <p className="mt-2 text-xs text-w-text-2 leading-relaxed">
              Successfully cleared all cards from hand first. Triggered "Joker Leap" ability to secure the win!
            </p>
          </div>

          <div className="mt-6 border-t border-w-yellow/20 pt-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-w-text-3">Bonus Reward</span>
              <p className="font-display text-xl font-black text-w-yellow">+100 XP</p>
            </div>
            <div className="h-10 w-10 rounded-full border border-w-yellow/30 bg-w-yellow/20 flex items-center justify-center text-w-yellow shadow-tactile-sm">
              ★
            </div>
          </div>
        </article>

        {/* Right Side: Scorecard / Damage breakdown (occupies 7 cols) */}
        <div className="col-span-1 md:col-span-7 rounded-2xl border border-w-border bg-w-surface p-6 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-w-text-2 border-b border-w-border/40 pb-2 mb-4">
              Round Score Card
            </h3>
            
            <div className="space-y-2.5">
              {roundPoints.map((row) => (
                <article
                  key={row.username}
                  className="flex items-center justify-between rounded-xl border border-w-border bg-w-bg px-4 py-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-w-text">{row.username}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${row.color}`}>
                      {row.status}
                    </span>
                    <span className="font-display font-black text-sm text-w-text">
                      {row.points} <span className="text-[10px] text-w-text-2 font-normal font-body">pts</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setGamePhase('classSelection')}
            className="mt-6 w-full rounded-xl bg-w-orange hover:bg-w-orange/95 px-4 py-3 font-display text-xs font-bold text-w-text shadow transition-transform hover:scale-[1.01]"
          >
            Ready for Next Round
          </button>
        </div>
      </section>
    </main>
  )
}
