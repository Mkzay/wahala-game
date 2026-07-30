import { api } from './api'
import type { Room } from '../types/room'
import type { APIRoom } from '../types/api'

export interface RoomSearchParams {
  query?: string
  status?: string
  mode?: string
  page?: number
  limit?: number
}

export interface CreateRoomInput {
  name: string
  gameMode: string
  visibility: 'public' | 'private'
  maxPlayers: number
  roundCount?: number
  timerEnabled?: boolean
}

export function transformRoom(raw: APIRoom): Room {
  const roomId = raw?.room_id ?? 'room-demo'
  const hostId = raw?.host?.user_id ?? 'unknown'
  const hostUsername = raw?.host?.username ?? 'Host'
  return {
    id: roomId,
    code: `WHL-${roomId.slice(-4).toUpperCase()}`,
    name: raw?.room_name ?? 'Battle Room',
    hostId,
    hostUsername,
    gameMode: raw?.game_mode ?? 'classic',
    visibility: raw?.visibility ?? 'private',
    maxPlayers: raw?.max_players ?? 6,
    playerCount: raw?.current_players ?? 1,
    roundCount: null,
    timerEnabled: true,
    status: raw?.status === 'in_progress' ? 'in_progress' : raw?.status === 'completed' ? 'finished' : 'waiting',
  }
}

export const roomService = {
  async getRooms(params: RoomSearchParams): Promise<Room[]> {
    const response = await api.get<APIRoom[]>('/rooms', { params })
    return Array.isArray(response.data) ? response.data.map(transformRoom) : []
  },

  async createRoom(data: CreateRoomInput): Promise<Room> {
    const response = await api.post<APIRoom>('/rooms', data)
    return transformRoom(response.data)
  },

  async getRoom(roomId: string): Promise<Room> {
    const response = await api.get<APIRoom>(`/rooms/${roomId}`)
    return transformRoom(response.data)
  },

  async joinRoom(roomId: string): Promise<void> {
    await api.post(`/rooms/${roomId}/join`)
  },

  async leaveRoom(roomId: string): Promise<void> {
    await api.post(`/rooms/${roomId}/leave`)
  },
}
