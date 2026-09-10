import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { roomService } from '../services/roomService'
import { useGameStore } from '../store/gameStore'

export default function Spectator() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const setCanAccessGame = useGameStore((s) => s.setCanAccessGame)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function routeToGame() {
      // If a specific gameId was passed in route params
      if (gameId && gameId !== 'latest' && gameId !== 'demo-game-id') {
        setCanAccessGame(true)
        navigate(`/game/${gameId}/board`, { replace: true })
        return
      }

      // Otherwise look up the latest active tournament match
      try {
        const room = await roomService.getRoom('latest')
        if (!mounted) return

        if (room?.activeGameId) {
          setCanAccessGame(true)
          navigate(`/game/${room.activeGameId}/board`, { replace: true })
        } else if (room?.id) {
          navigate(`/rooms/${room.id}`, { replace: true })
        } else {
          setError('No active tournament match is currently in progress.')
        }
      } catch (err: any) {
        if (!mounted) return
        setError(err?.message || 'No active matches found in the parlor.')
      }
    }

    routeToGame()

    return () => {
      mounted = false
    }
  }, [gameId, navigate, setCanAccessGame])

  if (error) {
    return (
      <div className="min-h-screen w-full felt-table-bg text-[#fffdf8] flex flex-col items-center justify-center p-6 gap-5 select-none">
        <div className="rounded-3xl border border-[#e8ab32]/40 bg-[#071d17]/95 p-8 max-w-md text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-w-orange to-w-yellow text-2xl font-black text-[#fffdf8] shadow-glow-orange">
            👁️
          </div>
          <h2 className="mt-4 font-display text-lg font-black text-[#e8ab32]">No Active Tournament</h2>
          <p className="mt-2 text-xs text-w-text-2 leading-relaxed">
            {error}
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-xl bg-w-orange px-4 py-3 font-display text-xs font-black text-[#fffdf8] shadow-tactile-sm transition hover:scale-[1.02] active:scale-[0.98]"
            >
              🔄 Refresh Stream Feed
            </button>
            <Link
              to="/rooms"
              className="w-full rounded-xl border border-w-border bg-w-surface px-4 py-2.5 text-xs font-bold text-w-text-2 hover:border-[#e8ab32] transition"
            >
              Browse All Rooms
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full felt-table-bg text-[#fffdf8] flex items-center justify-center select-none">
      <div className="flex items-center gap-3 rounded-2xl border border-[#38bdf8]/40 bg-[#071d17]/95 px-6 py-4 shadow-xl backdrop-blur-md">
        <span className="h-3 w-3 rounded-full bg-[#38bdf8] animate-ping" />
        <p className="font-display text-sm font-bold text-[#38bdf8]">
          Connecting to Live Arena Broadcast…
        </p>
      </div>
    </div>
  )
}
