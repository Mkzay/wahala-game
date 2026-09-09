import { useState } from 'react'
import type { IconName } from '../ui/Icon'
import { Icon } from '../ui/Icon'
import { playUiSound } from '../../lib/sound'

export type ClassName = 'joker' | 'wall' | 'striker' | 'mastermind'

interface AbilitiesPanelProps {
  classNameType: ClassName
  onActivateAbility: (abilityName: string) => void
  isMyTurn: boolean
  abilityUsed?: boolean
}

const classDetails: Record<
  ClassName,
  {
    title: string
    passive: string
    ability: string
    desc: string
    icon: IconName
    badgeBg: string
    textColor: string
    borderColor: string
    glowClass: string
  }
> = {
  joker: {
    title: 'The Joker',
    passive: 'Chaos Aura · rules rotate faster',
    ability: 'Mirror Play',
    desc: 'Reflect the next incoming penalty back to its attacker.',
    icon: 'spark',
    badgeBg: 'bg-amber-500/15',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(217,119,6,0.35)]',
  },
  wall: {
    title: 'The Wall',
    passive: 'Fortress · soften incoming penalties',
    ability: 'Iron Block',
    desc: 'Raise a shield and turn the next penalty into dust.',
    icon: 'shield',
    badgeBg: 'bg-emerald-500/15',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(5,150,105,0.35)]',
  },
  striker: {
    title: 'The Striker',
    passive: 'Fury · same-shape chains hit harder',
    ability: 'Double Strike',
    desc: 'Prime your next combo to unleash a second hit.',
    icon: 'sword',
    badgeBg: 'bg-red-500/15',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(220,38,38,0.35)]',
  },
  mastermind: {
    title: 'The Mastermind',
    passive: 'Prescience · read the market',
    ability: 'Mind Read',
    desc: 'Swap your lowest card with the market top, then bury the old card.',
    icon: 'brain',
    badgeBg: 'bg-indigo-500/15',
    textColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/40',
    glowClass: 'shadow-[0_0_20px_rgba(79,70,229,0.35)]',
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

  const handleCast = () => {
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
    onActivateAbility(details.ability)
    setCooldown(3)
    showMessage(`${details.ability} activated!`)
    window.setTimeout(() => setCooldown(0), 15000)
  }

  return (
    <>
      {isCasting && (
        <div className="pointer-events-none fixed inset-0 z-50 border-[3px] border-[#e8ab32]/60 bg-[#e8ab32]/5 shadow-[inset_0_0_120px_rgba(232,171,50,0.3)] animate-pulse" />
      )}
      <div className="fixed bottom-[10.75rem] right-3 z-40 sm:bottom-[166px] sm:right-6">
        {message && (
          <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-xl border border-[#e8ab32]/40 bg-[#071d17]/95 px-3 py-2 text-[11px] font-black text-[#e8ab32] shadow-xl backdrop-blur-xl animate-fade-in">
            {message}
          </div>
        )}

        <div
          className={`group relative overflow-hidden rounded-[20px] border p-1 sm:p-2 backdrop-blur-xl transition-[border-color,box-shadow,transform] duration-200 ${
            ready
              ? `${details.borderColor} bg-[#08201a]/95 ${details.glowClass} ring-1 ring-[#e8ab32]/30`
              : 'border-[#1b3b33] bg-[#071813]/90 shadow-[0_12px_32px_rgba(0,0,0,0.5)]'
          }`}
        >
          {/* Subtle top brass accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#e8ab32] to-transparent opacity-80" />

          <button
            type="button"
            onClick={handleCast}
            aria-label={`Cast ${details.ability}`}
            className={`relative grid h-11 w-11 place-items-center rounded-2xl ${details.badgeBg} ${details.textColor} transition-[transform,background-color] duration-150 hover:-translate-y-0.5 hover:scale-105 active:scale-[0.96] sm:h-16 sm:w-16 sm:rounded-2xl`}
          >
            <Icon name={details.icon} size={22} strokeWidth={2.2} className="sm:hidden" />
            <Icon name={details.icon} size={30} strokeWidth={2.2} className="hidden sm:block" />

            {abilityUsed ? (
              <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-[#10b981] text-[9px] font-black text-[#041511] shadow-sm">
                ✓
              </span>
            ) : cooldown > 0 ? (
              <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-[#071d17] border border-[#1b3b33] text-[9px] font-black text-[#e6ede8]">
                {cooldown}
              </span>
            ) : (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
            )}
          </button>

          <div className="hidden max-w-20 px-1 pt-1.5 text-center sm:block">
            <p className="truncate text-[9px] font-black uppercase tracking-wider text-[#e6ede8]">
              {details.title.replace('The ', '')}
            </p>
            <p className={`mt-0.5 text-[8px] font-black tracking-widest ${ready ? 'text-[#10b981]' : abilityUsed ? 'text-[#8ba79e]' : 'text-[#e8ab32]'}`}>
              {ready ? 'READY' : abilityUsed ? 'SPENT' : 'STANDBY'}
            </p>
          </div>
        </div>

        {/* Hover detail tooltip */}
        <div className="pointer-events-none absolute bottom-full right-0 hidden w-64 pb-2 group-hover:block transition-opacity duration-150">
          <div className="rounded-2xl border border-[#c48d28]/40 bg-[#071d17]/95 p-3.5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg ${details.badgeBg} ${details.textColor}`}>
                <Icon name={details.icon} size={15} />
              </span>
              <div>
                <p className="font-display text-xs font-black text-[#fffdf8]">{details.title}</p>
                <p className={`text-[10px] font-bold ${details.textColor}`}>{details.ability}</p>
              </div>
            </div>
            <p className="mt-2.5 rounded-lg bg-[#041511]/70 p-2 text-[10px] font-semibold text-[#e8ab32] border border-[#1b3b33]">
              {details.passive}
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-[#c2d6ce]">
              {details.desc}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
