import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { EmptyRoomsState } from '../components/lobby/EmptyRoomsState'
import { RoomCard } from '../components/lobby/RoomCard'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'
import { useRooms } from '../hooks/useRooms'
import { useProfile } from '../hooks/useProfile'
import { useAuthStore } from '../store/authStore'

export default function Home() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'waiting' | 'live'>('all')

  const user = useAuthStore((state) => state.user)
  const { rooms, isLoading } = useRooms()
  const { profile } = useProfile(user?.id ?? '')

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
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between">
      {/* Desktop & Mobile Header Navigation */}
      <DashboardNavBar />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-24 lg:pb-8 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {/* Widescreen Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Hero branding, profile info & actions */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
            <header className="rounded-2xl border border-w-border/80 bg-gradient-to-br from-w-surface to-w-surface-2 p-6 shadow-tactile-sm">
              <span className="text-xs text-w-orange font-display font-bold uppercase tracking-widest">
                Welcome back, {user?.username || 'Player'} 👋
              </span>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black leading-tight text-w-text">
                Every round,<br />
                <span className="text-w-orange">new</span> <span className="text-w-yellow">trouble.</span>
              </h1>
              <p className="mt-3 text-sm text-w-text-2 leading-relaxed">
                Real-time Naija Whot reimagined with character classes, deck-shifting abilities, dynamic round rules, and leaderboard progression.
              </p>

              {/* Action buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/rooms/create"
                  className="flex-1 rounded-xl bg-w-orange hover:bg-w-orange/95 px-5 py-3.5 flex items-center justify-center gap-2 font-display text-sm font-bold text-w-text shadow-tactile-md hover:scale-[1.01] transition-all"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  Create Room
                </Link>
                <Link
                  to="/rooms"
                  className="flex-1 rounded-xl border border-w-border hover:border-w-orange/40 bg-w-surface px-5 py-3.5 flex items-center justify-center gap-2 font-display text-sm font-bold text-w-text hover:scale-[1.01] transition-all shadow-tactile-sm"
                >
                  <svg className="h-4 w-4 fill-current text-w-orange" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.25z" />
                  </svg>
                  Join with Code
                </Link>
              </div>
            </header>

            {/* Quick Stats Dashboard Widget */}
            <section className="grid grid-cols-3 gap-3 rounded-2xl border border-w-border bg-w-surface p-4 shadow-tactile-sm">
              <article className="text-center border-r border-w-border/50 flex flex-col justify-between items-center py-1">
                <svg className="h-5 w-5 fill-w-yellow text-w-yellow" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" className="fill-w-yellow/20 stroke-w-yellow stroke-2" />
                  <path d="M12 6v12M9 9h6M9 15h6" className="stroke-w-yellow stroke-2" />
                </svg>
                <p className="font-display text-base font-black text-w-yellow mt-1">{profile?.coins ?? 120}</p>
                <p className="text-[10px] text-w-text-2 uppercase font-bold tracking-wider mt-0.5">Coins</p>
              </article>
              <article className="text-center border-r border-w-border/50 flex flex-col justify-between items-center py-1">
                <svg className="h-5 w-5 fill-w-support text-w-support" viewBox="0 0 24 24">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                </svg>
                <p className="font-display text-base font-black text-w-support mt-1">Lv.{profile?.overallLevel ?? 1}</p>
                <p className="text-[10px] text-w-text-2 uppercase font-bold tracking-wider mt-0.5">Level</p>
              </article>
              <article className="text-center flex flex-col justify-between items-center py-1">
                <svg className="h-5 w-5 fill-w-mystic text-w-mystic" viewBox="0 0 24 24">
                  <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H8v2h8v-2h-3v-2.1c2.12-.39 3.79-2.07 4.39-4.39C19.08 11.21 21 9.13 21 6.5V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                </svg>
                <p className="font-display text-base font-black text-w-mystic mt-1 truncate max-w-full px-1">{profile?.title ?? 'Newcomer'}</p>
                <p className="text-[10px] text-w-text-2 uppercase font-bold tracking-wider mt-0.5">Title</p>
              </article>
            </section>
          </div>

          {/* Right Column: Live rooms list browser feed */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-4 w-full">
            <header className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-w-border pb-2.5">
                <h2 className="font-display text-sm font-extrabold uppercase text-w-orange tracking-wider">
                  Live Arena Rooms
                </h2>
                <span className="text-xs text-w-text-2 font-medium">
                  Showing {filteredRooms.length} rooms
                </span>
              </div>

              {/* Filter Search Bar & Chip Filters */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex-1 rounded-xl border border-w-border bg-w-surface px-3.5 py-2.5 focus-within:border-w-orange transition-colors flex items-center gap-2">
                  <svg className="h-4 w-4 text-w-text-3 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoComplete="off"
                    placeholder="Search room name or host..."
                    className="w-full bg-transparent text-xs outline-none placeholder:text-w-text-3"
                  />
                </div>

                {/* Status chips */}
                <div className="flex gap-2">
                  {(['all', 'waiting', 'live'] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFilter(key)}
                      className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                        filter === key
                          ? 'border-w-orange bg-w-orange/10 text-w-orange shadow-tactile-sm'
                          : 'border-w-border bg-w-surface text-w-text-2 hover:text-w-text'
                      }`}
                    >
                      {key === 'all' ? 'All' : key === 'waiting' ? 'Waiting' : 'Live'}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            {/* Rooms Grid list */}
            <section className="space-y-3">
              {isLoading ? (
                <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-w-border bg-w-surface text-center">
                  <svg className="animate-spin h-6 w-6 text-w-orange" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="mt-2 text-xs text-w-text-2 font-medium">Scanning active arenas...</p>
                </div>
              ) : showEmptyState ? (
                <EmptyRoomsState />
              ) : (
                filteredRooms.map((room) => (
                  <Link key={room.id} to={`/rooms/${room.id}`} className="block hover:scale-[1.01] transition-transform">
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
            </section>
          </div>
        </div>

      </main>

      {/* Web Footer */}
      <footer className="hidden md:block mt-12 text-center border-t border-w-border/40 py-6 text-xs text-w-text-3">
        <span>© 2026 Wahala Entertainment. All rights reserved.</span>
      </footer>
    </div>
  )
}
