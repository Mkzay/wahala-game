// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRooms } from './useRooms'
import React from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useRooms hook', () => {
  it('manages search term and filter state correctly', () => {
    const { result } = renderHook(() => useRooms(), { wrapper })

    expect(result.current.searchTerm).toBe('')
    expect(result.current.filter).toBe('all')

    act(() => {
      result.current.setSearchTerm('Naija')
      result.current.setFilter('waiting')
    })

    expect(result.current.searchTerm).toBe('Naija')
    expect(result.current.filter).toBe('waiting')
  })
})
