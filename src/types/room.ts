export type RoomStatus = 'waiting' | 'in_progress' | 'finished' | 'disbanded'
export type RoomVisibility = 'public' | 'private'

export interface Room {
  id: string
  code: string
  name: string
  hostId: string
  hostUsername: string
  gameMode: string
  visibility: RoomVisibility
  maxPlayers: number
  playerCount: number
  roundCount: number | null
  timerEnabled: boolean
  status: RoomStatus
}
