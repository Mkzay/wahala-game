import { DashboardNavBar } from '../components/ui/DashboardNavBar'

export default function History() {
  const matchHistory = [
    { id: '1', roomName: 'Lagosians only', date: '2026-05-22', result: 'Winner', standing: '1st Place', mode: 'Classic', xp: '+100 XP', coins: '+50 coins', classUsed: 'The Joker' },
    { id: '2', roomName: 'Weekend mayhem', date: '2026-05-20', result: 'Safe', standing: '2nd Place', mode: 'Progression', xp: '+65 XP', coins: '+25 coins', classUsed: 'The Wall' },
    { id: '3', roomName: 'Friday session', date: '2026-05-19', result: 'Winner', standing: '1st Place', mode: 'Classic', xp: '+120 XP', coins: '+60 coins', classUsed: 'The Striker' },
    { id: '4', roomName: 'Chill room', date: '2026-05-18', result: 'Eliminated', standing: '4th Place', mode: 'Progression', xp: '+15 XP', coins: '+5 coins', classUsed: 'The Mastermind' },
  ]

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between">
      {/* Desktop & Mobile Header Navigation */}
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-24 lg:pb-8 sm:px-6 lg:px-8 flex flex-col gap-6">
        <header className="flex flex-col border-b border-w-border/80 pb-4">
          <span className="text-xs font-display font-bold uppercase tracking-widest text-w-orange">
            Match Archives
          </span>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-black">
            Match <span className="text-w-orange">History</span>
          </h1>
        </header>

        {/* Widescreen Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Analytics Summary (occupies 4 cols) */}
          <section className="col-span-1 lg:col-span-4 rounded-2xl border border-w-border bg-w-surface p-5 flex flex-col justify-between shadow-md">
            <div>
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-w-text-2 border-b border-w-border/40 pb-2 mb-4">
                Career Performance Overview
              </h3>

              <div className="space-y-4">
                <article className="flex justify-between items-center py-1 border-b border-w-border/20">
                  <span className="text-xs text-w-text-2">Matches Played</span>
                  <span className="font-display font-bold text-sm">42 Games</span>
                </article>
                <article className="flex justify-between items-center py-1 border-b border-w-border/20">
                  <span className="text-xs text-w-text-2">Total Victories</span>
                  <span className="font-display font-bold text-sm text-w-success">28 Wins</span>
                </article>
                <article className="flex justify-between items-center py-1 border-b border-w-border/20">
                  <span className="text-xs text-w-text-2">Win Ratio</span>
                  <span className="font-display font-bold text-sm text-w-orange">66.6%</span>
                </article>
                <article className="flex justify-between items-center py-1 border-b border-w-border/20">
                  <span className="text-xs text-w-text-2">Best Win Streak</span>
                  <span className="font-display font-bold text-sm text-w-yellow">5 Matches</span>
                </article>
              </div>

              <div className="mt-6">
                <h4 className="text-[10px] font-bold text-w-text-2 uppercase tracking-wider mb-2">Class Play Distribution</h4>
                <div className="flex h-2 rounded bg-w-bg overflow-hidden">
                  <div className="bg-w-orange w-[40%]" title="Joker (40%)" />
                  <div className="bg-w-mystic w-[25%]" title="Wall (25%)" />
                  <div className="bg-w-warrior w-[20%]" title="Striker (20%)" />
                  <div className="bg-w-royal w-[15%]" title="Mastermind (15%)" />
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[9px] font-bold text-w-text-2 uppercase">
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-w-orange" /> Joker</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-w-mystic" /> Wall</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-w-warrior" /> Striker</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-w-royal" /> Mastermind</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-w-border bg-w-bg text-[10px] text-w-text-3 leading-normal mt-4">
              Match history updates instantly after a round check up completes. Leaderboard standings are refreshed at 00:00 UTC.
            </div>
          </section>

          {/* Right Column: Scrollable matches feed (occupies 8 cols) */}
          <section className="col-span-1 lg:col-span-8 rounded-2xl border border-w-border bg-w-surface p-5 shadow-md flex flex-col lg:overflow-hidden h-[400px] lg:h-auto">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-w-text-2 border-b border-w-border/40 pb-2 mb-4">
              Match Log History
            </h3>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {matchHistory.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-w-border bg-w-bg px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-w-orange/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-xs font-bold text-w-text">{item.roomName}</h4>
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border border-w-border bg-w-surface text-w-text-3">
                        {item.mode}
                      </span>
                    </div>
                    <p className="text-[10px] text-w-text-3 mt-1">
                      Played on {item.date} · Class: <span className="text-w-text-2 font-medium">{item.classUsed}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        item.result === 'Winner' ? 'text-w-yellow' : item.result === 'Safe' ? 'text-w-success' : 'text-w-danger'
                      }`}>
                        {item.standing}
                      </span>
                      <p className="text-[10px] text-w-text-2 mt-0.5">{item.result}</p>
                    </div>

                    <div className="border-l border-w-border/50 pl-4 text-left sm:text-right">
                      <span className="font-display font-black text-xs text-w-yellow block">{item.xp}</span>
                      <span className="text-[9px] text-w-success block font-semibold">{item.coins}</span>
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
