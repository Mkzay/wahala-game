import { describe, it, expect, beforeEach } from 'vitest'
import { useToastStore, toast } from './toastStore'

describe('toastStore', () => {
  beforeEach(() => {
    useToastStore.getState().clearToasts()
  })

  it('adds and removes toasts correctly', () => {
    toast.error('Test Error Message', 'Error Title')

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].type).toBe('error')
    expect(toasts[0].title).toBe('Error Title')
    expect(toasts[0].message).toBe('Test Error Message')

    useToastStore.getState().removeToast(toasts[0].id)
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('supports wahala toast notification type', () => {
    toast.wahala('Chaos Leap activated!')

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0].type).toBe('wahala')
    expect(toasts[0].title).toBe('WAHALA Alert! 💥')
  })
})
