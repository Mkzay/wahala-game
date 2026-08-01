import { describe, it, expect } from 'vitest'
import { transformRoom } from './roomService'
import type { APIRoom } from '../types/api'

describe('roomService - transformRoom', () => {
  it('correctly maps APIRoom properties to frontend Room domain model', () => {
    const rawApiRoom: APIRoom = {
      id: 'room-1234-abcd',
      code: 'WHL-ABCD',
      name: 'Mkzay Den',
      hostId: 'user-001',
      hostUsername: 'Mkzay',
      gameMode: 'classic',
      visibility: 'public',
      maxPlayers: 6,
      playerCount: 3,
      roundCount: null,
      timerEnabled: false,
      status: 'waiting',
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

  it('passes through fields without transformation', () => {
    const rawApiRoom: APIRoom = {
      id: 'room-9999-efgh',
      code: 'WHL-EFGH',
      name: 'Solo Room',
      hostId: 'user-002',
      hostUsername: 'Player2',
      gameMode: 'progression',
      visibility: 'private',
      maxPlayers: 4,
      playerCount: 1,
      roundCount: 5,
      timerEnabled: true,
      status: 'waiting',
    }

    const room = transformRoom(rawApiRoom)

    expect(room.id).toBe('room-9999-efgh')
    expect(room.hostId).toBe('user-002')
    expect(room.hostUsername).toBe('Player2')
    expect(room.status).toBe('waiting')
    expect(room.gameMode).toBe('progression')
    expect(room.roundCount).toBe(5)
    expect(room.timerEnabled).toBe(true)
  })
})
