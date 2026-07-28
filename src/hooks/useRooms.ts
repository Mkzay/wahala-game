import { useQuery } from '@tanstack/react-query'
import { roomService } from '../services/roomService'
import type { Room } from '../types/room'
import type { AppError } from '../types/api'

interface UseRoomsResult {
  rooms: Room[]
  isLoading: boolean
  error: AppError | null
  refetch: () => void
}

export function useRooms(): UseRoomsResult {
  const query = useQuery<Room[], AppError>({
    queryKey: ['rooms'],
    queryFn: () => roomService.getRooms({}),
    staleTime: 5000,
  })

  return {
    rooms: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ?? null,
    refetch: () => {
      query.refetch()
    },
  }
}
