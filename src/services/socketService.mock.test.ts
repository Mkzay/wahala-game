import { describe, it, expect, vi } from 'vitest'
import { mockSocketService } from './socketService.mock'

describe('mockSocketService', () => {
  it('subscribes and triggers custom socket events correctly', () => {
    const callback = vi.fn()
    mockSocketService.on('test:event', callback)

    mockSocketService.triggerEvent('test:event', { payload: 'hello' })
    expect(callback).toHaveBeenCalledWith({ payload: 'hello' })

    mockSocketService.off('test:event', callback)
    mockSocketService.triggerEvent('test:event', { payload: 'world' })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('simulates state snapshot when emitting game:join', async () => {
    const snapshotCallback = vi.fn()
    mockSocketService.on('game:stateSnapshot', snapshotCallback)

    mockSocketService.emit('game:join', { gameId: 'test-room' })

    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(snapshotCallback).toHaveBeenCalled()
    expect(snapshotCallback.mock.calls[0][0].game.gameId).toBe('test-room')
  })
})
