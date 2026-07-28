import { create } from 'zustand'
import type { Room } from '../types/room'

interface LobbyStore {
  activeRoom: Room | null
  setActiveRoom: (room: Room | null) => void
  clearLobby: () => void
}

export const useLobbyStore = create<LobbyStore>((set) => ({
  activeRoom: null,
  setActiveRoom: (room) => set({ activeRoom: room }),
  clearLobby: () => set({ activeRoom: null }),
}))
