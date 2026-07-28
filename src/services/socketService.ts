import { io, type Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null

  public connect(): Socket {
    if (this.socket) {
      return this.socket
    }

    this.socket = io(import.meta.env.VITE_WS_URL, {
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
}

export const socketService = new SocketService()
