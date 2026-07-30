import { create } from 'zustand'
import type { ToastMessage } from '../types/toast'

interface ToastState {
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const newToast: ToastMessage = {
      id,
      durationMs: 4000,
      ...toast,
    }

    set((state) => ({
      toasts: [newToast, ...state.toasts].slice(0, 5), // Keep max 5 active toasts
    }))

    if (newToast.durationMs && newToast.durationMs > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, newToast.durationMs)
    }

    return id
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}))

export const toast = {
  error: (message: string, title: string = 'Action Failed') =>
    useToastStore.getState().addToast({ type: 'error', title, message }),

  success: (message: string, title: string = 'Success') =>
    useToastStore.getState().addToast({ type: 'success', title, message }),

  warning: (message: string, title: string = 'Warning') =>
    useToastStore.getState().addToast({ type: 'warning', title, message }),

  info: (message: string, title: string = 'Notice') =>
    useToastStore.getState().addToast({ type: 'info', title, message }),

  wahala: (message: string, title: string = 'WAHALA Alert! 💥') =>
    useToastStore.getState().addToast({ type: 'wahala', title, message, durationMs: 5000 }),
}
