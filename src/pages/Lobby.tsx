import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlayerRow } from '../components/lobby/PlayerRow'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'
import { roomService, type RoomReadyInfo } from '../services/roomService'
import { socketService } from '../services/socketService'
import { useAuthStore } from '../store/authStore'
import { useGameStore } from '../store/gameStore'
import { toast } from '../store/toastStore'
import { playUiSound, startLobbyMusic, stopLobbyMusic, toggleLobbyMusic, isLobbyMusicPlaying } from '../lib/sound'
import type { Room } from '../types/room'

export default function Lobby() {
  const { roomId = '' } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const applyStateSnapshot = useGameStore((state) => state.applyStateSnapshot)
  const setCanAccessGame = useGameStore((state) => state.setCanAccessGame)
  const queryClient = useQueryClient()

  const [showEditSheet, setShowEditSheet] = useState(false)
  const [editName, setEditName] = useState('')
  const [editMaxPlayers, setEditMaxPlayers] = useState(6)
  const [editRoundCount, setEditRoundCount] = useState(5)
  const [editTimerEnabled, setEditTimerEnabled] = useState(false)
  const [lobbyAudioOn, setLobbyAudioOn] = useState(false)

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

  // Procedural Afrobeat lobby music lifecycle
  useEffect(() => {
    const tryPlay = () => {
      startLobbyMusic()
      setLobbyAudioOn(isLobbyMusicPlaying())
    }

    tryPlay()
    window.addEventListener('click', tryPlay, { once: true })
    window.addEventListener('keydown', tryPlay, { once: true })

    return () => {
      window.removeEventListener('click', tryPlay)
      window.removeEventListener('keydown', tryPlay)
      stopLobbyMusic()
    }
  }, [])

  useEffect(() => {
    if (room) {
      setEditName(room.name)
      setEditMaxPlayers(room.maxPlayers)
      setEditRoundCount(room.roundCount ?? 5)
      setEditTimerEnabled(room.timerEnabled)

      if (room.status === 'in_progress' && room.activeGameId) {
        stopLobbyMusic()
        setCanAccessGame(true)
        navigate(`/game/${room.activeGameId}/board`)
      }
    }
  }, [room, navigate, setCanAccessGame])

  // Real-time socket sync for lobby members
  useEffect(() => {
    if (!roomId) return

    socketService.connect(undefined, roomId)

    const handleGameStarting = (payload: { gameId: string }) => {
      stopLobbyMusic()
      setCanAccessGame(true)
      playUiSound('power')
      if (payload?.gameId) {
        navigate(`/game/${payload.gameId}/class-selection`)
      }
    }

    const handleStateSnapshot = (payload: any) => {
      const state = payload?.game ?? payload
      if (state?.gameId) {
        stopLobbyMusic()
        applyStateSnapshot({ game: state })
        const targetPhase = state.phase === 'classSelection' ? 'class-selection' : 'board'
        navigate(`/game/${state.gameId}/${targetPhase}`)
      }
    }

    socketService.on('lobby:gameStarting', handleGameStarting)
    socketService.on('game:stateSnapshot', handleStateSnapshot)

    return () => {
      socketService.off('lobby:gameStarting', handleGameStarting)
      socketService.off('game:stateSnapshot', handleStateSnapshot)
    }
  }, [roomId, navigate, applyStateSnapshot, setCanAccessGame])

  const readyMutation = useMutation<RoomReadyInfo, Error, void>({
    mutationFn: () => roomService.setReady(roomId),
    onSuccess: () => {
      playUiSound('select')
      queryClient.invalidateQueries({ queryKey: ['roomReady', roomId] })
    },
    onError: (err) => {
      playUiSound('error')
      toast.error(err.message, 'Ready Error')
    },
  })

  const startMutation = useMutation<any, Error, void>({
    mutationFn: () => roomService.startGame(roomId),
    onSuccess: (data) => {
      playUiSound('fanfare')
      setCanAccessGame(true)
      applyStateSnapshot({ game: data })
      navigate(`/game/${data.gameId}/class-selection`)
    },
    onError: (err) => {
      playUiSound('error')
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
      playUiSound('slide')
      setShowEditSheet(false)
      toast.success('Room settings updated', 'Settings Saved')
      refetch()
    },
    onError: (err) => {
      playUiSound('error')
      toast.error(err.message, 'Update Error')
    },
  })

  const handleCopyCode = () => {
    if (room?.code) {
      navigator.clipboard.writeText(room.code)
      playUiSound('select')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isHost = user?.id === room?.hostId
  const filledSlots = players.length
  const emptySlots = room ? Math.max(0, room.maxPlayers - filledSlots) : 0

  if (isLoading) {
    return (
      <div className="min-h-screen w-full felt-table-bg text-[#fffdf8] flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-[#c48d28]/40 bg-[#071d17]/90 px-6 py-4 shadow-xl backdrop-blur-md">
          <span className="h-3 w-3 rounded-full bg-[#e8ab32] animate-ping" />
          <p className="font-display text-sm font-bold text-[#e8ab32]">Loading Wahala Parlor…</p>
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="min-h-screen w-full felt-table-bg text-[#fffdf8] flex flex-col items-center justify-center gap-4">
        <p className="text-sm font-bold text-[#ef4444]">Room not found or failed to load.</p>
        <Link
          to="/rooms"
          className="rounded-2xl border border-[#c48d28]/40 bg-[#071d17] px-5 py-2.5 text-xs font-black text-[#e8ab32] hover:border-[#e8ab32] transition-colors"
        >
          Back to Rooms
        </Link>
      </div>
    )
  }

  const playerRows = players
    .map((p) => ({
      name: p.username || p.userId.slice(0, 8),
      subtext: p.userId === room.hostId ? 'Table Host' : undefined,
      isReady: p.isReady,
      isCurrentUser: p.userId === user?.id,
      isHost: p.userId === room.hostId,
    }))
    .sort((a, b) => (a.isHost === b.isHost ? 0 : a.isHost ? -1 : 1))

  return (
    <div className="min-h-screen w-full felt-table-bg text-[#fffdf8] flex flex-col justify-between select-none">
      <div className="table-spotlight absolute inset-0 pointer-events-none" />
      <DashboardNavBar />

      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 lg:pb-8 flex flex-col gap-6">
        {/* Header Parlor Banner */}
        <header className="rounded-3xl border border-[#c48d28]/40 bg-gradient-to-r from-[#071d17] via-[#0b2820] to-[#071d17] p-6 sm:p-8 shadow-[0_16px_36px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c48d28]/40 bg-[#041511]/80 px-3.5 py-1">
              <span className="h-2 w-2 rounded-full bg-[#ea580c] shadow-[0_0_6px_#ea580c]" />
              <span className="text-[10px] sm:text-xs font-display font-black uppercase tracking-widest text-[#e8ab32]">
                Parlor Table Lobby ⚔️
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-black text-[#fffdf8] mt-2.5 tracking-wide">
              {room.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#c2d6ce] mt-1 flex flex-wrap items-center gap-2">
              <span className="font-semibold">{room.gameMode === 'classic' ? 'Classic Whot' : 'Progression'} Mode</span>
              <span className="text-[#c48d28]">·</span>
              <span>{room.roundCount ? `${room.roundCount} Rounds to Win` : 'Standard Rounds'}</span>
              <span className="text-[#c48d28]">·</span>
              <span>{room.timerEnabled ? '20s Turn Timer' : 'Untimed'}</span>
              <span className="text-[#c48d28]">·</span>
              <span className="uppercase text-[11px] font-bold text-[#e8ab32]">{room.visibility}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                const nextPlaying = toggleLobbyMusic()
                setLobbyAudioOn(nextPlaying)
              }}
              aria-label={lobbyAudioOn ? 'Mute Lobby Music' : 'Play Lobby Music'}
              title={lobbyAudioOn ? 'Mute Lobby Music' : 'Play Lobby Music'}
              className="rounded-2xl border border-[#c48d28]/50 bg-[#071d17] hover:border-[#e8ab32] px-3.5 py-2.5 text-xs font-display font-black text-[#fffdf8] transition-[border-color,transform] active:scale-[0.97] shadow-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8ab32]"
            >
              <span className="text-sm">{lobbyAudioOn ? '🔊' : '🔇'}</span>
              <span className="hidden sm:inline">{lobbyAudioOn ? 'Music On' : 'Muted'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCode}
              aria-label="Copy Room Code"
              className="rounded-2xl border border-[#c48d28]/50 bg-[#071d17] hover:border-[#e8ab32] px-4 py-2.5 text-xs font-display font-black text-[#fffdf8] transition-[border-color,transform] active:scale-[0.97] shadow-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8ab32]"
            >
              <svg className="h-4 w-4 fill-current text-[#e8ab32]" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </svg>
              <span>{copied ? 'Code Copied! ✓' : `Code: ${room.code}`}</span>
            </button>

            <Link
              to="/rooms"
              aria-label="Leave Lobby"
              title="Leave Lobby"
              className="h-10 w-10 rounded-2xl border border-[#1b3b33] bg-[#071d17] hover:border-[#ea580c] text-[#8ba79e] hover:text-[#ea580c] transition-[colors,border-color,transform] active:scale-[0.96] flex items-center justify-center flex-shrink-0 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]"
            >
              <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
        </header>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          {/* Left Column: Player Slots */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-4">
            <header className="flex items-center justify-between rounded-2xl border border-[#1b3b33] bg-[#071d17]/90 px-5 py-3.5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
                <h2 className="font-display text-xs sm:text-sm font-black uppercase tracking-wider text-[#fffdf8]">
                  Table Seating
                </h2>
              </div>
              <div className="text-right">
                <span className="font-display text-base font-black text-[#e8ab32]">{filledSlots}</span>
                <span className="text-xs text-[#8ba79e] font-bold"> / {room.maxPlayers} Seats</span>
              </div>
            </header>

            <section className="space-y-3">
              {playerRows.map((p, i) => (
                <PlayerRow
                  key={i}
                  name={p.name}
                  subtext={p.subtext}
                  badgeLabel={p.isHost ? '👑 Host' : p.isReady ? 'Ready ✓' : 'Waiting'}
                  badgeClassName={
                    p.isHost
                      ? 'bg-[#c48d28]/20 text-[#e8ab32] border-[#c48d28]/50'
                      : p.isReady
                        ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/50'
                        : 'bg-[#041511] text-[#8ba79e] border-[#1b3b33]'
                  }
                  containerClassName={
                    p.isCurrentUser && p.isReady
                      ? 'border-[#10b981]/60 bg-[#08221b] ring-1 ring-[#10b981]/30'
                      : p.isCurrentUser
                        ? 'border-[#c48d28]/60 bg-[#071d17]'
                        : 'border-[#1b3b33] bg-[#071d17]/80'
                  }
                />
              ))}

              {[...Array(emptySlots)].map((_, i) => (
                <article
                  key={`empty-${i}`}
                  className="rounded-2xl border border-dashed border-[#1b3b33] bg-[#041511]/40 px-5 py-4 text-xs text-[#8ba79e] flex items-center justify-between select-none"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span className="h-6 w-6 rounded-lg border border-dashed border-[#1b3b33] flex items-center justify-center font-bold text-[#8ba79e]">
                      +
                    </span>
                    Waiting for challenger…
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#8ba79e]/60">
                    Open Seat
                  </span>
                </article>
              ))}
            </section>
          </div>

          {/* Right Column: Actions and Settings */}
          <aside className="col-span-1 lg:col-span-5 flex flex-col gap-6">
            <article className="rounded-3xl border border-[#c48d28]/40 bg-gradient-to-b from-[#071d17] to-[#051813] p-6 shadow-[0_16px_36px_rgba(0,0,0,0.4)] flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[#1b3b33] pb-3.5">
                <span className="text-xs font-display font-black uppercase tracking-wider text-[#e8ab32]">
                  Match Control
                </span>
                {isHost && (
                  <button
                    type="button"
                    onClick={() => {
                      playUiSound('slide')
                      setShowEditSheet(true)
                    }}
                    className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-[#c48d28]/50 text-[#e8ab32] bg-[#c48d28]/15 hover:bg-[#c48d28]/25 transition-[background-color,transform] active:scale-[0.96]"
                  >
                    ⚙️ Table Rules
                  </button>
                )}
              </div>

              {isHost ? (
                <div className="space-y-3 pt-1">
                  <button
                    type="button"
                    disabled={!allReady || startMutation.isPending}
                    onClick={() => startMutation.mutate()}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#e8ab32] to-[#ea580c] py-4 font-display text-sm font-black uppercase tracking-wider text-[#041511] shadow-[0_8px_24px_rgba(234,88,12,0.4)] hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e8ab32] transition-[transform,filter] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {startMutation.isPending ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-[#041511]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Dealing Cards…</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Start Wahala Match</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-[#8ba79e]">
                    {!allReady ? 'Waiting for all seated players to Ready Up' : 'All players ready! Host can start the round'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <button
                    type="button"
                    disabled={readyMutation.isPending}
                    onClick={() => readyMutation.mutate()}
                    className={`w-full rounded-2xl border py-4 font-display text-sm font-black uppercase tracking-wider shadow-sm active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 transition-[transform,background-color,border-color] disabled:opacity-50 disabled:cursor-not-allowed ${
                      players.find((p) => p.userId === user?.id)?.isReady
                        ? 'border-[#10b981] bg-[#10b981] text-[#041511] shadow-[0_4px_16px_rgba(16,185,129,0.4)]'
                        : 'border-[#ea580c] bg-[#ea580c]/15 text-[#ea580c] hover:bg-[#ea580c]/25'
                    }`}
                  >
                    {readyMutation.isPending
                      ? '…'
                      : players.find((p) => p.userId === user?.id)?.isReady
                        ? '✓ Seated & Ready'
                        : 'Ready Up'}
                  </button>
                  <Link
                    to="/rooms"
                    className="w-full rounded-2xl border border-[#1b3b33] hover:border-[#ea580c]/60 py-3 text-xs font-bold text-[#8ba79e] hover:text-[#fffdf8] transition-colors text-center block active:scale-[0.98]"
                  >
                    Leave Table
                  </Link>
                </div>
              )}
            </article>
          </aside>
        </div>
      </main>

      {/* Edit Room Sheet Modal */}
      {showEditSheet && isHost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={() => {
            playUiSound('slide')
            setShowEditSheet(false)
          }}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-[#c48d28]/50 bg-[#071d17] p-6 sm:p-7 shadow-[0_24px_48px_rgba(0,0,0,0.6)] relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                playUiSound('slide')
                setShowEditSheet(false)
              }}
              aria-label="Close settings"
              className="absolute top-5 right-5 text-[#8ba79e] hover:text-[#fffdf8] transition-colors font-display text-base font-black"
            >
              ✕
            </button>

            <h2 className="mb-5 font-display text-xl font-black text-[#fffdf8]">
              Table <span className="text-[#e8ab32]">House Rules</span>
            </h2>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-[#c2d6ce]">Room Name</span>
                <input
                  name="roomName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-2xl border border-[#1b3b33] bg-[#041511] px-4 py-3 text-xs text-[#fffdf8] outline-none focus:border-[#e8ab32] transition-colors"
                />
              </label>

              <div className="flex items-center justify-between rounded-2xl border border-[#1b3b33] bg-[#041511] px-4 py-3">
                <span className="text-xs font-bold text-[#fffdf8]">Max Seated Players</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      playUiSound('select')
                      setEditMaxPlayers((prev) => Math.max(2, prev - 1))
                    }}
                    className="h-8 w-8 border border-[#1b3b33] rounded-xl bg-[#071d17] flex items-center justify-center font-bold text-[#fffdf8] hover:border-[#e8ab32] transition-colors"
                  >
                    -
                  </button>
                  <span className="font-display font-black text-sm w-4 text-center text-[#e8ab32]">
                    {editMaxPlayers}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      playUiSound('select')
                      setEditMaxPlayers((prev) => Math.min(12, prev + 1))
                    }}
                    className="h-8 w-8 border border-[#1b3b33] rounded-xl bg-[#071d17] flex items-center justify-center font-bold text-[#fffdf8] hover:border-[#e8ab32] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#1b3b33] bg-[#041511] px-4 py-3">
                <span className="text-xs font-bold text-[#fffdf8]">Rounds to Win</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      playUiSound('select')
                      setEditRoundCount((prev) => Math.max(3, prev - 1))
                    }}
                    className="h-8 w-8 border border-[#1b3b33] rounded-xl bg-[#071d17] flex items-center justify-center font-bold text-[#fffdf8] hover:border-[#e8ab32] transition-colors"
                  >
                    -
                  </button>
                  <span className="font-display font-black text-sm w-4 text-center text-[#e8ab32]">
                    {editRoundCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      playUiSound('select')
                      setEditRoundCount((prev) => Math.min(10, prev + 1))
                    }}
                    className="h-8 w-8 border border-[#1b3b33] rounded-xl bg-[#071d17] flex items-center justify-center font-bold text-[#fffdf8] hover:border-[#e8ab32] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#1b3b33] bg-[#041511] px-4 py-3">
                <div>
                  <p className="text-xs font-bold text-[#fffdf8]">20s Reaction Turn Limit</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={editTimerEnabled}
                  onClick={() => {
                    playUiSound('select')
                    setEditTimerEnabled((prev) => !prev)
                  }}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8ab32] ${
                    editTimerEnabled ? 'bg-[#ea580c]' : 'bg-[#1b3b33]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#fffdf8] shadow ring-0 transition duration-200 ease-in-out ${
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
              className="w-full mt-6 rounded-2xl bg-gradient-to-r from-[#ea580c] to-[#e8ab32] px-4 py-3.5 font-display text-sm font-black text-[#041511] shadow-[0_4px_16px_rgba(234,88,12,0.3)] hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#e8ab32] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {updateMutation.isPending ? 'Saving Table Rules…' : 'Confirm Table Rules'}
            </button>
          </div>
        </div>
      )}

      <footer className="hidden md:block mt-12 text-center text-xs text-[#8ba79e]/60 border-t border-[#1b3b33]/40 py-6">
        © 2026 Wahala Parlor Arena. Afro-Arcade Neo-Tabletop Edition.
      </footer>
    </div>
  )
}
