import { DashboardNavBar } from '../components/ui/DashboardNavBar'

export default function Leaderboard() {
  const players = [
    { rank: 1, name: 'Mkzay', points: 1240, winStreak: 5, class: 'Trickster', games: 42, winRate: '68%' },
    { rank: 2, name: 'Happiness', points: 1142, winStreak: 3, class: 'Support', games: 38, winRate: '64%' },
    { rank: 3, name: 'Roseanne', points: 998, winStreak: 0, class: 'Warrior', games: 50, winRate: '58%' },
    { rank: 4, name: 'Zainab', points: 874, winStreak: 2, class: 'Mystic', games: 31, winRate: '55%' },
    { rank: 5, name: 'Alhaji Moves', points: 792, winStreak: 1, class: 'Rogue', games: 29, winRate: '52%' },
    { rank: 6, name: 'Esther', points: 754, winStreak: 0, class: 'Warrior', games: 35, winRate: '50%' },
    { rank: 7, name: 'Chinonso', points: 720, winStreak: 0, class: 'Royal', games: 28, winRate: '48%' },
    { rank: 8, name: 'Tunde_Dev', points: 689, winStreak: 4, class: 'Trickster', games: 22, winRate: '54%' },
  ]

  // Top 3 for Podium
  const podium = [
    {
      ...players[1],
      rankName: '2nd Place',
      badgeColor: 'text-gray-300',
      icon: (
        <svg className="h-5 w-5 sm:h-6 sm:w-6 fill-current text-gray-300" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ),
      size: 'h-36 sm:h-40 mt-4 sm:mt-6 border-w-border bg-gradient-to-b from-w-surface to-w-surface-2',
    },
    {
      ...players[0],
      rankName: '1st Place',
      badgeColor: 'text-w-yellow',
      icon: (
        <svg className="h-6 w-6 sm:h-7 sm:w-7 fill-current text-w-yellow" viewBox="0 0 24 24">
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
        </svg>
      ),
      size: 'h-44 sm:h-48 border-w-yellow/60 bg-gradient-to-b from-w-yellow/10 via-w-surface to-w-surface-2 shadow-tactile-lg scale-105 z-10',
    },
    {
      ...players[2],
      rankName: '3rd Place',
      badgeColor: 'text-amber-600',
      icon: (
        <svg className="h-5 w-5 sm:h-6 sm:w-6 fill-current text-amber-600" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ),
      size: 'h-32 sm:h-36 mt-8 sm:mt-10 border-w-warrior/30 bg-gradient-to-b from-w-warrior/5 via-w-surface to-w-surface-2',
    },
  ]

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between">
      {/* Desktop & Mobile Header Navigation */}
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-32 sm:pb-24 lg:pb-8 flex flex-col gap-6">
        <header className="flex flex-col border-b border-w-border/80 pb-4">
          <span className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-widest text-w-orange">
            Arena Standings
          </span>
          <h1 className="mt-1 font-display text-xl sm:text-3xl font-black">
            Global <span className="text-w-orange">Leaderboard</span>
          </h1>
        </header>

        {/* Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Visual Podium (occupies 5 cols on lg) */}
          <div className="col-span-1 lg:col-span-5 flex flex-col justify-center items-center gap-3 bg-w-surface border border-w-border rounded-2xl p-3 sm:p-6 shadow-tactile-sm overflow-hidden">
            <span className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-widest text-w-text-2">
              Top Arena Champions
            </span>

            <div className="flex items-end justify-center gap-1.5 sm:gap-3 w-full my-2 sm:my-4">
              {podium.map((p) => (
                <div
                  key={p.name}
                  className={`flex-1 min-w-0 rounded-xl sm:rounded-2xl border p-1.5 sm:p-4 flex flex-col items-center justify-between text-center transition-all ${p.size}`}
                >
                  <div className="my-0.5">{p.icon}</div>
                  <div className="my-1 sm:my-2 w-full px-0.5">
                    <p className="font-display font-black text-xs sm:text-sm text-w-text truncate">{p.name}</p>
                    <span className="text-[8px] sm:text-[10px] font-bold text-w-orange block uppercase tracking-wider truncate">{p.class}</span>
                  </div>
                  <div className="bg-w-surface/80 rounded-lg sm:rounded-xl px-1 sm:px-2.5 py-0.5 sm:py-1 border border-w-border/50 w-full">
                    <p className="font-display text-[10px] sm:text-xs font-black text-w-yellow truncate">{p.points} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Full Rankings Table (occupies 7 cols on lg) */}
          <section className="col-span-1 lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-w-border pb-2.5">
              <span className="text-xs text-w-text-2 font-bold uppercase tracking-wider">
                Ranked Players
              </span>
              <span className="text-xs text-w-text-2 font-medium">
                Season 1 Active
              </span>
            </div>

            <div className="space-y-2.5">
              {players.map((item) => (
                <article
                  key={item.rank}
                  className={`flex items-center justify-between rounded-xl border p-3.5 transition-all ${
                    item.rank === 1
                      ? 'border-w-orange/40 bg-w-orange/5 shadow-tactile-sm'
                      : 'border-w-border bg-w-surface hover:border-w-orange/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg font-display text-xs font-black ${
                        item.rank === 1
                          ? 'bg-w-yellow text-w-text'
                          : item.rank === 2
                            ? 'bg-w-border text-w-text'
                            : item.rank === 3
                              ? 'bg-w-warrior/30 text-w-text'
                              : 'bg-w-bg text-w-text-2'
                      }`}
                    >
                      #{item.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-sm font-bold text-w-text">
                          {item.name}
                        </h2>
                        <span className="rounded bg-w-bg px-2 py-0.5 text-[9px] font-bold text-w-orange border border-w-border">
                          {item.class}
                        </span>
                      </div>
                      <p className="text-[10px] text-w-text-2 mt-0.5">
                        {item.games} matches · {item.winRate} win rate
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {item.winStreak > 0 && (
                      <span className="text-[10px] font-bold text-w-support bg-w-support/10 border border-w-support/20 px-2.5 py-1 rounded-full hidden sm:flex items-center gap-1">
                        <svg className="h-3 w-3 fill-w-support" viewBox="0 0 24 24">
                          <path d="M13.5 1.5s.15 1.83-.93 3.63c-1.07 1.78-3.07 2.45-3.07 4.87 0 2.22 1.7 4 4 4 2.3 0 4-1.78 4-4 0-3.3-2.5-6.5-4-8.5zm-3.1 7.27c.45-.77 1.05-1.42 1.72-1.95.89 1.48.98 3.19.18 4.7-.68 1.28-2.02 2.1-3.48 2.1-1.39 0-2.61-.75-3.23-1.92-.88-1.68-.3-3.79 1.34-4.8 1.32-.82 2.76-.94 3.47-.13z" />
                        </svg>
                        {item.winStreak} streak
                      </span>
                    )}
                    <div className="border-l border-w-border/50 pl-4">
                      <span className="text-[10px] text-w-text-3 block">Points</span>
                      <span className="font-display font-black text-sm text-w-yellow">
                        {item.points}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

        </div>
      </main>

      <footer className="hidden md:block mt-12 text-center text-xs text-w-text-3 border-t border-w-border/30 py-6">
        © 2026 Wahala Entertainment. Global Arena Rankings.
      </footer>
    </div>
  )
}
