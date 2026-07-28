import type { ReactNode } from 'react'

interface TopNavBarProps {
  left: ReactNode
  title: ReactNode
  right?: ReactNode
}

export function TopNavBar({ left, title, right }: TopNavBarProps) {
  return (
    <header className="mb-5 flex items-center justify-between">
      <div>{left}</div>
      <h1 className="font-display text-xl font-extrabold">{title}</h1>
      <div>{right ?? <span className="w-10" />}</div>
    </header>
  )
}
