import axios, { AxiosError } from 'axios'
import type { AppError } from '../types/api'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL

const getBaseUrl = (): string => {
  const url = API_BASE_URL || 'http://localhost:3001'
  return url.endsWith('/v1') ? url : `${url}/v1`
}

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
})

let accessToken: string | null = null

export const getAccessToken = (): string | null => accessToken
export const setAccessToken = (token: string | null): void => {
  accessToken = token
}

export const getRefreshToken = (): string | null => localStorage.getItem('wahala_refresh_token')
export const setRefreshToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('wahala_refresh_token', token)
  } else {
    localStorage.removeItem('wahala_refresh_token')
  }
}

// Request interceptor to attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor to unpack envelope and handle token refresh
api.interceptors.response.use(
  (response) => {
    // Backend responses are wrapped in { success: true, data: T }
    if (response.data && response.data.success === true) {
      response.data = response.data.data
    }
    return response
  },
  async (error: AxiosError<{ message?: string; success?: boolean; error?: { message?: string; statusCode?: number } }>) => {
    const originalRequest = error.config as any

    const appError: AppError = {
      message: error.response?.data?.error?.message ?? error.response?.data?.message ?? 'Something went wrong',
      code: error.response?.data?.error?.statusCode ?? error.response?.status ?? 500,
    }

    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/signup')

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const rToken = getRefreshToken()
      if (rToken) {
        try {
          // Use basic axios to avoid interceptor recursion
          const refreshRes = await axios.post<{ success: boolean; data: { accessToken: string } }>(
            `${getBaseUrl()}/auth/refresh`,
            { refreshToken: rToken }
          )

          const newAccessToken = refreshRes.data.data.accessToken
          setAccessToken(newAccessToken)
          isRefreshing = false
          processQueue(null, newAccessToken)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          }
          return api(originalRequest)
        } catch (refreshError) {
          isRefreshing = false
          processQueue(refreshError, null)

          // Clear credentials
          setAccessToken(null)
          setRefreshToken(null)
          useAuthStore.getState().logout()
          
          window.location.href = '/auth'
          return Promise.reject(refreshError)
        }
      } else {
        setAccessToken(null)
        useAuthStore.getState().logout()
        window.location.href = '/auth'
      }
    }

    return Promise.reject(appError)
  }
)
