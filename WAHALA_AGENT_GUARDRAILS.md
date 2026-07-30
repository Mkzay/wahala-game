# WAHALA — AGENT GUARDRAILS & SUCCESS METRICS

> This document governs how any AI coding agent (Claude Code, Cursor, Copilot, etc.) operates on this codebase.
> It exists because architecture docs tell an agent *how* to build things correctly, but say nothing about
> *how much* to build, *when to stop*, or *how to know if the work was actually good*.
> Read this alongside `WAHALA_FRONTEND.md` and `WAHALA_BACKEND.md` — those are the "how," this is the "how much" and "how well."

---

## Table of Contents

1. [Core Operating Principle](#1-core-operating-principle)
2. [Scope Guardrails](#2-scope-guardrails)
3. [Behavioral Guardrails](#3-behavioral-guardrails)
4. [The Escalation Protocol](#4-the-escalation-protocol)
5. [Success Metrics](#5-success-metrics)
6. [Underperformance Signals](#6-underperformance-signals)
7. [Overreach Signals](#7-overreach-signals)
8. [Session Start Checklist](#8-session-start-checklist)
9. [Session End Checklist](#9-session-end-checklist)
10. [Task Sizing Rules](#10-task-sizing-rules)
11. [Red Flags — Stop Immediately](#11-red-flags--stop-immediately)
12. [Weekly Review Rubric](#12-weekly-review-rubric)

---

## 1. Core Operating Principle

**An agent should do exactly what was asked, to the standard documented in the architecture files, and nothing more.**

Two failure modes are equally bad:
- **Underperformance:** shipping something that technically works but ignores the architecture docs, skips error handling, or leaves the feature half-done.
- **Overreach:** building things nobody asked for — extra endpoints, unrequested refactors, "while I'm here" improvements, speculative abstractions for features that don't exist yet.

Both are scope failures. The goal is **precision**, not maximum effort or maximum caution.

---

## 2. Scope Guardrails

### The agent may only build what is explicitly in the task
If a task says "build the room creation endpoint," the agent builds:
- The endpoint
- Its Zod validation schema
- Its service function
- Its error cases as documented in `WAHALA_BACKEND.md`

The agent does **not** also:
- Refactor unrelated existing endpoints "for consistency"
- Add a caching layer that wasn't requested
- Build the room deletion endpoint "since it's related"
- Introduce a new npm package without flagging it first

### One task, one pull request, one concern
Each unit of work should map to a single feature or fix. If a task naturally splits into two unrelated pieces of work, that's two tasks, not one.

### The architecture docs are the ceiling, not a suggestion
`WAHALA_FRONTEND.md` and `WAHALA_BACKEND.md` define the constraints. If a doc says "no Redux," the agent does not introduce Redux even if it seems like a clean solution to a state problem. If the docs are wrong or incomplete, the agent flags it — it does not silently work around it.

### Expansion features stay in expansion
Anything marked `[EXPANSION]` in the backend doc is explicitly **out of scope** unless a task explicitly says otherwise. The agent should never start building achievements, friends systems, leaderboards, or Redis-backed state unless directly instructed.

### No speculative abstraction
Don't build a generic "rule engine plugin system" because rules might need to be more flexible someday. Build the rule engine that resolves the 3 tiers and mechanics documented in the game logic. Abstraction is earned by repetition, not anticipated.

---

## 3. Behavioral Guardrails

### Always cite which document governs a decision
When the agent makes an architectural choice, it should be traceable to a specific section of `WAHALA_FRONTEND.md`, `WAHALA_BACKEND.md`, or the game logic writeup. If a decision isn't covered by any doc, that's a signal to ask, not improvise silently.

### Never silently deviate from the documented stack
If Drizzle ORM is the standard and the agent thinks Prisma would be easier for a specific query, it does not switch. It raises the tension and waits for a decision.

### Never mark something "done" that isn't testable
Per the Definition of Done sections in both docs — loading states, error states, and empty states are part of "done," not polish added later.

### Never touch game-critical constants without flagging it
Values like `REACTION_WINDOW_MS = 5000`, `MAX_ACTIVE_RULES = 2`, XP thresholds, and coin values are **game design decisions**, not implementation details. An agent should never adjust these numbers to make a test pass or a feature "feel better" without explicit approval.

### Ask before introducing a new dependency
Every dependency has a cost — bundle size, maintenance surface, security exposure. The agent should propose the dependency and its justification, not just add it.

### Prefer the boring, documented solution over the clever one
If there's a choice between the pattern already established in the docs and a more elegant one the agent thinks of mid-task, the established pattern wins. Consistency across a growing codebase matters more than any single clever implementation.

---

## 4. The Escalation Protocol

When an agent hits a decision point not covered by the docs, it should escalate rather than guess. Escalation looks like this:

```
"This task requires a decision not covered in the architecture docs:

[the specific ambiguity]

Two reasonable options:
A — [option A, with tradeoff]
B — [option B, with tradeoff]

I'm proceeding with [default choice] unless you'd like something else,
because [brief reasoning]. Flagging in case this should be documented
as a new standard."
```

This keeps velocity while still surfacing decisions that should have human input. The agent should not block entirely on small decisions, but it should never bury a real architectural choice inside a diff without mentioning it.

---

## 5. Success Metrics

These are the actual measures of whether an agent's output is good, separate from "did the code run."

### Correctness metrics
- [ ] Feature matches the task description exactly — no more, no less
- [ ] All game rules implemented match the numbers in the game logic writeup exactly (XP values, timer durations, deck scaling, etc.)
- [ ] Server-side validation exists for every client-facing action (per the "server is source of truth" rule)
- [ ] Edge cases from the Definition of Done checklist are handled (loading, error, empty states)

### Architecture compliance metrics
- [ ] Follows the service → hook → component pattern (frontend) or controller → service → Drizzle pattern (backend)
- [ ] No component/controller bypasses its designated layer
- [ ] TypeScript strict mode passes with zero `any` types
- [ ] New WebSocket events follow `noun:verb` naming and are added to the event inventory in `WAHALA_BACKEND.md`

### Scope discipline metrics
- [ ] Diff only touches files relevant to the task
- [ ] No unrelated refactors bundled into the same change
- [ ] No new dependencies without prior flagging
- [ ] No `[EXPANSION]` features touched without explicit instruction

### Documentation hygiene metrics
- [ ] New env variables added to `.env.example`
- [ ] New socket events documented in the backend doc's event inventory
- [ ] Game constants sourced from the constants file, not hardcoded inline

### Test coverage metrics
- [ ] Core game logic (tender calculation, XP awarding, ability resolution, rule conflict checks) has at least one test per function
- [ ] Auth flows have tests for both success and failure paths
- [ ] No PR merges with a failing test suite

---

## 6. Underperformance Signals

Watch for these patterns — they indicate the agent is cutting corners, not being efficient.

| Signal | What it looks like |
|---|---|
| Missing error handling | API calls with no try-catch, no error state shown to user |
| Missing validation | Endpoint accepts a request body with no Zod schema |
| Hardcoded values | Magic numbers instead of referencing `constants.ts` / `cards.ts` |
| Client-trusted logic | Game outcome (tender, XP, winner) calculated on the frontend instead of server |
| No loading state | Component renders blank while data is fetching |
| Untyped returns | Service or hook function with no explicit return type |
| Skipped tests | Task marked complete with zero test coverage on core logic |
| Copy-pasted logic | Same validation or calculation duplicated instead of extracted to a shared function |
| Ignored docs | A pattern is used that directly contradicts something written in the architecture docs |

If three or more of these show up in a single task's output, the work should be sent back before merging, not patched piecemeal.

---

## 7. Overreach Signals

Watch for these patterns — they indicate the agent is doing more than asked, which is just as costly as doing less.

| Signal | What it looks like |
|---|---|
| Silent refactors | Files changed that weren't part of the task, with no explanation |
| Unrequested abstraction | A generic "system" built for a single concrete need |
| Dependency creep | A new package added without justification or a flag raised first |
| Feature bundling | Two unrelated features shipped in one task because "it was quick" |
| Expansion drift | Work started on a `[EXPANSION]` marked feature without being asked |
| Constant tampering | Game design values (XP, timers, thresholds) changed without approval |
| Documentation rewrite | Architecture docs edited to match what the agent built, instead of the agent matching the docs |
| Scope narration absent | Large diff with no summary of what changed and why |

If an agent's diff is significantly larger than the task would reasonably require, that's the first thing to question — not the last.

---

## 8. Session Start Checklist

Before starting any task, the agent should:

- [ ] Re-read the relevant sections of `WAHALA_FRONTEND.md` or `WAHALA_BACKEND.md` for the area being touched
- [ ] Check the game logic writeup for any numbers or rules relevant to the task
- [ ] Identify which layer(s) the task touches (service / hook / component, or controller / service / db)
- [ ] Identify if the task touches any `[EXPANSION]` marked area — if so, stop and confirm scope first
- [ ] State the plan in one or two sentences before writing code

---

## 9. Session End Checklist

Before marking a task complete, the agent should:

- [ ] Run through the relevant Definition of Done section from the architecture doc
- [ ] Confirm the diff only touches files relevant to the task
- [ ] Confirm no new dependencies were added without being flagged
- [ ] Confirm new constants, event names, or env variables are documented where required
- [ ] Summarize what was built, referencing the specific doc sections it complies with
- [ ] Flag anything ambiguous that was resolved with a default assumption

---

## 10. Task Sizing Rules

To keep scope tight, tasks should be sized like this:

**Small task (single session):**
One endpoint, one hook, one component, one socket event handler, one service function.

**Medium task (may need a plan first):**
One full feature slice — e.g. "implement the class selection flow end to end" touches a controller, service, socket handler, and multiple frontend layers. For medium tasks, the agent should output a short plan and confirm it before writing code.

**Large task (must be broken down before starting):**
"Build the game engine" or "implement the full lobby system" are not tasks — they are epics. The agent should decompose these into a sequence of small/medium tasks and confirm the breakdown before starting any of them.

**Rule of thumb:** if a task cannot be described in one sentence without using "and" more than once, it should be split.

---

## 11. Red Flags — Stop Immediately

These require stopping and asking, not proceeding with a best guess:

- A task requires changing a number in the game logic writeup (XP values, timer durations, deck scaling, rule tier gating)
- A task requires touching authentication or password handling logic
- A task requires a schema migration that could affect existing data
- A task seems to require a new architectural pattern not covered in either doc
- A task's requirements conflict with an explicit constraint (e.g. "no Redux," "no custom avatars," "max 2 active rules")
- A task would require the client to calculate a game outcome instead of the server
- The agent is unsure whether something is a bug in existing code or intentional behavior

---

## 12. Weekly Review Rubric

Use this to periodically audit agent output across a week of work, not just per-task.

| Category | Question to ask | Pass condition |
|---|---|---|
| Scope discipline | Did any task expand beyond its stated goal? | Zero unexplained scope creep |
| Architecture adherence | Does new code follow the layer pattern consistently? | 100% compliance, no exceptions without a flagged reason |
| Documentation hygiene | Are new constants, events, and env vars documented? | Docs are never out of sync with code |
| Game integrity | Is any game outcome ever calculated client-side? | Zero instances |
| Dependency hygiene | Were any new packages added without justification? | Zero unflagged additions |
| Test coverage | Does core game logic have tests? | No core logic merges untested |
| Constant stability | Were any game design values changed without approval? | Zero unauthorized changes |

If any category fails more than once in a week, that's the point to tighten the process — either by making the docs more explicit or by adjusting how tasks are being scoped before being handed to the agent.

---

*Last updated: April 2026*
*Maintained by: Mkzay (Ayomikun Wahab-Jimoh)*
*This document should evolve as real agent behavior is observed. If a new failure pattern shows up that isn't covered here, add it.*
