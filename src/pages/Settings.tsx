import { useState } from 'react'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'

type SettingKey =
  | 'turnTimer'
  | 'soundEffects'
  | 'music'
  | 'invites'
  | 'roundResults'
  | 'friendActivity'
  | 'publicProfile'
  | 'onlineStatus'

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'gameplay' | 'audio' | 'social'>('gameplay')
  const [settings, setSettings] = useState({
    turnTimer: false,
    soundEffects: true,
    music: true,
    invites: true,
    roundResults: false,
    friendActivity: true,
    publicProfile: true,
    onlineStatus: true,
  })

  const toggle = (key: SettingKey) => {
    setSettings((value) => ({ ...value, [key]: !value[key] }))
  }

  const gameplaySettings = [
    { key: 'turnTimer' as const, label: '20s Turn Timer', desc: 'Enforce strict 20-second turn timeouts during gameplay.' },
    { key: 'roundResults' as const, label: 'Auto-Progress Rounds', desc: 'Instantly load next round lobby without showing detailed scores.' },
  ]

  const audioSettings = [
    { key: 'soundEffects' as const, label: 'Sound Effects (SFX)', desc: 'Play tactile audio clips on card plays and ability triggers.' },
    { key: 'music' as const, label: 'Background Music', desc: 'Play ambient Afrobeat instrumentals during game rounds.' },
  ]

  const socialSettings = [
    { key: 'invites' as const, label: 'Allow Game Invites', desc: 'Let players send you direct room invite codes.' },
    { key: 'friendActivity' as const, label: 'Share Activity Status', desc: 'Broadcast match victories and rank ups to friend feeds.' },
    { key: 'publicProfile' as const, label: 'Public Leaderboard Profiling', desc: 'List your stats and trophy room on the public directory.' },
    { key: 'onlineStatus' as const, label: 'Show Online Indicator', desc: 'Show active green dot presence tag on lobbies.' },
  ]

  const getVisibleSettings = () => {
    switch (activeTab) {
      case 'gameplay':
        return gameplaySettings
      case 'audio':
        return audioSettings
      case 'social':
        return socialSettings
    }
  }

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between select-none">
      {/* Desktop & Mobile Header Navigation */}
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 lg:pb-8 flex flex-col gap-6">
        
        {/* Header Hero Banner */}
        <header className="rounded-3xl border border-w-border bg-gradient-to-r from-w-surface via-w-bg to-w-surface p-6 shadow-tactile-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-display font-black uppercase tracking-widest text-w-orange bg-w-orange/10 border border-w-orange/30 px-3 py-1 rounded-full">
              Client Control Panel ⚙️
            </span>
            <h1 className="mt-2 font-display text-2xl sm:text-4xl font-black text-w-text">
              Preferences & <span className="text-w-orange">Settings</span>
            </h1>
            <p className="text-xs sm:text-sm text-w-text-2 mt-1">
              Customize gameplay timers, Afrobeat audio SFX, and social matchmaking privacy.
            </p>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <span className="text-xs font-display font-bold text-w-success bg-w-success/10 border border-w-success/30 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
              <span>✓</span> Auto-saved to Cloud
            </span>
          </div>
        </header>

        {/* Widescreen Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Account profile summary & categories (occupies 4 cols) */}
          <section className="col-span-1 lg:col-span-4 flex flex-col gap-5">
            
            {/* User Profile Card */}
            <article className="rounded-3xl border border-w-border bg-gradient-to-br from-w-surface to-w-surface-2 p-5 shadow-tactile-md flex flex-col gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl border-2 border-w-orange bg-w-bg flex items-center justify-center font-display text-base font-black text-w-orange shadow-tactile-sm">
                  MK
                </div>
                <div>
                  <h2 className="font-display text-base font-black text-w-text">Mkzay</h2>
                  <p className="text-xs text-w-text-2 mt-0.5">mkzay@gmail.com</p>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-w-border/50 pt-3 text-xs text-w-text-2">
                <span className="font-medium">Account Tier:</span>
                <span className="font-display font-black text-[10px] uppercase tracking-wider text-w-orange bg-w-orange/10 px-2.5 py-1 rounded-full border border-w-orange/30">
                  PREMIUM MEMBER
                </span>
              </div>
            </article>

            {/* Category selection tabs */}
            <nav className="grid grid-cols-3 lg:flex lg:flex-col gap-2">
              {[
                {
                  id: 'gameplay',
                  label: 'Gameplay',
                  fullLabel: 'Gameplay Preferences',
                  icon: (
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 1c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5-1.5z" />
                    </svg>
                  ),
                },
                {
                  id: 'audio',
                  label: 'Audio',
                  fullLabel: 'Audio & SFX',
                  icon: (
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  ),
                },
                {
                  id: 'social',
                  label: 'Privacy',
                  fullLabel: 'Privacy & Social',
                  icon: (
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                    </svg>
                  ),
                },
              ].map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`rounded-2xl border px-4 py-3.5 text-xs font-display font-black transition-[colors,border-color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange flex items-center justify-center lg:justify-start gap-2.5 ${
                      isActive
                        ? 'border-w-orange bg-w-orange/10 text-w-orange shadow-tactile-sm'
                        : 'border-w-border bg-w-surface text-w-text-2 hover:text-w-text hover:border-w-orange/40'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden lg:inline">{tab.fullLabel}</span>
                    <span className="lg:hidden">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </section>

          {/* Right Column: Active controls list (occupies 8 cols) */}
          <section className="col-span-1 lg:col-span-8 rounded-3xl border border-w-border bg-w-surface p-6 sm:p-8 shadow-tactile-md flex flex-col gap-4">
            <h3 className="font-display text-xs font-black uppercase tracking-wider text-w-text-2 border-b border-w-border/60 pb-3 mb-2">
              {activeTab === 'gameplay' ? 'Gameplay Preferences' : activeTab === 'audio' ? 'Audio & SFX Controls' : 'Privacy & Matchmaking Controls'}
            </h3>

            <div className="space-y-4">
              {getVisibleSettings().map((item) => {
                const checked = settings[item.key]
                return (
                  <article
                    key={item.key}
                    onClick={() => toggle(item.key)}
                    className="cursor-pointer rounded-2xl border border-w-border/60 bg-w-bg p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-w-orange/40 transition-[colors,border-color]"
                  >
                    <div className="flex flex-col gap-1">
                      <h4 className="font-display text-xs sm:text-sm font-black text-w-text">
                        {item.label}
                      </h4>
                      <p className="text-xs text-w-text-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={checked}
                      aria-label={`Toggle ${item.label}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggle(item.key)
                      }}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-[colors,box-shadow] duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange ${
                        checked ? 'bg-w-orange' : 'bg-w-surface-2'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-w-text shadow ring-0 transition duration-200 ease-in-out ${
                          checked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </article>
                )
              })}
            </div>
          </section>

        </div>
      </main>

      <footer className="hidden md:block mt-12 text-center text-xs text-w-text-3 border-t border-w-border/30 py-6">
        © 2026 Wahala Entertainment. Preferences & Settings.
      </footer>
    </div>
  )
}
