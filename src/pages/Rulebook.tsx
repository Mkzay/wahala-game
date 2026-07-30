import { useState, useMemo } from 'react'
import { DashboardNavBar } from '../components/ui/DashboardNavBar'

export default function Rulebook() {
  const [activeKey, setActiveKey] = useState<string>('overview')
  const [query, setQuery] = useState<string>('')

  const sections = useMemo(
    () => [
      {
        key: 'overview',
        title: 'Core Game Overview',
        desc: 'Wahala is a competitive card-battle strategy game built on classic Naija Whot card rules, enhanced with RPG character classes.',
        lines: [
          'Players take turns matching cards in their hand with the top card on the active discard pile.',
          'A card can be played if it matches either the active suit symbol or the face value of the active card.',
          'The primary goal of every round is to deplete your entire hand before your opponents, or hold the lowest total card points when the market deck runs out.',
          'If a player cannot play any valid card from their hand, they must draw 1 card from the central Market deck.',
        ],
      },
      {
        key: 'cards',
        title: 'Card Values & Special Actions',
        desc: 'Specific card values trigger special actions at the table that disrupt opponent turns or force drawing.',
        lines: [
          'Value 1 (Hold On): Stops the turn order. The playing player gets another turn immediately.',
          'Value 2 (Pick Two): Forces the next player to draw 2 cards from the Market deck unless countered.',
          'Value 5 (Send Three): Forces the next player to draw 3 cards from the Market deck unless countered.',
          'Value 8 (Suspension): Skips the next player\'s turn in the rotation.',
          'Value 14 (General Market): Forces all other players to draw 1 card from the deck.',
          'Value 20 (WHOT Wild): Can be played on any card to change the active suit at will.',
        ],
      },
      {
        key: 'classes',
        title: 'Character Classes & Abilities',
        desc: 'Choose your hero class at the start of every match. Each class possesses unique passive advantages and active abilities.',
        lines: [
          'The Warrior: Aggressive offensive class. Deals +1 extra penalty card on Pick Two and Send Three plays.',
          'The Wall: Defensive tank class. Immune to Pick Two penalties once per round.',
          'The Joker: Chaos trickster class. Can swap a random card from hand with the top Market card.',
          'The Mastermind: Strategic controller class. Can preview the top 2 cards of the Market deck.',
        ],
      },
      {
        key: 'scoring',
        title: 'Scoring & Round End',
        desc: 'How round points are tallied when a player goes out or when the Market deck empties.',
        lines: [
          'When a player clears their hand ("Last Card" -> "Check"), the round ends immediately.',
          'Opponents score penalty points equal to the total face values of remaining cards in their hands.',
          'WHOT (Value 20) cards carry a heavy 20-point penalty if caught in your hand at round end.',
          'The player with the fewest cumulative points after 5 rounds wins the arena match.',
        ],
      },
    ],
    [],
  )

  const filteredSections = useMemo(() => {
    if (!query.trim()) return sections
    const q = query.toLowerCase()
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.lines.some((l) => l.toLowerCase().includes(q)),
    )
  }, [query, sections])

  const displaySections = filteredSections
  const activeSection = displaySections.find((s) => s.key === activeKey) ?? displaySections[0]

  return (
    <div className="min-h-screen w-full bg-w-bg text-w-text flex flex-col justify-between select-none">
      {/* Desktop & Mobile Header Navigation */}
      <DashboardNavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 lg:pb-8 flex flex-col gap-6">
        
        {/* Header Hero Banner */}
        <header className="rounded-3xl border border-w-border bg-gradient-to-r from-w-surface via-w-bg to-w-surface p-6 shadow-tactile-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-display font-black uppercase tracking-widest text-w-orange bg-w-orange/10 border border-w-orange/30 px-3 py-1 rounded-full">
              Official Guidebook 📖
            </span>
            <h1 className="mt-2 font-display text-2xl sm:text-4xl font-black text-w-text">
              Arena <span className="text-w-orange">Rulebook</span>
            </h1>
            <p className="text-xs sm:text-sm text-w-text-2 mt-1">
              Master the card values, action triggers, character class abilities, and scoring rules.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-display font-bold text-w-yellow bg-w-yellow/10 border border-w-yellow/30 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
              <span>🃏</span> Whot Card #20 = 20 Pts Penalty
            </span>
          </div>
        </header>

        {/* Responsive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Explorer Index (occupies 4 cols) */}
          <section className="col-span-1 lg:col-span-4 rounded-3xl border border-w-border bg-w-surface p-5 flex flex-col gap-4 shadow-tactile-md">
            
            {/* Search rulebook input */}
            <div className="rounded-xl border border-w-border bg-w-bg px-3.5 py-2.5 focus-within:border-w-orange transition-colors flex items-center gap-2">
              <svg className="h-4 w-4 text-w-text-3 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                name="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                placeholder="Search rulebook guides…"
                className="w-full bg-transparent text-xs text-w-text outline-none placeholder:text-w-text-3"
              />
            </div>

            {/* Rule Categories List */}
            <div className="space-y-2">
              {displaySections.length === 0 ? (
                <p className="text-center text-xs text-w-text-3 italic py-4">No matching sections found</p>
              ) : (
                displaySections.map((sec) => (
                  <button
                    key={sec.key}
                    type="button"
                    onClick={() => setActiveKey(sec.key)}
                    className={`w-full text-left rounded-2xl border p-4 transition-[colors,border-color,box-shadow] text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-w-orange ${
                      activeSection?.key === sec.key
                        ? 'border-w-orange bg-w-orange/10 text-w-orange shadow-tactile-sm'
                        : 'border-w-border bg-w-bg text-w-text-2 hover:bg-w-surface hover:text-w-text hover:border-w-orange/40'
                    }`}
                  >
                    <h2 className="font-display font-black text-w-text text-xs sm:text-sm">{sec.title}</h2>
                    <p className="mt-1 text-[11px] text-w-text-2 line-clamp-1">{sec.desc}</p>
                  </button>
                ))
              )}
            </div>
          </section>

          {/* Right Column: Details visualization panel (occupies 8 cols) */}
          <section className="col-span-1 lg:col-span-8 rounded-3xl border border-w-border bg-w-surface p-6 sm:p-8 shadow-tactile-md flex flex-col gap-6">
            {activeSection ? (
              <div className="flex flex-col gap-5">
                <header className="border-b border-w-border/60 pb-4">
                  <span className="text-[10px] font-display font-black uppercase tracking-widest text-w-orange block">
                    Section Guide
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-black text-w-text mt-1">
                    {activeSection.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-w-text-2 mt-2 leading-relaxed">
                    {activeSection.desc}
                  </p>
                </header>

                <div className="space-y-3">
                  {activeSection.lines.map((line, idx) => (
                    <article
                      key={idx}
                      className="rounded-2xl border border-w-border/60 bg-w-bg p-4 flex items-start gap-3 hover:border-w-orange/30 transition-colors"
                    >
                      <div className="h-6 w-6 rounded-lg bg-w-orange/20 border border-w-orange/40 flex items-center justify-center font-display text-xs font-black text-w-orange flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-w-text leading-relaxed font-medium">
                        {line}
                      </p>
                    </article>
                  ))}
                </div>

                {/* Inline suit symbols guide when inspecting Cards section */}
                {activeSection.key === 'cards' && (
                  <div className="pt-5 border-t border-w-border/60 mt-2">
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-w-orange mb-3">
                      Suit Symbols Guide
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs font-bold text-w-text-2">
                      {[
                        { name: 'Circle', color: 'text-w-trickster bg-w-trickster/10 border-w-trickster/20', char: '●' },
                        { name: 'Triangle', color: 'text-w-mystic bg-w-mystic/10 border-w-mystic/20', char: '▲' },
                        { name: 'Star', color: 'text-w-warrior bg-w-warrior/10 border-w-warrior/20', char: '★' },
                        { name: 'Cross', color: 'text-w-rogue bg-w-rogue/10 border-w-rogue/20', char: '✚' },
                        { name: 'Square', color: 'text-w-royal bg-w-royal/10 border-w-royal/20', char: '■' },
                      ].map((suit) => (
                        <div key={suit.name} className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-1 ${suit.color}`}>
                          <span className="text-2xl select-none">{suit.char}</span>
                          <span className="text-[11px] font-display font-black">{suit.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </section>
        </div>
      </main>

      <footer className="hidden md:block mt-12 text-center text-xs text-w-text-3 border-t border-w-border/30 py-6">
        © 2026 Wahala Entertainment. Official Rulebook.
      </footer>
    </div>
  )
}
