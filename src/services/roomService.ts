import { api } from './api'
import type { Room } from '../types/room'

interface RoomSearchParams {
  query?: string
  status?: string
  mode?: string
  page?: number
  limit?: number
}

interface CreateRoomInput {
  name: string
  gameMode: string
  visibility: 'public' | 'private'
  maxPlayers: number
  roundCount?: number
  timerEnabled?: boolean
}

export const roomService = {
  async getRooms(params: RoomSearchParams): Promise<Room[]> {
    const response = await api.get<Room[]>('/rooms', { params })
    return response.data
  },

  async createRoom(data: CreateRoomInput): Promise<Room> {
    const response = await api.post<Room>('/rooms', data)
    return response.data
  },

  async getRoom(roomId: string): Promise<Room> {
    const response = await api.get<Room>(`/rooms/${roomId}`)
    return response.data
  },

  async joinRoom(roomId: string): Promise<void> {
    await api.post(`/rooms/${roomId}/join`)
  },

  async leaveRoom(roomId: string): Promise<void> {
    await api.post(`/rooms/${roomId}/leave`)
  }
}
