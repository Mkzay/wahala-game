import { describe, it, expect } from 'vitest'
import { transformRoom } from './roomService'
import type { APIRoom } from '../types/api'

describe('roomService - transformRoom', () => {
  it('correctly maps APIRoom properties to frontend Room domain model', () => {
    const rawApiRoom: APIRoom = {
      room_id: 'room-1234-abcd',
      room_name: 'Mkzay Den',
      host: {
        user_id: 'user-001',
        username: 'Mkzay',
      },
      game_mode: 'classic',
      visibility: 'public',
      current_players: 3,
      max_players: 6,
      status: 'waiting',
      created_at: '2026-07-30T00:00:00Z',
    }

    const room = transformRoom(rawApiRoom)

    expect(room.id).toBe('room-1234-abcd')
    expect(room.code).toBe('WHL-ABCD')
    expect(room.name).toBe('Mkzay Den')
    expect(room.hostId).toBe('user-001')
    expect(room.hostUsername).toBe('Mkzay')
    expect(room.gameMode).toBe('classic')
    expect(room.visibility).toBe('public')
    expect(room.playerCount).toBe(3)
    expect(room.maxPlayers).toBe(6)
    expect(room.status).toBe('waiting')
  })

  it('handles missing host metadata gracefully with default fallbacks', () => {
    const rawApiRoom: APIRoom = {
      room_id: 'room-9999-efgh',
      room_name: 'Solo Room',
      host: null as any,
      game_mode: 'progression',
      visibility: 'private',
      current_players: 1,
      max_players: 4,
      status: 'in_progress',
      created_at: '2026-07-30T00:00:00Z',
    }

    const room = transformRoom(rawApiRoom)

    expect(room.id).toBe('room-9999-efgh')
    expect(room.hostId).toBe('unknown')
    expect(room.hostUsername).toBe('Host')
    expect(room.status).toBe('in_progress')
  })
})
