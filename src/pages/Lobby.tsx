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
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between">
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-24 lg:pb-8 sm:px-6 lg:px-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-w-border/80 pb-4">
          <div>
            <span className="text-xs font-display font-bold uppercase tracking-widest text-w-orange">Room Arena</span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-w-text mt-0.5 whitespace-nowrap">
              Lobby <span className="text-w-orange">WHL-4829</span>
            </h1>
          </div>
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleCopyCode}
              className="rounded-xl border border-w-border bg-w-surface hover:border-w-orange px-3 py-2 text-xs font-bold text-w-text transition-colors shadow-tactile-sm flex items-center gap-2"
            >
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <svg className="h-4 w-4 fill-current text-w-orange" viewBox="0 0 24 24">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                </svg>
                {copied ? 'Code Copied!' : 'Code: WHL-4829'}
              </span>
            </button>
            <Link
              to="/rooms"
              aria-label="Leave Lobby"
              title="Leave Lobby"
              className="h-8 w-8 rounded-full border border-w-border bg-w-bg hover:bg-w-surface-2 hover:border-w-orange text-w-text-2 hover:text-w-orange transition-all flex items-center justify-center flex-shrink-0 shadow-tactile-sm"
            >
              <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Room Header Info Card */}
        <section className="mb-4 rounded-2xl border border-w-border bg-w-surface p-5 shadow-tactile-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg font-black text-w-text">Mkzay’s den of chaos</p>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-w-text-2">
                <span className="capitalize font-semibold text-w-warrior">{mode} Mode</span>
                <span className="h-3 w-px bg-w-border" />
                <span>{rounds} Rounds</span>
                <span className="h-3 w-px bg-w-border" />
                <span className="capitalize">{visibility} Room</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-w-border bg-w-bg px-3.5 py-1.5 rounded-xl shadow-tactile-sm">
                <span className="font-display text-xs font-black tracking-widest text-w-text-2">WHL-4829</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-[10px] text-w-warrior hover:text-w-warrior/80 transition-colors font-bold uppercase tracking-wider pl-1.5 border-l border-w-border"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <button
                type="button"
                disabled={!isHostView}
                onClick={() => setShowEditSheet(true)}
                className={`rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
                  isHostView
                    ? 'border-w-warrior text-w-warrior hover:bg-w-surface-2 shadow-tactile-sm'
                    : 'cursor-not-allowed border-w-border bg-w-surface-2 text-w-text-3'
                }`}
              >
                Lobby settings
              </button>
            </div>
          </div>
        </section>

        {/* Widescreen Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 flex-1 lg:overflow-hidden items-stretch">
          
          {/* Left Column: Player Slots list (occupies 7 cols on large screens) */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-5 h-full lg:overflow-hidden">
            <header className="flex items-center justify-between border-b border-w-border pb-3">
              <div>
                <h2 className="font-display text-base font-black uppercase tracking-wider text-w-text-2">
                  Lobby Members
                </h2>
              </div>
              <div className="text-right">
                <span className="font-display text-lg font-black text-w-warrior">3</span>
                <span className="text-xs text-w-text-2"> / {maxPlayers}</span>
              </div>
            </header>

            {/* Players list slots */}
            <section className="space-y-3 flex-1 lg:overflow-y-auto pr-1">
              <PlayerRow
                name="Mkzay"
                subtext="Host · The Trickster"
                badgeLabel="Host"
                badgeClassName="bg-w-orange/20 text-w-orange"
                containerClassName="border-w-orange/40 bg-w-surface-2"
              />
              <PlayerRow
                name="Esther"
                subtext={isHostView ? 'The Striker' : 'You · The Striker'}
                badgeLabel={!isHostView && isReady ? 'Ready' : (isHostView ? 'Ready' : 'Not Ready')}
                badgeClassName={
                  (!isHostView && isReady) || isHostView
                    ? 'bg-w-success/20 text-w-success'
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
                  className="rounded-xl border border-dashed border-w-border px-4 py-3.5 text-xs text-w-text-3 flex items-center justify-between select-none"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full border border-dashed border-w-border flex items-center justify-center font-bold">
                      +
                    </span>
                    Waiting for player slot…
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-55">
                    Open Slot
                  </span>
                </article>
              ))}
            </section>
          </div>

          {/* Right Column: Settings, Meta and Rules (occupies 5 cols on large screens) */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 h-full lg:overflow-y-auto pr-1">
            
            {showEditSheet && isHostView && (
              <section className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditSheet(false)}>
                <div className="w-full max-w-md rounded-3xl border border-w-border bg-w-surface p-6 shadow-tactile-lg relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setShowEditSheet(false)}
                    className="absolute top-4 right-4 text-w-text-3 hover:text-w-text transition-colors font-display text-sm font-bold"
                  >
                    ✕
                  </button>
                  <h2 className="mb-5 font-display text-lg font-black">
                    Room <span className="text-w-warrior">Settings</span>
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="mb-2 block text-xs font-semibold text-w-text-2">Game Mode</span>
                      <div className="rounded-xl border border-w-border bg-w-bg p-1">
                        <div className="grid grid-cols-2 gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setMode('classic')
                              setVisibility('private')
                            }}
                            className={`rounded-lg px-2 py-2 text-sm font-bold transition-all ${
                              mode === 'classic' ? 'bg-w-warrior text-w-text shadow-tactile-sm' : 'text-w-text-2 hover:text-w-text'
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
                            className={`rounded-lg px-2 py-2 text-sm font-bold transition-all ${
                              mode === 'progression' ? 'bg-w-warrior text-w-text shadow-tactile-sm' : 'text-w-text-2 hover:text-w-text'
                            }`}
                          >
                            Progression
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-w-border bg-w-bg px-4 py-3">
                      <span className="text-xs font-semibold text-w-text">Max Player slots</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setMaxPlayers((prev) => Math.max(2, prev - 1))}
                          className="h-7 w-7 border border-w-border rounded-lg bg-w-surface flex items-center justify-center font-bold text-w-text hover:bg-w-surface-2 transition-colors"
                        >
                          -
                        </button>
                        <span className="font-display font-black text-sm w-4 text-center">{maxPlayers}</span>
                        <button
                          type="button"
                          onClick={() => setMaxPlayers((prev) => Math.min(12, prev + 1))}
                          className="h-7 w-7 border border-w-border rounded-lg bg-w-surface flex items-center justify-center font-bold text-w-text hover:bg-w-surface-2 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-w-border bg-w-bg px-4 py-3">
                      <span className="text-xs font-semibold text-w-text">Rounds to win</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setRounds((prev) => Math.max(3, prev - 1))}
                          className="h-7 w-7 border border-w-border rounded-lg bg-w-surface flex items-center justify-center font-bold text-w-text hover:bg-w-surface-2 transition-colors"
                        >
                          -
                        </button>
                        <span className="font-display font-black text-sm w-4 text-center">{rounds}</span>
                        <button
                          type="button"
                          onClick={() => setRounds((prev) => Math.min(10, prev + 1))}
                          className="h-7 w-7 border border-w-border rounded-lg bg-w-surface flex items-center justify-center font-bold text-w-text hover:bg-w-surface-2 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowEditSheet(false)}
                    className="w-full mt-6 rounded-xl bg-w-warrior px-4 py-3.5 font-display text-sm font-bold text-w-text shadow-tactile-md hover:scale-[1.01] transition-transform"
                  >
                    Confirm Changes
                  </button>
                </div>
              </section>
            )}

            <section className="mt-4 space-y-3">
              {isHostView ? (
                <>
                  <button
                    type="button"
                    onClick={handleStartGame}
                    className="w-full rounded-xl bg-w-warrior hover:bg-w-warrior/95 py-3.5 font-display text-sm font-bold text-w-text shadow-tactile-md hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
                  >
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Start Match
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-w-border hover:bg-w-danger/5 hover:border-w-danger/30 py-3 text-sm font-bold text-w-danger transition-colors"
                  >
                    Disband Room
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsReady(!isReady)}
                    className={`w-full rounded-xl border py-3.5 font-display text-sm font-bold transition-all shadow-tactile-sm hover:scale-[1.01] ${
                      isReady
                        ? 'border-w-success bg-w-success text-w-surface'
                        : 'border-w-support bg-w-surface-2 text-w-support hover:bg-w-support/10'
                    }`}
                  >
                    {isReady ? '✓ Ready' : 'Ready Up'}
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-xl px-4 py-2.5 text-xs text-w-text-2 hover:text-w-danger transition-colors font-semibold"
                  >
                    Leave Lobby
                  </button>
                </>
              )}
            </section>
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsHostView(true)
              setShowEditSheet(false)
            }}
            className={`rounded-full px-3 py-1 text-xs ${
              isHostView ? 'bg-w-orange text-w-text' : 'bg-w-surface text-w-text-2'
            }`}
          >
            Host view
          </button>
          <button
            type="button"
            onClick={() => {
              setIsHostView(false)
              setShowEditSheet(false)
            }}
            className={`rounded-full px-3 py-1 text-xs ${
              !isHostView ? 'bg-w-orange text-w-text' : 'bg-w-surface text-w-text-2'
            }`}
          >
            View as Participant
          </button>
        </div>
      </main>

      <footer className="hidden md:block mt-12 text-center text-xs text-w-text-3 border-t border-w-border/30 py-6">
        © 2026 Wahala Entertainment. Room Lobby.
      </footer>
    </div>
  )
}
