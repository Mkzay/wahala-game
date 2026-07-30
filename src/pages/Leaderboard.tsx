import { useState, useMemo } from 'react'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'

export default function Leaderboard() {
  const [query, setQuery] = useState('')

  const players = [
    { rank: 1, name: 'Mkzay', points: 1240, winStreak: 5, class: 'Mastermind', games: 42, winRate: '68%' },
    { rank: 2, name: 'Happiness', points: 1142, winStreak: 3, class: 'Support', games: 38, winRate: '64%' },
    { rank: 3, name: 'Roseanne', points: 998, winStreak: 0, class: 'Warrior', games: 50, winRate: '58%' },
    { rank: 4, name: 'Zainab', points: 874, winStreak: 2, class: 'Mystic', games: 31, winRate: '55%' },
    { rank: 5, name: 'Alhaji Moves', points: 792, winStreak: 1, class: 'Joker', games: 29, winRate: '52%' },
    { rank: 6, name: 'Esther', points: 754, winStreak: 0, class: 'Warrior', games: 35, winRate: '50%' },
    { rank: 7, name: 'Chinonso', points: 720, winStreak: 0, class: 'Royal', games: 28, winRate: '48%' },
    { rank: 8, name: 'Tunde_Dev', points: 689, winStreak: 4, class: 'Joker', games: 22, winRate: '54%' },
  ]

  const filteredPlayers = useMemo(() => {
    if (!query.trim()) return players
    const q = query.toLowerCase()
    return players.filter(
      (p) => p.name.toLowerCase().includes(q) || p.class.toLowerCase().includes(q)
    )
  }, [query, players])

  // Top 3 for Podium
  const podium = [
    {
      ...players[1],
      rankName: '2nd Place',
      badgeColor: 'text-gray-300',
      icon: (
        <svg className="h-6 w-6 fill-current text-gray-300" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ),
      size: 'h-40 sm:h-44 border-gray-400/40 bg-gradient-to-b from-gray-400/10 via-w-surface to-w-surface-2 shadow-tactile-md',
    },
    {
      ...players[0],
      rankName: '1st Place',
      badgeColor: 'text-w-yellow',
      icon: (
        <svg className="h-7 w-7 fill-current text-w-yellow animate-pulse" viewBox="0 0 24 24">
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
        </svg>
      ),
      size: 'h-48 sm:h-52 border-w-yellow/80 bg-gradient-to-b from-w-yellow/20 via-w-surface to-w-surface-2 shadow-[0_0_30px_rgba(234,179,8,0.25)] scale-105 z-10',
    },
    {
      ...players[2],
      rankName: '3rd Place',
      badgeColor: 'text-amber-600',
      icon: (
        <svg className="h-6 w-6 fill-current text-amber-600" viewBox="0 0 24 24">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ),
      size: 'h-36 sm:h-40 mt-4 border-amber-600/40 bg-gradient-to-b from-amber-600/10 via-w-surface to-w-surface-2 shadow-tactile-sm',
    },
  ]

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between select-none">
      {/* Desktop & Mobile Header Navigation */}
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-32 sm:pb-24 lg:pb-8 flex flex-col gap-6">
        
        {/* Header Hero Banner */}
        <header className="rounded-3xl border border-w-border bg-gradient-to-r from-w-surface via-w-bg to-w-surface p-6 shadow-tactile-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-display font-black uppercase tracking-widest text-w-yellow bg-w-yellow/10 border border-w-yellow/30 px-3 py-1 rounded-full">
              Season 1 Global Standings 🏆
            </span>
            <h1 className="mt-2 font-display text-2xl sm:text-4xl font-black">
              Global <span className="text-w-orange">Leaderboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-w-text-2 mt-1">
              Top Whot arena players ranked by victory points, win streaks, and class dominance.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-w-surface/80 border border-w-border/60 rounded-2xl p-3 shadow-tactile-sm flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-w-yellow/20 border border-w-yellow/40 flex items-center justify-center text-xl">
              👑
            </div>
            <div>
              <p className="font-display font-black text-xs text-w-text">Current Champion</p>
              <span className="font-display text-xs font-black text-w-yellow block">Mkzay (1,240 pts)</span>
            </div>
          </div>
        </header>

        {/* Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Visual Podium (occupies 5 cols on lg) */}
          <div className="col-span-1 lg:col-span-5 flex flex-col justify-center items-center gap-3 bg-w-surface border border-w-border rounded-3xl p-4 sm:p-6 shadow-tactile-md overflow-hidden relative">
            <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-w-yellow/10 blur-2xl pointer-events-none" />
            
            <span className="text-[10px] sm:text-xs font-display font-black uppercase tracking-widest text-w-text-2 relative z-10">
              Top Arena Champions
            </span>

            <div className="flex items-end justify-center gap-2 sm:gap-3 w-full my-3 relative z-10">
              {podium.map((p) => (
                <div
                  key={p.name}
                  className={`flex-1 min-w-0 rounded-2xl border p-2 sm:p-4 flex flex-col items-center justify-between text-center transition-all ${p.size}`}
                >
                  <div className="my-0.5">{p.icon}</div>
                  <div className="my-1.5 w-full px-0.5">
                    <p className="font-display font-black text-xs sm:text-sm text-w-text truncate">{p.name}</p>
                    <span className="text-[9px] sm:text-[10px] font-bold text-w-orange block uppercase tracking-wider truncate">{p.class}</span>
                  </div>
                  <div className="bg-w-surface/90 rounded-xl px-2 py-1 border border-w-border/60 w-full shadow-inner">
                    <p className="font-display text-[10px] sm:text-xs font-black text-w-yellow truncate">{p.points} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Full Rankings Table (occupies 7 cols on lg) */}
          <section className="col-span-1 lg:col-span-7 flex flex-col gap-3">
            
            {/* Search Filter Console Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-w-border pb-3">
              <div className="rounded-xl border border-w-border bg-w-surface px-3.5 py-2 focus-within:border-w-orange transition-colors flex items-center gap-2 w-full sm:w-64">
                <svg className="h-3.5 w-3.5 text-w-text-3 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <input
                  name="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Filter player or class…"
                  className="w-full bg-transparent text-xs outline-none placeholder:text-w-text-3"
                />
              </div>

              <span className="text-xs text-w-text-2 font-medium">
                Showing <span className="font-display font-bold text-w-text">{filteredPlayers.length}</span> ranked fighters
              </span>
            </div>

            <div className="space-y-2.5">
              {filteredPlayers.map((item) => (
                <article
                  key={item.rank}
                  className={`flex items-center justify-between rounded-2xl border p-3.5 transition-[colors,border-color,transform] hover:scale-[1.005] ${
                    item.rank === 1
                      ? 'border-w-yellow/50 bg-gradient-to-r from-w-yellow/10 via-w-surface to-w-surface shadow-tactile-sm'
                      : 'border-w-border bg-w-surface hover:border-w-orange/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl font-display text-xs font-black shadow-sm ${
                        item.rank === 1
                          ? 'bg-w-yellow text-w-surface'
                          : item.rank === 2
                            ? 'bg-gray-300 text-w-surface'
                            : item.rank === 3
                              ? 'bg-amber-600 text-w-surface'
                              : 'bg-w-bg text-w-text-2 border border-w-border'
                      }`}
                    >
                      #{item.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-sm font-black text-w-text">
                          {item.name}
                        </h2>
                        <span className="rounded-md bg-w-bg px-2 py-0.5 text-[9px] font-bold text-w-orange border border-w-border">
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
                    <div className="border-l border-w-border/50 pl-4 text-right">
                      <span className="text-[9px] text-w-text-3 uppercase font-bold tracking-wider block">Points</span>
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
