import type { HTMLAttributes } from 'react'

export type CardSuit = 'circle' | 'triangle' | 'star' | 'cross' | 'square' | 'whot'

export interface CardType {
  id: string
  suit: CardSuit
  value: number
}

interface GameCardProps extends HTMLAttributes<HTMLDivElement> {
  card: CardType
  isPlayable?: boolean
  isSelected?: boolean
  isShaking?: boolean
  isFlipped?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function GameCard({
  card,
  isPlayable = true,
  isSelected = false,
  isShaking = false,
  isFlipped = false,
  size = 'md',
  className = '',
  ...props
}: GameCardProps) {
  const { suit, value } = card

  // Styles based on suit
  const getSuitStyles = (suitType: CardSuit) => {
    switch (suitType) {
      case 'circle':
        return {
          border: 'border-w-trickster/40 group-hover:border-w-trickster/80',
          bg: 'bg-gradient-to-br from-w-trickster/15 via-w-surface to-w-surface-2',
          text: 'text-w-trickster',
          shadow: 'shadow-tactile-md',
          glow: 'group-hover:shadow-tactile-lg',
        }
      case 'triangle':
        return {
          border: 'border-w-mystic/40 group-hover:border-w-mystic/80',
          bg: 'bg-gradient-to-br from-w-mystic/15 via-w-surface to-w-surface-2',
          text: 'text-w-mystic',
          shadow: 'shadow-tactile-md',
          glow: 'group-hover:shadow-tactile-lg',
        }
      case 'star':
        return {
          border: 'border-w-warrior/40 group-hover:border-w-warrior/80',
          bg: 'bg-gradient-to-br from-w-warrior/15 via-w-surface to-w-surface-2',
          text: 'text-w-warrior',
          shadow: 'shadow-tactile-md',
          glow: 'group-hover:shadow-tactile-lg',
        }
      case 'cross':
        return {
          border: 'border-w-rogue/40 group-hover:border-w-rogue/80',
          bg: 'bg-gradient-to-br from-w-rogue/15 via-w-surface to-w-surface-2',
          text: 'text-w-rogue',
          shadow: 'shadow-tactile-md',
          glow: 'group-hover:shadow-tactile-lg',
        }
      case 'square':
        return {
          border: 'border-w-royal/40 group-hover:border-w-royal/80',
          bg: 'bg-gradient-to-br from-w-royal/15 via-w-surface to-w-surface-2',
          text: 'text-w-royal',
          shadow: 'shadow-tactile-md',
          glow: 'group-hover:shadow-tactile-lg',
        }
      case 'whot':
        return {
          border: 'border-w-warrior/50 group-hover:border-w-yellow/80',
          bg: 'bg-gradient-to-br from-w-warrior/20 via-w-surface to-w-royal/20',
          text: 'text-transparent bg-clip-text bg-gradient-to-r from-w-warrior via-w-yellow to-w-royal',
          shadow: 'shadow-tactile-lg',
          glow: 'group-hover:shadow-[0_0_20px_rgba(217,108,45,0.25)]',
        }
    }
  }

  const styles = getSuitStyles(suit)

  // Render suit SVG icons
  const renderSuitIcon = (suitType: CardSuit, isMini = false) => {
    const sizeClasses = isMini ? 'h-4 w-4' : 'h-12 w-12 lg:h-16 lg:w-16'
    const colorClass = suitType === 'whot' ? 'stroke-w-orange fill-w-yellow' : 'fill-current'

    switch (suitType) {
      case 'circle':
        return (
          <svg className={`${sizeClasses} ${colorClass}`} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.3" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        )
      case 'triangle':
        return (
          <svg className={`${sizeClasses} ${colorClass}`} viewBox="0 0 24 24">
            <polygon points="12,2 2,22 22,22" stroke="currentColor" strokeWidth="2" fill="none" />
            <polygon points="12,7 6,19 18,19" fill="currentColor" opacity="0.3" />
            <polygon points="12,12 9,18 15,18" fill="currentColor" />
          </svg>
        )
      case 'star':
        return (
          <svg className={`${sizeClasses} ${colorClass}`} viewBox="0 0 24 24">
            <polygon
              points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <polygon
              points="12,6 13.8,10.5 18.5,10.5 14.8,13.5 16,18 12,15.5 8,18 9.2,13.5 5.5,10.5 10.2,10.5"
              fill="currentColor"
              opacity="0.3"
            />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        )
      case 'cross':
        return (
          <svg className={`${sizeClasses} ${colorClass}`} viewBox="0 0 24 24">
            <path
              d="M9,2 H15 V9 H22 V15 H15 V22 H9 V15 H2 V9 H9 Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path d="M11,4 H13 V11 H20 V13 H13 V20 H11 V13 H4 V11 H11 Z" fill="currentColor" opacity="0.3" />
            <rect x="11" y="11" width="2" height="2" fill="currentColor" />
          </svg>
        )
      case 'square':
        return (
          <svg className={`${sizeClasses} ${colorClass}`} viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" opacity="0.3" />
            <rect x="10" y="10" width="4" height="4" fill="currentColor" />
          </svg>
        )
      case 'whot':
        return (
          <svg className={`${sizeClasses} ${colorClass}`} viewBox="0 0 24 24">
            <path
              d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M12,20 C7.59,20 4,16.41 4,12 C4,7.59 7.59,4 12,4 C16.41,4 20,7.59 20,12 C20,16.41 16.41,20 12,20 Z"
              fill="url(#whotGrad)"
            />
            <path
              d="M12,6 L15,10.5 L19.5,12 L15,13.5 L12,18 L9,13.5 L4.5,12 L9,10.5 Z"
              fill="url(#whotGradInner)"
              opacity="0.8"
            />
            <defs>
              <linearGradient id="whotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-orange)" />
                <stop offset="50%" stopColor="var(--color-yellow)" />
                <stop offset="100%" stopColor="#9B59B6" />
              </linearGradient>
              <linearGradient id="whotGradInner" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9B59B6" />
                <stop offset="50%" stopColor="var(--color-orange)" />
                <stop offset="100%" stopColor="var(--color-yellow)" />
              </linearGradient>
            </defs>
          </svg>
        )
    }
  }

  // Dimensions based on size
  const sizeStyles = {
    sm: 'w-16 h-24 text-[10px] p-1.5 rounded-lg border-2',
    md: 'w-24 h-36 lg:w-28 lg:h-40 text-xs p-2.5 rounded-xl border-2',
    lg: 'w-32 h-48 lg:w-36 lg:h-54 text-sm p-4 rounded-2xl border-[3px]',
  }

  // Back of card view
  if (isFlipped) {
    return (
      <div
        className={`group relative flex flex-col justify-between select-none border-2 border-w-orange/50 bg-gradient-to-br from-w-surface-2 via-w-surface to-w-surface-2 shadow-tactile-md ${sizeStyles[size]} ${className}`}
        {...props}
      >
        <div className="absolute inset-1.5 rounded-lg border border-dashed border-w-orange/30 flex flex-col items-center justify-center">
          {/* Ornate back pattern */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-w-orange via-transparent to-transparent scale-150 animate-pulse" />
            <svg className="h-10 w-10 text-w-orange opacity-40 animate-spin" style={{ animationDuration: '20s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="absolute font-display text-[10px] lg:text-xs tracking-widest text-w-orange font-black opacity-30 select-none uppercase">WAHALA</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`group relative flex flex-col justify-between select-none transition-all duration-300 ${
        styles.bg
      } ${styles.border} ${styles.shadow} ${styles.glow} ${sizeStyles[size]} cursor-pointer ${
        isShaking ? 'animate-nod-shake ring-2 ring-w-danger/60' : ''
      } ${
        !isPlayable ? 'cursor-not-allowed' : ''
      } ${
        isSelected
          ? 'border-w-orange ring-2 ring-w-orange/40 shadow-[0_0_25px_rgba(232,80,10,0.4)]'
          : ''
      } ${className}`}
      {...props}
    >
      {/* Top Value and Suit */}
      <div className="flex items-center justify-between">
        <span className="font-display font-black text-sm lg:text-base leading-none text-w-text">
          {suit === 'whot' ? 'W' : value}
        </span>
        <div className={styles.text}>{renderSuitIcon(suit, true)}</div>
      </div>

      {/* Center Ornate Illustration / Suit symbol */}
      <div className={`flex items-center justify-center flex-1 my-2 ${styles.text}`}>
        {renderSuitIcon(suit)}
      </div>

      {/* Bottom Value and Suit (Upside down) */}
      <div className="flex items-center justify-between transform rotate-180">
        <span className="font-display font-black text-sm lg:text-base leading-none text-w-text">
          {suit === 'whot' ? 'W' : value}
        </span>
        <div className={styles.text}>{renderSuitIcon(suit, true)}</div>
      </div>

      {/* Playable Indicator Glow */}
      {isPlayable && !isSelected && (
        <div className="absolute inset-0 rounded-[inherit] border border-w-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </div>
  )
}
