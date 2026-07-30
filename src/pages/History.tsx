import { useState, useMemo } from 'react'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'

export default function History() {
  const [filter, setFilter] = useState<'all' | 'winner' | 'top3' | 'eliminated'>('all')

  const matchHistory = [
    { id: '1', roomName: 'Lagosians only', date: '2026-05-22', result: 'Winner', standing: '1st Place', mode: 'Classic', xp: '+100 XP', coins: '+50 coins', classUsed: 'The Joker', badge: '🏆' },
    { id: '2', roomName: 'Weekend mayhem', date: '2026-05-20', result: 'Safe', standing: '2nd Place', mode: 'Progression', xp: '+65 XP', coins: '+25 coins', classUsed: 'The Wall', badge: '🥈' },
    { id: '3', roomName: 'Friday session', date: '2026-05-19', result: 'Winner', standing: '1st Place', mode: 'Classic', xp: '+120 XP', coins: '+60 coins', classUsed: 'The Striker', badge: '🏆' },
    { id: '4', roomName: 'Chill room', date: '2026-05-18', result: 'Eliminated', standing: '4th Place', mode: 'Progression', xp: '+15 XP', coins: '+5 coins', classUsed: 'The Mastermind', badge: '💀' },
  ]

  const filteredHistory = useMemo(() => {
    return matchHistory.filter((item) => {
      if (filter === 'winner') return item.result === 'Winner'
      if (filter === 'top3') return item.standing === '1st Place' || item.standing === '2nd Place' || item.standing === '3rd Place'
      if (filter === 'eliminated') return item.result === 'Eliminated'
      return true
    })
  }, [filter, matchHistory])

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between select-none">
      {/* Desktop & Mobile Header Navigation */}
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 lg:pb-8 flex flex-col gap-6">
        
        {/* Header Hero Banner */}
        <header className="rounded-3xl border border-w-border bg-gradient-to-r from-w-surface via-w-bg to-w-surface p-6 shadow-tactile-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-display font-black uppercase tracking-widest text-w-orange bg-w-orange/10 border border-w-orange/30 px-3 py-1 rounded-full">
              Match Archives 📜
            </span>
            <h1 className="mt-2 font-display text-2xl sm:text-4xl font-black">
              Match <span className="text-w-orange">History</span>
            </h1>
            <p className="text-xs sm:text-sm text-w-text-2 mt-1">
              Review your past arena battles, XP gains, coin rewards, and class performances.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {(['all', 'winner', 'top3', 'eliminated'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-xl border px-3.5 py-2 text-xs font-display font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange ${
                  filter === key
                    ? 'border-w-orange bg-w-orange/10 text-w-orange shadow-tactile-sm'
                    : 'border-w-border bg-w-surface text-w-text-2 hover:text-w-text'
                }`}
              >
                {key === 'all' ? 'All Matches' : key === 'winner' ? 'Victories 🏆' : key === 'top3' ? 'Top 3 Podiums' : 'Eliminated'}
              </button>
            ))}
          </div>
        </header>

        {/* Widescreen Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Analytics Summary (occupies 4 cols) */}
          <section className="col-span-1 lg:col-span-4 rounded-3xl border border-w-border bg-w-surface p-6 flex flex-col justify-between shadow-tactile-md">
            <div>
              <h3 className="font-display text-xs font-black uppercase tracking-wider text-w-text-2 border-b border-w-border/60 pb-3 mb-4">
                Career Performance Overview
              </h3>

              <div className="space-y-4">
                <article className="flex justify-between items-center py-1 border-b border-w-border/40">
                  <span className="text-xs text-w-text-2 font-medium">Matches Played</span>
                  <span className="font-display font-black text-sm text-w-text">42 Games</span>
                </article>
                <article className="flex justify-between items-center py-1 border-b border-w-border/40">
                  <span className="text-xs text-w-text-2 font-medium">Total Victories</span>
                  <span className="font-display font-black text-sm text-w-success">28 Wins</span>
                </article>
                <article className="flex justify-between items-center py-1 border-b border-w-border/40">
                  <span className="text-xs text-w-text-2 font-medium">Win Ratio</span>
                  <span className="font-display font-black text-sm text-w-orange">66.6%</span>
                </article>
                <article className="flex justify-between items-center py-1 border-b border-w-border/40">
                  <span className="text-xs text-w-text-2 font-medium">Best Win Streak</span>
                  <span className="font-display font-black text-sm text-w-yellow">5 Matches</span>
                </article>
              </div>

              <div className="mt-6">
                <h4 className="text-[10px] font-black text-w-text-2 uppercase tracking-wider mb-2.5">Class Play Distribution</h4>
                <div className="flex h-2.5 rounded-full bg-w-bg overflow-hidden border border-w-border/40">
                  <div className="bg-w-orange w-[40%]" title="Joker (40%)" />
                  <div className="bg-w-mystic w-[25%]" title="Wall (25%)" />
                  <div className="bg-w-warrior w-[20%]" title="Striker (20%)" />
                  <div className="bg-w-royal w-[15%]" title="Mastermind (15%)" />
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3 text-[10px] font-bold text-w-text-2 uppercase">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-w-orange" /> Joker (40%)</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-w-mystic" /> Wall (25%)</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-w-warrior" /> Striker (20%)</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-w-royal" /> Mastermind (15%)</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-w-border bg-w-bg text-[10px] text-w-text-3 leading-relaxed mt-6">
              Match history updates instantly after a round check up completes. Leaderboard standings are refreshed at 00:00 UTC.
            </div>
          </section>

          {/* Right Column: Scrollable matches feed (occupies 8 cols) */}
          <section className="col-span-1 lg:col-span-8 rounded-3xl border border-w-border bg-w-surface p-6 shadow-tactile-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-w-border/60 pb-3">
              <h3 className="font-display text-xs font-black uppercase tracking-wider text-w-text-2">
                Match Log History
              </h3>
              <span className="text-xs text-w-text-2 font-medium">
                Showing <span className="font-display font-bold text-w-text">{filteredHistory.length}</span> archives
              </span>
            </div>

            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-w-border bg-w-bg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-w-orange/40 transition-[colors,border-color,transform] hover:scale-[1.005]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl select-none">{item.badge}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display text-xs font-black text-w-text">{item.roomName}</h4>
                        <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-md border border-w-border bg-w-surface text-w-orange">
                          {item.mode}
                        </span>
                      </div>
                      <p className="text-[10px] text-w-text-3 mt-1">
                        Played on {item.date} · Class: <span className="text-w-text-2 font-semibold">{item.classUsed}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-right border-t sm:border-t-0 border-w-border/40 pt-2 sm:pt-0">
                    <div>
                      <span className={`text-[10px] font-display font-black uppercase tracking-wider block ${
                        item.result === 'Winner' ? 'text-w-yellow' : item.result === 'Safe' ? 'text-w-success' : 'text-w-danger'
                      }`}>
                        {item.standing}
                      </span>
                      <p className="text-[10px] text-w-text-2 mt-0.5">{item.result}</p>
                    </div>

                    <div className="border-l border-w-border/50 pl-4 text-left sm:text-right">
                      <span className="font-display font-black text-xs text-w-yellow block">{item.xp}</span>
                      <span className="text-[9px] text-w-success block font-bold">{item.coins}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

        </div>
      </main>

      <footer className="hidden md:block mt-12 text-center text-xs text-w-text-3 border-t border-w-border/30 py-6">
        © 2026 Wahala Entertainment. Match Archives.
      </footer>
    </div>
  )
}
