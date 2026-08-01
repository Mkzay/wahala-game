import { api } from './api'
import type { APIProfile } from '../types/api'
import type { UserProfile } from '../types/user'

export function transformProfile(raw: APIProfile): UserProfile {
  return {
    id: raw.id,
    username: raw.username,
    email: raw.email,
    coins: raw.coins,
    xp: raw.totalXp,
    level: raw.overallLevel,
    title: raw.title,
  }
}

export const profileService = {
  async getMyProfile(): Promise<UserProfile> {
    const response = await api.get<APIProfile>('/profile/me')
    return transformProfile(response.data)
  },

  async updateUsername(newUsername: string): Promise<UserProfile> {
    const response = await api.patch<APIProfile>('/profile/username', { username: newUsername })
    return transformProfile(response.data)
  },
}
