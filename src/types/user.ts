export interface AuthUser {
  id: string
  username: string
  email: string
}

export interface UserProfile {
  id: string
  username: string
  email?: string
  avatarUrl: string
  coins: number
  xp: number
  level: number
  favoriteClass: string
}
