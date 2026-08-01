# WAHALA GAME — AGENT HANDOFF & PROJECT STATUS

> **Notice for AI Agents**: Read this document completely BEFORE writing or modifying any code in `wahala-game`. This status log tracks the live state of implementation, locked architectural decisions, and current execution boundaries.

---

## 1. What Wahala Is
Wahala is a real-time, desktop-optimized multiplayer web card game that reimagines traditional Nigerian Whot card mechanics. Built for competitive players and casual social gaming, Wahala introduces RPG-style active character classes (Warrior, Support, Trickster, Mystic, Royal, Rogue), stackable special abilities, and dynamic, shifting round rules that alter turn limits, hand sizes, and suit interactions on the fly.

---

## 2. Required Reading Order
Before making any changes to `wahala-game`, read the context documents in this exact order:

1. **[WAHALA_AGENT_GUARDRAILS.md](file:///c:/Users/USER/Documents/Github/Wahala/wahala-game/WAHALA_AGENT_GUARDRAILS.md)** — Governs agent behavior, escalation protocols, task sizing rules, and metrics.
2. **[WAHALA_FRONTEND.md](file:///c:/Users/USER/Documents/Github/Wahala/wahala-game/WAHALA_FRONTEND.md)** — Governs frontend 3-layer architecture, state rules, socket event contracts, and design tokens.
3. **[WAHALA_BACKEND.md](file:///c:/Users/USER/Documents/Github/Wahala/wahala-backend/WAHALA_BACKEND.md)** — Governs server source-of-truth rules, backend event inventory, and game engine specifications.
4. **[HANDOFF.md](file:///c:/Users/USER/Documents/Github/Wahala/wahala-game/HANDOFF.md)** (This document) — Governs current execution status, locked decisions, completed phases, and active boundaries.

---

## 3. Current Project Phase & Execution Status

### Status: **Phase 1 – Phase 4 Completed & Verified**
- **Completed Phases**:
  - **Phase 1 (Types & Services)**: `ISocketService` defined in `types/socket.ts`, API envelopes in `types/api.ts`, pure transform functions `transformRoom` & `transformProfile` with unit tests passing.
  - **Phase 2 (Socket Adapter & Stores)**: `socketService.mock.ts` dev adapter created, `gameStore.ts` & `lobbyStore.ts` reducers wired, `useGameSocket.ts` bound, unit tests passing.
  - **Phase 3 (TanStack Query & RoomBrowser)**: `useRooms.ts` updated with `useQuery`, search debouncing, and filter state. `RoomBrowser.tsx` decoupled. Unit tests passing.
  - **Phase 4 (Component Decoupling & Toast System)**: `GameBoard.tsx` & `Lobby.tsx` decoupled from local mock loops to socket emissions. Option A Custom Glassmorphic Toast System implemented (`toastStore.ts` + `ToastContainer.tsx`). `routes.test.tsx` route guards verified.
  - **Dependency & Node Modules Fix (`7c3dce1`)**: Restored clean local `node_modules` via `npm install`, added production dependencies to `package.json`, resolved TypeScript strict mode interface alignment across `GameBoardTable`, `Spectator`, `GameSidebar`, and `gameService`.

### Explicitly Deferred Screens (Require Follow-Up Plan Maps)
The following screens have completed UI redesigns but are deferred for server hook/store decoupling in subsequent phase maps:
- `CreateRoom.tsx`
- `Auth.tsx`
- `Profile.tsx`
- `Settings.tsx`
- `History.tsx`
- `Leaderboard.tsx`
- `ClassSelection.tsx`
- `RoundEnd.tsx`
- `GameEnd.tsx`

---

## 4. Locked Architectural Decisions

The following decisions were explicitly agreed upon during planning and **MUST NOT be re-litigated, modified, or undone**:

1. **Mock Socket Isolation**: `src/services/socketService.mock.ts` is a dev-only tool activated **exclusively** when `VITE_USE_MOCK_SOCKET=true` in `.env.development`. It must NEVER act as a silent fallback during live production disconnects.
2. **Server as Single Source of Truth**: All game outcomes, card play validity, turn changes, rule activations, and XP calculations are determined by the server (or mock socket adapter events). Components and stores must never perform client-side outcome calculations.
3. **Atomic Task Sizing for `GameBoard.tsx`**: `GameBoard.tsx` refactoring is split into 3 sub-tasks (`Task 4.2a`: Turn & Hand Wiring, `Task 4.2b`: Reaction Window & Timer, `Task 4.2c`: Abilities & Dynamic Rules). Do NOT recombine them into a single task.
4. **Reconnect Verification Status**: Testing `VITE_USE_MOCK_SOCKET=false` against a live socket server is explicitly marked `[BLOCKED UNTIL LIVE BACKEND SOCKET SERVER IS RUNNING]`.
5. **Option A Custom Glassmorphic Toast System**: Global error & action feedback uses `toastStore.ts` and `<ToastContainer />` (no inline error text banners in forms). HTTP errors automatically trigger `toast.error(...)` via the Axios response interceptor in `api.ts`.
6. **Password Toggle**: Password inputs in `Auth.tsx` feature an interactive eye toggle button for Sign In and Sign Up tabs.
7. **Package Dependencies**: All production packages (`react-router-dom`, `@tanstack/react-query`, `axios`, `socket.io-client`, `zustand`) are declared directly in `wahala-game/package.json` for Vercel deployment.
8. **Per-Phase Definition of Done**: Unit/hook tests must be co-located with deliverables in each phase. A phase is not complete until `npm test` and `npm run build` pass with 0 errors.

---

## 5. Open Questions & Deferred Items

1. **Live Backend Socket Handler Integration**: Verification of real Socket.io auto-reconnect banner behavior awaits live backend socket server event handlers.
2. **Deferred Screen Phase Maps**: Dedicated phase maps must be drafted and approved before refactoring `CreateRoom`, `Auth`, `Profile`, `Settings`, `History`, `Leaderboard`, `ClassSelection`, `RoundEnd`, or `GameEnd`.

---

## 6. What NOT to Redo

- **Do NOT regenerate `implementation_plan.md` v3**: The plan is v3 approved — only extend it for new phase maps.
- **Do NOT remove or replace `socketService.mock.ts`**: The dev mock adapter is essential for offline frontend UI testing.
- **Do NOT replace the Option A Toast System**: `<ToastContainer />` and `toastStore.ts` are locked.
- **Do NOT move production dependencies out of `wahala-game/package.json`**.

---

## 7. How to Ask for Help
If you encounter underspecified requirements, ambiguous state contracts, or breaking changes, refer to the **Escalation Protocol** in [WAHALA_AGENT_GUARDRAILS.md](file:///c:/Users/USER/Documents/Github/Wahala/wahala-game/WAHALA_AGENT_GUARDRAILS.md#3-escalation-protocol) for the expected question format and review process.
