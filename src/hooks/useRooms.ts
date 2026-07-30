import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { roomService } from '../services/roomService'
import type { Room } from '../types/room'
import type { AppError } from '../types/api'

export type RoomFilter = 'all' | 'waiting' | 'in_progress'

export interface UseRoomsResult {
  rooms: Room[]
  isLoading: boolean
  error: AppError | null
  searchTerm: string
  setSearchTerm: (term: string) => void
  filter: RoomFilter
  setFilter: (filter: RoomFilter) => void
  refetch: () => void
}

export function useRooms(): UseRoomsResult {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filter, setFilter] = useState<RoomFilter>('all')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const query = useQuery<Room[], AppError>({
    queryKey: ['rooms', debouncedSearch, filter],
    queryFn: () =>
      roomService.getRooms({
        query: debouncedSearch,
        status: filter === 'all' ? undefined : filter,
      }),
    staleTime: 5000,
    refetchInterval: 10000,
  })

  return {
    rooms: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ?? null,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    refetch: () => {
      query.refetch()
    },
  }
}
