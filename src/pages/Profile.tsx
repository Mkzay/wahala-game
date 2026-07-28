import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'

export default function Profile() {
  const { userId } = useParams()
  const [view, setView] = useState<'owner' | 'public'>('owner')

  const achievements = [
    { name: 'Chaos King', desc: 'Won 10 rounds as The Joker', icon: '🃏', color: 'border-w-orange/20 text-w-orange' },
    { name: 'Iron Fortress', desc: 'Blocked 5 draws in a single match', icon: '🛡️', color: 'border-[#378ADD]/20 text-[#378ADD]' },
    { name: 'General Market', desc: 'Forced opponents to draw 12 cards', icon: '🛒', color: 'border-w-yellow/20 text-w-yellow' },
  ]

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between">
      {/* Desktop & Mobile Header Navigation */}
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-24 lg:pb-8 sm:px-6 lg:px-8 flex flex-col gap-6">
        <header className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between text-center sm:text-left gap-4 border-b border-w-border/80 pb-4">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-widest text-w-orange">
              Player Dashboard
            </span>
            <h1 className="mt-1 font-display text-xl sm:text-3xl font-black">
              Profile: <span className="text-w-orange">{userId === 'preview-user' ? 'Mkzay' : userId ?? 'Mkzay'}</span>
            </h1>
          </div>

          <div className="flex gap-1 rounded-xl border border-w-border bg-w-surface p-1 w-full max-w-xs sm:w-auto mx-auto sm:mx-0 justify-center">
            <button
              type="button"
              onClick={() => setView('owner')}
              className={`flex-1 sm:flex-initial rounded-lg px-3 sm:px-4 py-1.5 text-xs font-display font-bold text-center transition-all ${
                view === 'owner' ? 'bg-w-orange text-w-text shadow-tactile-sm' : 'text-w-text-2 hover:text-w-text'
              }`}
            >
              Personal View
            </button>
            <button
              type="button"
              onClick={() => setView('public')}
              className={`flex-1 sm:flex-initial rounded-lg px-3 sm:px-4 py-1.5 text-xs font-display font-bold text-center transition-all ${
                view === 'public' ? 'bg-w-orange text-w-text shadow-tactile-sm' : 'text-w-text-2 hover:text-w-text'
              }`}
            >
              Public View
            </button>
          </div>
        </header>

        {/* Widescreen split panels */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
        
        {/* Left Side: Avatar Card & Info (occupies 4 cols) */}
        <article className="col-span-1 lg:col-span-4 rounded-2xl border border-w-border bg-w-surface p-6 flex flex-col items-center justify-between shadow-md text-center">
          <div className="flex flex-col items-center">
            {/* Large Avatar */}
            <div className="h-20 w-20 rounded-full border-[3px] border-w-orange bg-w-bg flex items-center justify-center font-display text-2xl font-black text-w-orange shadow-lg">
              MK
            </div>
            
            <h3 className="font-display text-xl font-black mt-4 text-w-text">
              Mkzay
            </h3>
            <span className="text-xs font-display font-bold text-w-orange uppercase tracking-wider mt-1">
              Chaos King · The Joker
            </span>
            <p className="mt-4 text-xs text-w-text-2 leading-relaxed">
              Playing cards out of Nigeria. Lover of strategic hold ons and chaotic mastermind abilities.
            </p>
          </div>

        </article>

        {/* Right Side: Stats and Achievements (occupies 8 cols) */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 h-full lg:overflow-y-auto pr-1">
          
          {/* Stats grid widget */}
          <section className="rounded-2xl border border-w-border bg-w-surface p-5 shadow-sm">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-w-text-2 border-b border-w-border/40 pb-2 mb-4">
              Career Statistics
            </h4>
            <div className="grid grid-cols-2 gap-3.5">
              {[
                ['Win Rate', '68%'],
                ['Games Played', '42 Matches'],
                ['Total XP', '1,240 XP'],
                ['Coins', '290 Coins'],
              ].map(([label, value]) => (
                <article key={label} className="rounded-xl border border-w-border bg-w-bg p-3.5">
                  <p className="font-display text-lg font-black text-w-yellow">{value}</p>
                  <p className="text-[10px] text-w-text-2 uppercase font-bold tracking-wider mt-1">{label}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Achievements widget */}
          <section className="rounded-2xl border border-w-border bg-w-surface p-5 shadow-sm">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-w-text-2 border-b border-w-border/40 pb-2 mb-4">
              Earned Trophies
            </h4>
            <div className="space-y-2.5">
              {achievements.map((item) => (
                <article
                  key={item.name}
                  className={`flex items-center gap-3.5 rounded-xl border p-3 bg-w-bg ${item.color}`}
                >
                  <span className="text-xl select-none">{item.icon}</span>
                  <div>
                    <h5 className="font-display text-xs font-bold text-w-text">
                      {item.name}
                    </h5>
                    <p className="text-[10px] text-w-text-2 mt-0.5">
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
        © 2026 Wahala Entertainment. Player profile page.
      </footer>
    </div>
  )
}
