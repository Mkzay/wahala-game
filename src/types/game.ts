export type GameMode = 'classic' | 'progression'
export type RuleType = 'light' | 'moderate' | 'chaotic'
export type PlayerStatus = 'active' | 'eliminated' | 'spectating'

export interface GameState {
  gameId: string
  mode: GameMode
  round: number
  currentTurnPlayerId: string | null
  activeRules: RuleType[]
  marketCount: number
  reactionWindowEndsAtMs: number | null
  players: GamePlayer[]
}

export interface GamePlayer {
  id: string
  username: string
  cardCount: number
  status: PlayerStatus
}

export interface GameStateSnapshotPayload {
  game: GameState
}

export interface CardPlayedPayload {
  gameId: string
  playerId: string
  nextTurnPlayerId: string
  marketCount: number
  playedAtMs: number
}

export interface TurnChangedPayload {
  gameId: string
  currentTurnPlayerId: string
}

export interface RuleActivatedPayload {
  gameId: string
  rule: RuleType
}

export interface RoundEndedPayload {
  gameId: string
  round: number
}

export interface GameEndedPayload {
  gameId: string
  winnerPlayerId: string | null
}

export interface PlayerDisconnectedPayload {
  gameId: string
  playerId: string
}

export interface ReactionWindowOpenedPayload {
  gameId: string
  closesAtMs: number
}

export interface AbilityUsedPayload {
  gameId: string
  playerId: string
  abilityKey: string
}

export interface GameSocketEvents {
  'game:stateSnapshot': GameStateSnapshotPayload
  'card:played': CardPlayedPayload
  'turn:changed': TurnChangedPayload
  'rule:activated': RuleActivatedPayload
  'round:ended': RoundEndedPayload
  'game:ended': GameEndedPayload
  'player:disconnected': PlayerDisconnectedPayload
  'reaction:window:opened': ReactionWindowOpenedPayload
  'ability:used': AbilityUsedPayload
}
