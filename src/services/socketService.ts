import { io, type Socket } from 'socket.io-client'
import type { ISocketService } from '../types/socket'
import { mockSocketService } from './socketService.mock'

class LiveSocketService implements ISocketService {
  private socket: Socket | null = null

  public connect(): Socket | null {
    if (this.socket) {
      return this.socket
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3001'
    this.socket = io(wsUrl, {
      autoConnect: true,
      transports: ['websocket'],
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    })

    return this.socket
  }

  public disconnect(): void {
    if (!this.socket) {
      return
    }

    this.socket.disconnect()
    this.socket = null
  }

  public getSocket(): Socket | null {
    return this.socket
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  public emit<T = unknown>(event: string, data?: T): void {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  public on<T = unknown>(event: string, callback: (data: T) => void): void {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  public off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }
}

const useMock = import.meta.env.VITE_USE_MOCK_SOCKET === 'true'
export const socketService: ISocketService = useMock ? mockSocketService : new LiveSocketService()
