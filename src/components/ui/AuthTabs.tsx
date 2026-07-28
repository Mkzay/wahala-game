interface AuthTabsProps {
  activeTab: 'signin' | 'signup'
  onChange: (tab: 'signin' | 'signup') => void
}

export function AuthTabs({ activeTab, onChange }: AuthTabsProps) {
  return (
    <section className="rounded-xl border border-w-border bg-w-surface p-1">
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => onChange('signin')}
          className={`rounded-lg px-3 py-2 font-display text-sm font-bold ${
            activeTab === 'signin' ? 'bg-w-orange text-w-text' : 'text-w-text-2'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => onChange('signup')}
          className={`rounded-lg px-3 py-2 font-display text-sm font-bold ${
            activeTab === 'signup' ? 'bg-w-orange text-w-text' : 'text-w-text-2'
          }`}
        >
          Sign up
        </button>
      </div>
    </section>
  )
}
