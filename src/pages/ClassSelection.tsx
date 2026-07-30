import { useState } from 'react'
import type { ReactNode } from 'react'
import { useGameState } from '../hooks/useGameState'
import { useGamePhaseRouting } from '../hooks/useGamePhaseRouting'

type ClassName = 'The Joker' | 'The Wall' | 'The Striker' | 'The Mastermind'

interface ClassDetail {
  id: ClassName
  lore: string
  passive: string
  active: string
  activeDesc: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  chaosLevel: number
  color: string
  bg: string
  border: string
  glow: string
  icon: ReactNode
}

export default function ClassSelection() {
  const [selected, setSelected] = useState<ClassName | null>(null)
  const { setGamePhase } = useGameState()
  useGamePhaseRouting()

  const classDetails: ClassDetail[] = [
    {
      id: 'The Joker',
      lore: 'The agent of sheer randomness. Rules shift and twist under their presence.',
      passive: 'Chaos Aura: Global rules rotate twice as fast.',
      active: 'Chaos Leap',
      activeDesc: 'Instantly swap active card suit to a random shape and force next player to draw.',
      difficulty: 'Medium',
      chaosLevel: 5,
      color: 'text-w-trickster',
      bg: 'bg-gradient-to-br from-w-trickster/15 via-w-surface to-w-surface-2',
      border: 'border-w-trickster/30 hover:border-w-trickster/60',
      glow: 'shadow-tactile-md border-w-trickster bg-w-surface-2',
      icon: (
        <svg className="h-10 w-10 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" />
        </svg>
      ),
    },
    {
      id: 'The Wall',
      lore: 'Unmovable defensive bastion. They absorb damage and redirect trouble back to others.',
      passive: 'Fortress: Immune to draw penalties when blocking.',
      active: 'Iron Block',
      activeDesc: 'Cancel incoming card draw penalties and force it on the player to your left.',
      difficulty: 'Easy',
      chaosLevel: 1,
      color: 'text-w-support',
      bg: 'bg-gradient-to-br from-w-support/15 via-w-surface to-w-surface-2',
      border: 'border-w-support/30 hover:border-w-support/60',
      glow: 'shadow-tactile-md border-w-support bg-w-surface-2',
      icon: (
        <svg className="h-10 w-10 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12V17L12 22L22 17V12C22 6.48 17.52 2 12 2ZM12 19.8L5.5 16.6V12.8L12 15.6L18.5 12.8V16.6L12 19.8Z" />
        </svg>
      ),
    },
    {
      id: 'The Striker',
      lore: 'Aggressive card offensive. Rapid burst of identical shapes to deplete the hand.',
      passive: 'Fury: Gain 20% bonus XP for consecutive plays of same shape.',
      active: 'Double Strike',
      activeDesc: 'Play two cards from your hand in a single turn if they share shape or value.',
      difficulty: 'Hard',
      chaosLevel: 4,
      color: 'text-w-warrior',
      bg: 'bg-gradient-to-br from-w-warrior/15 via-w-surface to-w-surface-2',
      border: 'border-w-warrior/30 hover:border-w-warrior/60',
      glow: 'shadow-tactile-md border-w-warrior bg-w-surface-2',
      icon: (
        <svg className="h-10 w-10 fill-current" viewBox="0 0 24 24">
          <path d="M17.5 2C15.5 2 13.7 3.3 12.8 5.2C11.9 3.3 10.1 2 8.1 2C5.3 2 3 4.3 3 7.1C3 11 7 14.5 12.8 20L13.2 20.4L13.6 20C19.4 14.5 23.4 11 23.4 7.1C23.4 4.3 21.1 2 18.3 2H17.5Z" />
        </svg>
      ),
    },
    {
      id: 'The Mastermind',
      lore: 'Tactician who plays with open knowledge. Sees cards before they arrive.',
      passive: 'Prescience: Always see the top card of the draw market deck.',
      active: 'Mind Read',
      activeDesc: 'Take a peek at the player with the fewest cards\' hand for 5 seconds.',
      difficulty: 'Medium',
      chaosLevel: 3,
      color: 'text-w-mystic',
      bg: 'bg-gradient-to-br from-w-mystic/15 via-w-surface to-w-surface-2',
      border: 'border-w-mystic/30 hover:border-w-mystic/60',
      glow: 'shadow-tactile-md border-w-mystic bg-w-surface-2',
      icon: (
        <svg className="h-10 w-10 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18Z" />
        </svg>
      ),
    },
  ]

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pt-6 pb-24 md:pb-8 text-w-text flex flex-col justify-center">
      <header className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-display font-bold uppercase tracking-widest text-w-orange">
          Round 1 of 5 Setup
        </span>
        <h2 className="mt-1 font-display text-3xl lg:text-4xl font-extrabold tracking-wide text-w-text">
          Pick your <span className="text-w-orange">character class</span>
        </h2>
        <p className="mt-2 text-sm text-w-text-2">
          Each class has a unique passive advantage and a clickable active ability that can swing the table.
        </p>
      </header>

      {/* Class Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {classDetails.map((details) => {
          const isSelected = selected === details.id
          return (
            <button
              key={details.id}
              type="button"
              onClick={() => setSelected(details.id)}
              aria-label={`Select ${details.id} class`}
              className={`rounded-2xl border p-5 text-left transition-[transform,border-color,box-shadow] duration-300 flex flex-col justify-between min-h-[360px] group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-w-orange ${
                isSelected ? details.glow : `${details.bg} ${details.border}`
              } hover:-translate-y-2`}
            >
              {/* Header */}
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div className={`transition-transform duration-300 group-hover:scale-110 ${details.color}`}>
                    {details.icon}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-w-border bg-w-bg text-w-text-2">
                    {details.difficulty}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-black tracking-wide text-w-text text-balance">
                  {details.id}
                </h3>
                <p className="mt-1.5 text-xs text-w-text-2 leading-relaxed italic line-clamp-3">
                  "{details.lore}"
                </p>
              </div>

              {/* Abilities & Lore details */}
              <div className="w-full mt-6 py-3 border-t border-w-border/30 text-xs flex-1 flex flex-col gap-2 justify-end">
                <div>
                  <strong className="text-[10px] uppercase font-bold tracking-wider text-w-yellow block mb-0.5">
                    Passive:
                  </strong>
                  <p className="text-w-text-2 leading-normal">{details.passive}</p>
                </div>
                
                <div className="mt-2">
                  <strong className={`${details.color} text-[10px] uppercase font-bold tracking-wider block mb-0.5`}>
                    Active - {details.active}:
                  </strong>
                  <p className="text-w-text-2 leading-normal">{details.activeDesc}</p>
                </div>

                {/* Chaos Meter */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-w-text-3">
                    Chaos rating
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <span
                        key={level}
                        className={`h-1.5 w-3 rounded-sm ${
                          level <= details.chaosLevel ? details.color + ' bg-current' : 'bg-w-border'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </section>

      {/* Lock in Action Button */}
      <footer className="mt-8 flex justify-center">
        <button
          type="button"
          disabled={!selected}
          onClick={() => setGamePhase('board')}
          className={`w-full max-w-sm rounded-xl py-3 px-6 font-display text-sm font-bold transition-[transform,background-color,border-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange ${
            selected
              ? 'bg-w-orange text-w-text shadow-tactile-md hover:scale-[1.02]'
              : 'border border-w-border bg-w-surface-2 text-w-text-3 cursor-not-allowed'
          }`}
        >
          {selected ? `Lock in ${selected}` : 'Choose a class to lock in'}
        </button>
      </footer>
    </main>
  )
}
