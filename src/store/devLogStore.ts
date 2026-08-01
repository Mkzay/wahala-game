import { create } from 'zustand'

export type DevLogCategory = 'error' | 'warn' | 'network' | 'socket' | 'unhandled'

export interface DevLogEntry {
  id: string
  timestamp: string
  category: DevLogCategory
  message: string
  stack?: string
  screen: string
  statusCode?: number
  count: number
}

interface DevLogStore {
  logs: DevLogEntry[]
  isOpen: boolean
  activeCategory: string
  unreadCount: number
  addLog: (entry: {
    category: DevLogCategory
    message: string
    stack?: string
    statusCode?: number
  }) => void
  clearLogs: () => void
  toggleConsole: () => void
  setIsOpen: (isOpen: boolean) => void
  setActiveCategory: (category: string) => void
}

export const useDevLogStore = create<DevLogStore>((set, get) => ({
  logs: [],
  isOpen: false,
  activeCategory: 'all',
  unreadCount: 0,

  addLog: ({ category, message, stack, statusCode }) => {
    const currentScreen = typeof window !== 'undefined' ? window.location.pathname : '/'
    const existingLogs = get().logs

    // Check for duplicate log within last 2 seconds on same screen
    const existingIndex = existingLogs.findIndex(
      (l) => l.message === message && l.category === category && l.screen === currentScreen
    )

    if (existingIndex !== -1) {
      const updatedLogs = [...existingLogs]
      const target = updatedLogs[existingIndex]
      updatedLogs[existingIndex] = {
        ...target,
        count: target.count + 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }
      set({
        logs: updatedLogs,
        unreadCount: get().isOpen ? 0 : get().unreadCount + 1,
      })
      return
    }

    const newLog: DevLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      category,
      message,
      stack,
      screen: currentScreen,
      statusCode,
      count: 1,
    }

    set({
      logs: [newLog, ...existingLogs].slice(0, 100), // Max 100 logs
      unreadCount: get().isOpen ? 0 : get().unreadCount + 1,
    })
  },

  clearLogs: () => set({ logs: [], unreadCount: 0 }),
  toggleConsole: () => {
    const nextIsOpen = !get().isOpen
    set({ isOpen: nextIsOpen, unreadCount: nextIsOpen ? 0 : get().unreadCount })
  },
  setIsOpen: (isOpen) => set({ isOpen, unreadCount: isOpen ? 0 : get().unreadCount }),
  setActiveCategory: (category) => set({ activeCategory: category }),
}))

export const devLog = {
  error: (message: string, stack?: string) =>
    useDevLogStore.getState().addLog({ category: 'error', message, stack }),
  warn: (message: string) =>
    useDevLogStore.getState().addLog({ category: 'warn', message }),
  network: (message: string, statusCode?: number) =>
    useDevLogStore.getState().addLog({ category: 'network', message, statusCode }),
  socket: (message: string) =>
    useDevLogStore.getState().addLog({ category: 'socket', message }),
  unhandled: (message: string, stack?: string) =>
    useDevLogStore.getState().addLog({ category: 'unhandled', message, stack }),
}
