import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '../services/profileService'
import type { UserProfile } from '../types/user'
import type { AppError } from '../types/api'

export interface UseProfileResult {
  profile: UserProfile | null
  isLoading: boolean
  error: AppError | null
  updateUsername: (newUsername: string) => Promise<void>
}

export function useProfile(): UseProfileResult {
  const queryClient = useQueryClient()

  const query = useQuery<UserProfile, AppError>({
    queryKey: ['myProfile'],
    queryFn: () => profileService.getMyProfile(),
    staleTime: 5000,
  })

  const mutation = useMutation<UserProfile, AppError, string>({
    mutationFn: (newUsername: string) => profileService.updateUsername(newUsername),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['myProfile'], updatedProfile)
    },
  })

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error ?? null,
    updateUsername: async (newUsername: string) => {
      await mutation.mutateAsync(newUsername)
    },
  }
}
