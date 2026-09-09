interface PlayerRowProps {
  name: string
  subtext?: string
  badgeLabel: string
  badgeClassName: string
  containerClassName?: string
}

export function PlayerRow({
  name,
  subtext,
  badgeLabel,
  badgeClassName,
  containerClassName = 'border-[#1b3b33] bg-[#071d17]/80',
}: PlayerRowProps) {
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <article
      className={`group relative flex items-center justify-between rounded-2xl border p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-[transform,border-color,background-color] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] ${containerClassName}`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Brass-rimmed avatar medallion */}
        <div className="relative flex-shrink-0 h-11 w-11 rounded-2xl border border-[#c48d28]/60 bg-gradient-to-br from-[#12382e] to-[#051813] p-0.5 shadow-sm flex items-center justify-center">
          <div className="h-full w-full rounded-[14px] bg-[#041511]/90 flex items-center justify-center font-display text-xs font-black text-[#e8ab32] tracking-wider">
            {initials}
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-display text-sm font-black text-[#fffdf8] truncate">{name}</p>
          </div>
          {subtext && <p className="text-[11px] font-semibold text-[#8ba79e] mt-0.5 truncate">{subtext}</p>}
        </div>
      </div>

      <span
        className={`flex-shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border shadow-sm ${badgeClassName}`}
      >
        {badgeLabel}
      </span>
    </article>
  )
}
