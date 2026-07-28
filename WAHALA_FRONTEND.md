# WAHALA — FRONTEND ARCHITECTURE & STANDARDS

> This document is the single source of truth for all frontend decisions on Wahala.
> Every developer and AI agent working on this codebase must read and follow this before writing a single line of code.
> When in doubt, refer here first.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repo Structure](#2-repo-structure)
3. [Tech Stack](#3-tech-stack)
4. [The Three-Layer Architecture](#4-the-three-layer-architecture)
5. [WebSocket Layer](#5-websocket-layer)
6. [State Management Rules](#6-state-management-rules)
7. [Component Standards](#7-component-standards)
8. [TypeScript Standards](#8-typescript-standards)
9. [Routing](#9-routing)
10. [Styling Standards](#10-styling-standards)
11. [Performance Rules](#11-performance-rules)
12. [Error Handling](#12-error-handling)
13. [File and Folder Naming](#13-file-and-folder-naming)
14. [Dos and Don'ts](#14-dos-and-donts)
15. [Constraints](#15-constraints)
16. [Checklist Before Pushing Code](#16-checklist-before-pushing-code)
17. [Definition of Done](#17-definition-of-done)
18. [Testing Standards](#18-testing-standards)
19. [Environment Variables](#19-environment-variables)
20. [Design System Tokens](#20-design-system-tokens)

---

## 1. Project Overview

**Product name:** Wahala
**Description:** A real-time multiplayer web card game reimagining Naija Whot with classes, abilities, dynamic rules, and progression systems.

**Two frontend repos:**

| Repo | Purpose | Framework | Deploy |
|---|---|---|---|
| `wahala-landing` | Marketing site, SEO, discovery | Next.js 14+ (App Router) | Vercel |
| `wahala-game` | The actual game client | React + Vite | Vercel (proxied from `/game`) |

**Backend:** Node.js + Express + Socket.io on Railway
**Database:** Neon PostgreSQL
**Domain:** All traffic under one domain via Vercel rewrites

---

## 2. Repo Structure

### `wahala-landing`

```
wahala-landing/
  app/
    page.tsx
    layout.tsx
    globals.css
  components/
    Hero.tsx
    HowItWorks.tsx
    Footer.tsx
  public/
    assets/
  next.config.js
  tailwind.config.ts
  tsconfig.json
```

Keep this simple. It is a marketing surface, not an app. No state management. No complex logic.

---

### `wahala-game`

```
wahala-game/
  src/
    assets/
      fonts/
      icons/
    components/
      ui/                  # Design system atoms — no business logic
      game/                # Game-specific components
      lobby/               # Lobby-specific components
      profile/             # Profile-specific components
    features/              # Self-contained feature modules (if needed)
    hooks/                 # All custom React hooks
    lib/
      utils.ts             # Pure utility functions
      constants.ts         # App-wide constants
      validators.ts        # Input validation helpers
    pages/                 # Top-level route pages (one per screen)
    services/              # HTTP and WebSocket service layer
    store/                 # Zustand stores
    styles/
      tokens.css           # Design tokens (colors, typography, spacing)
      globals.css
    types/                 # All TypeScript types and interfaces
      game.ts
      user.ts
      room.ts
      api.ts
    routes.tsx             # Central route definitions
    main.tsx               # App entry point
  index.html
  vite.config.ts
  tailwind.config.ts
  tsconfig.json
  .env.example
```

---

## 3. Tech Stack

| Concern | Tool | Version | Notes |
|---|---|---|---|
| Framework | React | 18+ | Concurrent features enabled |
| Build tool | Vite | 5+ | Fast HMR, optimized builds |
| Language | TypeScript | 5+ | Strict mode always on |
| Styling | Tailwind CSS | 3+ | Utility-first, no CSS-in-JS |
| Routing | React Router | v6 | Declarative routing |
| Server state | TanStack Query | v5 | All HTTP data fetching |
| Client state | Zustand | v4 | Real-time game state only |
| WebSocket | Socket.io client | v4 | Must match server version |
| Animation | CSS transforms only | — | No Framer Motion in V1 |
| Forms | React Hook Form | v7 | Auth forms and settings only |
| Icons | Custom SVG | — | Inline SVGs, no icon library |
| Testing | Vitest + RTL | — | Unit and component tests |

**Do not add new dependencies without documenting why here.**

---

## 4. The Three-Layer Architecture

This is the foundational pattern for every feature. No exceptions.

```
Service Layer → Hook Layer → Component Layer
```

### Layer 1 — Service Layer (`src/services/`)

**Responsibility:**
- Makes HTTP requests to the backend API
- Handles auth token injection via Axios interceptors
- Transforms raw API response shapes into UI-friendly shapes
- Returns typed data only — no React, no state, no side effects

**Rules:**
- Services are plain TypeScript functions. No React hooks inside services.
- Every service function must have a return type annotation.
- All API response transformations happen here, never in hooks or components.
- Services do not handle loading or error state. That is the hook's job.

**Files:**
```
services/
  api.ts               # Axios instance with interceptors
  authService.ts       # login, signup, logout, refresh token
  roomService.ts       # createRoom, getRooms, joinRoom, updateRoom
  gameService.ts       # getGameHistory, getGameResult
  profileService.ts    # getProfile, updateUsername, updateEmail
  socketService.ts     # WebSocket connection and event management
```

**Example:**
```typescript
// services/roomService.ts
export const roomService = {
  getRooms: async (params: RoomSearchParams): Promise<Room[]> => {
    const response = await api.get('/rooms', { params })
    return response.data.rooms.map(transformRoom)
  },

  createRoom: async (data: CreateRoomInput): Promise<Room> => {
    const response = await api.post('/rooms', data)
    return transformRoom(response.data.room)
  },
}

// Always transform — never let raw API shapes reach components
function transformRoom(raw: APIRoom): Room {
  return {
    id: raw.room_id,
    name: raw.room_name,
    hostUsername: raw.host.username,
    mode: raw.game_mode,
    playerCount: raw.current_players,
    maxPlayers: raw.max_players,
    status: raw.status,
  }
}
```

---

### Layer 2 — Hook Layer (`src/hooks/`)

**Responsibility:**
- Calls the service layer
- Manages loading, error, and data state
- Handles caching, refetching, and optimistic updates via TanStack Query
- Encapsulates business logic and side effects
- Returns everything a component needs — nothing more

**Rules:**
- Hooks call services. Hooks do not make fetch calls directly.
- Every hook must explicitly type its return value.
- Keep hooks focused — one hook per feature concern.
- Hooks can call other hooks. Hooks cannot call components.
- Debouncing, polling intervals, and retry logic all live in hooks.

**Files:**
```
hooks/
  useAuth.ts               # Auth state, login, logout
  useRooms.ts              # Room list, search, filter
  useRoom.ts               # Single room, lobby state
  useProfile.ts            # User profile data
  useGameSocket.ts         # WebSocket connection lifecycle
  useGameState.ts          # Selectors over Zustand game store
  useLobbyState.ts         # Selectors over Zustand lobby store
  useAbility.ts            # Ability activation logic
  useTimer.ts              # Countdown timer
  useReactionWindow.ts     # 5-second reaction window
  useClassSelection.ts     # Class selection + shop flow
  useToast.ts              # Toast notification trigger
```

**Example:**
```typescript
// hooks/useRooms.ts
export function useRooms() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<RoomFilter>('all')
  const debouncedSearch = useDebounce(searchTerm, 300)

  const { data: rooms = [], isLoading, error, refetch } = useQuery({
    queryKey: ['rooms', debouncedSearch, filter],
    queryFn: () => roomService.getRooms({ query: debouncedSearch, filter }),
    refetchInterval: 10_000,
    staleTime: 5_000,
  })

  return { rooms, isLoading, error, searchTerm, setSearchTerm, filter, setFilter, refetch }
}
```

---

### Layer 3 — Component Layer (`src/components/` + `src/pages/`)

**Responsibility:**
- Renders UI based on data from hooks
- Handles user interactions (clicks, inputs, gestures)
- Calls hook functions in response to events
- Contains zero API calls and zero business logic

**Rules:**
- Components never import from `services/` directly. Ever.
- Components never manage server data with `useState`. Use TanStack Query.
- Components receive data from hooks only.
- If a component is getting large, split it. Page components should be thin orchestrators.
- UI state (lifted card, open modal, active tab) stays local with `useState`.

**Three sub-levels:**

```
components/ui/          # Design system atoms — Button, Card, Badge, Toggle, Input
components/game/        # Game-specific components — ClassCard, HandFan, ActiveCard
components/lobby/       # Lobby components — RoomCard, PlayerRow
pages/                  # Full screens — one file per screen
```

**Example:**
```typescript
// pages/RoomBrowser.tsx
export function RoomBrowser() {
  const { rooms, isLoading, error, searchTerm, setSearchTerm, filter, setFilter } = useRooms()

  return (
    <Layout>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      <FilterChips active={filter} onChange={setFilter} />
      {isLoading && <Spinner />}
      {error && <ErrorMessage message="Could not load rooms. Try again." />}
      {!isLoading && rooms.length === 0 && <EmptyState />}
      {rooms.map(room => <RoomCard key={room.id} room={room} />)}
    </Layout>
  )
}
```

---

## 5. WebSocket Layer

The WebSocket layer runs in parallel to the three-layer architecture. It has its own service, feeds Zustand stores, and is consumed via hooks.

**Data flow:**
```
socketService → Zustand store → hook selector → component
```

**socketService responsibilities:**
- Manages the Socket.io connection lifecycle
- Registers all event listeners
- Dispatches incoming events to the correct Zustand store action
- Exposes an `emit()` method for outgoing events
- Handles reconnection logic

**Critical rules:**
- There is only ONE socket connection at a time. Never create multiple connections.
- Always disconnect the socket when the component that created it unmounts.
- On every reconnect, request a full game state snapshot from the server.
- Never trust local game state after a disconnection. Always resync.

**Event naming convention:**
```
noun:verb

Examples:
  card:played
  turn:changed
  rule:activated
  round:ended
  game:ended
  player:disconnected
  reaction:window:opened
  ability:used
```

**Zustand stores fed by WebSocket:**
```
store/gameStore.ts     # Live game state during a game
store/lobbyStore.ts    # Lobby state (ready status, settings changes)
```

---

## 6. State Management Rules

| State type | Tool | Example |
|---|---|---|
| Server data (HTTP) | TanStack Query | Profile, room list, game history |
| Real-time game data | Zustand | Active card, turn, rules, timers |
| UI state | useState | Lifted card, open modal, active tab |
| Form state | React Hook Form | Auth form, create room form |
| URL state | React Router | Room ID, game ID, active filters |

**Rules:**
- Never put UI state in Zustand. It belongs in the component.
- Never put server data in Zustand. It belongs in TanStack Query.
- Never put real-time game state in TanStack Query. It belongs in Zustand.
- Never use Context API for anything TanStack Query or Zustand can handle.
- Never use Redux. It is not in the stack.

---

## 7. Component Standards

### Naming
- Components: PascalCase (`ClassCard.tsx`)
- Hooks: camelCase with `use` prefix (`useRooms.ts`)
- Services: camelCase with `Service` suffix (`roomService.ts`)
- Stores: camelCase with `Store` suffix (`gameStore.ts`)
- Types and interfaces: PascalCase (`Room`, `Player`, `GameState`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_PLAYERS`, `REACTION_WINDOW_MS`)

### Structure of a component file
```typescript
// 1. Imports (external first, internal second)
// 2. Types / interfaces local to this file
// 3. Constants local to this file
// 4. The component function
// 5. Sub-components if small enough to live in same file
// 6. Default export at bottom
```

### Props
- Always define a Props interface for every component.
- Never use `any` as a prop type.
- Prefer explicit props over spread props (`{...props}`).

```typescript
interface RoomCardProps {
  room: Room
  onJoin: (roomId: string) => void
}

export function RoomCard({ room, onJoin }: RoomCardProps) { ... }
```

---

## 8. TypeScript Standards

- **Strict mode is always on.** `"strict": true` in tsconfig. Non-negotiable.
- **No `any`.** Use `unknown` if you genuinely don't know the type, then narrow it.
- **No type assertions (`as SomeType`)** unless absolutely unavoidable with a comment explaining why.
- **All function return types must be explicitly annotated** on service functions and hooks.
- **All API response types live in `types/api.ts`.** UI types live in `types/game.ts`, `types/user.ts`, `types/room.ts`.
- **Use `type` for unions and primitives. Use `interface` for object shapes.**

```typescript
// types/game.ts
type GameMode = 'classic' | 'progression'
type ClassName = 'joker' | 'wall' | 'striker' | 'mastermind'
type RuleType = 'light' | 'moderate' | 'chaotic'
type PlayerStatus = 'active' | 'eliminated' | 'spectating'

interface Player {
  id: string
  username: string
  class: ClassName | null
  cardCount: number
  status: PlayerStatus
}

interface GameState {
  gameId: string
  mode: GameMode
  round: number
  totalRounds: number
  currentTurnPlayerId: string
  players: Player[]
  marketCount: number
}
```

---

## 9. Routing

```typescript
// routes.tsx
const routes = [
  { path: '/',                      element: <Home />,           guard: null },
  { path: '/auth',                  element: <Auth />,           guard: null },
  { path: '/rooms',                 element: <RoomBrowser />,    guard: 'auth' },
  { path: '/rooms/create',          element: <CreateRoom />,     guard: 'auth' },
  { path: '/rooms/:roomId',         element: <Lobby />,          guard: 'auth' },
  { path: '/game/:gameId',          element: <GameBoard />,      guard: 'game' },
  { path: '/game/:gameId/spectate', element: <Spectator />,      guard: 'auth' },
  { path: '/profile/:userId',       element: <Profile />,        guard: 'auth' },
  { path: '/settings',              element: <Settings />,       guard: 'auth' },
  { path: '/rulebook',              element: <Rulebook />,       guard: null },
  { path: '*',                      element: <NotFound />,       guard: null },
]
```

**Route guards:**
- `auth` — User must be authenticated. Redirect to `/auth` if not.
- `game` — User must be an active participant in the game. Redirect to `/rooms` if not.
- `null` — Public. Anyone can access.

**All page components are lazy loaded:**
```typescript
const GameBoard = lazy(() => import('./pages/GameBoard'))
```

---

## 10. Styling Standards

**Tailwind CSS is the only styling tool.** No styled-components, no CSS modules, no inline style objects (except for dynamic values that Tailwind cannot handle).

**Design tokens are defined in `styles/tokens.css`** and extended into `tailwind.config.ts`.

### Wahala Design Tokens

```css
/* styles/tokens.css */
:root {
  /* Colors */
  --color-bg:          #0F0F0F;
  --color-surface:     #141414;
  --color-surface-2:   #1A1A1A;
  --color-border:      #242424;
  --color-border-2:    #2A2A2A;

  --color-orange:      #E8500A;
  --color-yellow:      #FFD200;
  --color-text:        #F5F0E8;
  --color-text-2:      #484848;
  --color-text-3:      #333333;

  --color-joker:       #E8500A;
  --color-wall:        #378ADD;
  --color-striker:     #E24B4A;
  --color-mastermind:  #9B59B6;

  --color-success:     #639922;
  --color-warning:     #BA7517;
  --color-danger:      #E24B4A;

  /* Typography */
  --font-display:      'Syne', sans-serif;
  --font-body:         'Plus Jakarta Sans', sans-serif;
  --font-card:         'Cinzel', serif;

  /* Radii */
  --radius-sm:         8px;
  --radius-md:         12px;
  --radius-lg:         14px;
  --radius-xl:         16px;
  --radius-full:       9999px;

  /* Spacing base: 4px grid */
}
```

**Mobile-first is non-negotiable.** Write mobile styles first, then desktop overrides with `md:` and `lg:` prefixes. Wahala is primarily a mobile web game.

**Animation rules:**
- Only animate `transform` and `opacity`. Never animate `width`, `height`, `top`, `left`, or `margin`.
- Card flip: CSS `rotateY` transform with `transform-style: preserve-3d`.
- Use `transition-duration` of 200–400ms for UI transitions. Game animations can go up to 600ms.
- Prefer CSS animations over JavaScript-driven animations for performance.

---

## 11. Performance Rules

- **All page components are lazy loaded** with `React.lazy()` and wrapped in `<Suspense>`.
- **Images use lazy loading** via the native `loading="lazy"` attribute.
- **Debounce all search inputs** by at least 300ms before triggering a query.
- **Never animate layout properties.** GPU-only animations using transform and opacity.
- **Batch WebSocket state updates.** When multiple events fire at once, apply them in a single Zustand `setState` call.
- **Memoize expensive selectors** from Zustand with `useCallback` or `useMemo` where re-render cost is measurable.
- **TanStack Query `staleTime`** should be set on every query. Never leave it at 0 unless real-time freshness is genuinely required.

---

## 12. Error Handling

### HTTP errors
Every service function that makes an HTTP request is wrapped in a try-catch at the Axios interceptor level. The interceptor standardises error shapes before they reach hooks.

```typescript
// services/api.ts
api.interceptors.response.use(
  response => response,
  error => {
    const standardError: AppError = {
      message: error.response?.data?.message ?? 'Something went wrong',
      code: error.response?.status ?? 500,
    }
    return Promise.reject(standardError)
  }
)
```

TanStack Query handles retry logic. Default: retry twice on network errors, never retry on 4xx errors.

### WebSocket disconnection
When the WebSocket disconnects:
1. Show a non-blocking reconnecting overlay on the game board.
2. Auto-reconnect up to 3 times with 1-second delay between attempts.
3. On successful reconnect, emit `game:requestState` immediately.
4. Apply the received snapshot to Zustand to resync.
5. If all 3 reconnect attempts fail, show a full-screen error with a "Rejoin game" button.

### UI errors
Every page is wrapped in a React Error Boundary. If a page crashes, the error boundary shows a fallback UI and logs the error. The rest of the app stays functional.

---

## 13. File and Folder Naming

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase | `ClassCard.tsx` |
| Hooks | camelCase | `useRooms.ts` |
| Services | camelCase | `roomService.ts` |
| Stores | camelCase | `gameStore.ts` |
| Utility files | camelCase | `utils.ts` |
| Type files | camelCase | `game.ts` |
| Constants | camelCase | `constants.ts` |
| Folders | camelCase | `components/game/` |
| Test files | same name + `.test` | `RoomCard.test.tsx` |

**One component per file.** Sub-components that are only used by one parent component may live in the same file if they are small (under 30 lines). Otherwise extract.

---

## 14. Dos and Don'ts

### DO
- Follow the service → hook → component pattern on every feature without exception.
- Type everything. Prefer being verbose with types over being loose.
- Write the transform function in the service layer when the API shape differs from the UI shape.
- Keep components dumb. If a component is making decisions, move that logic to a hook.
- Use TanStack Query for any data that comes from HTTP.
- Use Zustand only for real-time state that arrives via WebSocket.
- Request a game state snapshot from the server on every WebSocket reconnect.
- Write mobile styles first, desktop styles second.
- Lazy load all page components.
- Debounce search inputs and any input that triggers a network request.
- Document non-obvious decisions with a short comment.
- Use the design tokens defined in `tokens.css`. Never hardcode hex values in components.

### DON'T
- Don't call a service directly from a component. Never. Use a hook.
- Don't put UI state in Zustand.
- Don't put server/HTTP data in Zustand.
- Don't use `any`. Not even temporarily.
- Don't use `as SomeType` unless you have documented why.
- Don't write inline styles unless the value is genuinely dynamic and cannot be expressed with Tailwind.
- Don't animate layout properties (width, height, top, left, margin).
- Don't create multiple WebSocket connections.
- Don't trust local game state after a disconnection. Always resync.
- Don't add a new npm package without checking if the existing stack can handle it first.
- Don't hardcode API URLs. Use environment variables.
- Don't commit `.env` files. Use `.env.example` with placeholder values.
- Don't leave `console.log` statements in committed code.
- Don't skip the transform function and let raw API shapes reach components.
- Don't bypass route guards.

---

## 15. Constraints

These are hard limits. They cannot be negotiated for V1.

- **No Framer Motion.** Use CSS animations only. Framer Motion adds bundle weight that is not justified for V1.
- **No Redux.** Zustand is the state manager. Redux is not in the stack.
- **No CSS-in-JS.** Tailwind CSS only.
- **No Context API for app-wide state.** Use TanStack Query or Zustand.
- **No component calling a service directly.** Always through a hook.
- **No untyped functions in services or hooks.** Return types must be explicit.
- **Strict TypeScript mode cannot be turned off.**
- **Mobile-first CSS cannot be skipped** even when building desktop views.
- **WebSocket events must follow the `noun:verb` naming convention** to stay consistent with the backend.
- **Max 2 active Dynamic Rules at any time** — this is a game rule enforced on the backend but the frontend must handle and display it correctly.
- **Reaction window is exactly 5 seconds.** The timer starts when `reaction:window:opened` is received and auto-resolves on the client at 5 seconds even if the server is slow.

---

## 16. Checklist Before Pushing Code

Run through this before every push or pull request.

### Architecture
- [ ] Does the feature follow service → hook → component?
- [ ] Does any component import directly from `services/`? (If yes, refactor.)
- [ ] Is server data managed by TanStack Query?
- [ ] Is real-time data managed by Zustand?
- [ ] Is UI state local with useState?

### TypeScript
- [ ] Does TypeScript compile with zero errors? (`tsc --noEmit`)
- [ ] Are there any `any` types?
- [ ] Do all service functions and hooks have explicit return types?

### Styling
- [ ] Are mobile styles written first?
- [ ] Are design tokens used instead of hardcoded hex values?
- [ ] Are only `transform` and `opacity` being animated?

### Performance
- [ ] Are page components lazy loaded?
- [ ] Are search inputs debounced?
- [ ] Are TanStack Query `staleTime` values set?

### Real-time
- [ ] Is there only one WebSocket connection?
- [ ] Does the reconnection handler request a state snapshot?
- [ ] Are WebSocket events following the `noun:verb` convention?

### Code quality
- [ ] No `console.log` statements left in?
- [ ] No `.env` file committed?
- [ ] Are new dependencies documented?

---

## 17. Definition of Done

A feature is done when:

1. It works correctly on mobile (375px viewport) first.
2. It works correctly on desktop (1280px viewport).
3. It handles loading state — the user sees a spinner or skeleton, not a blank screen.
4. It handles error state — the user sees a meaningful message, not a crash.
5. It handles empty state — the user sees an intentional empty state, not nothing.
6. TypeScript compiles with zero errors.
7. No `any` types introduced.
8. The service → hook → component pattern is followed.
9. Design tokens are used for all colours.
10. All animations use only `transform` and `opacity`.
11. At least one unit or component test is written for non-trivial logic.

---

## 18. Testing Standards

**Test runner:** Vitest
**Component testing:** React Testing Library
**Coverage target:** Focus on critical paths, not coverage percentage.

### What to test:
- Service layer transform functions (pure functions — easy to test, high value)
- Hook logic — especially loading, error, and data states
- Critical game UI components — ClassCard selection, reaction window, hand fan
- Route guards — unauthenticated users redirected correctly

### What not to test:
- Tailwind class names
- Cosmetic rendering details
- Third-party library internals (Socket.io, TanStack Query internals)

### Test file location:
Tests live next to the file they test.
```
components/game/ClassCard.tsx
components/game/ClassCard.test.tsx
```

### Test naming convention:
```typescript
describe('ClassCard', () => {
  it('renders class name and role', () => { ... })
  it('expands to show abilities on tap', () => { ... })
  it('shows XP bonus strip when same class as previous round', () => { ... })
})
```

---

## 19. Environment Variables

All environment variables are prefixed with `VITE_` for the game client.

```bash
# .env.example — commit this file, never commit .env

VITE_API_URL=https://api.wahala.gg
VITE_WS_URL=wss://api.wahala.gg
VITE_APP_ENV=development
```

Access in code:
```typescript
const API_URL = import.meta.env.VITE_API_URL
```

Never hardcode URLs. Never commit `.env`. The `.env.example` file must always be kept up to date when new variables are added.

---

## 20. Design System Tokens

### Colour palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#0F0F0F` | Page background |
| `--color-surface` | `#141414` | Cards, modals |
| `--color-surface-2` | `#1A1A1A` | Nested surfaces |
| `--color-border` | `#242424` | Primary borders |
| `--color-border-2` | `#2A2A2A` | Secondary borders |
| `--color-orange` | `#E8500A` | Primary brand, CTAs, Joker class |
| `--color-yellow` | `#FFD200` | Secondary accent, XP, coins |
| `--color-text` | `#F5F0E8` | Primary text |
| `--color-text-2` | `#484848` | Secondary text |
| `--color-text-3` | `#333333` | Tertiary text, placeholders |
| `--color-wall` | `#378ADD` | Wall class |
| `--color-striker` | `#E24B4A` | Striker class, danger |
| `--color-mastermind` | `#9B59B6` | Mastermind class |
| `--color-success` | `#639922` | Positive states, ready |
| `--color-warning` | `#BA7517` | Moderate warnings |

### Typography

| Font | Usage |
|---|---|
| Syne 800 | Headings, names, buttons, numbers |
| Syne 700 | Sub-headings, labels |
| Plus Jakarta Sans 600 | Body emphasis, metadata |
| Plus Jakarta Sans 400 | Body text, descriptions |
| Cinzel | Card suits, ornate labels |

### Logo rule
The Wahala logo (tarot W icon + wordmark) must only appear on dark backgrounds (`#0F0F0F` or `#141414`). It must never appear on the orange (`#E8500A`) background.

---

## Appendix: Screen Inventory

All 15 screens that exist in this product:

| Screen | Route | Auth required |
|---|---|---|
| Home | `/` | No |
| Authentication | `/auth` | No |
| Create Room | `/rooms/create` | Yes |
| Room Lobby | `/rooms/:roomId` | Yes |
| Class Selection | in-game flow | Yes |
| Shop | in-game flow (inline) | Yes |
| Game Board | `/game/:gameId` | Yes |
| Round End Results | in-game flow | Yes |
| Next Round Countdown | in-game flow | Yes |
| Game End Summary | in-game flow | Yes |
| Profile | `/profile/:userId` | Yes |
| Settings | `/settings` | Yes |
| Rulebook | `/rulebook` | No |
| Room Browser | `/rooms` | Yes |
| Spectator View | `/game/:gameId/spectate` | Yes |

---

*Last updated: April 2026*
*Maintained by: Mkzay (Ayomikun Wahab-Jimoh)*
*For questions about this document, refer to the project lead before making changes.*
