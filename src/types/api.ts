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

export interface APIUser {
  id: string
  username: string
  email?: string
  avatar_url?: string
  coins?: number
  xp?: number
  level?: number
  favorite_class?: string
}

export interface APIRoom {
  room_id: string
  room_name: string
  host: {
    user_id: string
    username: string
  }
  game_mode: 'classic' | 'progression'
  visibility: 'public' | 'private'
  current_players: number
  max_players: number
  status: 'waiting' | 'in_progress' | 'completed'
  created_at: string
}

export interface APIAuthResponse {
  user: APIUser
  accessToken: string
  refreshToken: string
}
