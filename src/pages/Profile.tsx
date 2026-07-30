import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'

export default function Profile() {
  const { userId } = useParams()
  const [view, setView] = useState<'owner' | 'public'>('owner')

  const achievements = [
    { name: 'Chaos King', desc: 'Won 10 rounds as The Joker', icon: '🃏', color: 'border-w-orange/30 text-w-orange bg-w-orange/5' },
    { name: 'Iron Fortress', desc: 'Blocked 5 draws in a single match', icon: '🛡️', color: 'border-[#378ADD]/30 text-[#378ADD] bg-[#378ADD]/5' },
    { name: 'General Market', desc: 'Forced opponents to draw 12 cards', icon: '🛒', color: 'border-w-yellow/30 text-w-yellow bg-w-yellow/5' },
  ]

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between select-none">
      {/* Desktop & Mobile Header Navigation */}
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 lg:pb-8 flex flex-col gap-6">
        
        {/* Profile Header Hero */}
        <header className="rounded-3xl border border-w-border bg-gradient-to-r from-w-surface via-w-bg to-w-surface p-6 shadow-tactile-md flex flex-col sm:flex-row items-center sm:items-center justify-between text-center sm:text-left gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl border-2 border-w-orange bg-w-bg flex items-center justify-center font-display text-2xl font-black text-w-orange shadow-tactile-sm flex-shrink-0">
              MK
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] sm:text-xs font-display font-black uppercase tracking-widest text-w-orange bg-w-orange/10 border border-w-orange/30 px-3 py-0.5 rounded-full">
                  Class Master 🔮
                </span>
                <span className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider text-w-yellow bg-w-yellow/10 border border-w-yellow/30 px-2.5 py-0.5 rounded-full">
                  Level 4
                </span>
              </div>
              <h1 className="mt-1 font-display text-2xl sm:text-4xl font-black text-w-text">
                {userId === 'preview-user' ? 'Mkzay' : userId ?? 'Mkzay'}
              </h1>
              <p className="text-xs text-w-text-2 mt-1">
                Lover of strategic hold ons and chaotic mastermind abilities.
              </p>
            </div>
          </div>

          <div className="flex gap-1.5 rounded-2xl border border-w-border bg-w-surface p-1.5 w-full max-w-xs sm:w-auto justify-center flex-shrink-0 shadow-inner">
            <button
              type="button"
              onClick={() => setView('owner')}
              className={`flex-1 sm:flex-initial rounded-xl px-4 py-2 text-xs font-display font-bold text-center transition-[colors,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange ${
                view === 'owner' ? 'bg-w-orange text-w-surface shadow-tactile-sm' : 'text-w-text-2 hover:text-w-text'
              }`}
            >
              Personal Overview
            </button>
            <button
              type="button"
              onClick={() => setView('public')}
              className={`flex-1 sm:flex-initial rounded-xl px-4 py-2 text-xs font-display font-bold text-center transition-[colors,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange ${
                view === 'public' ? 'bg-w-orange text-w-surface shadow-tactile-sm' : 'text-w-text-2 hover:text-w-text'
              }`}
            >
              Public Trophy Case
            </button>
          </div>
        </header>

        {/* Widescreen Split Panels */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start flex-1">
          
          {/* Left Side: Avatar Card & Character Class Info (occupies 4 cols) */}
          <article className="col-span-1 lg:col-span-4 rounded-3xl border border-w-border bg-w-surface p-6 flex flex-col gap-5 shadow-tactile-md">
            <div className="flex items-center justify-between border-b border-w-border/60 pb-3">
              <span className="text-xs font-display font-black uppercase tracking-wider text-w-text-2">
                Active Hero Class
              </span>
              <span className="text-[10px] font-bold text-w-orange bg-w-orange/10 border border-w-orange/30 px-2.5 py-0.5 rounded-full">
                Tactile Master
              </span>
            </div>

            <div className="flex items-center gap-4 bg-w-bg p-4 rounded-2xl border border-w-border/60">
              <div className="h-12 w-12 rounded-2xl bg-w-orange/10 border border-w-orange/40 flex items-center justify-center text-2xl flex-shrink-0">
                🔮
              </div>
              <div>
                <h3 className="font-display font-black text-sm text-w-text">
                  The Mastermind
                </h3>
                <p className="text-[11px] text-w-text-2 mt-0.5">
                  Top 2 Market card peek active.
                </p>
              </div>
            </div>

            {/* Level XP Bar */}
            <div className="bg-w-bg p-4 rounded-2xl border border-w-border/60 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-w-text-2">Class XP Progress</span>
                <span className="font-display font-black text-w-orange">750 / 1000 XP</span>
              </div>
              <div className="h-2 w-full bg-w-surface rounded-full overflow-hidden border border-w-border/40">
                <div className="h-full bg-gradient-to-r from-w-yellow to-w-orange rounded-full w-[75%]" />
              </div>
            </div>
          </article>

          {/* Right Side: Stats and Achievements (occupies 8 cols) */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
            
            {/* Stats grid widget */}
            <section className="rounded-3xl border border-w-border bg-w-surface p-6 shadow-tactile-md">
              <h4 className="font-display text-xs font-black uppercase tracking-wider text-w-text-2 border-b border-w-border/60 pb-3 mb-4">
                Career Battle Statistics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {[
                  ['Win Rate', '68%', 'text-w-yellow'],
                  ['Matches Played', '42 Games', 'text-w-orange'],
                  ['Total Points', '1,240 pts', 'text-w-support'],
                  ['Blocks', '18 Cards', 'text-w-mystic'],
                ].map(([label, value, color]) => (
                  <article key={label} className="rounded-2xl border border-w-border bg-w-bg p-4 text-center">
                    <p className={`font-display text-lg font-black ${color}`}>{value}</p>
                    <p className="text-[9px] text-w-text-2 uppercase font-bold tracking-wider mt-1">{label}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* Achievements widget */}
            <section className="rounded-3xl border border-w-border bg-w-surface p-6 shadow-tactile-md">
              <h4 className="font-display text-xs font-black uppercase tracking-wider text-w-text-2 border-b border-w-border/60 pb-3 mb-4">
                Earned Trophy Badges
              </h4>
              <div className="space-y-3">
                {achievements.map((item) => (
                  <article
                    key={item.name}
                    className={`flex items-center gap-4 rounded-2xl border p-4 transition-transform hover:scale-[1.005] ${item.color}`}
                  >
                    <span className="text-2xl select-none">{item.icon}</span>
                    <div>
                      <h5 className="font-display text-xs font-black text-w-text">
                        {item.name}
                      </h5>
                      <p className="text-xs text-w-text-2 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>

      <footer className="hidden md:block mt-12 text-center text-xs text-w-text-3 border-t border-w-border/30 py-6">
        © 2026 Wahala Entertainment. Player profile directory.
      </footer>
    </div>
  )
}
