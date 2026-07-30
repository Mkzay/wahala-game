export type ToastType = 'error' | 'success' | 'warning' | 'info' | 'wahala'

export interface ToastMessage {
  id: string
  type: ToastType
  title?: string
  message: string
  durationMs?: number
}
