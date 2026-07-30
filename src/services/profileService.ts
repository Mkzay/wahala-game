import { api } from './api'
import type { APIUser } from '../types/api'
import type { UserProfile } from '../types/user'

export function transformProfile(raw: APIUser): UserProfile {
  return {
    id: raw.id,
    username: raw.username,
    email: raw.email ?? '',
    avatarUrl: raw.avatar_url ?? '',
    coins: raw.coins ?? 1250,
    xp: raw.xp ?? 750,
    level: raw.level ?? 4,
    favoriteClass: raw.favorite_class ?? 'Mastermind',
  }
}

export const profileService = {
  async getProfile(userId: string): Promise<UserProfile> {
    const response = await api.get<APIUser>(`/profile/${userId}`)
    return transformProfile(response.data)
  },

  async updateUsername(newUsername: string): Promise<UserProfile> {
    const response = await api.patch<APIUser>('/profile/username', { username: newUsername })
    return transformProfile(response.data)
  },
}
