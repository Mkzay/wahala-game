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

  it('renders authentic Naija Whot action card banners', () => {
    const holdOn: CardType = { id: 'c1', suit: 'circle', value: 1 }
    const pickTwo: CardType = { id: 'c2', suit: 'triangle', value: 2 }
    const pickThree: CardType = { id: 'c3', suit: 'square', value: 5 }
    const suspension: CardType = { id: 'c4', suit: 'star', value: 8 }
    const genMarket: CardType = { id: 'c5', suit: 'cross', value: 14 }
    const whotWild: CardType = { id: 'c6', suit: 'whot', value: 20 }

    const { unmount: u1 } = render(<GameCard card={holdOn} />)
    expect(screen.getByText('HOLD ON')).toBeDefined()
    u1()

    const { unmount: u2 } = render(<GameCard card={pickTwo} />)
    expect(screen.getByText('PICK TWO')).toBeDefined()
    u2()

    const { unmount: u3 } = render(<GameCard card={pickThree} />)
    expect(screen.getByText('PICK THREE')).toBeDefined()
    u3()

    const { unmount: u4 } = render(<GameCard card={suspension} />)
    expect(screen.getByText('SUSPENSION')).toBeDefined()
    u4()

    const { unmount: u5 } = render(<GameCard card={genMarket} />)
    expect(screen.getByText('GEN MARKET')).toBeDefined()
    u5()

    const { unmount: u6 } = render(<GameCard card={whotWild} />)
    expect(screen.getByText('WHOT · WILD')).toBeDefined()
    u6()
  })

  it('does not apply is-muted or color-draining classes when isPlayable is false', () => {
    const { container } = render(<GameCard card={mockCard} isPlayable={false} />)
    const cardEl = container.firstChild as HTMLElement
    expect(cardEl.classList.contains('is-not-playable')).toBe(true)
    expect(cardEl.classList.contains('is-muted')).toBe(false)
  })
})
