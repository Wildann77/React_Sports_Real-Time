---
applyTo: "src/shared/**/*.{ts,tsx}"
---

# Shared Layer Instructions

Rules for all code inside `src/shared/`.

---

## Purpose

`src/shared/` contains code that is **reused by two or more features** or is a **foundational singleton** (HTTP client, WebSocket client, env config). It has no knowledge of specific features.

---

## `lib/` — Core Singletons

### `axios.ts` — HTTP Client

The `apiClient` is the **only** Axios instance in the entire application.

**Rules:**
- Do NOT call `axios.create()` anywhere else
- The response interceptor handles 401 → token refresh → redirect to `/login` automatically
- Adding new interceptors must be discussed; do not add interceptors in feature code
- Never modify the token refresh logic without understanding the `isRefreshing` / `failedQueue` pattern

### `websocket.ts` — WebSocket Client

The `wsClient` singleton manages the connection lifecycle.

**Rules:**
- Do NOT instantiate `new WebSocket()` outside this file
- Use `wsClient.subscribeMatch(id)` and `wsClient.unsubscribeMatch(id)` in feature hooks
- `wsClient.connect()` is idempotent — safe to call multiple times
- WebSocket auto-reconnects (max 5 attempts) only when there are active subscriptions

### `env.ts` — Environment Variables

All `import.meta.env.VITE_*` access must go through this module.

**Rules:**
- Every new env variable must be declared in `env.ts` with validation
- Must also be documented in `.env.example`
- Never access `import.meta.env.VITE_*` directly in feature or component code

### `query-client.ts` — TanStack Query Client

The QueryClient singleton. Do not instantiate a new `QueryClient` anywhere else.

### `errors.ts` — Error Utilities

- Use `getErrorMessage(error, fallback)` to safely extract a human-readable error string from any unknown error
- Use `<GlobalErrorNormalizer error={error} />` for inline error display in forms/pages

---

## `types/` — Global Types

### `api.ts`

- `ApiResponse<TData, TMeta>` — standard response envelope
- `ApiError` and `ErrorCode` — error shapes from the backend

**Rules:**
- All feature API hooks must type their return as `ApiResponse<SpecificType>`
- Do not extend or override `ApiResponse` in feature types

### `models.ts`

- `User`, `Match`, `Commentary`, `CommentaryPayload`, `MatchListMeta`
- `MatchStatus` — derived from `MatchStatusEnum` (`scheduled | live | finished`)
- `CommentaryEventType` — derived from `CommentaryEventTypeEnum`

**Rules:**
- All status comparisons must use the enum constants, never raw strings
  ```typescript
  // ✅ Correct
  if (match.status === MatchStatusEnum.LIVE) { ... }
  // ❌ Forbidden
  if (match.status === 'live') { ... }
  ```
- Adding new fields to existing models requires updating this file, **not** creating a local type override

---

## `components/` — Shared UI Components

**Allowed:**
- Components needed by multiple features (e.g., `GlobalErrorNormalizer`)
- Components that have no feature-specific logic

**Forbidden:**
- Feature-specific logic
- TanStack Query calls
- Imports from `src/features/`

---

## `ui/` — shadcn/ui Primitives

These are auto-generated/copied shadcn components (Button, Dialog, Select, Tabs, etc.).

**Rules:**
- Do NOT modify shadcn primitives directly unless updating the whole component version
- Do NOT add business logic inside `src/shared/ui/` files
- Extend via wrapper components in `src/shared/components/` or feature `components/`

---

## `hooks/` — Cross-Feature Hooks

Hooks here must be **feature-agnostic**. If a hook references a specific feature's store or types, it belongs in `src/features/<feature>/hooks/`.

---

## `utils/` — Pure Utility Functions

**Allowed:**
- Pure functions with no side effects
- Helpers that have no dependency on React, Zustand, or TanStack Query

**Forbidden:**
- Any React hook usage
- Any imports from `src/features/`
