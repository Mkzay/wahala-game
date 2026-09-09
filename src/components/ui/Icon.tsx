import type { SVGProps } from 'react'

export type IconName = 'home' | 'rooms' | 'rank' | 'history' | 'book' | 'settings' | 'sun' | 'moon' | 'sound' | 'mute' | 'logout' | 'spark' | 'sword' | 'shield' | 'brain' | 'crown' | 'compass' | 'cards' | 'users' | 'play' | 'plus' | 'search' | 'close' | 'arrow'

interface IconProps extends SVGProps<SVGSVGElement> { name: IconName; size?: number }

const paths: Record<IconName, string> = {
  home: 'M3 10.5 12 3l9 7.5M5.5 9.5V21h13V9.5M9 21v-6h6v6',
  rooms: 'M4 6.5h16v11H4zM8 4v5M16 4v5M8 12h.01M12 12h.01M16 12h.01M8 15.5h.01M12 15.5h.01M16 15.5h.01',
  rank: 'm12 3 2.2 4.45 4.9.7-3.55 3.45.84 4.87L12 14.9l-4.39 2.57.84-4.87L4.9 8.15l4.9-.7L12 3ZM5 21h14M8 18v3M12 16v5M16 18v3',
  history: 'M4 12a8 8 0 1 0 2.35-5.65L4 8.7M4 4v4.7h4.7M12 7v5l3 2',
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16ZM4 5.5v16M8 7h8M8 11h8',
  settings: 'M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6ZM19.4 13.8l1.3 1-.9 1.6-1.6-.6a7.8 7.8 0 0 1-1.4 1.1l.1 1.7h-1.9l-.5-1.6a7.8 7.8 0 0 1-1.8.2l-.9 1.4-1.7-.7.4-1.7a7.5 7.5 0 0 1-1.3-1.3l-1.7.3-.7-1.7 1.5-.9a7.8 7.8 0 0 1-.1-1.8l-1.4-.9.7-1.7 1.7.4c.4-.5.8-.9 1.3-1.2l-.2-1.7 1.8-.6.8 1.5c.6-.1 1.2-.1 1.8 0l.9-1.4 1.7.8-.4 1.6c.5.4.9.8 1.3 1.3l1.7-.3.6 1.8-1.5.8c.1.6.1 1.2.1 1.8Z',
  sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.64 5.64 4.22 4.22M19.78 19.78l-1.42-1.42M18.36 5.64l1.42-1.42M4.22 19.78l1.42-1.42M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z',
  moon: 'M20 15.4A8.5 8.5 0 0 1 8.6 4a8.5 8.5 0 1 0 11.4 11.4Z',
  sound: 'M4 10v4h3l4 3V7l-4 3H4ZM15 9.5a4 4 0 0 1 0 5M17.5 7a7.5 7.5 0 0 1 0 10',
  mute: 'M4 10v4h3l4 3V7l-4 3H4ZM16 10l4 4M20 10l-4 4',
  logout: 'M10 5H4v14h6M14 8l4 4-4 4M18 12H8',
  spark: 'm12 2 1.4 6.6L20 10l-6.6 1.4L12 18l-1.4-6.6L4 10l6.6-1.4L12 2ZM19 16l.6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z',
  sword: 'm5 19 9.5-9.5M12 5l7 7M14 3l7 7-2 2-7-7 2-2ZM4 20l1-4 3 3-4 1Z',
  shield: 'M12 3 19 6v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3ZM9 12l2 2 4-4',
  brain: 'M9 5.5A3.5 3.5 0 0 0 6 9a3 3 0 0 0 0 6 3.5 3.5 0 0 0 3 3.5M15 5.5A3.5 3.5 0 0 1 18 9a3 3 0 0 1 0 6 3.5 3.5 0 0 1-3 3.5M9 5.5V19M15 5.5V19M9 10h6M9 14h6',
  crown: 'm3 7 4 4 5-7 5 7 4-4-1 13H4L3 7ZM5 21h14',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.5 5.5-2 5.5-5.5 2 2-5.5 5.5-2Z',
  cards: 'M6 4h12v16H6zM3 7h3M18 7h3M9 8h6M9 12h6M9 16h3',
  users: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 10a2.5 2.5 0 1 0 0-5M3 19a5 5 0 0 1 10 0M15 14a4 4 0 0 1 6 3',
  play: 'M8 5v14l11-7L8 5Z',
  plus: 'M12 5v14M5 12h14',
  search: 'm20 20-4.3-4.3M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z',
  close: 'm6 6 12 12M18 6 6 18',
  arrow: 'M5 12h14M13 6l6 6-6 6',
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>
}
