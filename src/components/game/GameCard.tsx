import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

export type CardSuit = 'circle' | 'triangle' | 'star' | 'cross' | 'square' | 'whot'
export interface CardType { id: string; suit: CardSuit; value: number }

interface GameCardProps extends HTMLAttributes<HTMLDivElement> {
  card: CardType
  isPlayable?: boolean
  isSelected?: boolean
  isShaking?: boolean
  isFlipped?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function CircleSuitGlyph({ size = 42, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="3" />
      <circle cx="24" cy="24" r="13" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" opacity="0.85" />
      <circle cx="24" cy="24" r="7" fill="currentColor" />
    </svg>
  )
}

export function TriangleSuitGlyph({ size = 42, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <polygon points="24,5 44,41 4,41" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="24,17 36,36 12,36" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" opacity="0.85" />
      <circle cx="24" cy="28" r="4" fill="currentColor" />
    </svg>
  )
}

export function CrossSuitGlyph({ size = 42, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M17 4h14v13h13v14H31v13H17V31H4V17h13V4Z" fill="currentColor" opacity="0.95" />
      <circle cx="24" cy="24" r="3.5" fill="#fffdf8" />
    </svg>
  )
}

export function SquareSuitGlyph({ size = 42, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="5" width="38" height="38" rx="5" stroke="currentColor" strokeWidth="3" />
      <rect x="13" y="13" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" opacity="0.85" />
      <rect x="19" y="19" width="10" height="10" rx="1.5" fill="currentColor" />
    </svg>
  )
}

export function StarSuitGlyph({ size = 42, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M24 2l5.2 14.8L45 18.5l-12.2 11.5 3.5 16L24 37.6 11.7 46l3.5-16L3 18.5l15.8-1.7L24 2Z"
        fill="currentColor"
        opacity="0.95"
      />
      <circle cx="24" cy="25" r="4" fill="#fffdf8" />
    </svg>
  )
}

export function WhotSuitGlyph({ size = 42, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 14l6 21h24l6-21-9 8-9-17-9 17-9-8Z"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <circle cx="6" cy="14" r="3" fill="currentColor" />
      <circle cx="24" cy="6" r="3" fill="currentColor" />
      <circle cx="42" cy="14" r="3" fill="currentColor" />
      <path
        d="M16 23l2.8 10 5.2-6.5 5.2 6.5 2.8-10"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export const suitMeta: Record<
  CardSuit,
  { label: string; glyph: (size?: number, className?: string) => ReactNode; color: string; css: string }
> = {
  circle: { label: 'Circle', glyph: (s, c) => <CircleSuitGlyph size={s} className={c} />, color: '#059669', css: 'card-circle' },
  triangle: { label: 'Triangle', glyph: (s, c) => <TriangleSuitGlyph size={s} className={c} />, color: '#0284c7', css: 'card-triangle' },
  cross: { label: 'Cross', glyph: (s, c) => <CrossSuitGlyph size={s} className={c} />, color: '#e11d48', css: 'card-cross' },
  square: { label: 'Square', glyph: (s, c) => <SquareSuitGlyph size={s} className={c} />, color: '#7c3aed', css: 'card-square' },
  star: { label: 'Star', glyph: (s, c) => <StarSuitGlyph size={s} className={c} />, color: '#d97706', css: 'card-star' },
  whot: { label: 'Whot', glyph: (s, c) => <WhotSuitGlyph size={s} className={c} />, color: '#ea580c', css: 'card-whot' },
}

export function getCardActionCaption(suit: CardSuit, value: number): string {
  if (suit === 'whot' || value >= 20) return 'WHOT · WILD'
  if (value === 1) return 'HOLD ON'
  if (value === 2) return 'PICK TWO'
  if (value === 5) return 'PICK THREE'
  if (value === 8) return 'SUSPENSION'
  if (value === 14) return 'GEN MARKET'
  return `REALM ${String(value).padStart(2, '0')}`
}

export function GameCard({
  card,
  isPlayable = true,
  isSelected = false,
  isShaking = false,
  isFlipped = false,
  size = 'md',
  className = '',
  onClick,
  ...props
}: GameCardProps) {
  const meta = suitMeta[card.suit] ?? suitMeta.whot
  const valueLabel = card.suit === 'whot' || card.value >= 20 ? 'W' : String(card.value)
  const sizeClass = { sm: 'game-card-sm', md: 'game-card-md', lg: 'game-card-lg' }[size]
  const glyphSize = { sm: 26, md: 44, lg: 58 }[size]
  const cornerIconSize = { sm: 10, md: 12, lg: 15 }[size]
  const actionCaption = getCardActionCaption(card.suit, card.value)

  if (isFlipped) {
    return (
      <div
        className={`game-card game-card-back ${sizeClass} ${className}`}
        aria-label="Face-down market card"
        {...props}
      >
        <div className="card-back-sigil">
          <span>W</span>
        </div>
        <div className="card-back-label">WAHALA</div>
        <div className="card-back-corner">✦</div>
      </div>
    )
  }

  return (
    <div
      role="img"
      tabIndex={isPlayable ? 0 : -1}
      aria-label={`${meta.label} ${card.value}`}
      className={`game-card ${meta.css} ${sizeClass} ${isPlayable ? 'is-playable' : 'is-not-playable'} ${
        isSelected ? 'is-selected' : ''
      } ${isShaking ? 'animate-nod-shake' : ''} ${className}`}
      style={{ '--suit-color': meta.color } as CSSProperties}
      onClick={(event) => {
        if (!isPlayable) {
          const target = event.currentTarget
          target.classList.remove('animate-nod-shake')
          void target.offsetWidth
          target.classList.add('animate-nod-shake')
          window.setTimeout(() => target.classList.remove('animate-nod-shake'), 450)
          return
        }
        onClick?.(event)
      }}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && isPlayable) {
          event.preventDefault()
          onClick?.(event as any)
        }
      }}
      {...props}
    >
      <div className="card-corner card-corner-top">
        <strong>{valueLabel}</strong>
        <span>{meta.glyph(cornerIconSize)}</span>
      </div>

      <div className="card-art">
        <div className="card-art-halo" />
        <span className="card-glyph">{meta.glyph(glyphSize)}</span>
        <span className="card-suit-name">{meta.label}</span>
      </div>

      <div className="card-caption">
        {actionCaption}
      </div>

      <div className="card-corner card-corner-bottom">
        <strong>{valueLabel}</strong>
        <span>{meta.glyph(cornerIconSize)}</span>
      </div>
    </div>
  )
}
