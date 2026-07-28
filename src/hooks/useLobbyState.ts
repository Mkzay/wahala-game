import type { Room } from '../types/room'
import { useLobbyStore } from '../store/lobbyStore'

interface UseLobbyStateResult {
  activeRoom: Room | null
  setActiveRoom: (room: Room | null) => void
  clearLobby: () => void
}

export function useLobbyState(): UseLobbyStateResult {
  const { activeRoom, setActiveRoom, clearLobby } = useLobbyStore()

  return {
    activeRoom,
    setActiveRoom,
    clearLobby,
  }
}
