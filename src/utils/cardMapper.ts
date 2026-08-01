import type { BackendCard } from '../types/game'
import type { CardType, CardSuit } from '../components/game/GameCard'

const suitMap: Record<string, CardSuit> = {
  Circle: 'circle',
  Cross: 'cross',
  Triangle: 'triangle',
  Square: 'square',
  Star: 'star',
  Wild: 'whot',
}

export function mapCard(backend: BackendCard): CardType {
  return {
    id: backend.id,
    suit: suitMap[backend.suit] ?? 'whot',
    value: backend.number,
  }
}
