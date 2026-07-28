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
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between">
      {/* Desktop & Mobile Header Navigation */}
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-24 lg:pb-8 sm:px-6 lg:px-8 flex flex-col gap-6">
        <header className="flex flex-col border-b border-w-border/80 pb-4">
          <span className="text-xs font-display font-bold uppercase tracking-widest text-w-orange">
            Client Settings
          </span>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-black text-w-text">
            Account & <span className="text-w-orange">Preferences</span>
          </h1>
        </header>

        {/* Widescreen Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Account profile summary & categories (occupies 4 cols) */}
          <section className="col-span-1 lg:col-span-4 flex flex-col gap-5">
            
            {/* User Profile Card */}
            <article className="rounded-2xl border border-w-border bg-gradient-to-br from-w-surface to-w-surface-2 p-5 shadow-tactile-sm flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full border-2 border-w-orange bg-w-bg flex items-center justify-center font-display text-base font-black text-w-orange shadow-tactile-sm">
                  MK
                </div>
                <div>
                  <h2 className="font-display text-base font-black text-w-text">Mkzay</h2>
                  <p className="text-xs text-w-text-2 mt-0.5">mkzay@gmail.com</p>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-w-border/50 pt-3 text-xs text-w-text-2">
                <span>Account Tier:</span>
                <span className="font-display font-black text-[11px] uppercase tracking-wider text-w-orange bg-w-orange/10 px-2.5 py-1 rounded-md border border-w-orange/20">
                  PREMIUM MEMBER
                </span>
              </div>
            </article>

            {/* Category selection tabs - Grid on mobile, vertical stack on lg */}
            <nav className="grid grid-cols-3 lg:flex lg:flex-col gap-2">
              {[
                {
                  id: 'gameplay',
                  label: 'Gameplay',
                  fullLabel: 'Gameplay Preferences',
                  icon: (
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 1c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    </svg>
                  ),
                },
                {
                  id: 'audio',
                  label: 'Audio',
                  fullLabel: 'Audio & Soundtrack',
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
                    className={`rounded-xl border px-3 py-3 text-xs font-display font-bold transition-all flex items-center justify-center lg:justify-start gap-2.5 ${
                      isActive
                        ? 'border-w-orange bg-w-orange/10 text-w-orange shadow-tactile-sm scale-[1.01]'
                        : 'border-w-border bg-w-surface text-w-text-2 hover:bg-w-surface-2 hover:text-w-text'
                    }`}
                  >
                    <span className={isActive ? 'text-w-orange' : 'text-w-text-3'}>{tab.icon}</span>
                    <span className="hidden sm:inline lg:inline">{tab.fullLabel}</span>
                    <span className="sm:hidden lg:hidden">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </section>

          {/* Right Column: Settings control panel (occupies 8 cols) */}
          <section className="col-span-1 lg:col-span-8 rounded-2xl border border-w-border bg-w-surface p-5 sm:p-6 shadow-tactile-sm flex flex-col gap-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-w-orange border-b border-w-border/60 pb-3">
              {activeTab === 'gameplay' ? 'Gameplay Rules' : activeTab === 'audio' ? 'Volume Preferences' : 'Visibility Parameters'}
            </h3>

            {/* List of toggle cards */}
            <div className="space-y-3">
              {getVisibleSettings().map((stat) => {
                const isChecked = settings[stat.key]
                return (
                  <article
                    key={stat.key}
                    className="flex items-center justify-between gap-4 rounded-xl border border-w-border bg-w-bg/60 p-4 transition-all hover:border-w-orange/40 hover:bg-w-surface"
                  >
                    <div className="flex flex-col gap-1 pr-2">
                      <span className="text-xs font-display font-bold text-w-text">
                        {stat.label}
                      </span>
                      <span className="text-[11px] text-w-text-2 leading-relaxed">
                        {stat.desc}
                      </span>
                    </div>

                    {/* Premium Sliding Switch Toggle */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isChecked}
                      onClick={() => toggle(stat.key)}
                      className={`h-6 w-11 rounded-full border flex items-center p-[2px] transition-colors duration-200 focus:outline-none flex-shrink-0 cursor-pointer ${
                        isChecked ? 'border-w-orange bg-w-orange' : 'border-w-border bg-w-surface-2'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-w-surface shadow transition-transform duration-200 transform ${
                          isChecked ? 'translate-x-5' : 'translate-x-0'
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
        © 2026 Wahala Entertainment. Client Preferences.
      </footer>
    </div>
  )
}
