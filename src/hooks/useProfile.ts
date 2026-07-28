import { useQuery } from '@tanstack/react-query'
import { profileService, type Profile } from '../services/profileService'
import type { AppError } from '../types/api'

interface UseProfileResult {
  profile: Profile | null
  isLoading: boolean
  error: AppError | null
}

export function useProfile(userId: string): UseProfileResult {
  const query = useQuery<Profile, AppError>({
    queryKey: ['profile', userId],
    queryFn: () => profileService.getProfile(userId),
    staleTime: 5000,
    enabled: userId.length > 0,
  })

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error ?? null,
  }
}
