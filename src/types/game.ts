export type GameMode = 'classic' | 'progression'
export type GamePhase = 'waiting' | 'classSelection' | 'shop' | 'roundActive' | 'roundEnded' | 'gameEnded'
export type TurnPhase = 'turnStart' | 'awaitingPlay' | 'reactionWindow'
export type PlayerStatus = 'active' | 'eliminated' | 'spectating'

export interface BackendCard {
  id: string
  number: number
  suit: string
  type: string
}

export interface GamePlayer {
  userId: string
  username: string
  cardCount: number
  status: PlayerStatus
  class: string | null
  previousClass: string | null
  abilityUsed: boolean
  activeShield: boolean
  comboBoostActive: boolean
  cardValueSum: number
  cumulativeScore: number
}

export type RuleType = 'light' | 'moderate' | 'chaotic'

export interface ActiveRule {
  ruleId: string
  name: string
  description: string
  tier: RuleType
  activatedRound: number
  expiresRound: number
}

export interface ReactionWindow {
  targetUserId: string
  attackerUserId: string
  penaltyType: string
  penaltyAmount: number
  expiresAtMs: number
}

export interface GameState {
  gameId: string
  roomId: string
  mode: GameMode
  round: number
  totalRounds: number | null
  phase: GamePhase
  turnPhase: TurnPhase
  status: string
  currentTurnPlayerId: string | null
  turnOrder: string[]
  isClockwise: boolean
  players: GamePlayer[]
  playerHands: Record<string, BackendCard[]>
  market: BackendCard[]
  discardPile: BackendCard[]
  activeCard: BackendCard | null
  declaredSuit: string | null
  activeRules: ActiveRule[]
  reactionWindow: ReactionWindow | null
  timerSeconds: number | null
  winnerId: string | null
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
  rule: string
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
