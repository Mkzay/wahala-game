import type { Socket } from 'socket.io-client'

export type SocketConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting'

export interface ISocketService {
  connect(): Socket | null
  disconnect(): void
  getSocket(): Socket | null
  isConnected(): boolean
  emit<T = unknown>(event: string, data?: T): void
  on<T = unknown>(event: string, callback: (data: T) => void): void
  off(event: string, callback?: (...args: any[]) => void): void
}
