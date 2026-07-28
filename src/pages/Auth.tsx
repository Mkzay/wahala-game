import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useGameStore } from '../store/gameStore'
import { useAuth } from '../hooks/useAuth'

type AuthTab = 'signin' | 'signup'

export default function Auth() {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin')
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const setCanAccessGame = useGameStore((state) => state.setCanAccessGame)
  const { loginWithPassword, signupWithEmail } = useAuth()

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePreview = () => {
    login({
      id: 'preview-user',
      username: 'Mkzay',
      email: 'mkzay@gmail.com',
    })
    setCanAccessGame(true)
    navigate('/home')
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsLoading(true)

    try {
      if (activeTab === 'signin') {
        if (!email || !password) {
          throw new Error('Email and password are required.')
        }
        await loginWithPassword(email, password)
      } else {
        if (!username || !email || !password) {
          throw new Error('All fields are required.')
        }
        await signupWithEmail(username, email, password)
      }
      setCanAccessGame(true)
      navigate('/home')
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'An error occurred during authentication.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text grid grid-cols-1 lg:grid-cols-12">
      
      {/* Left Column: Brand Showcase (Laptop/Desktop only - occupies 7 cols) */}
      <section className="hidden lg:flex lg:col-span-7 bg-[radial-gradient(circle_at_center,_#FFFDF8_0%,_#F8F4EC_100%)] border-r border-w-border relative flex-col justify-between p-12 overflow-hidden select-none">
        {/* Floating grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(45,34,28,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(45,34,28,0.015)_1px,_transparent_1px)] bg-[size:30px_30px]" />
        
        {/* Floating cards decoration */}
        <div className="absolute top-1/4 right-10 opacity-60 transform rotate-12 scale-110 pointer-events-none">
          <div className="w-28 h-40 border-2 border-w-warrior/40 rounded-xl bg-gradient-to-br from-w-surface to-w-surface-2 shadow-tactile-md flex flex-col justify-between p-3">
            <span className="font-display font-black text-sm text-w-warrior">J</span>
            <div className="flex-1 flex items-center justify-center text-w-warrior">
              <svg className="h-10 w-10 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
              </svg>
            </div>
            <span className="font-display font-black text-sm text-w-warrior transform rotate-180">J</span>
          </div>
        </div>

        <div className="absolute bottom-1/4 left-10 opacity-60 transform -rotate-12 scale-90 pointer-events-none">
          <div className="w-24 h-36 border-2 border-w-support/40 rounded-xl bg-gradient-to-br from-w-surface to-w-surface-2 shadow-tactile-md flex flex-col justify-between p-3">
            <span className="font-display font-black text-xs text-w-support">W</span>
            <div className="flex-1 flex items-center justify-center text-w-support">
              <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12V17L12 22L22 17V12C22 6.48 17.52 2 12 2ZM12 19.8L5.5 16.6V12.8L12 15.6L18.5 12.8V16.6L12 19.8Z" />
              </svg>
            </div>
            <span className="font-display font-black text-xs text-w-support transform rotate-180">W</span>
          </div>
        </div>

        {/* Top Info */}
        <div className="relative flex items-center gap-2">
          <span className="font-display text-lg font-black tracking-widest text-w-orange">WAHALA</span>
          <span className="h-4 w-px bg-w-border" />
          <span className="text-[9px] uppercase font-bold text-w-text-3 tracking-widest">Naija Whot Unleashed</span>
        </div>

        {/* Core Hero Content */}
        <div className="relative max-w-lg my-auto">
          <span className="text-xs font-display font-bold uppercase tracking-widest text-w-orange block">
            The Rules Have Changed
          </span>
          <h1 className="mt-2 font-display text-4xl xl:text-5xl font-black leading-tight">
            Every round,<br />
            <span className="text-w-orange">new</span> <span className="text-w-yellow">trouble.</span>
          </h1>
          <p className="mt-4 text-sm text-w-text-2 leading-relaxed">
            Wahala is a real-time multiplayer card game reimagining the classic Naija Whot with active character classes, stackable abilities, and dynamic round rules. Play as a Warrior, Support, Trickster, Mystic, Royal, or Rogue and dominate the table.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-w-border bg-w-surface/50 backdrop-blur-sm">
              <h4 className="font-display text-xs font-bold text-w-trickster uppercase">6 Character Classes</h4>
              <p className="text-[11px] text-w-text-2 mt-1">Unique passive buffs and game-changing active moves.</p>
            </div>
            <div className="p-4 rounded-xl border border-w-border bg-w-surface/50 backdrop-blur-sm">
              <h4 className="font-display text-xs font-bold text-w-warrior uppercase">Dynamic Board Rules</h4>
              <p className="text-[11px] text-w-text-2 mt-1">Trigger events to alter gameplay limits on the fly.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative text-xs text-w-text-3 font-medium">
          © 2026 Wahala Entertainment. Created for next-gen card gaming.
        </div>
      </section>

      {/* Right Column: Form Panel (cols 5 on desktop) */}
      <section className="col-span-1 lg:col-span-5 flex flex-col justify-center px-6 py-12 lg:p-16 overflow-y-auto h-full">
        <div className="w-full max-w-sm mx-auto">
          
          {/* Header */}
          <header className="mb-6 text-center lg:text-left">
            <h2 className="font-display text-2xl font-black text-w-text">
              {activeTab === 'signin' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-xs text-w-text-2 mt-1">
              {activeTab === 'signin' ? 'Sign in to access your card decks and rooms' : 'Register your profile to begin progression'}
            </p>
          </header>

          {/* Signin / Signup Switcher Tab */}
          <div className="grid grid-cols-2 rounded-xl border border-w-border bg-w-surface p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin')
                setErrorMsg(null)
              }}
              className={`rounded-lg py-2 text-xs font-bold font-display transition-all ${
                activeTab === 'signin' ? 'bg-w-orange text-w-text' : 'text-w-text-2 hover:text-w-text'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup')
                setErrorMsg(null)
              }}
              className={`rounded-lg py-2 text-xs font-bold font-display transition-all ${
                activeTab === 'signup' ? 'bg-w-orange text-w-text' : 'text-w-text-2 hover:text-w-text'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-w-danger/30 bg-w-danger/5 p-3.5 text-xs text-w-danger font-semibold flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form input fields */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <label className="block">
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-w-text-2">
                  Username
                </span>
                <input
                  type="text"
                  placeholder="e.g. Mkzay"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-w-border bg-w-surface px-4 py-3 text-xs outline-none focus:border-w-warrior transition-colors"
                />
              </label>
            )}
            
            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-w-text-2">
                Email Address
              </span>
              <input
                type="email"
                placeholder="e.g. mkzay@gmail.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-w-border bg-w-surface px-4 py-3 text-xs outline-none focus:border-w-warrior transition-colors"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-w-text-2">
                Password
              </span>
              <input
                type="password"
                placeholder="••••••••••••"
                autoComplete={activeTab === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-w-border bg-w-surface px-4 py-3 text-xs outline-none focus:border-w-warrior transition-colors"
              />
            </label>

            {activeTab === 'signin' && (
              <div className="text-right text-[11px] font-semibold text-w-warrior cursor-pointer hover:underline">
                Forgot password?
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-xl bg-w-orange hover:bg-w-orange/95 px-4 py-3.5 font-display text-xs font-bold text-w-text shadow-tactile-md hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-w-text" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                activeTab === 'signin' ? 'Sign In to Account' : 'Create Account'
              )}
            </button>
          </form>

          {/* Social OAuth Dividers */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-w-border" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-w-text-3">or connect with</span>
            <div className="h-px flex-1 bg-w-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-xl border border-w-border bg-w-surface hover:border-w-orange/40 px-3 py-2.5 text-xs font-bold transition-colors"
            >
              Google
            </button>
            <button
              type="button"
              className="rounded-xl border border-w-border bg-w-surface hover:border-w-orange/40 px-3 py-2.5 text-xs font-bold transition-colors"
            >
              Apple
            </button>
          </div>

          {/* Toggle Tab link */}
          <p className="mt-6 text-center text-xs text-w-text-2">
            {activeTab === 'signin' ? "Don’t have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}
              className="font-bold text-w-orange hover:underline"
            >
              {activeTab === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <p className="mt-4 text-center text-[10px] text-w-text-3 leading-normal">
            By logging in, you agree to our Terms of Service and data usage policy.
          </p>

          {/* Demo account bypass */}
          <div className="mt-6 pt-4 border-t border-w-border/30 text-center">
            <button
              type="button"
              onClick={handlePreview}
              className="text-xs text-w-yellow underline font-semibold hover:text-w-yellow/85"
            >
              Skip auth (Preview Home) →
            </button>
          </div>

        </div>
      </section>

    </div>
  )
}
