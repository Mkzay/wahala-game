import type { RuleType } from '../../types/game'

interface EventLog {
  id: string
  text: string
  timestamp: string
}

interface GameSidebarProps {
  activeRules: RuleType[]
  eventLogs: EventLog[]
  playerStandings: { id: string; username: string; points: number; cardCount: number }[]
  mode: 'classic' | 'progression'
  round: number
}

export function GameSidebar({
  activeRules,
  eventLogs,
  playerStandings,
  mode,
  round,
}: GameSidebarProps) {
  const getRuleDetails = (rule: RuleType) => {
    switch (rule) {
      case 'light':
        return {
          title: 'Quick Reaction',
          badge: 'Light Rule',
          color: 'text-w-success bg-w-surface-2 border-w-success/20',
          desc: '5-second counter window is active. Any player can play a matching suit card to interrupt a turn!',
        }
      case 'moderate':
        return {
          title: 'Class Lockdown',
          badge: 'Moderate Rule',
          color: 'text-w-yellow bg-w-surface-2 border-w-yellow/20',
          desc: 'Abilities can only be activated during your own turn. Out-of-turn activation is disabled.',
        }
      case 'chaotic':
        return {
          title: 'Circle Double Draw',
          badge: 'Chaotic Rule',
          color: 'text-w-orange bg-w-surface-2 border-w-orange/20',
          desc: 'Whenever a Circle suit card is played, the next player must draw 2 cards immediately from the market deck!',
        }
    }
  }

  return (
    <aside className="w-full flex flex-col gap-4 text-w-text">
      {/* Game Info Dashboard Widget */}
      <section className="rounded-2xl border border-w-border bg-w-surface p-4 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-wider text-w-text-2">
          Match Metadata
        </span>
        <div className="flex items-center justify-between mt-1.5">
          <div>
            <h4 className="font-display text-sm font-bold text-w-text">Round {round} of 5</h4>
            <p className="text-xs text-w-text-2 mt-0.5 capitalize">{mode} Mode</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-w-success animate-ping" />
        </div>
      </section>

      {/* Dynamic Rules Widget */}
      <section className="rounded-2xl border border-w-border bg-w-surface p-4 shadow-sm flex-1 flex flex-col min-h-[160px]">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-w-text-2 mb-3">
          Active Dynamic Rules
        </h3>
        {activeRules.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-3 text-w-text-3 text-xs border border-dashed border-w-border rounded-xl">
            No active dynamic rules.
            <span className="mt-1 text-[10px] opacity-75">Rules activate when special cards are played.</span>
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {activeRules.map((rule) => {
              const details = getRuleDetails(rule)
              if (!details) return null

              return (
                <article
                  key={rule}
                  className={`rounded-xl border p-3 ${details.color} transition-all duration-300 hover:scale-[1.02]`}
                >
                  <header className="flex items-center justify-between">
                    <h4 className="font-display text-xs font-bold tracking-wide">
                      {details.title}
                    </h4>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-current/20">
                      {details.badge}
                    </span>
                  </header>
                  <p className="mt-1.5 text-[11px] leading-normal opacity-85">
                    {details.desc}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Leaderboard Widget */}
      <section className="rounded-2xl border border-w-border bg-w-surface p-4 shadow-sm">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-w-text-2 mb-3">
          Leaderboard / Hand Count
        </h3>
        <div className="space-y-2">
          {playerStandings.map((player, idx) => (
            <article
              key={player.id}
              className="flex items-center justify-between text-xs py-1.5 border-b border-w-border/30 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-w-text-2 w-3 text-center">
                  {idx + 1}
                </span>
                <span className="font-medium text-w-text">{player.username}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-w-text-2 text-[10px]">{player.cardCount} cards</span>
                <span className="font-display font-bold text-w-yellow">{player.points} pts</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Live Event Log Widget */}
      <section className="rounded-2xl border border-w-border bg-w-surface p-4 shadow-sm h-[200px] flex flex-col">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-w-text-2 mb-2.5">
          Live Match Feed
        </h3>
        <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 font-mono text-[10px] text-w-text-2 select-text">
          {eventLogs.length === 0 ? (
            <p className="text-center text-w-text-3 mt-6 italic">Feed is empty</p>
          ) : (
            eventLogs.map((log) => (
              <div key={log.id} className="flex gap-2 leading-tight">
                <span className="text-w-orange select-none">[{log.timestamp}]</span>
                <span className="text-w-text/95">{log.text}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </aside>
  )
}
