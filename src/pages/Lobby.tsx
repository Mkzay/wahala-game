import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlayerRow } from '../components/lobby/PlayerRow'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'
import { roomService, type RoomReadyInfo } from '../services/roomService'
import { useAuthStore } from '../store/authStore'
import { toast } from '../store/toastStore'
import type { Room } from '../types/room'

export default function Lobby() {
  const { roomId = '' } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const queryClient = useQueryClient()

  const [showEditSheet, setShowEditSheet] = useState(false)
  const [editName, setEditName] = useState('')
  const [editMaxPlayers, setEditMaxPlayers] = useState(6)
  const [editRoundCount, setEditRoundCount] = useState(5)
  const [editTimerEnabled, setEditTimerEnabled] = useState(false)

  const [copied, setCopied] = useState(false)

  const { data: room, isLoading, error, refetch } = useQuery<Room>({
    queryKey: ['room', roomId],
    queryFn: () => roomService.getRoom(roomId),
    enabled: roomId.length > 0,
    refetchInterval: 5000,
  })

  const { data: readyState } = useQuery<RoomReadyInfo>({
    queryKey: ['roomReady', roomId],
    queryFn: () => roomService.getReadyState(roomId),
    enabled: roomId.length > 0,
    refetchInterval: 5000,
  })

  const players = readyState?.players ?? []
  const allReady = readyState?.allReady ?? false

  useEffect(() => {
    if (room) {
      setEditName(room.name)
      setEditMaxPlayers(room.maxPlayers)
      setEditRoundCount(room.roundCount ?? 5)
      setEditTimerEnabled(room.timerEnabled)
    }
  }, [room])

  const readyMutation = useMutation<RoomReadyInfo, Error, void>({
    mutationFn: () => roomService.setReady(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomReady', roomId] })
    },
    onError: (err) => {
      toast.error(err.message, 'Ready Error')
    },
  })

  const startMutation = useMutation<any, Error, void>({
    mutationFn: () => roomService.startGame(roomId),
    onSuccess: (data) => {
      navigate(`/game/${data.gameId}/board`)
    },
    onError: (err) => {
      toast.error(err.message, 'Start Game Error')
    },
  })

  const updateMutation = useMutation<Room, Error, void>({
    mutationFn: () =>
      roomService.updateRoom(roomId, {
        name: editName,
        maxPlayers: editMaxPlayers,
        roundCount: editRoundCount,
        timerEnabled: editTimerEnabled,
      }),
    onSuccess: () => {
      setShowEditSheet(false)
      toast.success('Room settings updated', 'Settings Saved')
      refetch()
    },
    onError: (err) => {
      toast.error(err.message, 'Update Error')
    },
  })

  const handleCopyCode = () => {
    if (room?.code) {
      navigator.clipboard.writeText(room.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isHost = user?.id === room?.hostId
  const filledSlots = players.length
  const emptySlots = room ? Math.max(0, room.maxPlayers - filledSlots) : 0

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-w-bg text-w-text flex items-center justify-center">
        <p className="text-sm text-w-text-2">Loading lobby…</p>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-w-danger">Room not found or failed to load.</p>
        <Link to="/rooms" className="rounded-xl border border-w-border px-4 py-2 text-xs font-bold text-w-text hover:bg-w-surface-2 transition-colors">
          Back to Rooms
        </Link>
      </div>
    )
  }

  const playerRows = players.map((p) => ({
    name: p.username || p.userId.slice(0, 8),
    subtext: p.userId === room.hostId ? 'Host' : undefined,
    isReady: p.isReady,
    isCurrentUser: p.userId === user?.id,
    isHost: p.userId === room.hostId,
  }))

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between select-none">
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 lg:pb-8 flex flex-col gap-6">
        <header className="rounded-3xl border border-w-border bg-gradient-to-r from-w-surface via-w-bg to-w-surface p-6 shadow-tactile-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-display font-black uppercase tracking-widest text-w-orange bg-w-orange/10 border border-w-orange/30 px-3 py-1 rounded-full">
              Room Arena Lobby ⚔️
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-black text-w-text mt-2">
              {room.name}
            </h1>
            <p className="text-xs sm:text-sm text-w-text-2 mt-1">
              {room.gameMode === 'classic' ? 'Classic Whot' : 'Progression'} Mode
              {room.roundCount ? ` · ${room.roundCount} Rounds` : ''}
              {room.timerEnabled ? ' · Timer On' : ''}
              {' · '}{room.visibility === 'public' ? 'Public' : 'Private'} Room
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
              <span>{copied ? 'Code Copied!' : `Code: ${room.code}`}</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-4">
            <header className="flex items-center justify-between rounded-2xl border border-w-border bg-w-surface px-5 py-3.5 shadow-tactile-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-w-success animate-ping" />
                <h2 className="font-display text-xs sm:text-sm font-black uppercase tracking-wider text-w-text">
                  Lobby Members
                </h2>
              </div>
              <div className="text-right">
                <span className="font-display text-base font-black text-w-orange">{filledSlots}</span>
                <span className="text-xs text-w-text-2 font-bold"> / {room.maxPlayers} Slots</span>
              </div>
            </header>

            <section className="space-y-3">
              {playerRows.map((p, i) => (
                <PlayerRow
                  key={i}
                  name={p.name}
                  subtext={p.subtext}
                  badgeLabel={p.isHost ? 'Host' : p.isReady ? 'Ready ✓' : 'Not Ready'}
                  badgeClassName={
                    p.isHost
                      ? 'bg-w-orange/10 text-w-orange border border-w-orange/30'
                      : p.isReady
                        ? 'bg-w-success/20 text-w-success border border-w-success/40'
                        : 'bg-w-surface-2 text-w-text-3'
                  }
                  containerClassName={
                    p.isCurrentUser && p.isReady
                      ? 'border-w-success bg-w-success/5 shadow-tactile-sm'
                      : p.isCurrentUser
                        ? 'border-w-orange/40 bg-w-surface shadow-tactile-sm'
                        : 'border-w-border bg-w-surface'
                  }
                />
              ))}

              {[...Array(emptySlots)].map((_, i) => (
                <article
                  key={`empty-${i}`}
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

          <aside className="col-span-1 lg:col-span-5 flex flex-col gap-6">
            <article className="rounded-3xl border border-w-border bg-w-surface p-6 shadow-tactile-md flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-w-border/60 pb-3">
                <span className="text-xs font-display font-black uppercase tracking-wider text-w-text-2">
                  Match Actions
                </span>
                {isHost && (
                  <button
                    type="button"
                    onClick={() => setShowEditSheet(true)}
                    className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-w-orange text-w-orange bg-w-orange/10 hover:bg-w-orange/20 shadow-tactile-sm transition-all"
                  >
                    ⚙️ Settings
                  </button>
                )}
              </div>

              {isHost ? (
                <div className="space-y-3 pt-1">
                  <button
                    type="button"
                    disabled={!allReady || startMutation.isPending}
                    onClick={() => startMutation.mutate()}
                    className="w-full rounded-2xl bg-gradient-to-r from-w-orange to-w-yellow hover:from-w-orange/95 hover:to-w-yellow/95 py-4 font-display text-sm font-black text-w-surface shadow-tactile-md hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-w-orange transition-[transform,background-color] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {startMutation.isPending ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-w-surface" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Starting…
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Start Match Arena
                      </>
                    )}
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
                    disabled={readyMutation.isPending}
                    onClick={() => readyMutation.mutate()}
                    className={`w-full rounded-2xl border py-4 font-display text-sm font-black shadow-tactile-md hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-w-success transition-[transform,background-color,border-color] disabled:opacity-50 disabled:cursor-not-allowed ${
                      players.find((p) => p.userId === user?.id)?.isReady
                        ? 'border-w-success bg-w-success text-w-surface'
                        : 'border-w-orange bg-w-orange/10 text-w-orange hover:bg-w-orange/20'
                    }`}
                  >
                    {readyMutation.isPending
                      ? '…'
                      : players.find((p) => p.userId === user?.id)?.isReady
                        ? '✓ Ready for Battle'
                        : 'Ready Up'}
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
          </aside>
        </div>
      </main>

      {showEditSheet && isHost && (
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
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-w-text-2">Room Name</span>
                <input
                  name="roomName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-2xl border border-w-border bg-w-bg px-4 py-3 text-xs text-w-text outline-none focus:border-w-orange transition-colors"
                />
              </label>

              <div className="flex items-center justify-between rounded-2xl border border-w-border/60 bg-w-bg px-4 py-3">
                <span className="text-xs font-bold text-w-text">Max Player Slots</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditMaxPlayers((prev) => Math.max(2, prev - 1))}
                    className="h-8 w-8 border border-w-border rounded-xl bg-w-surface flex items-center justify-center font-bold text-w-text hover:bg-w-surface-2 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-display font-black text-sm w-4 text-center">{editMaxPlayers}</span>
                  <button
                    type="button"
                    onClick={() => setEditMaxPlayers((prev) => Math.min(12, prev + 1))}
                    className="h-8 w-8 border border-w-border rounded-xl bg-w-surface flex items-center justify-center font-bold text-w-text hover:bg-w-surface-2 transition-colors"
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
                    onClick={() => setEditRoundCount((prev) => Math.max(3, prev - 1))}
                    className="h-8 w-8 border border-w-border rounded-xl bg-w-surface flex items-center justify-center font-bold text-w-text hover:bg-w-surface-2 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-display font-black text-sm w-4 text-center">{editRoundCount}</span>
                  <button
                    type="button"
                    onClick={() => setEditRoundCount((prev) => Math.min(10, prev + 1))}
                    className="h-8 w-8 border border-w-border rounded-xl bg-w-surface flex items-center justify-center font-bold text-w-text hover:bg-w-surface-2 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-w-border/60 bg-w-bg px-4 py-3">
                <div>
                  <p className="text-xs font-bold text-w-text">20 Second Turn Limit</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={editTimerEnabled}
                  onClick={() => setEditTimerEnabled((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange ${
                    editTimerEnabled ? 'bg-w-orange' : 'bg-w-surface-2'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-w-text shadow ring-0 transition duration-200 ease-in-out ${
                      editTimerEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={updateMutation.isPending}
              onClick={() => updateMutation.mutate()}
              className="w-full mt-6 rounded-2xl bg-w-orange px-4 py-3.5 font-display text-sm font-black text-w-surface shadow-tactile-md hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-w-orange transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? 'Saving…' : 'Confirm Changes'}
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
