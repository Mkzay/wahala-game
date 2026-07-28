import type { ReactNode } from 'react'

interface SettingsPillProps {
  children: ReactNode
  highlighted?: boolean
}

export function SettingsPill({ children, highlighted = false }: SettingsPillProps) {
  return (
    <span
      className={`rounded-full border px-2 py-1 text-xs ${
        highlighted
          ? 'border-w-orange bg-[#1A0F0A] text-w-orange'
          : 'border-w-border text-w-text-2'
      }`}
    >
      {children}
    </span>
  )
}
