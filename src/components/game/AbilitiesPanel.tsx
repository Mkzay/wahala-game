import { useState } from 'react'
import type { IconName } from '../ui/Icon'
import { Icon } from '../ui/Icon'
import { playUiSound } from '../../lib/sound'

export type ClassName = 'joker' | 'wall' | 'striker' | 'mastermind'

interface AbilitiesPanelProps {
  classNameType: ClassName
  onActivateAbility: (abilityId: string) => void
  isMyTurn: boolean
  abilityUsed?: boolean
}

export interface ClassAbilityInfo {
  id: string
  name: string
  desc: string
  icon: IconName
}

export interface ClassSetup {
  title: string
  passive: string
  passiveDesc: string
  badgeBg: string
  textColor: string
  borderColor: string
  glowClass: string
  abilities: ClassAbilityInfo[]
}

const classDetails: Record<ClassName, ClassSetup> = {
  joker: {
    title: 'The Joker',
    passive: 'Chaos Aura',
    passiveDesc: 'Rule shifts & wildcard plays occur with elevated speed.',
    badgeBg: 'bg-amber-500/15',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(217,119,6,0.35)]',
    abilities: [
      {
        id: 'mirror_play',
        name: 'Mirror Play',
        desc: 'Reflect the next incoming penalty back to its attacker.',
        icon: 'spark',
      },
      {
        id: 'rule_twist',
        name: 'Rule Twist',
        desc: 'Override demanded suit condition to disrupt opponents.',
        icon: 'zap',
      },
    ],
  },
  wall: {
    title: 'The Wall',
    passive: 'Fortress',
    passiveDesc: 'Passively absorbs 1 card from heavy incoming forced draw penalties.',
    badgeBg: 'bg-emerald-500/15',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(5,150,105,0.35)]',
    abilities: [
      {
        id: 'block',
        name: 'Iron Block',
        desc: 'Raise an impenetrable shield that absorbs the next penalty completely.',
        icon: 'shield',
      },
      {
        id: 'hold_ground',
        name: 'Hold Ground',
        desc: 'Take a steadfast defensive stance to halve forced draw penalties.',
        icon: 'lock',
      },
    ],
  },
  striker: {
    title: 'The Striker',
    passive: 'Fury',
    passiveDesc: 'Aggressive momentum empowers combo plays and multi-card chains.',
    badgeBg: 'bg-red-500/15',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(220,38,38,0.35)]',
    abilities: [
      {
        id: 'double_down',
        name: 'Double Strike',
        desc: 'Double the penalty of your next attack card (Pick 2 -> 4, Pick 3 -> 6).',
        icon: 'sword',
      },
      {
        id: 'relentless',
        name: 'Relentless',
        desc: 'Immediately chain another valid card after landing an attack.',
        icon: 'flame',
      },
    ],
  },
  mastermind: {
    title: 'The Mastermind',
    passive: 'Prescience',
    passiveDesc: 'Look into the market deck — the top card is revealed on your table.',
    badgeBg: 'bg-indigo-500/15',
    textColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(79,70,229,0.35)]',
    abilities: [
      {
        id: 'mind_read',
        name: 'Mind Read',
        desc: 'Clairvoyance: peek at an opponent\'s secret hand cards.',
        icon: 'brain',
      },
      {
        id: 'perfect_setup',
        name: 'Perfect Setup',
        desc: 'Swap one card in hand with the top card of the market deck.',
        icon: 'shuffle',
      },
    ],
  },
}

export function AbilitiesPanel({
  classNameType,
  onActivateAbility,
  isMyTurn,
  abilityUsed = false,
}: AbilitiesPanelProps) {
  const [cooldown, setCooldown] = useState(0)
  const [isCasting, setIsCasting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const details = classDetails[classNameType] ?? classDetails.joker
  const ready = cooldown === 0 && isMyTurn && !abilityUsed

  const showMessage = (value: string) => {
    setMessage(value)
    window.setTimeout(() => setMessage(null), 2200)
  }

  const handleCast = (ability: ClassAbilityInfo) => {
    if (abilityUsed) {
      playUiSound('error')
      showMessage('Power spent this round')
      return
    }
    if (cooldown > 0) {
      playUiSound('error')
      showMessage(`Recharging · ${cooldown}s`)
      return
    }
    if (!isMyTurn) {
      playUiSound('error')
      showMessage('Wait for your turn')
      return
    }

    playUiSound('power')
    setIsCasting(true)
    window.setTimeout(() => setIsCasting(false), 900)
    onActivateAbility(ability.id)
    setCooldown(3)
    showMessage(`${ability.name} activated!`)
    window.setTimeout(() => setCooldown(0), 15000)
  }

  return (
    <>
      {isCasting && (
        <div className="pointer-events-none fixed inset-0 z-50 border-[3px] border-[#e8ab32]/60 bg-[#e8ab32]/5 shadow-[inset_0_0_120px_rgba(232,171,50,0.3)] animate-pulse" />
      )}

      <div className="fixed bottom-[13.5rem] right-3 z-40 sm:bottom-[220px] sm:right-6 flex flex-col items-end gap-2">
        {message && (
          <div className="whitespace-nowrap rounded-xl border border-[#e8ab32]/40 bg-[#071d17]/95 px-3 py-2 text-[11px] font-black text-[#e8ab32] shadow-xl backdrop-blur-xl animate-fade-in">
            {message}
          </div>
        )}

        {/* Tactical Ability Control Cluster */}
        <div
          className={`relative flex items-center gap-2 rounded-[22px] border p-1.5 sm:p-2.5 backdrop-blur-xl transition-[border-color,box-shadow,transform] duration-200 ${
            ready
              ? `${details.borderColor} bg-[#08201a]/95 ${details.glowClass} ring-1 ring-[#e8ab32]/30`
              : 'border-[#1b3b33] bg-[#071813]/90 shadow-[0_12px_32px_rgba(0,0,0,0.5)]'
          }`}
        >
          {/* Subtle top brass accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#e8ab32] to-transparent opacity-80" />

          {/* Class passive aura pill */}
          <div
            className="hidden sm:flex flex-col items-start pr-2 border-r border-[#1b3b33] max-w-[110px]"
            title={details.passiveDesc}
          >
            <span className="text-[8px] font-black uppercase tracking-wider text-[#ebd9b7]/60">Passive</span>
            <span className={`text-[10px] font-black truncate ${details.textColor}`}>
              {details.passive}
            </span>
          </div>

          {/* Dual Ability Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {details.abilities.map((ability) => (
              <div key={ability.id} className="relative group">
                <button
                  type="button"
                  onClick={() => handleCast(ability)}
                  aria-label={`Cast ${ability.name}`}
                  className={`relative grid h-11 w-11 place-items-center rounded-2xl ${details.badgeBg} ${details.textColor} transition-[transform,background-color] duration-150 hover:-translate-y-0.5 hover:scale-105 active:scale-[0.96] sm:h-14 sm:w-14 sm:rounded-2xl`}
                >
                  <Icon name={ability.icon} size={20} strokeWidth={2.2} className="sm:hidden" />
                  <Icon name={ability.icon} size={26} strokeWidth={2.2} className="hidden sm:block" />

                  {abilityUsed ? (
                    <span className="absolute right-1 top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-[#10b981] text-[8px] font-black text-[#041511] shadow-sm">
                      ✓
                    </span>
                  ) : cooldown > 0 ? (
                    <span className="absolute right-1 top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-[#071d17] border border-[#1b3b33] text-[8px] font-black text-[#e6ede8]">
                      {cooldown}
                    </span>
                  ) : (
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
                  )}
                </button>

                {/* Floating tooltip */}
                <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-56 group-hover:block z-50 animate-pop-in">
                  <div className="rounded-2xl border border-[#c48d28]/40 bg-[#071d17]/95 p-3 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded-lg ${details.badgeBg} ${details.textColor}`}>
                        <Icon name={ability.icon} size={14} />
                      </span>
                      <div>
                        <p className="font-display text-xs font-black text-[#fffdf8]">{ability.name}</p>
                        <p className={`text-[9px] font-bold ${details.textColor}`}>
                          {abilityUsed ? 'Power Spent' : ready ? 'Ready to Cast' : 'Standing By'}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-[10px] leading-relaxed text-[#c2d6ce]">
                      {ability.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden px-1 text-center sm:block">
            <p className="text-[9px] font-black uppercase tracking-wider text-[#e6ede8]">
              {details.title.replace('The ', '')}
            </p>
            <p className={`mt-0.5 text-[8px] font-black tracking-widest ${ready ? 'text-[#10b981]' : abilityUsed ? 'text-[#8ba79e]' : 'text-[#e8ab32]'}`}>
              {ready ? 'READY' : abilityUsed ? 'SPENT' : 'STANDBY'}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
