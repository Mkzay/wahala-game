import { useToastStore, type ToastState } from '../../store/toastStore'
import type { ToastMessage } from '../../types/toast'
import type { ToastType } from '../../types/toast'

export function ToastContainer() {
  const toasts = useToastStore((state: ToastState) => state.toasts)
  const removeToast = useToastStore((state: ToastState) => state.removeToast)

  if (toasts.length === 0) {
    return null
  }

  const getTypeStyles = (type: ToastType) => {
    switch (type) {
      case 'error':
        return {
          border: 'border-red-500/70',
          bg: 'bg-[#0f1917]/95',
          glow: 'shadow-[0_12px_32px_rgba(0,0,0,0.55),0_0_20px_rgba(239,68,68,0.2)]',
          badge: 'bg-red-500/20 text-red-400 border-red-500/40',
          iconColor: 'text-red-400',
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          ),
        }
      case 'success':
        return {
          border: 'border-emerald-500/70',
          bg: 'bg-[#0f1917]/95',
          glow: 'shadow-[0_12px_32px_rgba(0,0,0,0.55),0_0_20px_rgba(16,185,129,0.2)]',
          badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          iconColor: 'text-emerald-400',
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ),
        }
      case 'warning':
        return {
          border: 'border-[#e8ab32]/80',
          bg: 'bg-[#0f1917]/95',
          glow: 'shadow-[0_12px_32px_rgba(0,0,0,0.55),0_0_20px_rgba(232,171,50,0.2)]',
          badge: 'bg-[#e8ab32]/20 text-[#f5c35b] border-[#e8ab32]/40',
          iconColor: 'text-[#f5c35b]',
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ),
        }
      case 'wahala':
        return {
          border: 'border-w-orange/90',
          bg: 'bg-[#0f1917]/95',
          glow: 'shadow-[0_12px_32px_rgba(0,0,0,0.55),0_0_24px_rgba(234,88,12,0.3)]',
          badge: 'bg-w-orange/20 text-w-orange border-w-orange/50 font-black',
          iconColor: 'text-w-orange',
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          ),
        }
      case 'info':
      default:
        return {
          border: 'border-w-cyan/70',
          bg: 'bg-[#0f1917]/95',
          glow: 'shadow-[0_12px_32px_rgba(0,0,0,0.55),0_0_20px_rgba(8,127,122,0.2)]',
          badge: 'bg-w-cyan/20 text-w-cyan border-w-cyan/40',
          iconColor: 'text-w-cyan',
          icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          ),
        }
    }
  }

  return (
    <div
      aria-live="polite"
      className="fixed top-5 right-5 z-50 flex flex-col gap-3 w-full max-w-sm px-4 sm:px-0 pointer-events-none"
    >
      {toasts.map((t: ToastMessage) => {
        const styles = getTypeStyles(t.type)
        return (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-2xl border-2 ${styles.border} ${styles.bg} ${styles.glow} p-4 backdrop-blur-xl transition-all duration-200 transform translate-y-0 flex items-start gap-3 select-none animate-pop-in`}
          >
            <span className={`flex-shrink-0 mt-0.5 ${styles.iconColor}`}>{styles.icon}</span>
            <div className="flex-1 min-w-0">
              {t.title && (
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-sans font-black uppercase tracking-[0.14em] px-2.5 py-0.5 rounded-full border ${styles.badge}`}
                  >
                    {t.title}
                  </span>
                </div>
              )}
              <p className="text-xs text-[#fffdf8] font-medium leading-relaxed break-words">
                {t.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-[#fffdf8]/60 hover:text-[#fffdf8] p-1 rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-none"
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
