import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PlayerRow } from '../components/lobby/PlayerRow'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'

export default function Lobby() {
  const [isHostView, setIsHostView] = useState(true)
  const [showEditSheet, setShowEditSheet] = useState(false)
  const navigate = useNavigate()

  // Game config settings
  const [visibility, setVisibility] = useState<'private' | 'public'>('private')
  const [mode, setMode] = useState<'classic' | 'progression'>('classic')
  const [maxPlayers, setMaxPlayers] = useState<number>(6)
  const [rounds, setRounds] = useState<number>(5)

  // Interactive prototype states
  const [isReady, setIsReady] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleStartGame = () => {
    navigate('/game/demo-room-id/board')
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText('WHL-4829')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between select-none">
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 lg:pb-8 flex flex-col gap-6">
        
        {/* Header Hero Banner */}
        <header className="rounded-3xl border border-w-border bg-gradient-to-r from-w-surface via-w-bg to-w-surface p-6 shadow-tactile-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-display font-black uppercase tracking-widest text-w-orange bg-w-orange/10 border border-w-orange/30 px-3 py-1 rounded-full">
              Room Arena Lobby ⚔️
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-black text-w-text mt-2">
              Mkzay’s <span className="text-w-orange">den of chaos</span>
            </h1>
            <p className="text-xs sm:text-sm text-w-text-2 mt-1">
              {mode === 'classic' ? 'Classic Whot' : 'Progression'} Mode · {rounds} Rounds · {visibility} Room
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleCopyCode}
              className="rounded-2xl border border-w-border bg-w-surface hover:border-w-orange px-4 py-2.5 text-xs font-display font-bold text-w-text transition-colors shadow-tactile-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
            >
              <svg className="h-4 w-4 fill-current text-w-orange" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </svg>
              <span>{copied ? 'Code Copied!' : 'Code: WHL-4829'}</span>
            </button>

            <Link
              to="/rooms"
              aria-label="Leave Lobby"
              title="Leave Lobby"
              className="h-10 w-10 rounded-2xl border border-w-border bg-w-surface hover:border-w-orange text-w-text-2 hover:text-w-orange transition-[colors,border-color] flex items-center justify-center flex-shrink-0 shadow-tactile-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
            >
              <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
        </header>

        {/* Widescreen Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          
          {/* Left Column: Player Slots list (occupies 7 cols on large screens) */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-4">
            
            <header className="flex items-center justify-between rounded-2xl border border-w-border bg-w-surface px-5 py-3.5 shadow-tactile-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-w-success animate-ping" />
                <h2 className="font-display text-xs sm:text-sm font-black uppercase tracking-wider text-w-text">
                  Lobby Members
                </h2>
              </div>
              <div className="text-right">
                <span className="font-display text-base font-black text-w-orange">3</span>
                <span className="text-xs text-w-text-2 font-bold"> / {maxPlayers} Slots</span>
              </div>
            </header>

            {/* Players list slots */}
            <section className="space-y-3">
              <PlayerRow
                name="Mkzay"
                subtext="Host · The Mastermind"
                badgeLabel="Host 👑"
                badgeClassName="bg-w-orange/20 text-w-orange border border-w-orange/40"
                containerClassName="border-w-orange/40 bg-w-surface shadow-tactile-sm"
              />
              <PlayerRow
                name="Esther"
                subtext={isHostView ? 'The Striker' : 'You · The Striker'}
                badgeLabel={!isHostView && isReady ? 'Ready ✓' : (isHostView ? 'Ready ✓' : 'Not Ready')}
                badgeClassName={
                  (!isHostView && isReady) || isHostView
                    ? 'bg-w-success/20 text-w-success border border-w-success/40'
                    : 'bg-w-surface-2 text-w-text-3'
                }
                containerClassName={
                  isHostView
                    ? 'border-w-border bg-w-surface'
                    : (!isHostView && isReady ? 'border-w-success bg-w-success/5 shadow-tactile-sm' : 'border-w-border bg-w-surface')
                }
              />
              <PlayerRow
                name="Happiness"
                subtext="The Wall"
                badgeLabel="Not Ready"
                badgeClassName="bg-w-surface-2 text-w-text-3"
                containerClassName="border-w-border bg-w-surface"
              />

              {/* Empty slot placeholder cards */}
              {[...Array(Math.max(0, maxPlayers - 3))].map((_, i) => (
                <article
                  key={i}
                  className="rounded-2xl border border-dashed border-w-border/80 bg-w-bg/50 px-5 py-4 text-xs text-w-text-3 flex items-center justify-between select-none"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span className="h-6 w-6 rounded-lg border border-dashed border-w-border flex items-center justify-center font-bold text-w-text-3">
                      +
                    </span>
                    Waiting for opponent slot…
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-w-text-3">
                    Open Slot
                  </span>
                </article>
              ))}
            </section>
          </div>

          {/* Right Column: Host Actions & Settings (occupies 5 cols on large screens) */}
          <aside className="col-span-1 lg:col-span-5 flex flex-col gap-6">
            
            {/* Host / Participant Actions Card */}
            <article className="rounded-3xl border border-w-border bg-w-surface p-6 shadow-tactile-md flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-w-border/60 pb-3">
                <span className="text-xs font-display font-black uppercase tracking-wider text-w-text-2">
                  Match Actions
                </span>
                <button
                  type="button"
                  disabled={!isHostView}
                  onClick={() => setShowEditSheet(true)}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${
                    isHostView
                      ? 'border-w-orange text-w-orange bg-w-orange/10 hover:bg-w-orange/20 shadow-tactile-sm'
                      : 'cursor-not-allowed border-w-border text-w-text-3 opacity-60'
                  }`}
                >
                  ⚙️ Settings
                </button>
              </div>

              {isHostView ? (
                <div className="space-y-3 pt-1">
                  <button
                    type="button"
                    onClick={handleStartGame}
                    className="w-full rounded-2xl bg-gradient-to-r from-w-orange to-w-yellow hover:from-w-orange/95 hover:to-w-yellow/95 py-4 font-display text-sm font-black text-w-surface shadow-tactile-md hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-w-orange transition-[transform,background-color] flex items-center justify-center gap-2"
                  >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Start Match Arena
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-2xl border border-w-border hover:bg-w-danger/10 hover:border-w-danger/40 py-3 text-xs font-bold text-w-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-danger transition-colors"
                  >
                    Disband Room
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsReady(!isReady)}
                    className={`w-full rounded-2xl border py-4 font-display text-sm font-black shadow-tactile-md hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-w-success transition-[transform,background-color,border-color] ${
                      isReady
                        ? 'border-w-success bg-w-success text-w-surface'
                        : 'border-w-orange bg-w-orange/10 text-w-orange hover:bg-w-orange/20'
                    }`}
                  >
                    {isReady ? '✓ Ready for Battle' : 'Ready Up'}
                  </button>
                  <Link
                    to="/rooms"
                    className="w-full rounded-2xl border border-w-border hover:border-w-orange/40 py-3 text-xs font-bold text-w-text-2 hover:text-w-text transition-colors text-center block"
                  >
                    Leave Lobby
                  </Link>
                </div>
              )}
            </article>

            {/* Prototype Role Toggle Switcher */}
            <div className="rounded-2xl border border-w-border bg-w-surface p-4 text-center shadow-tactile-sm">
              <span className="text-[10px] font-bold text-w-text-3 uppercase tracking-wider block mb-2">
                Preview Prototype Role
              </span>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsHostView(true)
                    setShowEditSheet(false)
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-display font-bold transition-all ${
                    isHostView ? 'bg-w-orange text-w-surface shadow-tactile-sm' : 'bg-w-bg text-w-text-2 hover:text-w-text'
                  }`}
                >
                  Host View
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsHostView(false)
                    setShowEditSheet(false)
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-display font-bold transition-all ${
                    !isHostView ? 'bg-w-orange text-w-surface shadow-tactile-sm' : 'bg-w-bg text-w-text-2 hover:text-w-text'
                  }`}
                >
                  Participant View
                </button>
              </div>
            </div>

          </aside>

        </div>
      </main>

      {/* Edit Settings Modal */}
      {showEditSheet && isHostView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={() => setShowEditSheet(false)}>
          <div className="w-full max-w-md rounded-3xl border border-w-border bg-w-surface p-6 shadow-tactile-lg relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowEditSheet(false)}
              className="absolute top-5 right-5 text-w-text-3 hover:text-w-text transition-colors font-display text-sm font-black"
            >
              ✕
            </button>
            
            <h2 className="mb-4 font-display text-xl font-black">
              Lobby <span className="text-w-orange">Settings</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <span className="mb-2 block text-xs font-bold text-w-text-2">Game Mode</span>
                <div className="rounded-2xl border border-w-border bg-w-bg p-1.5 grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('classic')
                      setVisibility('private')
                    }}
                    className={`rounded-xl px-3 py-2 text-xs font-display font-black transition-all ${
                      mode === 'classic' ? 'bg-w-orange text-w-surface shadow-tactile-sm' : 'text-w-text-2 hover:text-w-text'
                    }`}
                  >
                    Classic
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('progression')
                      setVisibility('public')
                    }}
                    className={`rounded-xl px-3 py-2 text-xs font-display font-black transition-all ${
                      mode === 'progression' ? 'bg-w-orange text-w-surface shadow-tactile-sm' : 'text-w-text-2 hover:text-w-text'
                    }`}
                  >
                    Progression
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-w-border/60 bg-w-bg px-4 py-3">
                <span className="text-xs font-bold text-w-text">Max Player Slots</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMaxPlayers((prev) => Math.max(2, prev - 1))}
                    aria-label="Decrease player slots"
                    className="h-8 w-8 border border-w-border rounded-xl bg-w-surface flex items-center justify-center font-bold text-w-text hover:bg-w-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
                  >
                    -
                  </button>
                  <span className="font-display font-black text-sm w-4 text-center">{maxPlayers}</span>
                  <button
                    type="button"
                    onClick={() => setMaxPlayers((prev) => Math.min(12, prev + 1))}
                    aria-label="Increase player slots"
                    className="h-8 w-8 border border-w-border rounded-xl bg-w-surface flex items-center justify-center font-bold text-w-text hover:bg-w-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-w-border/60 bg-w-bg px-4 py-3">
                <span className="text-xs font-bold text-w-text">Rounds to Win</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRounds((prev) => Math.max(3, prev - 1))}
                    aria-label="Decrease rounds to win"
                    className="h-8 w-8 border border-w-border rounded-xl bg-w-surface flex items-center justify-center font-bold text-w-text hover:bg-w-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
                  >
                    -
                  </button>
                  <span className="font-display font-black text-sm w-4 text-center">{rounds}</span>
                  <button
                    type="button"
                    onClick={() => setRounds((prev) => Math.min(10, prev + 1))}
                    aria-label="Increase rounds to win"
                    className="h-8 w-8 border border-w-border rounded-xl bg-w-surface flex items-center justify-center font-bold text-w-text hover:bg-w-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowEditSheet(false)}
              className="w-full mt-6 rounded-2xl bg-w-orange px-4 py-3.5 font-display text-sm font-black text-w-surface shadow-tactile-md hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-w-orange transition-transform"
            >
              Confirm Changes
            </button>
          </div>
        </div>
      )}

      <footer className="hidden md:block mt-12 text-center text-xs text-w-text-3 border-t border-w-border/30 py-6">
        © 2026 Wahala Entertainment. Room Lobby.
      </footer>
    </div>
  )
}
