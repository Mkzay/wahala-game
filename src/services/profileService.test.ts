import { describe, it, expect } from 'vitest'
import { transformProfile } from './profileService'
import type { APIProfile } from '../types/api'

describe('profileService - transformProfile', () => {
  it('maps APIProfile to UserProfile domain model', () => {
    const raw: APIProfile = {
      id: 'user-777',
      username: 'Mkzay',
      email: 'mkzay@wahala.gg',
      overallLevel: 12,
      totalXp: 2400,
      coins: 3500,
      title: 'Veteran',
      createdAt: '2026-01-15T00:00:00.000Z',
    }

    const profile = transformProfile(raw)

    expect(profile.id).toBe('user-777')
    expect(profile.username).toBe('Mkzay')
    expect(profile.email).toBe('mkzay@wahala.gg')
    expect(profile.coins).toBe(3500)
    expect(profile.xp).toBe(2400)
    expect(profile.level).toBe(12)
    expect(profile.title).toBe('Veteran')
  })
})
