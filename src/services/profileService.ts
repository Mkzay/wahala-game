import { api } from './api'

export interface Profile {
  id: string
  username: string
  email: string
  overallLevel: number
  totalXp: number
  coins: number
  title: string
  createdAt: string
}

export const profileService = {
  async getProfile(userId: string): Promise<Profile> {
    const response = await api.get<Profile>(`/profile/${userId}`)
    return response.data
  },
}
