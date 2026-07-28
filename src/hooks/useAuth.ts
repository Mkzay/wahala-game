import type { AuthUser } from '../types/user'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'

interface UseAuthResult {
  isAuthenticated: boolean
  user: AuthUser | null
  loginWithPassword: (email: string, password: string) => Promise<void>
  signupWithEmail: (username: string, email: string, password: string) => Promise<void>
  login: (user: AuthUser) => void
  logout: () => Promise<void>
}

export function useAuth(): UseAuthResult {
  const { isAuthenticated, user, login, logout: localLogout } = useAuthStore()
  
  const loginWithPassword = async (email: string, password: string): Promise<void> => {
    const authenticatedUser = await authService.login({ email, password })
    login(authenticatedUser)
  }

  const signupWithEmail = async (username: string, email: string, password: string): Promise<void> => {
    const authenticatedUser = await authService.signup({ username, email, password })
    login(authenticatedUser)
  }

  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
    } finally {
      localLogout()
    }
  }

  return {
    isAuthenticated,
    user,
    loginWithPassword,
    signupWithEmail,
    login,
    logout,
  }
}
