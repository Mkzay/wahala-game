import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { isSoundEnabled, setSoundEnabled } from '../../lib/sound'
import { Icon, type IconName } from './Icon'

const navItems: Array<{ label: string; path: string; icon: IconName }> = [
  { label: 'Dashboard', path: '/home', icon: 'home' },
  { label: 'Room Browser', path: '/rooms', icon: 'rooms' },
  { label: 'Leaderboard', path: '/leaderboard', icon: 'rank' },
  { label: 'Match History', path: '/history', icon: 'history' },
  { label: 'Rulebook', path: '/rulebook', icon: 'book' },
]

const mobileNavItems: Array<{ label: string; path: string; icon: IconName }> = [
  { label: 'Home', path: '/home', icon: 'home' },
  { label: 'Rooms', path: '/rooms', icon: 'rooms' },
  { label: 'Ranks', path: '/leaderboard', icon: 'rank' },
  { label: 'History', path: '/history', icon: 'history' },
  { label: 'Rules', path: '/rulebook', icon: 'book' },
]

export function DashboardNavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled())
  const isSettings = location.pathname === '/settings'
  const handleLogout = () => { logout(); navigate('/auth') }
  const toggleSound = () => { const next = !soundOn; setSoundOn(next); setSoundEnabled(next) }

  return <>
    <header className="sticky top-0 z-40 w-full border-b-2 border-[#e8ab32]/30 bg-[#061c17]/95 backdrop-blur-2xl shadow-[0_6px_20px_rgba(0,0,0,0.4)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/home" className="group flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-cyan">
          <span className="icon-tile h-11 w-11 rounded-[15px] border-[#743d2c] bg-gradient-to-br from-[#edb129] via-w-orange-2 to-w-orange text-[#fff8df] shadow-[0_5px_0_#743d2c,0_12px_22px_rgba(120,65,35,.2)] transition-transform group-hover:rotate-6"><Icon name="spark" size={23} strokeWidth={2.6} /></span>
          <span className="flex flex-col"><span className="font-display text-xl font-black tracking-[.06em] leading-none text-w-text group-hover:text-w-orange transition-colors">WAHALA<span className="text-w-orange">!</span></span><span className="mt-1 text-[8px] font-extrabold uppercase tracking-[.16em] text-w-text-3">The social card game</span></span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl border border-[#e8ab32]/25 bg-[#09251f]/80 p-1.5 lg:flex">
          {navItems.map((item) => { const active = location.pathname === item.path; return <Link key={item.path} to={item.path} className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-extrabold transition ${active ? 'bg-w-orange text-[#fff9ea] shadow-[0_4px_0_#a43f2d]' : 'text-[#ebd9b7]/80 hover:bg-[#11382f] hover:text-[#fffdf8]'}`}><Icon name={item.icon} size={16} /><span>{item.label}</span></Link> })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/spectate"
            title="Watch Live Match"
            aria-label="Watch Live Match"
            className="flex items-center gap-1.5 rounded-xl border border-[#38bdf8]/50 bg-[#0c4a6e]/40 px-3 py-1.5 text-xs font-black text-[#38bdf8] shadow-tactile-sm transition hover:scale-105 hover:border-[#38bdf8]"
          >
            <span className="h-2 w-2 rounded-full bg-[#38bdf8] animate-ping" />
            <span>Watch Live</span>
          </Link>
          <button type="button" onClick={toggleSound} title={soundOn ? 'Mute game sounds' : 'Enable game sounds'} aria-label={soundOn ? 'Mute game sounds' : 'Enable game sounds'} className="icon-tile hidden h-9 w-9 rounded-xl text-w-cyan transition hover:-translate-y-0.5 hover:border-w-cyan sm:grid"><Icon name={soundOn ? 'sound' : 'mute'} size={17} /></button>
          <Link to="/settings" title="Settings" aria-label="Settings" className={`icon-tile h-9 w-9 rounded-xl transition hover:-translate-y-0.5 ${isSettings ? 'border-w-orange text-w-orange' : 'text-w-text-2 hover:border-w-orange hover:text-w-orange'}`}><Icon name="settings" size={17} /></Link>
          <Link to="/profile/preview-user" className="grid h-9 w-9 place-items-center rounded-xl border border-w-orange/60 bg-w-orange/15 font-display text-xs font-black text-w-orange transition hover:rotate-3">{(user?.username || 'P').slice(0, 2).toUpperCase()}</Link>
          <button type="button" onClick={handleLogout} title="Log out" aria-label="Log out" className="icon-tile hidden h-9 w-9 rounded-xl text-w-text-3 transition hover:border-w-danger hover:text-w-danger lg:grid"><Icon name="logout" size={17} /></button>
        </div>
      </div>
    </header>

    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-[#e8ab32]/30 bg-[#061c17]/95 px-2 py-2 backdrop-blur-2xl lg:hidden"><div className="mx-auto flex max-w-md items-center justify-around">{mobileNavItems.map((item) => { const active = location.pathname === item.path; return <Link key={item.path} to={item.path} className={`flex min-w-12 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[9px] font-extrabold transition ${active ? 'bg-w-orange text-[#fff9ea] shadow-[0_3px_0_#a43f2d]' : 'text-w-text-3'}`}><Icon name={item.icon} size={19} /><span>{item.label}</span></Link> })}<button type="button" onClick={handleLogout} className="flex min-w-12 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[9px] font-extrabold text-w-text-3"><Icon name="logout" size={19} /><span>Logout</span></button></div></nav>
  </>
}
