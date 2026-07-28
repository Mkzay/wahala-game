import { api, setAccessToken, setRefreshToken, getRefreshToken } from './api'
import type { AuthUser } from '../types/user'

interface LoginInput {
  email: string
  password: string
}

interface SignupInput {
  username: string;
  email: string;
  password: string;
}

interface AuthPayload {
  user: {
    id: string
    username: string
    email: string
  }
  accessToken: string
  refreshToken: string
}

function transformUser(raw: AuthPayload['user']): AuthUser {
  return {
    id: raw.id,
    username: raw.username,
    email: raw.email,
  }
}

export const authService = {
  async login(data: LoginInput): Promise<AuthUser> {
    const response = await api.post<AuthPayload>('/auth/login', data)
    // response.data is the unpacked AuthPayload because of response interceptor
    const { user, accessToken, refreshToken } = response.data
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    return transformUser(user)
  },

  async signup(data: SignupInput): Promise<AuthUser> {
    const response = await api.post<AuthPayload>('/auth/signup', data)
    const { user, accessToken, refreshToken } = response.data
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    return transformUser(user)
  },

  async logout(): Promise<void> {
    const rToken = getRefreshToken()
    try {
      if (rToken) {
        await api.post('/auth/logout', { refreshToken: rToken })
      }
    } finally {
      setAccessToken(null)
      setRefreshToken(null)
    }
  }
}
