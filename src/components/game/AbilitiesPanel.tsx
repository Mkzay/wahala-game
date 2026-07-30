import { useState } from 'react'

export type ClassName = 'joker' | 'wall' | 'striker' | 'mastermind'

interface AbilitiesPanelProps {
  classNameType: ClassName
  onActivateAbility: (abilityName: string) => void
  isMyTurn: boolean
}

export function AbilitiesPanel({
  classNameType,
  onActivateAbility,
  isMyTurn,
}: AbilitiesPanelProps) {
  const [cooldown, setCooldown] = useState<number>(0) // cooldown turns: 0 means ready
  const [isShaking, setIsShaking] = useState<boolean>(false)
  const [isCastingEffect, setIsCastingEffect] = useState<boolean>(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)

  const getClassDetails = (name: ClassName) => {
    switch (name) {
      case 'joker':
        return {
          title: 'The Trickster',
          passive: 'Chaos Aura: Global rules rotate twice as fast.',
          ability: 'Chaos Leap',
          desc: 'Instantly swap the active card suit to a random suit and force the next player to draw a card.',
          color: 'text-w-trickster border-w-trickster/30 bg-w-surface shadow-tactile-md',
          btnBg: 'bg-w-trickster hover:bg-w-trickster/90 text-w-text',
          icon: '🃏',
        }
      case 'wall':
        return {
          title: 'The Wall',
          passive: 'Fortress: You are immune to draw penalties when blocking.',
          ability: 'Iron Block',
          desc: 'Cancel any incoming draw cards penalty targeted at you and force the penalty onto the player to your left.',
          color: 'text-w-support border-w-support/30 bg-w-surface shadow-tactile-md',
          btnBg: 'bg-w-support hover:bg-w-support/90 text-w-surface',
          icon: '🛡️',
        }
      case 'striker':
        return {
          title: 'The Striker',
          passive: 'Fury: Gain 20% bonus XP for every card you play consecutive to another of the same shape.',
          ability: 'Double Strike',
          desc: 'Play two cards from your hand in a single turn if they share the same shape or value.',
          color: 'text-w-warrior border-w-warrior/30 bg-w-surface shadow-tactile-md',
          btnBg: 'bg-w-warrior hover:bg-w-warrior/90 text-w-text',
          icon: '⚔️',
        }
      case 'mastermind':
        return {
          title: 'The Mastermind',
          passive: 'Prescience: You can always see the top card of the draw market.',
          ability: 'Mind Read',
          desc: 'Take a peek at the player with the fewest cards\' hand for 5 seconds.',
          color: 'text-w-mystic border-w-mystic/30 bg-w-surface shadow-tactile-md',
          btnBg: 'bg-w-mystic hover:bg-w-mystic/90 text-w-surface',
          icon: '🔮',
        }
    }
  }

  const details = getClassDetails(classNameType)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => {
      setToastMsg(null)
    }, 2000)
  }

  // Quick Draw Direct Tap Activation!
  const handleQuickDrawAbility = () => {
    if (cooldown > 0) {
      setIsShaking(true)
      showToast(`Cooldown active (${cooldown} turns left)`)
      setTimeout(() => setIsShaking(false), 450)
      return
    }

    if (!isMyTurn) {
      setIsShaking(true)
      showToast('Wait for your turn to cast!')
      setTimeout(() => setIsShaking(false), 450)
      return
    }

    // Trigger Visual Ability Shockwave & Screen Aura Blast!
    setIsCastingEffect(true)
    setTimeout(() => setIsCastingEffect(false), 1200)

    // Instant Cast!
    onActivateAbility(details.ability)
    setCooldown(3)
    showToast(`⚡ ${details.ability} Activated!`)

    // Simulate cooldown reduction
    setTimeout(() => {
      setCooldown(0)
    }, 15000)
  }

  const isReady = cooldown === 0 && isMyTurn

  return (
    <>
      {/* Ability Activation Screen Edge Aura Flash */}
      {isCastingEffect && (
        <div className="fixed inset-0 pointer-events-none z-50 shadow-[inset_0_0_120px_rgba(217,108,45,0.5)] border-4 border-w-orange/40 bg-w-orange/5 animate-pulse transition-all duration-700" />
      )}

      {/* Quick Draw Floating Action Power Orb Trigger */}
      <div className="fixed bottom-[115px] right-3 sm:bottom-[130px] sm:right-6 z-40 flex flex-col items-end gap-1">
        
        {/* Floating Quick Toast / Feedback Message */}
        {toastMsg && (
          <div className="bg-w-surface/95 backdrop-blur-md border border-w-border px-3 py-1 rounded-full shadow-tactile-md text-[10px] font-display font-extrabold text-w-orange animate-bounce whitespace-nowrap">
            {toastMsg}
          </div>
        )}

        {/* Hover / Long Press Tooltip */}
        {showTooltip && !toastMsg && (
          <div className="bg-w-surface/95 backdrop-blur-xl border border-w-border p-3 rounded-2xl shadow-tactile-lg max-w-xs text-xs text-w-text animate-fade-in text-balance">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{details.icon}</span>
              <span className="font-display font-black text-w-orange">{details.title}</span>
            </div>
            <p className="text-[10px] text-w-text-2 mb-1"><strong>Passive:</strong> {details.passive}</p>
            <p className="text-[10px] text-w-text-2"><strong>Skill ({details.ability}):</strong> {details.desc}</p>
          </div>
        )}

        {/* Quick Draw Action Button Container */}
        <div className="relative">
          {/* Shockwave Energy Rings Radiating from Action Button on Cast */}
          {isCastingEffect && (
            <>
              <span className="absolute -inset-6 rounded-full border-2 border-w-orange/80 bg-w-orange/20 animate-ping pointer-events-none" />
              <span className="absolute -inset-12 rounded-full border border-w-yellow/60 bg-w-yellow/10 animate-ping pointer-events-none" style={{ animationDuration: '1.2s' }} />
            </>
          )}

          <button
            type="button"
            onClick={handleQuickDrawAbility}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label={`Quick Draw ${details.title} Ability`}
            title={`Tap to instantly cast ${details.ability}`}
            className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 bg-w-surface/95 backdrop-blur-xl flex items-center justify-center text-xl sm:text-2xl shadow-tactile-lg hover:scale-110 active:scale-95 transition-all duration-300 ${
              isShaking ? 'animate-nod-shake ring-4 ring-w-danger/40 border-w-danger' : ''
            } ${
              isReady
                ? 'border-w-orange ring-4 ring-w-orange/30 animate-pulse-subtle text-w-orange'
                : 'border-w-border text-w-text-2 hover:border-w-orange/60'
            }`}
          >
            <span>{details.icon}</span>

            {/* Readiness Notification Badge */}
            {cooldown === 0 && (
              <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-w-success border-2 border-w-surface shadow-sm animate-pulse" />
            )}

            {/* Cooldown Counter Badge */}
            {cooldown > 0 && (
              <span className="absolute -bottom-1 -right-1 bg-w-surface-2 text-w-text-2 border border-w-border font-display text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                {cooldown}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
