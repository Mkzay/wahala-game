import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StepperControl } from '../components/ui/StepperControl'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'
import { roomService } from '../services/roomService'

type RoomVisibility = 'private' | 'public'
type GameMode = 'classic' | 'progression'

export default function CreateRoom() {
  const navigate = useNavigate()
  const [visibility, setVisibility] = useState<RoomVisibility>('private')
  const [mode, setMode] = useState<GameMode>('classic')
  const [maxPlayers, setMaxPlayers] = useState<number>(visibility === 'private' ? 6 : 8)
  const [rounds, setRounds] = useState<number>(5)
  const [turnTimer, setTurnTimer] = useState<boolean>(false)
  
  // Interactive API states
  const [roomName, setRoomName] = useState("Mkzay’s den of chaos")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isPublic = visibility === 'public'
  const isTurnTimerOn = isPublic || turnTimer

  const incrementMaxPlayers = () => setMaxPlayers((value) => Math.min(12, value + 1))
  const decrementMaxPlayers = () => setMaxPlayers((value) => Math.max(2, value - 1))
  const incrementRounds = () => setRounds((value) => Math.min(10, value + 1))
  const decrementRounds = () => setRounds((value) => Math.max(3, value - 1))

  const handleCreateRoom = async () => {
    setErrorMsg(null)
    setIsLoading(true)
    try {
      const room = await roomService.createRoom({
        name: roomName || (visibility === 'private' ? "Mkzay’s den of chaos" : 'Weekend mayhem'),
        gameMode: mode,
        visibility,
        maxPlayers,
        roundCount: mode === 'progression' ? rounds : undefined,
        timerEnabled: turnTimer,
      })
      navigate(`/rooms/${room.id}`)
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Failed to create room.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col">
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-24 sm:px-6 lg:px-8 lg:pb-8 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-w-border/80 pb-4">
          <div>
            <span className="text-xs font-display font-bold uppercase tracking-widest text-w-orange">Arena Setup</span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-w-text mt-0.5">
              Create <span className="text-w-orange">Room</span>
            </h1>
          </div>
          <Link
            to="/home"
            aria-label="Back to Dashboard"
            title="Back to Dashboard"
            className="h-8 w-8 rounded-full border border-w-border bg-w-bg hover:bg-w-surface-2 hover:border-w-orange text-w-text-2 hover:text-w-orange transition-all flex items-center justify-center shadow-tactile-sm"
          >
            <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>

        {/* Widescreen Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Room Details & Visibility (occupies 6 cols) */}
          <section className="col-span-1 lg:col-span-6 rounded-2xl border border-w-border bg-w-surface p-5 shadow-md flex flex-col gap-4 h-full lg:overflow-y-auto pr-1">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-w-text-2 border-b border-w-border/40 pb-2">
              General Information
            </h3>
            
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-w-text-2">Room Name</span>
              <input
                autoComplete="off"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full rounded-xl border border-w-border bg-w-bg px-4 py-3 text-sm outline-none focus:border-w-warrior transition-colors"
              />
            </label>

            <div>
              <span className="mb-2 block text-xs font-semibold text-w-text-2">Room Visibility</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setVisibility('private')
                    setMaxPlayers(6)
                    setRoomName("Mkzay’s den of chaos")
                  }}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${
                    visibility === 'private'
                      ? 'border-w-warrior bg-w-surface-2 text-w-warrior shadow-tactile-sm'
                      : 'border-w-border bg-w-bg text-w-text-2'
                  }`}
                >
                  Private Room
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVisibility('public')
                    setMaxPlayers(8)
                    setMode('progression')
                    setRoomName("Weekend mayhem")
                  }}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${
                    visibility === 'public'
                      ? 'border-w-warrior bg-w-surface-2 text-w-warrior shadow-tactile-sm'
                      : 'border-w-border bg-w-bg text-w-text-2'
                  }`}
                >
                  Public Room
                </button>
              </div>
              <p className="mt-2 text-[10px] text-w-text-3 leading-normal">
                {visibility === 'private'
                  ? 'Only players with direct room invite codes can search and enter.'
                  : 'Public rooms are displayed openly in the global room browser feed.'}
              </p>
            </div>
          </section>

          {/* Right Column: Game settings & timers (occupies 6 cols) */}
          <section className="col-span-1 lg:col-span-6 rounded-2xl border border-w-border bg-w-surface p-5 shadow-md flex flex-col gap-4 h-full lg:overflow-y-auto pr-1">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-w-text-2 border-b border-w-border/40 pb-2">
              Rule Parameters
            </h3>

            <div>
              <span className="mb-2 block text-xs font-semibold text-w-text-2">Game Mode</span>
              <div className="grid grid-cols-2 rounded-xl border border-w-border bg-w-bg p-1">
                <button
                  type="button"
                  onClick={() => setMode('classic')}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                    mode === 'classic' ? 'bg-w-warrior text-w-text' : 'text-w-text-2 hover:text-w-text'
                  }`}
                >
                  Classic Whot
                </button>
                <button
                  type="button"
                  onClick={() => setMode('progression')}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                    mode === 'progression' ? 'bg-w-warrior text-w-text' : 'text-w-text-2 hover:text-w-text'
                  }`}
                >
                  Progression
                </button>
              </div>
            </div>

            {/* Stepper inputs */}
            <div className="space-y-3">
              {mode === 'progression' && (
                <div className="flex items-center justify-between rounded-xl border border-w-border bg-w-bg px-4 py-2.5">
                  <span className="text-xs font-semibold">Number of rounds</span>
                  <StepperControl value={rounds} onIncrement={incrementRounds} onDecrement={decrementRounds} />
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl border border-w-border bg-w-bg px-4 py-2.5">
                <span className="text-xs font-semibold">Max player slots</span>
                <StepperControl
                  value={maxPlayers}
                  onIncrement={incrementMaxPlayers}
                  onDecrement={decrementMaxPlayers}
                />
              </div>
            </div>

            {/* Turn limit switch */}
            <div className="flex items-center justify-between rounded-xl border border-w-border bg-w-bg px-4 py-3">
              <div>
                <p className="text-xs font-semibold">20 second turn limit</p>
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
                className={`h-6 w-11 rounded-full border flex items-center p-[2px] transition-colors duration-200 focus:outline-none ${
                  isTurnTimerOn ? 'border-w-warrior bg-w-warrior' : 'border-w-border bg-[#D8CCBC]'
                } ${isPublic ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-w-text transition-transform duration-200 transform ${
                    isTurnTimerOn ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>
        </div>

        {/* Error Alert Display */}
        {errorMsg && (
          <div className="mt-6 w-full max-w-sm mx-auto rounded-xl border border-w-danger/30 bg-w-danger/5 p-3 text-xs text-w-danger font-semibold text-center flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit action */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleCreateRoom}
            className="w-full max-w-sm rounded-xl bg-w-warrior hover:bg-w-warrior/95 px-5 py-3.5 font-display text-sm font-bold text-w-text shadow-tactile-md hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-w-text" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Lobby...
              </>
            ) : (
              'Create and Host Room'
            )}
          </button>
        </div>
      </main>
    </div>
  )
}
