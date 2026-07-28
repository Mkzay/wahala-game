import { useRouteError, useNavigate } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError() as any
  const navigate = useNavigate()

  console.error('Captured Route Error:', error)

  const handleReload = (): void => {
    window.location.reload()
  }

  const handleGoHome = (): void => {
    navigate('/home')
  }

  return (
    <main className="min-h-screen w-full bg-w-bg text-w-text flex items-center justify-center p-6 select-none font-body">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(45,34,28,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(45,34,28,0.015)_1px,_transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
      
      <div className="w-full max-w-md rounded-3xl border border-w-border bg-w-surface p-8 shadow-tactile-lg text-center relative z-10">
        {/* Animated Error Emblem */}
        <div className="mx-auto w-16 h-16 rounded-full bg-w-danger/10 border-2 border-w-danger/25 flex items-center justify-center text-w-danger mb-6 animate-pulse">
          <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>

        {/* Subtitle */}
        <span className="text-[10px] uppercase font-bold tracking-widest text-w-text-3 block mb-1">
          WAHALA ARENA EXCEPTION
        </span>
        
        {/* Title */}
        <h1 className="font-display text-2xl font-black text-w-text">
          Unexpected <span className="text-w-orange">Trouble</span>
        </h1>
        
        {/* Description */}
        <p className="mt-4 text-xs text-w-text-2 leading-relaxed">
          {error?.message || error?.statusText || "We encountered a glitch loading this arena. Let's get you back to the lobby."}
        </p>

        {/* Stack Trace / Technical Details */}
        {(error?.stack || error?.message) && (
          <div className="mt-5 p-3 rounded-xl bg-w-bg border border-w-border/50 text-left max-h-24 overflow-y-auto text-[9px] font-mono text-w-text-2 opacity-85 leading-normal scrollbar-none">
            <span className="font-bold block mb-1 uppercase tracking-wider text-[8px] text-w-text-3">Diagnostic Log:</span>
            {error.stack || error.message}
          </div>
        )}

        {/* Action recovery buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleReload}
            className="w-full rounded-xl bg-w-orange hover:bg-w-orange/95 px-4 py-3 font-display text-xs font-bold text-w-text shadow-tactile-md transition-all active:scale-[0.98]"
          >
            Reload Arena
          </button>
          
          <button
            type="button"
            onClick={handleGoHome}
            className="w-full rounded-xl border border-w-border bg-w-bg hover:border-w-orange/30 px-4 py-3 font-display text-xs font-bold text-w-text-2 transition-all active:scale-[0.98]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  )
}
