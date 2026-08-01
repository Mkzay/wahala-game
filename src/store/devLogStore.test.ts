import { describe, it, expect, beforeEach } from 'vitest'
import { useDevLogStore, devLog } from './devLogStore'

describe('useDevLogStore', () => {
  beforeEach(() => {
    useDevLogStore.getState().clearLogs()
    useDevLogStore.setState({ isOpen: false, activeCategory: 'all', unreadCount: 0 })
  })

  it('adds error logs and increments unread count when console is closed', () => {
    devLog.error('Test runtime exception', 'Error: at line 10')
    const logs = useDevLogStore.getState().logs

    expect(logs.length).toBe(1)
    expect(logs[0].category).toBe('error')
    expect(logs[0].message).toBe('Test runtime exception')
    expect(logs[0].stack).toBe('Error: at line 10')
    expect(useDevLogStore.getState().unreadCount).toBe(1)
  })

  it('deduplicates identical consecutive log entries on the same screen', () => {
    devLog.network('GET /v1/profile 500 Internal Error', 500)
    devLog.network('GET /v1/profile 500 Internal Error', 500)

    const logs = useDevLogStore.getState().logs
    expect(logs.length).toBe(1)
    expect(logs[0].count).toBe(2)
  })

  it('clears logs and resets unread count', () => {
    devLog.socket('Socket disconnected')
    useDevLogStore.getState().clearLogs()

    expect(useDevLogStore.getState().logs.length).toBe(0)
    expect(useDevLogStore.getState().unreadCount).toBe(0)
  })

  it('resets unread count when opening console', () => {
    devLog.warn('Deprecated feature warning')
    expect(useDevLogStore.getState().unreadCount).toBe(1)

    useDevLogStore.getState().toggleConsole()
    expect(useDevLogStore.getState().isOpen).toBe(true)
    expect(useDevLogStore.getState().unreadCount).toBe(0)
  })
})
