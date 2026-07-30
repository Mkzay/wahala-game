import { useToastStore } from '../../store/toastStore'
import type { ToastType } from '../../types/toast'

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  if (toasts.length === 0) {
    return null
  }

  const getTypeStyles = (type: ToastType) => {
    switch (type) {
      case 'error':
        return {
          border: 'border-red-500/50 shadow-red-500/10',
          bg: 'from-red-950/40 via-w-surface to-w-surface',
          badge: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: '⚠️',
        }
      case 'success':
        return {
          border: 'border-emerald-500/50 shadow-emerald-500/10',
          bg: 'from-emerald-950/40 via-w-surface to-w-surface',
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: '✅',
        }
      case 'warning':
        return {
          border: 'border-amber-500/50 shadow-amber-500/10',
          bg: 'from-amber-950/40 via-w-surface to-w-surface',
          badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          icon: '⚡',
        }
      case 'wahala':
        return {
          border: 'border-w-orange/70 shadow-w-orange/20 animate-pulse',
          bg: 'from-w-orange/25 via-w-surface to-w-surface-2',
          badge: 'bg-w-orange/20 text-w-orange border-w-orange/40 font-black',
          icon: '💥',
        }
      case 'info':
      default:
        return {
          border: 'border-w-blue/50 shadow-w-blue/10',
          bg: 'from-w-blue/15 via-w-surface to-w-surface',
          badge: 'bg-w-blue/20 text-w-blue border-w-blue/30',
          icon: 'ℹ️',
        }
    }
  }

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm px-4 sm:px-0 pointer-events-none"
    >
      {toasts.map((t) => {
        const styles = getTypeStyles(t.type)
        return (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-2xl border bg-gradient-to-r ${styles.bg} ${styles.border} p-4 shadow-tactile-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 flex items-start gap-3 select-none`}
          >
            <span className="text-lg flex-shrink-0 mt-0.5">{styles.icon}</span>
            <div className="flex-1 min-w-0">
              {t.title && (
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${styles.badge}`}
                  >
                    {t.title}
                  </span>
                </div>
              )}
              <p className="text-xs text-w-text font-medium leading-relaxed break-words">
                {t.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-w-text-3 hover:text-w-text p-1 rounded-lg hover:bg-w-border/30 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-w-orange"
              aria-label="Close notification"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}
