// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import React from 'react'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }
  return <>{children}</>
}

describe('AuthGuard route protection', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, user: null })
  })

  it('redirects unauthenticated users to /auth page', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/auth" element={<div>Auth Page</div>} />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <div>Dashboard Page</div>
              </AuthGuard>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.queryByText('Dashboard Page')).toBeNull()
  })

  it('allows authenticated users to view protected page', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { id: 'u1', username: 'Mkzay', email: 'mkzay@wahala.gg' },
    })

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/auth" element={<div>Auth Page</div>} />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <div>Dashboard Page</div>
              </AuthGuard>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Dashboard Page')).toBeDefined()
  })
})
