# Wahala — Frontend API Integration Guide

> How the game client talks to the backend. Covers REST endpoints, WebSocket events, auth flow, and patterns for making API calls from React.

---

## Table of Contents

1. [Environment Setup](#1-environment-setup)
2. [Architecture Overview](#2-architecture-overview)
3. [Authentication Flow](#3-authentication-flow)
4. [REST API Reference](#4-rest-api-reference)
5. [WebSocket Event Reference](#5-websocket-event-reference)
6. [TypeScript Types](#6-typescript-types)
7. [Error Handling](#7-error-handling)
8. [Reconnection & State Sync](#8-reconnection--state-sync)

---

## 1. Environment Setup

### Environment Variables (`wahala-game/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | Yes | `http://localhost:3001` | Base URL for REST API calls |
| `VITE_WS_URL` | Yes | `http://localhost:3001` | WebSocket URL for Socket.io |
| `VITE_APP_ENV` | No | `development` | Environment label |

Copy `.env.example` to `.env` and fill in:

```bash
VITE_API_URL=http://localhost:3001
VITE_WS_URL=http://localhost:3001
VITE_APP_ENV=development
```

> The API and WS URLs point to the same backend server in development. In production they use `https://api.wahala.gg`.

---

## 2. Architecture Overview

### Two data paths

```
┌─────────────────────────────────────────────────────────┐
│                     React App                            │
│                                                          │
│  ┌──────────────┐     ┌──────────────────────────┐      │
│  │  TanStack     │     │   Zustand Stores          │      │
│  │  Query        │     │   (authStore, gameStore,  │      │
│  │  (HTTP data)  │     │    lobbyStore)            │      │
│  └──────┬───────┘     └──────────┬────────────────┘      │
│         │                        │                        │
│  ┌──────┴───────┐     ┌──────────┴────────────────┐      │
│  │   Hooks      │     │   Game Socket Hook          │      │
│  │  (useRooms,  │     │  (useGameSocket)            │      │
│  │   useAuth,   │     └──────────┬────────────────┘      │
│  │   useProfile)│                │                        │
│  └──────┬───────┘                │                        │
│         │                        │                        │
│  ┌──────┴───────┐     ┌──────────┴────────────────┐      │
│  │   Services   │     │   Socket Service            │      │
│  │  (Axios)     │     │  (socket.io-client)         │      │
│  └──────┬───────┘     └──────────┬────────────────┘      │
│         │                        │                        │
└─────────┼────────────────────────┼────────────────────────┘
          │                        │
          ▼                        ▼
   ┌────────────┐         ┌──────────────┐
   │  REST API  │         │  WebSocket   │
   │  :3001/v1  │         │  Socket.io   │
   └────────────┘         └──────────────┘
```

**REST** — stateless operations: auth, profile, room CRUD, game history. Handled via TanStack Query.

**WebSocket** — real-time game events: card plays, turn changes, round results. Feeds Zustand stores directly.

### Service → Hook → Component

Every feature follows this exact pattern:

1. **Service** (`src/services/`) — makes HTTP calls via Axios, transforms response shapes
2. **Hook** (`src/hooks/`) — calls service, manages loading/error/data via TanStack Query, exposes result to components
3. **Component** (`src/pages/` or `src/components/`) — renders UI, calls hook functions, never imports services directly

---

## 3. Authentication Flow

### Login / Signup

```
POST /v1/auth/login  ──→  { user, accessToken, refreshToken }
                                │
                    ┌───────────┴───────────┐
                    │                       │
               Store user           Store accessToken
               in Zustand           in memory (variable)
               (authStore)               │
                                         │
                              Attached to every Axios
                              request via interceptor:
                              Authorization: Bearer <token>
```

### Current implementation (`src/services/authService.ts`)

```typescript
const response = await api.post<LoginResponse>('/auth/login', { email, password })
// Returns transformed AuthUser, stores in Zustand via useAuth hook
```

> **Note:** The current frontend service only returns `AuthUser`. Update it to also return `accessToken` and `refreshToken` once the backend login endpoint is finalized.

### Token management

| Token | Storage | Expiry | Usage |
|---|---|---|---|
| Access Token | Memory (JS variable) | 15 min | Authorization header |
| Refresh Token | HttpOnly cookie | 7 days | `POST /auth/refresh` |

The Axios instance in `src/services/api.ts` needs an interceptor to:

1. Attach the access token to every request
2. Detect 401 responses and attempt a silent refresh
3. Redirect to `/auth` if refresh fails

**Add this to `api.ts`:**

```typescript
api.interceptors.request.use((config) => {
  const token = getAccessToken()  // from memory
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Route guards

Two guard levels in `src/routes.tsx`:

| Guard | Condition | Redirect |
|---|---|---|
| `AuthGuard` | `authStore.isAuthenticated === false` | `/auth` |
| `GameGuard` | `gameStore.canAccessGame === false` | `/rooms` |

---

## 4. REST API Reference

Base URL: `VITE_API_URL` + `/v1`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | No | Create account |
| POST | `/auth/login` | No | Email + password login |
| POST | `/auth/logout` | Yes | Invalidate refresh token |
| POST | `/auth/refresh` | No | Get new access token |
| POST | `/auth/forgot-password` | No | Send reset email |
| POST | `/auth/reset-password` | No | Apply new password |
| POST | `/auth/google` | No | Google OAuth token exchange |
| POST | `/auth/apple` | No | Apple OAuth token exchange |

**Example — Login:**

```
POST /v1/auth/login
Content-Type: application/json

{
  "email": "player@wahala.gg",
  "password": "secret123"
}

→ 200
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "username": "Mkzay", "email": "player@wahala.gg" },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

**Frontend service:** `authService.ts`
**Frontend hook:** `useAuth.ts` — exposes `loginWithPassword(email, password)` and `logout()`

### Rooms

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/rooms` | Yes | List public rooms (with filters) |
| POST | `/rooms` | Yes | Create a room |
| GET | `/rooms/:roomId` | Yes | Get room details |
| PATCH | `/rooms/:roomId` | Yes | Update room settings (host only) |
| DELETE | `/rooms/:roomId` | Yes | Disband room (host only) |
| POST | `/rooms/:roomId/join` | Yes | Join a room |
| POST | `/rooms/:roomId/leave` | Yes | Leave a room |
| POST | `/rooms/:roomId/kick` | Yes | Kick a player (host only) |
| POST | `/rooms/:roomId/ready` | Yes | Toggle ready status |
| POST | `/rooms/:roomId/start` | Yes | Start the game (host only) |

**Query parameters for `GET /rooms`:**

| Param | Type | Description |
|---|---|---|
| `query` | string | Search room name |
| `status` | `waiting \| in_progress \| finished` | Filter by status |
| `mode` | `classic \| progression` | Filter by game mode |
| `page` | number | Page number (default 1) |
| `limit` | number | Items per page (default 20, max 100) |

**Frontend service:** `roomService.ts`
**Frontend hook:** `useRooms.ts` — exposes `rooms`, `isLoading`, `error`

### Game (HTTP)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/games/:gameId` | Yes | Get game details and current state |
| GET | `/games/:gameId/state` | Yes | Full state snapshot (used on reconnect) |
| GET | `/games/:gameId/results` | Yes | Final results after game ends |

**Frontend service:** `gameService.ts`
**Frontend hook:** `useGame.ts`

### Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile/me` | Yes | Get authenticated user's full profile |
| GET | `/profile/:userId` | Yes | Get public profile of any user |
| PATCH | `/profile/me` | Yes | Update username or email |
| PATCH | `/profile/me/password` | Yes | Change password |
| GET | `/profile/me/game-history` | Yes | Paginated game history |

**Frontend service:** `profileService.ts`
**Frontend hook:** `useProfile.ts`

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Server health check |

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 42 }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ROOM_NOT_FOUND",
    "message": "The requested room does not exist.",
    "statusCode": 404
  }
}
```

Frontend type (`src/types/api.ts`):
```typescript
interface AppError {
  message: string
  code: number
}
```

---

## 5. WebSocket Event Reference

### Connection

```
Socket.io connection to VITE_WS_URL

Handshake auth:
  { token: "<accessToken>" }
  query: { gameId: "<gameId>" }

On connect:
  → Server joins socket to game:{gameId} and user:{userId} rooms
  ← Server emits 'game:stateSnapshot' with full game state
```

### Client → Server Events

| Event | Payload | When |
|---|---|---|
| `room:ready` | `{ roomId }` | Toggle ready status |
| `room:settings:update` | `{ roomId, settings }` | Host updates room settings |
| `room:start` | `{ roomId }` | Host starts the game |
| `round:class:select` | `{ gameId, className }` | Player selects a class |
| `round:shop:purchase` | `{ gameId, itemId }` | Player buys a shop item |
| `game:card:play` | `{ gameId, cardId }` | Player plays a card |
| `game:card:draw` | `{ gameId }` | Player draws from market |
| `game:ability:use` | `{ gameId, abilityId, targetId? }` | Player uses class ability |
| `game:reaction:respond` | `{ gameId, action, targetId? }` | Respond to reaction window |
| `game:state:request` | `{ gameId }` | Request state snapshot (reconnect) |
| `spectator:reaction` | `{ emoji }` | Spectator sends emoji reaction |

### Server → Client Events

| Event | Payload | When |
|---|---|---|
| `game:stateSnapshot` | `GameState` | On connect / reconnect |
| `lobby:playerJoined` | `{ userId, username }` | Player joined lobby |
| `lobby:playerLeft` | `{ userId }` | Player left lobby |
| `lobby:playerReady` | `{ userId, isReady }` | Player toggled ready |
| `lobby:settingsUpdated` | `Room` | Host updated settings |
| `lobby:gameStarting` | `{ gameId, countdown }` | 3s countdown to game start |
| `round:classSelection:open` | `{ gameId }` | Class selection started |
| `round:classSelection:closed` | `{ gameId }` | All players selected |
| `round:shop:open` | `{ gameId, items }` | Shop phase started |
| `game:card:played` | `CardPlayedPayload` | A card was played |
| `game:card:drawn` | `{ card }` | A card was drawn (to drawer only) |
| `game:turn:changed` | `{ currentTurnPlayerId }` | Turn changed |
| `game:ability:activated` | `AbilityUsedPayload` | Ability was used |
| `game:rule:activated` | `{ rule }` | Dynamic rule entered play |
| `game:rule:expired` | `{ rule }` | Dynamic rule expired |
| `game:reaction:window:opened` | `{ closesAtMs }` | 5s reaction window |
| `game:reaction:window:closed` | `{ resolution }` | Reaction resolved |
| `game:combo:detected` | `{ comboType, playerId }` | Combo detected |
| `game:market:low` | `{ count }` | Market below 10 cards |
| `round:ended` | `RoundEndedPayload` | Round is over |
| `round:xp:awarded` | `{ userId, xp, coins }` | XP distributed |
| `round:player:eliminated` | `{ userId }` | Player eliminated |
| `game:ended` | `{ winnerId, standings }` | Game over |
| `player:disconnected` | `{ userId }` | Player disconnected |
| `player:reconnected` | `{ userId }` | Player reconnected |
| `player:kicked` | `{ userId }` | Player kicked by host |

### Frontend Event Flow

Incoming WebSocket events → Zustand store actions → React re-render:

```
socket.on('game:card:played', onCardPlayed)
  → useGameStore.onCardPlayed(payload)
    → set({ gameState: {...}, lastEvent: 'card:played' })
      → Component re-renders via selector
```

The `useGameSocket` hook in `src/hooks/useGameSocket.ts` manages the full lifecycle:

```typescript
function useGameSocket({ gameId }) {
  // Connects socket
  // Registers all event listeners → Zustand actions
  // Requests state snapshot on connect
  // Disconnects on unmount
  // Returns isConnected status
}
```

### Broadcasting Rules

| Event | Recipients |
|---|---|
| Card play | All players in game room (`game:{gameId}`) |
| State snapshot | Requesting client only (direct `socket.emit`) |
| Card drawn | Drawing player only |
| XP awarded | Individual player only (`user:{userId}`) |
| Reaction window | Targeted player only |
| Player eliminated | All players |
| Spectator reaction | All players + spectators |

---

## 6. TypeScript Types

### Shared types between frontend and backend

**Room (`src/types/room.ts`):**

| Field | Type | Source |
|---|---|---|
| `id` | `string` | UUID from API |
| `name` | `string` | Room name |
| `playerCount` | `number` | Current player count |
| `maxPlayers` | `number` | Max capacity |

> **Note:** The current `Room` type is minimal. Update to match backend response once integration begins.

**User (`src/types/user.ts`):**

| Field | Type |
|---|---|
| `id` | `string` |
| `username` | `string` |
| `email` | `string` |

**Game (`src/types/game.ts`):**

| Field | Type |
|---|---|
| `gameId` | `string` |
| `mode` | `'classic' \| 'progression'` |
| `round` | `number` |
| `currentTurnPlayerId` | `string \| null` |
| `activeRules` | `RuleType[]` |
| `marketCount` | `number` |
| `players` | `GamePlayer[]` |
| `reactionWindowEndsAtMs` | `number \| null` |

**WebSocket payload types are defined in `src/types/game.ts`** — `GameSocketEvents` maps each event name to its payload type.

---

## 7. Error Handling

### HTTP errors

All errors flow through the Axios interceptor in `src/services/api.ts` which standardises them into `AppError`:

```typescript
interface AppError {
  message: string
  code: number
}
```

TanStack Query retry policy (configured in `src/lib/queryClient.ts`):

- Retry twice on network errors
- Never retry on 4xx errors
- `staleTime: 5000ms` (5 seconds)

### WebSocket disconnection

Handled by `useGameSocket` hook:

1. Socket disconnects → `setConnected(false)` → UI shows reconnecting overlay
2. Auto-reconnect up to 3 times (1s delay)
3. On reconnect → emit `game:state:request` → receive snapshot → Zustand resyncs
4. If all 3 attempts fail → show full-screen error with "Rejoin game" button

### Error codes

| Code | Meaning |
|---|---|
| `VALIDATION_ERROR` | Request body failed validation (400) |
| `UNAUTHORIZED` | No or invalid token (401) |
| `TOKEN_EXPIRED` | Access token expired (401) |
| `INVALID_CREDENTIALS` | Wrong email/password (401) |
| `FORBIDDEN` | Not permitted (403) |
| `NOT_FOUND` | Resource not found (404) |
| `ROOM_FULL` | Room at max capacity (409) |
| `ROOM_ALREADY_STARTED` | Game in progress (409) |
| `USERNAME_TAKEN` | Username exists (409) |
| `EMAIL_TAKEN` | Email exists (409) |
| `NOT_YOUR_TURN` | Player acted out of turn (422) |
| `INVALID_CARD_PLAY` | Card play failed validation (422) |
| `ABILITY_ALREADY_USED` | Ability used this round (422) |
| `INSUFFICIENT_COINS` | Not enough coins (422) |
| `RATE_LIMITED` | Too many requests (429) |
| `INTERNAL_ERROR` | Server error (500) |

---

## 8. Reconnection & State Sync

### Game state is never trusted after disconnect

```
Disconnect → Show overlay
   ↓
Reconnect (up to 3 attempts, 1s apart)
   ↓
On success → emit 'game:state:request'
   ↓
Server responds with 'game:stateSnapshot'
   ↓
Zustand applies snapshot → overwrites all local game state
```

### Current flow in `useGameSocket`:

```typescript
socket.on('connect', () => {
  setConnected(true)
  socket.emit('game:requestState', { gameId })
})

socket.on('game:stateSnapshot', applyStateSnapshot)
// applyStateSnapshot sets gameState, resets winnerPlayerId, sets canAccessGame
```

---

*Maintained by: Mkzay (Ayomikun Wahab-Jimoh)*
*For questions, refer to the project lead before making changes.*
