interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null

  const isDanger = variant === 'danger'

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-[3px] animate-fade-in"
        onClick={onCancel}
      />
      <div className="fixed inset-0 z-[70] grid place-items-center p-5 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-xs animate-pop-in">
          <div className="rounded-[22px] border-2 border-w-border bg-w-surface p-5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div
              className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl text-xl ${
                isDanger
                  ? 'bg-w-danger/15 text-w-danger'
                  : 'bg-w-orange/15 text-w-orange'
              }`}
            >
              {isDanger ? '!' : '?'}
            </div>
            <h3 className="mt-3 font-display text-base font-black text-w-text">
              {title}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-w-text-2">
              {message}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-w-border bg-w-surface px-3 py-2.5 text-xs font-bold text-w-text-2 transition hover:border-w-text-2 hover:text-w-text active:scale-[0.97]"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`rounded-xl px-3 py-2.5 text-xs font-black text-[#fffdf8] transition hover:scale-[1.02] active:scale-[0.97] ${
                  isDanger
                    ? 'bg-w-danger shadow-[0_4px_0_#7f1d1d]'
                    : 'bg-w-orange shadow-[0_4px_0_#a43f2d]'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
