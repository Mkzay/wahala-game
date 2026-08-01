import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StepperControl } from '../components/ui/StepperControl'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'
import { roomService } from '../services/roomService'
import { toast } from '../store/toastStore'
import { useAuthStore } from '../store/authStore'

type RoomVisibility = 'private' | 'public'
type GameMode = 'classic' | 'progression'

export default function CreateRoom() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [visibility, setVisibility] = useState<RoomVisibility>('private')
  const [mode, setMode] = useState<GameMode>('classic')
  const [maxPlayers, setMaxPlayers] = useState<number>(visibility === 'private' ? 6 : 8)
  const [rounds, setRounds] = useState<number>(5)
  const [turnTimer, setTurnTimer] = useState<boolean>(false)
  
  const [roomName, setRoomName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isPublic = visibility === 'public'
  const isTurnTimerOn = isPublic || turnTimer

  const incrementMaxPlayers = () => setMaxPlayers((value) => Math.min(12, value + 1))
  const decrementMaxPlayers = () => setMaxPlayers((value) => Math.max(2, value - 1))
  const incrementRounds = () => setRounds((value) => Math.min(10, value + 1))
  const decrementRounds = () => setRounds((value) => Math.max(3, value - 1))

  const applyPreset = (type: 'quick1v1' | 'standard4' | 'mayhem8') => {
    if (type === 'quick1v1') {
      setVisibility('private')
      setMode('classic')
      setMaxPlayers(2)
    } else if (type === 'standard4') {
      setVisibility('public')
      setMode('progression')
      setMaxPlayers(4)
      setRounds(5)
    } else if (type === 'mayhem8') {
      setVisibility('public')
      setMode('progression')
      setMaxPlayers(8)
      setRounds(7)
    }
  }

  const handleCreateRoom = async () => {
    setIsLoading(true)
    try {
      const room = await roomService.createRoom({
        name: roomName || `${user?.username ?? 'Player'}'s Room`,
        gameMode: mode,
        visibility,
        maxPlayers,
        roundCount: mode === 'progression' ? rounds : undefined,
        timerEnabled: turnTimer,
      })
      toast.success('Battle room created successfully!', 'Room Created')
      navigate(`/rooms/${room.id}`)
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to create room.', 'Room Creation Error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between select-none">
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 lg:pb-8 flex flex-col gap-6">
        
        {/* Header Hero Banner */}
        <header className="rounded-3xl border border-w-border bg-gradient-to-r from-w-surface via-w-bg to-w-surface p-6 shadow-tactile-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-display font-black uppercase tracking-widest text-w-orange bg-w-orange/10 border border-w-orange/30 px-3 py-1 rounded-full">
              Arena Setup 🛠️
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-black text-w-text mt-2">
              Create <span className="text-w-orange">Battle Room</span>
            </h1>
            <p className="text-xs sm:text-sm text-w-text-2 mt-1">
              Configure room visibility, max player slots, round limits, and turn timers.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => applyPreset('quick1v1')}
              className="rounded-xl border border-w-border bg-w-surface hover:border-w-orange px-3 py-2 text-xs font-display font-bold text-w-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
            >
              ⚡ 1v1 Duel
            </button>
            <button
              type="button"
              onClick={() => applyPreset('standard4')}
              className="rounded-xl border border-w-border bg-w-surface hover:border-w-orange px-3 py-2 text-xs font-display font-bold text-w-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
            >
              👥 4 Players
            </button>
            <button
              type="button"
              onClick={() => applyPreset('mayhem8')}
              className="rounded-xl border border-w-border bg-w-surface hover:border-w-orange px-3 py-2 text-xs font-display font-bold text-w-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
            >
              🔥 8 Mayhem
            </button>
          </div>
        </header>

        {/* Widescreen Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Room Details & Visibility (occupies 6 cols) */}
          <section className="col-span-1 lg:col-span-6 rounded-3xl border border-w-border bg-w-surface p-6 shadow-tactile-md flex flex-col gap-5">
            <h3 className="font-display text-xs font-black uppercase tracking-wider text-w-text-2 border-b border-w-border/60 pb-3">
              General Arena Information
            </h3>
            
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-w-text-2">Room Name</span>
              <input
                name="roomName"
                autoComplete="off"
                spellCheck={false}
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full rounded-2xl border border-w-border bg-w-bg px-4 py-3 text-xs sm:text-sm text-w-text outline-none focus:border-w-orange transition-colors"
              />
            </label>

            <div>
              <span className="mb-2 block text-xs font-bold text-w-text-2">Room Visibility</span>
              <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setVisibility('private')
                      setMaxPlayers(6)
                    }}
                  className={`rounded-2xl border px-4 py-3.5 text-xs font-display font-black transition-[colors,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange ${
                    visibility === 'private'
                      ? 'border-w-orange bg-w-orange/10 text-w-orange shadow-tactile-sm'
                      : 'border-w-border bg-w-bg text-w-text-2 hover:border-w-orange/40'
                  }`}
                >
                  🔒 Private Room
                </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVisibility('public')
                      setMaxPlayers(8)
                      setMode('progression')
                    }}
                  className={`rounded-2xl border px-4 py-3.5 text-xs font-display font-black transition-[colors,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange ${
                    visibility === 'public'
                      ? 'border-w-orange bg-w-orange/10 text-w-orange shadow-tactile-sm'
                      : 'border-w-border bg-w-bg text-w-text-2 hover:border-w-orange/40'
                  }`}
                >
                  🌐 Public Room
                </button>
              </div>
              <p className="mt-2.5 text-[11px] text-w-text-3 leading-relaxed">
                {visibility === 'private'
                  ? 'Only players with direct room invite codes can search and enter.'
                  : 'Public rooms are displayed openly in the global room browser feed.'}
              </p>
            </div>
          </section>

          {/* Right Column: Game settings & timers (occupies 6 cols) */}
          <section className="col-span-1 lg:col-span-6 rounded-3xl border border-w-border bg-w-surface p-6 shadow-tactile-md flex flex-col gap-5">
            <h3 className="font-display text-xs font-black uppercase tracking-wider text-w-text-2 border-b border-w-border/60 pb-3">
              Gameplay Parameters
            </h3>

            <div>
              <span className="mb-2 block text-xs font-bold text-w-text-2">Game Mode</span>
              <div className="grid grid-cols-2 rounded-2xl border border-w-border bg-w-bg p-1.5">
                <button
                  type="button"
                  onClick={() => setMode('classic')}
                  className={`rounded-xl px-3 py-2.5 text-xs font-display font-black transition-all ${
                    mode === 'classic' ? 'bg-w-orange text-w-surface shadow-tactile-sm' : 'text-w-text-2 hover:text-w-text'
                  }`}
                >
                  Classic Whot
                </button>
                <button
                  type="button"
                  onClick={() => setMode('progression')}
                  className={`rounded-xl px-3 py-2.5 text-xs font-display font-black transition-all ${
                    mode === 'progression' ? 'bg-w-orange text-w-surface shadow-tactile-sm' : 'text-w-text-2 hover:text-w-text'
                  }`}
                >
                  Progression
                </button>
              </div>
            </div>

            {/* Stepper inputs */}
            <div className="space-y-3">
              {mode === 'progression' && (
                <div className="flex items-center justify-between rounded-2xl border border-w-border/60 bg-w-bg px-4 py-3">
                  <span className="text-xs font-bold text-w-text">Number of rounds</span>
                  <StepperControl value={rounds} onIncrement={incrementRounds} onDecrement={decrementRounds} />
                </div>
              )}

              <div className="flex items-center justify-between rounded-2xl border border-w-border/60 bg-w-bg px-4 py-3">
                <span className="text-xs font-bold text-w-text">Max player slots</span>
                <StepperControl
                  value={maxPlayers}
                  onIncrement={incrementMaxPlayers}
                  onDecrement={decrementMaxPlayers}
                />
              </div>
            </div>

            {/* Turn limit switch */}
            <div className="flex items-center justify-between rounded-2xl border border-w-border/60 bg-w-bg px-4 py-3.5">
              <div>
                <p className="text-xs font-bold text-w-text">20 Second Turn Limit</p>
                <p className="text-[10px] text-w-text-3 mt-0.5">
                  {isPublic ? 'Forced enabled for public rooms' : 'Auto-skips idle player turns'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isTurnTimerOn}
                disabled={isPublic}
                onClick={() => setTurnTimer((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-[colors,box-shadow] duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange ${
                  isTurnTimerOn ? 'bg-w-orange' : 'bg-w-surface-2'
                } ${isPublic ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-w-text shadow ring-0 transition duration-200 ease-in-out ${
                    isTurnTimerOn ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>
        </div>

        {/* Submit action */}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleCreateRoom}
            className="w-full max-w-sm rounded-2xl bg-gradient-to-r from-w-orange to-w-yellow hover:from-w-orange/95 hover:to-w-yellow/95 px-6 py-4 font-display text-sm font-black text-w-surface shadow-tactile-md hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-w-orange transition-[transform,opacity,background-color] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-w-surface" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Lobby…
              </>
            ) : (
              'Create & Launch Room Arena'
            )}
          </button>
        </div>
      </main>
    </div>
  )
}
