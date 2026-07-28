interface PlayerRowProps {
  name: string
  subtext: string
  badgeLabel: string
  badgeClassName: string
  containerClassName?: string
}

export function PlayerRow({
  name,
  subtext,
  badgeLabel,
  badgeClassName,
  containerClassName = 'border-w-border bg-w-surface',
}: PlayerRowProps) {
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <article className={`flex items-center justify-between rounded-xl border p-3.5 shadow-tactile-sm transition-transform hover:scale-[1.01] ${containerClassName}`}>
      <div className="flex items-center gap-3">
        {/* Avatar block */}
        <div className="h-10 w-10 rounded-full border border-w-border bg-w-bg flex items-center justify-center font-display text-xs font-black text-w-orange shadow-tactile-sm">
          {initials}
        </div>
        <div>
          <p className="font-display text-sm font-black text-w-text">{name}</p>
          <p className="text-[10px] text-w-text-2 mt-0.5">{subtext}</p>
        </div>
      </div>
      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClassName}`}>
        {badgeLabel}
      </span>
    </article>
  )
}
