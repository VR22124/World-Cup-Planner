# StadiumIQ — Two-Layer Architecture

This document defines the authoritative architecture of StadiumIQ. Every engineer and AI agent working on this codebase must respect these invariants.

## System Overview

StadiumIQ is a real-time command center for managing FIFA World Cup 2026 stadium operations at MetLife Stadium, New York. It uses Generative AI (Gemini) to deliver actionable intelligence for crowd management, incident routing, live transit scheduling, and multi-persona assistance.

---

## Two-Layer Contract

The codebase is organised into two strict, non-overlapping layers with a clear HTTP boundary between them.

```
┌────────────────────────────────────────────────────────────────────┐
│  LAYER 2: CLIENT  (apps/web + packages/api-client-react)           │
│                                                                    │
│  pages/          → Pure layout. Delegates data to hooks.           │
│  hooks/          → Data fetching + derivation. No fetch in UI.     │
│  components/     → Pure UI renderers. Receive props, emit events.  │
│                                                                    │
│  INVARIANTS:                                                       │
│  ✗ No business logic in pages or components                        │
│  ✗ No raw fetch/axios calls inside components                      │
│  ✗ No knowledge of how the server implements anything              │
│  ✓ All data fetching goes through custom hooks                     │
│  ✓ All derivation (filter/sort/transform) goes in hooks            │
│  ✓ Components receive props and call hooks                         │
└──────────────────────────┬─────────────────────────────────────────┘
                           │ HTTP (JSON / SSE)
                           │ Contract defined in packages/api-spec
┌──────────────────────────┼─────────────────────────────────────────┐
│  LAYER 1: SERVER  (apps/api)                                       │
│                                                                    │
│  routes/         → HTTP transport only. Parse → service → respond. │
│  services/       → Pure domain logic. No Express req/res imports.  │
│  packages/db/    → All data access. Typed query functions only.    │
│                                                                    │
│  INVARIANTS:                                                       │
│  ✗ No Express imports below the routes/ boundary                   │
│  ✗ No raw drizzle calls outside packages/db/src/queries/           │
│  ✗ No business logic inside route handlers                         │
│  ✓ Routes are ≤ 15 lines: parse → call service → respond           │
│  ✓ Services are pure functions: input → output                     │
│  ✓ All DB access via packages/db/src/queries/ functions            │
└────────────────────────────────────────────────────────────────────┘
```

---

## Server Layer (Layer 1)

### HTTP Transport (`apps/api/src/routes/`)

Route handlers enforce a strict thin-handler pattern:

1. **Parse** — validate request params/body with Zod
2. **Call** — invoke a domain service function
3. **Respond** — serialise the result to JSON

Route files are never longer than ~15 lines per handler. **No business logic lives here.**

#### Route Modules
| Module | Endpoints |
|--------|-----------|
| `routes/stadium/status.ts` | `GET /api/stadium/status` |
| `routes/stadium/gates.ts` | `GET /api/stadium/gates` |
| `routes/stadium/heatmap.ts` | `GET /api/stadium/crowd` |
| `routes/stadium/transport.ts` | `GET /api/stadium/transport` |
| `routes/stadium/incidents.ts` | `GET /api/stadium/incidents` |
| `routes/stadium/supporting.ts` | volunteers, alerts, accessibility, sustainability |
| `routes/gemini/index.ts` | All `/api/gemini/*` conversation + streaming endpoints |
| `routes/ai/index.ts` | `POST /api/ai/assist`, `GET /api/ai/recommendations` |

### Domain Service Layer (`apps/api/src/services/`)

Pure business logic — **zero Express imports**.

| Module | Responsibility |
|--------|---------------|
| `services/stadium/index.ts` | **Facade** — sole entry point for all simulator data |
| `services/simulator/` | Deterministic live data engine (crowd, gates, incidents, transport) |
| `services/ai/assistant.ts` | Multi-persona Gemini AI assistant |
| `services/ai/recommendations.ts` | AI-generated operational recommendations |
| `services/ai/announcements.ts` | Multi-lingual PA announcement generation |
| `services/ai/contextBuilder.ts` | Injects live stadium state into AI prompts |

### Data Access Layer (`packages/db/`)

All database interaction is isolated here.

| Module | Responsibility |
|--------|---------------|
| `packages/db/src/schema/` | Drizzle ORM table definitions |
| `packages/db/src/queries/conversations.ts` | Typed CRUD for conversations |
| `packages/db/src/queries/messages.ts` | Typed CRUD for messages |

**Services import from `packages/db/src/queries/`, never from raw drizzle inline.**

---

## Client Layer (Layer 2)

### Custom Hooks (`apps/web/src/hooks/`)

All data fetching, caching, and derivation logic lives in hooks.

| Hook | Responsibility |
|------|---------------|
| `use-stadium-data.ts` | Aggregated snapshot of all stadium state |
| `use-incident-routing.ts` | Incident filtering, sorting, and severity grouping |
| `use-transport-schedule.ts` | Transport fetch + on-time/delayed/suspended derivation |
| `use-gemini-stream.ts` | SSE streaming for AI chat responses |

### Pages (`apps/web/src/pages/`)

Pages are pure layout and routing components. They:
- Call one or more hooks
- Pass data down as props
- Render layout/composition

**Zero business logic, zero fetch calls in page files.**

### Components (`apps/web/src/components/`)

Components are pure UI renderers. They:
- Accept typed props
- Call hooks where needed (e.g., `useGenerateAnnouncement`)
- Emit events via callbacks

**Zero fetch calls in pure UI components.**

### Server Contract Boundary (`packages/api-client-react/`)

| Module | Responsibility |
|--------|---------------|
| `src/generated/api.ts` | Auto-generated React Query hooks from OpenAPI spec |
| `src/query-keys.ts` | Typed query key factories — no hardcoded key arrays |
| `src/custom-fetch.ts` | Fetch adapter with auth, error boundary, base URL config |

---

## Testing Strategy

| Layer | What to Test | How |
|-------|-------------|-----|
| Server — Services | Domain logic (pure functions) | Vitest unit tests, no mocks |
| Server — Routes | HTTP contract | Supertest integration tests |
| Client — Hooks | Data transformation logic | Vitest unit tests |
| Client — Components | UI state and accessibility | React Testing Library + jsdom |

Run all tests: `pnpm run test`
Run with coverage: `pnpm run test -- --coverage`

---

## Monorepo Structure

```
apps/
  api/           # Layer 1: Express server
  web/           # Layer 2: React 19 frontend (Vite)
packages/
  api-spec/      # OpenAPI contract (source of truth)
  api-client-react/  # Generated hooks + query-keys
  api-zod/       # Generated Zod validators
  db/            # Drizzle ORM + typed query functions
  integrations-gemini-ai/  # Gemini SDK wrapper
```

---

*Last updated: 2026-07-07 — Two-Layer Architecture refactor*
