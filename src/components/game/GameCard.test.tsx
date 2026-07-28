// @vitest-environment jsdom
import { afterEach, describe, it, expect } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { GameCard } from './GameCard'
import type { CardType } from './GameCard'

describe('GameCard component', () => {
  afterEach(() => {
    cleanup()
  })

  const mockCard: CardType = {
    id: 'test-card-1',
    suit: 'circle',
    value: 7,
  }

  it('renders the card value in the top-left and bottom-right corners', () => {
    render(<GameCard card={mockCard} />)
    const values = screen.getAllByText('7')
    expect(values).toHaveLength(2)
  })

  it('renders a special W for WHOT card', () => {
    const whotCard: CardType = {
      id: 'test-whot-card',
      suit: 'whot',
      value: 20,
    }
    render(<GameCard card={whotCard} />)
    const values = screen.getAllByText('W')
    expect(values).toHaveLength(2)
  })

  it('renders the back of the card when isFlipped is true', () => {
    render(<GameCard card={mockCard} isFlipped={true} />)
    expect(screen.queryByText('7')).toBeNull()
    expect(screen.getByText('WAHALA')).toBeDefined()
  })
})
