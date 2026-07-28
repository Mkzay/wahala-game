interface RoomCardProps {
  name: string
  mode: string
  rounds: string
  status: 'Waiting' | 'Live'
  players: string
}

export function RoomCard({ name, mode, rounds, status, players }: RoomCardProps) {
  return (
    <article className="flex items-center justify-between rounded-xl border border-w-border bg-w-surface px-4 py-3">
      <div>
        <p className="font-display text-sm font-bold">{name}</p>
        <p className="text-xs text-w-text-2">
          {mode} · {rounds}
        </p>
      </div>
      <div className="text-right">
        <p className={`text-xs font-semibold ${status === 'Live' ? 'text-w-orange' : 'text-w-yellow'}`}>
          {status}
        </p>
        <p className="text-xs text-w-text-2">{players}</p>
      </div>
    </article>
  )
}
