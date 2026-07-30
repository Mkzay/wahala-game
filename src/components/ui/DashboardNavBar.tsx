import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export function DashboardNavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const navItems = [
    { label: 'Dashboard', path: '/home', icon: '🏠' },
    { label: 'Room Browser', path: '/rooms', icon: '⚔️' },
    { label: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
    { label: 'Match History', path: '/history', icon: '📜' },
    { label: 'Rulebook', path: '/rulebook', icon: '📖' },
  ]

  const mobileNavItems = [
    {
      label: 'Home',
      path: '/home',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
    },
    {
      label: 'Rooms',
      path: '/rooms',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 1c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      ),
    },
    {
      label: 'Ranks',
      path: '/leaderboard',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H8v2h8v-2h-3v-2.1c2.12-.39 3.79-2.07 4.39-4.39C19.08 11.21 21 9.13 21 6.5V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
        </svg>
      ),
    },
    {
      label: 'History',
      path: '/history',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
        </svg>
      ),
    },
    {
      label: 'Rules',
      path: '/rulebook',
      icon: (
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
        </svg>
      ),
    },
  ]

  const isSettings = currentPath === '/settings'

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <>
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-w-border/80 bg-w-surface/90 backdrop-blur-xl shadow-tactile-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          
          {/* Brand Logo & Version Pill */}
          <div className="flex items-center gap-3">
            <Link to="/home" className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange rounded-xl">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-w-orange to-w-yellow flex items-center justify-center font-display text-lg font-black text-w-surface shadow-tactile-sm group-hover:scale-105 transition-transform">
                ⚡
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl sm:text-2xl font-black tracking-widest text-w-orange leading-none group-hover:text-w-yellow transition-colors">
                  WAHALA
                </span>
                <span className="text-[9px] font-bold text-w-text-3 uppercase tracking-widest mt-0.5">
                  Whot Battles v1.0
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Web App Navigation Links */}
          <nav className="hidden items-center gap-1.5 lg:flex bg-w-bg/80 border border-w-border/60 p-1.5 rounded-2xl shadow-inner">
            {navItems.map((item) => {
              const isActive = currentPath === item.path
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`rounded-xl px-4 py-2 text-xs font-display font-bold transition-[colors,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange flex items-center gap-2 ${
                    isActive
                      ? 'border border-w-orange/40 bg-w-orange/10 text-w-orange shadow-tactile-sm'
                      : 'text-w-text-2 hover:bg-w-surface hover:text-w-text'
                  }`}
                >
                  <span className="text-sm select-none">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Desktop Right User Controls */}
          <div className="hidden items-center gap-4 lg:flex">
            {/* Quick Actions / Settings Icon */}
            <Link
              to="/settings"
              title="Settings"
              aria-label="Settings"
              className={`rounded-xl border p-2.5 transition-[colors,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange ${
                isSettings
                  ? 'border-w-orange bg-w-orange/10 text-w-orange shadow-tactile-sm'
                  : 'border-w-border bg-w-surface text-w-text-2 hover:border-w-orange hover:text-w-orange'
              }`}
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6-3.6z" />
              </svg>
            </Link>

            {/* Profile Menu Trigger */}
            <div className="flex items-center gap-3 border-l border-w-border/80 pl-4">
              <Link
                to="/profile/preview-user"
                className="group flex items-center gap-2.5 rounded-2xl border border-w-border bg-w-surface p-1.5 pr-3.5 transition-[border-color,background-color] hover:border-w-orange/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-w-orange font-display text-xs font-black text-w-surface shadow-tactile-sm">
                  {(user?.username || 'P').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-display text-xs font-black text-w-text group-hover:text-w-orange transition-colors">
                    {user?.username || 'Player One'}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-w-orange">The Mastermind</span>
                </div>
              </Link>

              {/* Logout button */}
              <button
                type="button"
                onClick={handleLogout}
                title="Logout"
                aria-label="Log Out"
                className="rounded-xl border border-w-border bg-w-surface p-2.5 text-w-text-3 transition-colors hover:border-w-danger/40 hover:bg-w-danger/10 hover:text-w-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-danger"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile & Tablet Top Quick Bar */}
          <div className="flex items-center gap-2.5 lg:hidden">
            {/* Mobile Settings Icon Link */}
            <Link
              to="/settings"
              title="Settings"
              className={`rounded-full border p-2 transition-colors ${
                isSettings
                  ? 'border-w-orange bg-w-orange/10 text-w-orange'
                  : 'border-w-border bg-w-surface text-w-text-2 hover:text-w-text'
              }`}
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6-3.6z" />
              </svg>
            </Link>

            {/* Mobile Profile Avatar */}
            <Link
              to="/profile/preview-user"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-w-orange font-display text-xs font-bold text-w-text shadow-sm border border-w-orange/40"
            >
              {(user?.username || 'P').slice(0, 2).toUpperCase()}
            </Link>
          </div>

        </div>
      </header>

      {/* Native-style Mobile & Tablet Bottom Dock Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-w-border/80 bg-w-surface/95 backdrop-blur-xl px-2 py-1.5 lg:hidden shadow-[0_-4px_25px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mobileNavItems.map((item) => {
            const isActive = currentPath === item.path
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-w-orange font-bold scale-105'
                    : 'text-w-text-3 hover:text-w-text-2'
                }`}
              >
                <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-w-orange/10' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-display font-semibold mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
