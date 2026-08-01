import { useState } from 'react'
import { useDevLogStore, type DevLogCategory } from '../../store/devLogStore'

export function DevErrorConsole() {
  const {
    logs,
    isOpen,
    activeCategory,
    unreadCount,
    toggleConsole,
    clearLogs,
    setActiveCategory,
  } = useDevLogStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null)

  const filteredLogs = logs.filter((log) => {
    const matchesCategory =
      activeCategory === 'all' || log.category === activeCategory
    const matchesSearch =
      searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.screen.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleCopy = () => {
    const formatted = logs
      .map(
        (l) =>
          `[${l.timestamp}] [${l.category.toUpperCase()}] [${l.screen}] ${l.message}${l.stack ? `\nStack: ${l.stack}` : ''}`
      )
      .join('\n\n')

    navigator.clipboard.writeText(formatted || 'No log entries.')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getCategoryBadge = (cat: DevLogCategory) => {
    switch (cat) {
      case 'error':
        return 'bg-w-danger/20 text-w-danger border-w-danger/40'
      case 'network':
        return 'bg-w-orange/20 text-w-orange border-w-orange/40'
      case 'socket':
        return 'bg-w-yellow/20 text-w-yellow border-w-yellow/40'
      case 'warn':
        return 'bg-w-support/20 text-w-support border-w-support/40'
      case 'unhandled':
        return 'bg-w-trickster/20 text-w-trickster border-w-trickster/40'
      default:
        return 'bg-w-surface-2 text-w-text-3 border-w-border'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none font-sans">
      {/* Minimized Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleConsole}
          aria-label="Toggle Dev Error Console"
          className="relative flex items-center gap-2 rounded-2xl border border-w-border bg-w-surface/95 backdrop-blur-md px-3.5 py-2.5 shadow-tactile-md hover:border-w-orange hover:scale-105 transition-all text-xs font-bold text-w-text"
        >
          <span className="text-base">🐛</span>
          <span className="font-display">Dev Console</span>
          {unreadCount > 0 && (
            <span className="h-5 min-w-5 rounded-full bg-w-danger text-w-bg font-display font-black text-[10px] px-1.5 flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
          {logs.length > 0 && unreadCount === 0 && (
            <span className="text-[10px] font-bold text-w-text-3">({logs.length})</span>
          )}
        </button>
      )}

      {/* Expanded Console Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[440px] md:w-[520px] max-h-[580px] rounded-3xl border border-w-border bg-w-surface/98 backdrop-blur-xl shadow-tactile-lg flex flex-col overflow-hidden text-w-text animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Console Header */}
          <header className="flex items-center justify-between border-b border-w-border bg-w-surface-2/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🐛</span>
              <div>
                <h3 className="font-display text-xs font-black tracking-wider uppercase text-w-text">
                  Dev Error Logger
                </h3>
                <p className="text-[10px] text-w-text-3 font-semibold">
                  Live diagnostics ({logs.length} logged)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-xl border border-w-border bg-w-surface px-2.5 py-1 text-[10px] font-bold text-w-text-2 hover:text-w-text hover:border-w-orange transition-colors"
              >
                {copied ? 'Copied ✓' : 'Copy All'}
              </button>
              <button
                type="button"
                onClick={clearLogs}
                className="rounded-xl border border-w-border bg-w-surface px-2.5 py-1 text-[10px] font-bold text-w-danger hover:bg-w-danger/10 transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={toggleConsole}
                aria-label="Close Dev Error Console"
                className="h-7 w-7 rounded-xl border border-w-border bg-w-surface text-w-text-3 hover:text-w-text hover:border-w-orange transition-colors flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>
          </header>

          {/* Search & Category Filter Tabs */}
          <div className="border-b border-w-border p-2.5 space-y-2 bg-w-bg/40">
            <input
              type="text"
              placeholder="Search error message or screen route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-w-border bg-w-surface px-3 py-1.5 text-xs text-w-text placeholder:text-w-text-3 outline-none focus:border-w-orange transition-colors"
            />

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
              {['all', 'error', 'network', 'socket', 'unhandled', 'warn'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    activeCategory === cat
                      ? 'bg-w-orange text-w-bg shadow-sm'
                      : 'text-w-text-2 hover:text-w-text hover:bg-w-surface-2'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Log Entries Stream */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[380px] bg-w-bg/20">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-w-text-3 border border-dashed border-w-border/60 rounded-2xl">
                <span className="text-xl block mb-1">✨</span>
                No logs recorded for filter.
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id

                return (
                  <article
                    key={log.id}
                    className="rounded-xl border border-w-border bg-w-surface p-3 space-y-1.5 shadow-sm text-xs transition-colors hover:border-w-border/80"
                  >
                    <header className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-md border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${getCategoryBadge(
                            log.category
                          )}`}
                        >
                          {log.category}
                        </span>
                        <span className="text-[10px] font-bold text-w-text-3">
                          {log.screen}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {log.count > 1 && (
                          <span className="rounded-full bg-w-surface-2 px-1.5 py-0.5 text-[9px] font-bold text-w-yellow border border-w-yellow/30">
                            ×{log.count}
                          </span>
                        )}
                        <time className="text-[10px] text-w-text-3 font-mono">
                          {log.timestamp}
                        </time>
                      </div>
                    </header>

                    <p className="font-mono text-[11px] text-w-text leading-relaxed break-words font-semibold">
                      {log.message}
                    </p>

                    {log.stack && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="text-[10px] font-bold text-w-orange hover:underline flex items-center gap-1"
                        >
                          <span>{isExpanded ? '▼ Hide Stack Trace' : '▶ View Stack Trace'}</span>
                        </button>

                        {isExpanded && (
                          <pre className="mt-1.5 rounded-lg border border-w-border bg-w-bg p-2 text-[10px] font-mono text-w-text-2 overflow-x-auto whitespace-pre-wrap break-all max-h-36">
                            {log.stack}
                          </pre>
                        )}
                      </div>
                    )}
                  </article>
                )
              })
            )}
          </div>

          {/* Console Footer */}
          <footer className="border-t border-w-border bg-w-surface-2/60 px-4 py-2 flex items-center justify-between text-[10px] text-w-text-3 font-medium">
            <span>Click logs to view trace. Log cap: 100 entries.</span>
            <span className="font-mono">VITE_API_URL: http://localhost:3001</span>
          </footer>
        </div>
      )}
    </div>
  )
}
