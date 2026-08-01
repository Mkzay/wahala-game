import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { roomService } from '../services/roomService'
import { toast } from '../store/toastStore'
import { EmptyRoomsState } from '../components/lobby/EmptyRoomsState'
import { RoomCard } from '../components/lobby/RoomCard'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'
import { useRooms } from '../hooks/useRooms'
import { useProfile } from '../hooks/useProfile'
import { useAuthStore } from '../store/authStore'

export default function Home() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'waiting' | 'live'>('all')
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const { rooms, isLoading } = useRooms()
  const { profile } = useProfile()

  const joinMutation = useMutation({
    mutationFn: (code: string) => roomService.joinRoomByCode(code),
    onSuccess: (room) => {
      setShowJoinModal(false)
      setJoinCode('')
      navigate(`/rooms/${room.id}`)
    },
    onError: (err: Error) => {
      toast.error(err.message, 'Join Room')
    },
  })

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesQuery = room.name.toLowerCase().includes(query.toLowerCase())
      const matchesFilter =
        filter === 'all' ||
        (filter === 'waiting' && room.status === 'waiting') ||
        (filter === 'live' && room.status === 'in_progress')
      return matchesQuery && matchesFilter
    })
  }, [rooms, query, filter])

  const showEmptyState = !isLoading && filteredRooms.length === 0

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between select-none">
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 lg:pb-8 flex flex-col gap-6">
        
        <header className="rounded-3xl border border-w-border bg-gradient-to-r from-w-surface via-w-bg to-w-surface p-6 sm:p-8 shadow-tactile-md relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-w-orange/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-w-yellow/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] sm:text-xs text-w-orange font-display font-black uppercase tracking-widest bg-w-orange/10 border border-w-orange/30 px-3 py-1 rounded-full">
                Welcome back, {user?.username || 'Player'} 👋
              </span>
            </div>
            
            <h1 className="mt-1 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-w-text leading-tight text-balance">
              Every round, <span className="text-w-orange">new trouble.</span>
            </h1>
            
            <p className="mt-2.5 text-xs sm:text-sm text-w-text-2 leading-relaxed">
              Real-time Whot card strategy with character class abilities, deck-shifting round rules, and global leaderboard ranking.
            </p>

            <div className="mt-4 flex items-center gap-3 bg-w-surface/80 border border-w-border/60 rounded-2xl p-2.5 max-w-md">
              <div className="h-8 w-8 rounded-xl bg-w-orange/20 border border-w-orange/40 flex items-center justify-center font-display font-black text-xs text-w-orange flex-shrink-0">
                Lv.{profile?.level ?? '-'}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider mb-1">
                  <span className="text-w-text">XP Progress</span>
                  <span className="text-w-orange font-display font-black">{profile?.xp ?? '-'} XP</span>
                </div>
                <div className="h-2 w-full bg-w-bg rounded-full overflow-hidden border border-w-border/40">
                  <div className="h-full bg-gradient-to-r from-w-yellow to-w-orange rounded-full w-[75%] transition-all duration-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0 lg:w-64">
            <Link
              to="/rooms"
              className="w-full rounded-2xl bg-gradient-to-r from-w-orange to-w-yellow hover:from-w-orange/95 hover:to-w-yellow/95 px-6 py-3.5 flex items-center justify-center gap-2.5 font-display text-sm font-black text-w-surface shadow-tactile-md hover:scale-[1.02] active:scale-[0.98] transition-[transform,background-color] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-w-orange"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Quick Match Arena
            </Link>

            <div className="flex gap-2 w-full">
              <Link
                to="/rooms/create"
                className="flex-1 rounded-xl border border-w-border hover:border-w-orange/50 bg-w-surface px-4 py-2.5 flex items-center justify-center gap-1.5 font-display text-xs font-bold text-w-text hover:bg-w-surface-2 transition-[colors,border-color] shadow-tactile-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
              >
                <svg className="h-4 w-4 fill-current text-w-orange" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                Create Room
              </Link>
              <button
                type="button"
                onClick={() => setShowJoinModal(true)}
                className="flex-1 rounded-xl border border-w-border hover:border-w-yellow/50 bg-w-surface px-4 py-2.5 flex items-center justify-center gap-1.5 font-display text-xs font-bold text-w-text hover:bg-w-surface-2 transition-[colors,border-color] shadow-tactile-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-yellow"
              >
                <svg className="h-4 w-4 fill-current text-w-yellow" viewBox="0 0 24 24">
                  <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                Join Room
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <aside className="col-span-1 lg:col-span-3 flex flex-col gap-6">
            <article className="rounded-2xl border border-w-border bg-w-surface p-5 shadow-tactile-sm flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-w-border/60 pb-3">
                <span className="text-xs font-display font-black uppercase tracking-wider text-w-text-2">
                  Profile
                </span>
                <Link
                  to="/profile/me"
                  className="text-[10px] font-bold text-w-orange hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange rounded"
                >
                  View →
                </Link>
              </div>
              <div className="flex items-center gap-3.5 pt-1">
                <div className="h-12 w-12 rounded-2xl bg-w-orange/10 border border-w-orange/40 flex items-center justify-center text-lg font-display font-black text-w-orange flex-shrink-0 shadow-inner">
                  {profile?.username?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-w-text">
                    {profile?.username ?? 'Player'}
                  </h3>
                  <span className="text-[10px] font-bold text-w-orange block uppercase tracking-wider">
                    {profile?.title ?? 'Newcomer'}
                  </span>
                </div>
              </div>
              <div className="bg-w-bg/80 border border-w-border/40 rounded-xl p-3 text-xs space-y-1.5 mt-1">
                <div className="flex justify-between items-center">
                  <span className="text-w-text-2">Coins</span>
                  <span className="font-bold text-w-yellow">{profile?.coins ?? '-'}</span>
                </div>
              </div>
            </article>
          </aside>

          <section className="col-span-1 lg:col-span-6 flex flex-col gap-4 w-full">
            
            <header className="flex flex-col gap-3 rounded-2xl border border-w-border bg-w-surface p-4 shadow-tactile-sm">
              <div className="flex items-center justify-between border-b border-w-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-w-success animate-ping" />
                  <h2 className="font-display text-xs sm:text-sm font-extrabold uppercase text-w-orange tracking-wider">
                    Live Arena Rooms
                  </h2>
                </div>
                <span className="text-xs text-w-text-2 font-medium">
                  Showing <span className="font-bold text-w-text">{filteredRooms.length}</span> rooms
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex-1 rounded-xl border border-w-border bg-w-bg px-3.5 py-2.5 focus-within:border-w-orange transition-colors flex items-center gap-2">
                  <svg className="h-4 w-4 text-w-text-3 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                  <input
                    name="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Search room name or host…"
                    className="w-full bg-transparent text-xs outline-none placeholder:text-w-text-3"
                  />
                </div>

                <div className="flex gap-2">
                  {(['all', 'waiting', 'live'] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFilter(key)}
                      className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange ${
                        filter === key
                          ? 'border-w-orange bg-w-orange/10 text-w-orange shadow-tactile-sm'
                          : 'border-w-border bg-w-bg text-w-text-2 hover:text-w-text'
                      }`}
                    >
                      {key === 'all' ? 'All' : key === 'waiting' ? 'Waiting' : 'Live'}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            <div className="space-y-3">
              {isLoading ? (
                <div aria-live="polite" className="flex h-56 flex-col items-center justify-center rounded-2xl border border-w-border bg-w-surface text-center shadow-tactile-sm">
                  <svg className="animate-spin h-6 w-6 text-w-orange" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="mt-2 text-xs text-w-text-2 font-medium">Scanning active arenas…</p>
                </div>
              ) : showEmptyState ? (
                <EmptyRoomsState />
              ) : (
                filteredRooms.map((room) => (
                  <Link key={room.id} to={`/rooms/${room.id}`} className="block hover:scale-[1.01] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange rounded-xl">
                    <RoomCard
                      name={room.name}
                      mode={room.gameMode === 'classic' ? 'Classic' : 'Progression'}
                      rounds={room.roundCount ? `${room.roundCount} rounds` : 'Infinite'}
                      status={room.status === 'waiting' ? 'Waiting' : 'Live'}
                      players={`${room.playerCount} / ${room.maxPlayers}`}
                    />
                  </Link>
                ))
              )}
            </div>
          </section>

          <aside className="col-span-1 lg:col-span-3 flex flex-col gap-6">
            <article className="rounded-2xl border border-w-border bg-w-surface p-5 shadow-tactile-sm flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-w-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🏆</span>
                  <span className="text-xs font-display font-black uppercase tracking-wider text-w-text">
                    Leaderboard
                  </span>
                </div>
                <Link
                  to="/leaderboard"
                  className="text-[10px] font-bold text-w-orange hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange rounded"
                >
                  View All →
                </Link>
              </div>
              <p className="text-xs text-w-text-2 leading-relaxed pt-1">
                Leaderboard rankings coming soon. Check back after the first season concludes!
              </p>
            </article>
          </aside>

        </div>

      </main>

      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={() => { setShowJoinModal(false); setJoinCode('') }}>
          <div className="w-full max-w-md rounded-3xl border border-w-border bg-w-surface p-6 shadow-tactile-lg relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => { setShowJoinModal(false); setJoinCode('') }}
              className="absolute top-5 right-5 text-w-text-3 hover:text-w-text transition-colors font-display text-sm font-black"
            >
              ✕
            </button>

            <h2 className="mb-1 font-display text-xl font-black">
              Join <span className="text-w-orange">Room</span>
            </h2>
            <p className="mb-5 text-xs text-w-text-2">
              Enter the room code shared by the host.
            </p>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-w-text-2">Room Code</span>
                <input
                  name="roomCode"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="WHL-ABCD"
                  disabled={joinMutation.isPending}
                  className="w-full rounded-2xl border border-w-border bg-w-bg px-4 py-3 text-xs text-w-text outline-none focus:border-w-orange transition-colors placeholder:text-w-text-3 uppercase tracking-widest font-bold disabled:opacity-50"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && joinCode.trim().length > 0 && !joinMutation.isPending) {
                      joinMutation.mutate(joinCode.trim())
                    }
                  }}
                />
              </label>

              <button
                type="button"
                disabled={joinCode.trim().length === 0 || joinMutation.isPending}
                onClick={() => joinMutation.mutate(joinCode.trim())}
                className="w-full rounded-2xl bg-gradient-to-r from-w-orange to-w-yellow hover:from-w-orange/95 hover:to-w-yellow/95 px-4 py-3.5 font-display text-sm font-black text-w-surface shadow-tactile-md hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-w-orange transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {joinMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-w-surface" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Joining…
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    Join Room
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="hidden md:block mt-12 text-center border-t border-w-border/40 py-6 text-xs text-w-text-3">
        <span>© 2026 Wahala Entertainment. All rights reserved.</span>
      </footer>
    </div>
  )
}
