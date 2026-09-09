import type { BackendCard } from '../types/game'
import type { CardType, CardSuit } from '../components/game/GameCard'

export const suitMap: Record<string, CardSuit> = {
  Circle: 'circle',
  circle: 'circle',
  Cross: 'cross',
  cross: 'cross',
  Triangle: 'triangle',
  triangle: 'triangle',
  Square: 'square',
  square: 'square',
  Star: 'star',
  star: 'star',
  Wild: 'whot',
  wild: 'whot',
  Whot: 'whot',
  whot: 'whot',
}

export function mapCard(backend: BackendCard): CardType {
  const rawSuit = backend?.suit ?? ''
  const mappedSuit = suitMap[rawSuit] ?? suitMap[rawSuit.toLowerCase()] ?? 'whot'
  return {
    id: backend.id,
    suit: mappedSuit,
    value: backend.number ?? (backend as any).value ?? 0,
  }
}
