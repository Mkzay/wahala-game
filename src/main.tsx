import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import './styles/globals.css'
import { queryClient } from './lib/queryClient'
import { router } from './routes'
import { ToastContainer } from './components/ui/ToastContainer'
import { DevErrorConsole } from './components/dev/DevErrorConsole'
import { devLog } from './store/devLogStore'

// Attach global uncaught exception and unhandled rejection listeners
window.onerror = (message, source, lineno, colno, error) => {
  devLog.unhandled(
    typeof message === 'string' ? message : 'Uncaught Script Error',
    error?.stack ?? `at ${source}:${lineno}:${colno}`
  )
}

window.onunhandledrejection = (event) => {
  const reason = event.reason
  devLog.unhandled(
    reason?.message ?? String(reason ?? 'Unhandled Promise Rejection'),
    reason?.stack
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
      <DevErrorConsole />
    </QueryClientProvider>
  </StrictMode>,
)
