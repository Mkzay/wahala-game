import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'
import { RoomCard } from '../components/lobby/RoomCard'
import { EmptyRoomsState } from '../components/lobby/EmptyRoomsState'
import { useRooms } from '../hooks/useRooms'

export default function RoomBrowser() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'waiting' | 'live' | 'classic' | 'progression'>('all')
  const { rooms, isLoading, refetch } = useRooms()

  const filtered = useMemo(
    () =>
      rooms.filter((room) => {
        const matchesQuery = room.name.toLowerCase().includes(query.toLowerCase())
        const matchesFilter =
          filter === 'all' ||
          (filter === 'waiting' && room.status === 'waiting') ||
          (filter === 'live' && room.status === 'in_progress') ||
          (filter === 'classic' && room.gameMode === 'classic') ||
          (filter === 'progression' && room.gameMode === 'progression')
        return matchesQuery && matchesFilter
      }),
    [rooms, query, filter],
  )

  const showEmptyState = !isLoading && filtered.length === 0

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between">
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-24 lg:pb-8 sm:px-6 lg:px-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-w-border/80 pb-4">
          <div>
            <span className="text-xs font-display font-bold uppercase tracking-widest text-w-orange">Lobby Browser</span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-w-text mt-0.5">
              Open <span className="text-w-orange">Arenas</span>
            </h1>
          </div>
          <button
            type="button"
            onClick={refetch}
            className="rounded-xl border border-w-border bg-w-surface hover:border-w-orange px-4 py-2 text-xs font-bold text-w-text transition-colors shadow-tactile-sm flex items-center gap-2"
          >
            <svg className="h-4 w-4 fill-current text-w-orange" viewBox="0 0 24 24">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
            </svg>
            Refresh List
          </button>
        </div>

        {/* Search and Filters console bar */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6 rounded-xl border border-w-border bg-w-surface px-4 py-3 focus-within:border-w-orange transition-colors">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              placeholder="Search room name or host..."
              className="w-full bg-transparent text-xs outline-none placeholder:text-w-text-3"
            />
          </div>

          <div className="md:col-span-6 flex gap-2 overflow-x-auto pb-1 justify-start md:justify-end">
            {(['all', 'waiting', 'live', 'classic', 'progression'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                  filter === key ? 'border-w-orange bg-w-orange/10 text-w-orange shadow-tactile-sm' : 'border-w-border bg-w-surface text-w-text-2 hover:text-w-text'
                }`}
              >
                {key === 'all'
                  ? 'All Rooms'
                  : key === 'waiting'
                    ? 'Waiting'
                    : key === 'live'
                      ? 'Live Feed'
                      : key === 'classic'
                        ? 'Classic'
                        : 'Progression'}
              </button>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between border-b border-w-border pb-2.5">
          <span className="text-xs text-w-text-2 font-bold uppercase tracking-wider">
            Available game lobbies
          </span>
          <p className="text-xs text-w-text-2 font-medium">
            Found <span className="font-display text-w-orange font-bold">{filtered.length}</span> rooms
          </p>
        </div>

        {/* Responsive Grid display for rooms */}
        <section className="flex-1">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((room) => (
                <Link
                  key={room.id}
                  to={`/rooms/${room.id}`}
                  className="block hover:scale-[1.01] transition-transform"
                >
                  <RoomCard
                    name={room.name}
                    mode={room.gameMode === 'classic' ? 'Classic' : 'Progression'}
                    rounds={room.roundCount ? `${room.roundCount} rounds` : 'Infinite'}
                    status={room.status === 'waiting' ? 'Waiting' : 'Live'}
                    players={`${room.playerCount} / ${room.maxPlayers}`}
                  />
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="hidden md:block mt-12 text-center text-xs text-w-text-3 border-t border-w-border/30 py-6">
        Need help? Check the <Link to="/rulebook" className="text-w-orange underline">Wahala rulebook</Link> for class breakdowns.
      </footer>
    </div>
  )
}
