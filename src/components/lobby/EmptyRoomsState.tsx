export function EmptyRoomsState() {
  return (
    <div className="flex h-56 flex-col items-center justify-center rounded-xl border border-w-border bg-w-surface text-center">
      <p className="font-display text-base font-bold">No rooms yet</p>
      <p className="mt-2 text-xs text-w-text-2">
        Nobody started the trouble yet. <span className="text-w-orange">Be the first.</span>
      </p>
    </div>
  )
}
