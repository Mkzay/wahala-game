import { useState } from 'react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { useGameSocket } from '../hooks/useGameSocket'
import { useGamePhaseRouting } from '../hooks/useGamePhaseRouting'
import { useGameStore } from '../store/gameStore'
import { useAuthStore } from '../store/authStore'
import { socketService } from '../services/socketService'
import { toast } from '../store/toastStore'
import { playUiSound } from '../lib/sound'
import { useWebMcp } from '../hooks/useWebMcp'

type ClassName = 'The Joker' | 'The Wall' | 'The Striker' | 'The Mastermind'

interface ClassDetail {
  id: ClassName
  shortName: string
  lore: string
  passive: string
  active: string
  activeDesc: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  chaosLevel: number
  primaryColor: string
  accentBorder: string
  glowClass: string
  badgeBg: string
  icon: ReactNode
}

const classIdMap: Record<ClassName, string> = {
  'The Joker': 'joker',
  'The Wall': 'wall',
  'The Striker': 'striker',
  'The Mastermind': 'mastermind',
}

export default function ClassSelection() {
  const { gameId = '' } = useParams()

  useGameSocket({ gameId, enabled: gameId.length > 0 })
  useGamePhaseRouting()
  useWebMcp({ gameId, enabled: gameId.length > 0 })

  const gameState = useGameStore((s) => s.gameState)
  const user = useAuthStore((s) => s.user)

  const myPlayer = gameState?.players?.find((p) => p.userId === user?.id)
  const isSpectator = !myPlayer
  const currentSelected = myPlayer?.class

  const [selected, setSelected] = useState<ClassName | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSelectClass = (id: ClassName) => {
    setSelected(id)
    playUiSound('slide')
  }

  const handleLockIn = () => {
    if (!selected || !gameId) return
    setIsSubmitting(true)
    playUiSound('power')

    const className = classIdMap[selected]
    socketService.emit('round:class:select', { gameId, className })
    toast.success(`Locked in ${selected}! Waiting for other players…`, 'Class Chosen')

    setTimeout(() => setIsSubmitting(false), 2000)
  }

  const classDetails: ClassDetail[] = [
    {
      id: 'The Joker',
      shortName: 'Chaos Trickster',
      lore: 'The agent of sheer unpredictability. Rules warp and twist under their presence.',
      passive: 'Chaos Aura: Global special rules rotate twice as fast.',
      active: 'Chaos Leap',
      activeDesc: 'Instantly swap active card suit to a random shape and force next player to draw.',
      difficulty: 'Medium',
      chaosLevel: 5,
      primaryColor: '#f59e0b',
      accentBorder: 'border-amber-500/60 hover:border-amber-400',
      glowClass: 'shadow-[0_12px_32px_rgba(217,119,6,0.35)] ring-2 ring-amber-400/80',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: (
        <svg className="h-9 w-9 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
        </svg>
      ),
    },
    {
      id: 'The Wall',
      shortName: 'Iron Fortress',
      lore: 'Unmovable defensive bastion. They absorb penalties and redirect trouble back to opponents.',
      passive: 'Fortress: Immune to draw penalties when successfully holding a reaction.',
      active: 'Iron Block',
      activeDesc: 'Cancel incoming card draw penalties and redirect them to the adjacent player.',
      difficulty: 'Easy',
      chaosLevel: 1,
      primaryColor: '#10b981',
      accentBorder: 'border-emerald-500/60 hover:border-emerald-400',
      glowClass: 'shadow-[0_12px_32px_rgba(5,150,105,0.35)] ring-2 ring-emerald-400/80',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: (
        <svg className="h-9 w-9 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12V17L12 22L22 17V12C22 6.48 17.52 2 12 2ZM12 19.8L5.5 16.6V12.8L12 15.6L18.5 12.8V16.6L12 19.8Z" />
        </svg>
      ),
    },
    {
      id: 'The Striker',
      shortName: 'Relentless Blade',
      lore: 'Aggressive card offensive. Rapid blitz of matching numbers to empty hands before opponents blink.',
      passive: 'Fury: Gain 20% bonus score shield for rapid consecutive shape chains.',
      active: 'Double Strike',
      activeDesc: 'Play two cards from your hand in a single burst if they share shape or value.',
      difficulty: 'Hard',
      chaosLevel: 4,
      primaryColor: '#ef4444',
      accentBorder: 'border-red-500/60 hover:border-red-400',
      glowClass: 'shadow-[0_12px_32px_rgba(220,38,38,0.35)] ring-2 ring-red-400/80',
      badgeBg: 'bg-red-500/15 text-red-300 border-red-500/30',
      icon: (
        <svg className="h-9 w-9 fill-current" viewBox="0 0 24 24">
          <path d="M17.5 2C15.5 2 13.7 3.3 12.8 5.2C11.9 3.3 10.1 2 8.1 2C5.3 2 3 4.3 3 7.1C3 11 7 14.5 12.8 20L13.2 20.4L13.6 20C19.4 14.5 23.4 11 23.4 7.1C23.4 4.3 21.1 2 18.3 2H17.5Z" />
        </svg>
      ),
    },
    {
      id: 'The Mastermind',
      shortName: 'Grand Tactician',
      lore: 'Scholar who plays with perfect prescience. Sees deck trajectories before cards arrive on the felt.',
      passive: 'Prescience: Peek at the upcoming draw market cards in real time.',
      active: 'Mind Read',
      activeDesc: "Scout the hand of the player with the lowest card count for 5 seconds.",
      difficulty: 'Medium',
      chaosLevel: 3,
      primaryColor: '#6366f1',
      accentBorder: 'border-indigo-500/60 hover:border-indigo-400',
      glowClass: 'shadow-[0_12px_32px_rgba(79,70,229,0.35)] ring-2 ring-indigo-400/80',
      badgeBg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      icon: (
        <svg className="h-9 w-9 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18Z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="relative min-h-screen w-full felt-table-bg text-[#fffdf8] flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 select-none">
      <div className="table-spotlight absolute inset-0 pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Header section with parlor brass banner */}
        <header className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c48d28]/40 bg-[#071d17]/80 px-4 py-1 shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#e8ab32] shadow-[0_0_6px_#e8ab32]" />
            <span className="font-display text-[11px] font-black uppercase tracking-widest text-[#e8ab32]">
              Round {gameState?.round ?? 1} Setup · Class Doctrine
            </span>
          </div>

          <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-wide text-[#fffdf8]">
            Choose Your <span className="text-[#e8ab32]">Combat Class</span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-[#c2d6ce] leading-relaxed">
            Each archetype dictates passive board advantages and an active tactical power you can release during your turn.
          </p>

          {isSpectator ? (
            <div className="mt-3 flex flex-col items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/40 bg-[#0c4a6e]/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#38bdf8] shadow-tactile-sm">
                <span className="h-2 w-2 rounded-full bg-[#38bdf8] animate-ping" />
                Live Spectator Feed · Watching Contender Draft
              </span>
              <div className="mt-2 w-full max-w-lg rounded-2xl border border-[#38bdf8]/30 bg-[#071d17]/90 p-3 shadow-lg backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#38bdf8] mb-2 text-center">
                  Contender Stance Lock-In Status
                </p>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {gameState?.players?.map((p) => (
                    <div key={p.userId} className="flex items-center justify-between px-3 py-1.5 rounded-xl border border-[#1b3b33] bg-[#041511]/80 text-xs">
                      <span className="font-semibold text-[#fffdf8]">{p.username}</span>
                      <span className={`text-[10px] font-bold ${p.class ? 'text-[#10b981]' : 'text-[#e8ab32] animate-pulse'}`}>
                        {p.class ? `✓ ${p.class.toUpperCase()}` : 'Choosing…'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : currentSelected ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#10b981]/40 bg-[#10b981]/15 px-4 py-1 text-xs font-black text-[#10b981] shadow-sm">
              <span>✓ Confirmed: {currentSelected.toUpperCase()}</span>
            </div>
          ) : null}
        </header>

        {/* 4 Class Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {classDetails.map((details) => {
            const isSelected = selected === details.id || currentSelected === classIdMap[details.id]

            return (
              <button
                key={details.id}
                type="button"
                onClick={() => handleSelectClass(details.id)}
                aria-label={`Select ${details.id} class`}
                className={`relative rounded-3xl border text-left p-5 sm:p-6 flex flex-col justify-between min-h-[380px] group transition-[transform,border-color,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8ab32] active:scale-[0.98] ${
                  isSelected
                    ? `${details.accentBorder} bg-[#08221b]/95 ${details.glowClass} -translate-y-1`
                    : 'border-[#1b3b33] bg-[#071d17]/90 hover:border-[#c48d28]/60 hover:-translate-y-1 shadow-[0_12px_28px_rgba(0,0,0,0.4)]'
                }`}
              >
                {/* Brass decorative corner accents */}
                <div className="pointer-events-none absolute top-2 left-2 h-2.5 w-2.5 border-t-2 border-l-2 border-[#c48d28]/40" />
                <div className="pointer-events-none absolute top-2 right-2 h-2.5 w-2.5 border-t-2 border-r-2 border-[#c48d28]/40" />
                <div className="pointer-events-none absolute bottom-2 left-2 h-2.5 w-2.5 border-b-2 border-l-2 border-[#c48d28]/40" />
                <div className="pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 border-b-2 border-r-2 border-[#c48d28]/40" />

                {/* Header info */}
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className="p-2.5 rounded-2xl bg-[#041511]/80 border border-[#1b3b33] transition-transform duration-200 group-hover:scale-110"
                      style={{ color: details.primaryColor }}
                    >
                      {details.icon}
                    </div>
                    <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full border ${details.badgeBg}`}>
                      {details.difficulty}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-black text-[#fffdf8] tracking-wide">
                    {details.id}
                  </h3>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#e8ab32]">
                    {details.shortName}
                  </p>
                  <p className="mt-2 text-xs text-[#c2d6ce] italic leading-relaxed line-clamp-3">
                    "{details.lore}"
                  </p>
                </div>

                {/* Ability Specs */}
                <div className="mt-6 pt-4 border-t border-[#1b3b33] flex-1 flex flex-col justify-end gap-3 text-xs">
                  <div className="rounded-xl bg-[#041511]/70 p-2.5 border border-[#142e26]">
                    <span className="text-[10px] uppercase font-black tracking-wider text-[#e8ab32] block mb-0.5">
                      Passive Trait
                    </span>
                    <p className="text-[11px] text-[#e6ede8] font-medium leading-snug">{details.passive}</p>
                  </div>

                  <div className="rounded-xl bg-[#041511]/70 p-2.5 border border-[#142e26]">
                    <span
                      className="text-[10px] uppercase font-black tracking-wider block mb-0.5"
                      style={{ color: details.primaryColor }}
                    >
                      Active: {details.active}
                    </span>
                    <p className="text-[11px] text-[#e6ede8] font-medium leading-snug">{details.activeDesc}</p>
                  </div>

                  {/* Chaos Rating Meter */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-[#8ba79e]">
                      Chaos Rating
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <span
                          key={level}
                          className="h-1.5 w-3.5 rounded-sm transition-colors"
                          style={{
                            backgroundColor: level <= details.chaosLevel ? details.primaryColor : '#1b3b33',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selection Indicator badge */}
                {isSelected && (
                  <div className="mt-3 text-center py-1 bg-[#10b981]/15 border border-[#10b981]/40 rounded-xl text-[11px] font-black text-[#10b981]">
                    ✓ SELECTED
                  </div>
                )}
              </button>
            )
          })}
        </section>

        {/* Lock In Button vs Spectator Status */}
        <footer className="mt-8 sm:mt-10 flex justify-center">
          {isSpectator ? (
            <div className="flex items-center gap-3 rounded-2xl border border-[#38bdf8]/40 bg-[#071d17]/95 px-8 py-4 shadow-xl backdrop-blur-md">
              <span className="h-2.5 w-2.5 rounded-full bg-[#38bdf8] animate-ping" />
              <p className="font-display text-xs sm:text-sm font-black uppercase tracking-wider text-[#38bdf8]">
                Awaiting Contender Draft Locks… Match Resumes Automatically
              </p>
            </div>
          ) : (
            <button
              type="button"
              disabled={!selected || isSubmitting}
              onClick={handleLockIn}
              className={`w-full max-w-sm rounded-2xl py-4 px-8 font-display text-sm font-black tracking-wider uppercase transition-[transform,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8ab32] active:scale-[0.97] ${
                selected && !isSubmitting
                  ? 'bg-gradient-to-r from-[#ea580c] via-[#e8ab32] to-[#ea580c] text-[#041511] shadow-[0_8px_24px_rgba(234,88,12,0.4)] hover:brightness-110'
                  : 'border border-[#1b3b33] bg-[#071d17]/80 text-[#8ba79e] cursor-not-allowed shadow-none'
              }`}
            >
              {isSubmitting
                ? 'Locking In Stance…'
                : selected
                  ? `Lock In ${selected}`
                  : 'Choose a Class to Lock In'}
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
