import { describe, it, expect } from 'vitest'
import { transformProfile } from './profileService'
import type { APIUser } from '../types/api'

describe('profileService - transformProfile', () => {
  it('correctly maps APIUser properties to UserProfile domain model', () => {
    const rawApiUser: APIUser = {
      id: 'user-777',
      username: 'Mkzay',
      email: 'mkzay@wahala.gg',
      avatar_url: 'https://avatar.url/mkzay.png',
      coins: 3500,
      xp: 2400,
      level: 12,
      favorite_class: 'Joker',
    }

    const profile = transformProfile(rawApiUser)

    expect(profile.id).toBe('user-777')
    expect(profile.username).toBe('Mkzay')
    expect(profile.email).toBe('mkzay@wahala.gg')
    expect(profile.coins).toBe(3500)
    expect(profile.xp).toBe(2400)
    expect(profile.level).toBe(12)
    expect(profile.favoriteClass).toBe('Joker')
  })

  it('provides safe default values for optional APIUser properties', () => {
    const rawApiUser: APIUser = {
      id: 'user-002',
      username: 'Esther',
    }

    const profile = transformProfile(rawApiUser)

    expect(profile.id).toBe('user-002')
    expect(profile.username).toBe('Esther')
    expect(profile.email).toBe('')
    expect(profile.coins).toBe(1250)
    expect(profile.xp).toBe(750)
    expect(profile.level).toBe(4)
    expect(profile.favoriteClass).toBe('Mastermind')
  })
})
