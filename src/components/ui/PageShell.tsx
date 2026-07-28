import type { ReactNode } from 'react'

interface PageShellProps {
  title: string
  children?: ReactNode
}

export function PageShell({ title, children }: PageShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 text-w-text sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
      <section className="mt-4 rounded-md border border-w-border bg-w-surface p-4">
        {children}
      </section>
    </main>
  )
}
