import { create } from 'zustand'
import type { Room } from '../types/room'

export interface LobbyMember {
  id: string
  username: string
  isHost: boolean
  isReady: boolean
  class?: string
}

export interface LobbyStore {
  activeRoom: Room | null
  members: LobbyMember[]
  isHost: boolean
  isReady: boolean
  setActiveRoom: (room: Room | null) => void
  setMembers: (members: LobbyMember[]) => void
  setIsHost: (isHost: boolean) => void
  toggleReady: () => void
  updateRoomSettings: (settings: Partial<Room>) => void
  clearLobby: () => void
}

export const useLobbyStore = create<LobbyStore>((set) => ({
  activeRoom: null,
  members: [],
  isHost: false,
  isReady: false,
  setActiveRoom: (room) => set({ activeRoom: room }),
  setMembers: (members) => set({ members }),
  setIsHost: (isHost) => set({ isHost }),
  toggleReady: () => set((state) => ({ isReady: !state.isReady })),
  updateRoomSettings: (settings) =>
    set((state) => ({
      activeRoom: state.activeRoom ? { ...state.activeRoom, ...settings } : null,
    })),
  clearLobby: () =>
    set({
      activeRoom: null,
      members: [],
      isHost: false,
      isReady: false,
    }),
}))
