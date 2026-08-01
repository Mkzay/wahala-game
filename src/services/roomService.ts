import { api } from './api'
import type { Room } from '../types/room'
import type { APIRoom, APIRoomReadyState, APIRoomReadyPlayer } from '../types/api'

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

export interface PlayerInfo {
  userId: string
  username: string
  isReady: boolean
  joinedAt: string
}

export interface RoomReadyInfo {
  roomId: string
  players: PlayerInfo[]
  allReady: boolean
}

export function transformRoom(raw: APIRoom): Room {
  return {
    id: raw.id,
    code: raw.code,
    name: raw.name,
    hostId: raw.hostId,
    hostUsername: raw.hostUsername,
    gameMode: raw.gameMode,
    visibility: raw.visibility,
    maxPlayers: raw.maxPlayers,
    playerCount: raw.playerCount,
    roundCount: raw.roundCount,
    timerEnabled: raw.timerEnabled,
    status: raw.status,
  }
}

export function transformReadyState(raw: APIRoomReadyState): RoomReadyInfo {
  return {
    roomId: raw.roomId,
    allReady: raw.allReady,
    players: raw.players.map((p: APIRoomReadyPlayer) => ({
      userId: p.userId,
      username: p.username,
      isReady: p.isReady,
      joinedAt: p.joinedAt,
    })),
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

  async joinRoomByCode(code: string): Promise<Room> {
    const response = await api.post<APIRoom>('/rooms/join-by-code', { code })
    return transformRoom(response.data)
  },

  async leaveRoom(roomId: string): Promise<void> {
    await api.post(`/rooms/${roomId}/leave`)
  },

  async getReadyState(roomId: string): Promise<RoomReadyInfo> {
    const response = await api.get<APIRoomReadyState>(`/rooms/${roomId}/ready`)
    return transformReadyState(response.data)
  },

  async setReady(roomId: string): Promise<RoomReadyInfo> {
    const response = await api.post<APIRoomReadyState>(`/rooms/${roomId}/ready`)
    return transformReadyState(response.data)
  },

  async startGame(roomId: string): Promise<{ gameId: string }> {
    const response = await api.post<{ gameId: string }>(`/rooms/${roomId}/start`)
    return response.data
  },

  async updateRoom(roomId: string, data: Partial<CreateRoomInput>): Promise<Room> {
    const response = await api.patch<APIRoom>(`/rooms/${roomId}`, data)
    return transformRoom(response.data)
  },
}
