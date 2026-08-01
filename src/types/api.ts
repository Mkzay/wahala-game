export interface AppError {
  message: string
  code: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: {
    message: string
    statusCode: number
  }
}

export interface APIProfile {
  id: string
  username: string
  email: string
  overallLevel: number
  totalXp: number
  coins: number
  title: string
  createdAt: string
}

export interface APIUser {
  id: string
  username: string
  email: string
}

export interface APIRoom {
  id: string
  code: string
  name: string
  hostId: string
  hostUsername: string
  gameMode: string
  visibility: 'public' | 'private'
  maxPlayers: number
  playerCount: number
  roundCount: number | null
  timerEnabled: boolean
  status: 'waiting' | 'in_progress' | 'finished' | 'disbanded'
}

export interface APIRoomReadyPlayer {
  userId: string
  username: string
  isReady: boolean
  joinedAt: string
}

export interface APIRoomReadyState {
  roomId: string
  players: APIRoomReadyPlayer[]
  allReady: boolean
}

export interface APIAuthResponse {
  user: APIUser
  accessToken: string
  refreshToken: string
}
