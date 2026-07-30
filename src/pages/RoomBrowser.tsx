import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'
import { RoomCard } from '../components/lobby/RoomCard'
import { EmptyRoomsState } from '../components/lobby/EmptyRoomsState'
import { useRooms } from '../hooks/useRooms'

export default function RoomBrowser() {
  const { rooms, isLoading, searchTerm, setSearchTerm, filter, setFilter, refetch } = useRooms()

  const filtered = useMemo(
    () =>
      rooms.filter((room) => {
        const matchesFilter =
          filter === 'all' ||
          (filter === ('waiting' as any) && room.status === 'waiting') ||
          (filter === ('in_progress' as any) && room.status === 'in_progress')
        return matchesFilter
      }),
    [rooms, filter],
  )

  const showEmptyState = !isLoading && filtered.length === 0

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between select-none">
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 lg:pb-8 flex flex-col gap-6">
        
        {/* Header Hero Banner */}
        <header className="rounded-3xl border border-w-border bg-gradient-to-r from-w-surface via-w-bg to-w-surface p-6 shadow-tactile-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-display font-black uppercase tracking-widest text-w-orange bg-w-orange/10 border border-w-orange/30 px-3 py-1 rounded-full">
              Live Battle Lobbies ⚔️
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-black text-w-text mt-2">
              Arena <span className="text-w-orange">Browser</span>
            </h1>
            <p className="text-xs sm:text-sm text-w-text-2 mt-1">
              Join an existing match or launch a custom arena room with class rules.
            </p>
          </div>

          <div className="flex gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={refetch}
              className="rounded-xl border border-w-border bg-w-surface hover:border-w-orange px-4 py-2.5 text-xs font-display font-bold text-w-text transition-[colors,border-color] shadow-tactile-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
            >
              <svg className="h-4 w-4 fill-current text-w-orange" viewBox="0 0 24 24">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
              Refresh
            </button>
            
            <Link
              to="/rooms/create"
              className="rounded-xl bg-w-orange hover:bg-w-orange/95 px-5 py-2.5 text-xs font-display font-bold text-w-text shadow-tactile-md flex items-center gap-2 transition-[transform,background-color] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Create Room
            </Link>
          </div>
        </header>

        {/* Search and Filters Console Bar */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center rounded-2xl border border-w-border bg-w-surface p-4 shadow-tactile-sm">
          <div className="md:col-span-6 rounded-xl border border-w-border bg-w-bg px-4 py-2.5 focus-within:border-w-orange transition-colors flex items-center gap-2">
            <svg className="h-4 w-4 text-w-text-3 flex-shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              name="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder="Search room name or host…"
              className="w-full bg-transparent text-xs outline-none placeholder:text-w-text-3"
            />
          </div>

          <div className="md:col-span-6 flex gap-2 overflow-x-auto pb-1 justify-start md:justify-end">
            {(['all', 'waiting', 'in_progress'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs font-display font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange ${
                  filter === key ? 'border-w-orange bg-w-orange/10 text-w-orange shadow-tactile-sm' : 'border-w-border bg-w-bg text-w-text-2 hover:text-w-text'
                }`}
              >
                {key === 'all'
                  ? 'All Rooms'
                  : key === 'waiting'
                    ? 'Waiting'
                    : 'Live Feed'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((room) => (
                <Link
                  key={room.id}
                  to={`/rooms/${room.id}`}
                  className="block hover:scale-[1.01] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange rounded-xl"
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
