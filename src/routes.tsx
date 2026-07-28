import { lazy, Suspense } from 'react'
import type { ReactElement } from 'react'
import ErrorPage from './pages/ErrorPage'
import {
  Navigate,
  Outlet,
  useParams,
  type RouteObject,
  createBrowserRouter,
} from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useGameStore } from './store/gameStore'

const Home = lazy(() => import('./pages/Home'))
const Auth = lazy(() => import('./pages/Auth'))
const CreateRoom = lazy(() => import('./pages/CreateRoom'))
const Lobby = lazy(() => import('./pages/Lobby'))
const GameBoard = lazy(() => import('./pages/GameBoard'))
const ClassSelection = lazy(() => import('./pages/ClassSelection'))
const RoundEnd = lazy(() => import('./pages/RoundEnd'))
const GameEnd = lazy(() => import('./pages/GameEnd'))
const Spectator = lazy(() => import('./pages/Spectator'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))
const Rulebook = lazy(() => import('./pages/Rulebook'))
const RoomBrowser = lazy(() => import('./pages/RoomBrowser'))
const History = lazy(() => import('./pages/History'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-w-bg font-body text-w-text">
      Loading…
    </div>
  )
}

type GuardType = 'auth' | 'game' | null

interface AppRouteDefinition {
  path: string
  guard: GuardType
  element: ReactElement
}

function AuthGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}

function GameGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const canAccessGame = useGameStore((state) => state.canAccessGame)

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  if (!canAccessGame) {
    return <Navigate to="/rooms" replace />
  }

  return <Outlet />
}

function GameEntryRedirect() {
  const { gameId = '' } = useParams()
  const gamePhase = useGameStore((state) => state.gamePhase)
  const phasePathMap = {
    classSelection: 'class-selection',
    board: 'board',
    roundEnd: 'round-end',
    gameEnd: 'game-end',
  } as const

  return <Navigate to={`/game/${gameId}/${phasePathMap[gamePhase]}`} replace />
}

const withSuspense = (element: ReactElement) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
)

const routeDefinitions: AppRouteDefinition[] = [
  { path: '/', guard: null, element: <Navigate to="/auth" replace /> },
  { path: '/home', guard: 'auth', element: <Home /> },
  { path: '/auth', guard: null, element: <Auth /> },
  { path: '/rulebook', guard: null, element: <Rulebook /> },
  { path: '/rooms', guard: 'auth', element: <RoomBrowser /> },
  { path: '/history', guard: 'auth', element: <History /> },
  { path: '/leaderboard', guard: 'auth', element: <Leaderboard /> },
  { path: '/rooms/create', guard: 'auth', element: <CreateRoom /> },
  { path: '/rooms/:roomId', guard: 'auth', element: <Lobby /> },
  { path: '/game/:gameId/spectate', guard: 'auth', element: <Spectator /> },
  { path: '/profile/:userId', guard: 'auth', element: <Profile /> },
  { path: '/settings', guard: 'auth', element: <Settings /> },
  { path: '/game/:gameId', guard: 'game', element: <GameEntryRedirect /> },
  { path: '/game/:gameId/board', guard: 'game', element: <GameBoard /> },
  { path: '/game/:gameId/class-selection', guard: 'game', element: <ClassSelection /> },
  { path: '/game/:gameId/round-end', guard: 'game', element: <RoundEnd /> },
  { path: '/game/:gameId/game-end', guard: 'game', element: <GameEnd /> },
  { path: '*', guard: null, element: <NotFound /> },
]

function buildRoutes(): RouteObject[] {
  const publicRoutes: RouteObject[] = []
  const authRoutes: RouteObject[] = []
  const gameRoutes: RouteObject[] = []

  routeDefinitions.forEach((route) => {
    const routeObject: RouteObject = {
      path: route.path,
      element: withSuspense(route.element),
    }

    if (route.guard === 'auth') {
      authRoutes.push(routeObject)
      return
    }

    if (route.guard === 'game') {
      gameRoutes.push(routeObject)
      return
    }

    publicRoutes.push(routeObject)
  })

  return [
    ...publicRoutes.map((r) => ({ ...r, errorElement: <ErrorPage /> })),
    { element: <AuthGuard />, children: authRoutes, errorElement: <ErrorPage /> },
    { element: <GameGuard />, children: gameRoutes, errorElement: <ErrorPage /> },
  ]
}

export const router = createBrowserRouter(buildRoutes())
