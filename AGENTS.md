# AGENTS.md — Sports Realtime Dashboard (Client)

> **AI Agent Contract** — Read this file before taking any action in this repository.

---

## Mission

Sports Realtime Dashboard is a **React + Vite SPA** serving as the frontend client for a real-time sports event broadcasting platform. It connects to a Go backend via REST API and WebSocket to display live match scores, commentaries, and allow admins to manage matches.

**Core goals:**
- Deliver real-time match data to public viewers with minimal latency
- Provide a secure admin panel for match and commentary management
- Maintain a clean, type-safe, feature-based codebase

---

## Critical Rules

1. **NEVER hardcode secrets.** All env values must come from `import.meta.env.VITE_*` via `src/shared/lib/env.ts`.
2. **ALL API calls go through `apiClient`** (`src/shared/lib/axios.ts`). Never use raw `fetch` or `axios.create()` elsewhere.
3. **ALL WebSocket communication goes through `wsClient`** (`src/shared/lib/websocket.ts`). Never instantiate `new WebSocket()` directly in components.
4. **ALL server state uses TanStack Query.** Never store server data in Zustand or component state.
5. **Client-only state uses Zustand.** Auth state (`useAuthStore`) is the canonical example.
6. **Forms use React Hook Form + Zod.** Never manage form state manually.
7. **Types for API shapes live in `src/shared/types/`.** Never define response types inline in a component or hook.
8. **New features are self-contained folders** under `src/features/<feature-name>/`.
9. **No business logic in components.** Components render and delegate. Logic belongs in hooks and API functions.
10. **Do not modify existing layer boundaries** without updating this file and `.ai-context/docs/architecture.md`.
11. **WebSocket callbacks must be stable.** Any function passed to `wsClient.subscribe()` must be wrapped in `useCallback`. Raw inline lambdas cause re-subscription on every render.
12. **All query keys use `QueryKeys` factory** (`src/shared/constants/query-keys.ts`). Never write inline query key arrays.

---

## Layer Boundaries

```
src/
├── app/           → App bootstrap: router, providers, root layout, protected routes
├── features/      → Domain features (auth, matches, commentary, dashboard)
│   └── <feature>/
│       ├── api/       → TanStack Query hooks (useQuery, useMutation)
│       ├── components/ → UI components scoped to this feature
│       ├── hooks/     → Custom hooks (non-query)
│       ├── pages/     → Route-level page components
│       ├── schemas/   → Zod validation schemas
│       ├── stores/    → Zustand stores (client state only)
│       └── types/     → Feature-local TypeScript types
└── shared/        → Cross-feature utilities, design system
    ├── components/ → Reusable components (GlobalErrorNormalizer, etc.)
    ├── constants/  → App-wide constants
    ├── hooks/      → Cross-feature custom hooks
    ├── lib/        → Core singletons (axios, websocket, env, query-client)
    ├── types/      → Global types (ApiResponse, models)
    ├── ui/         → shadcn/ui primitives (Button, Dialog, Select, Tabs)
    └── utils/      → Pure utility functions
```

### Layer Rules Summary

| Layer | Allowed | Forbidden |
|---|---|---|
| `app/` | Router setup, providers wiring, layout shells, protected route guard | Business logic, API calls, direct DOM manipulation |
| `features/*/pages/` | Compose feature components, pass route params, page-level Suspense/Error boundary | Direct API calls, form state, data transformation |
| `features/*/components/` | Render UI, call feature hooks, trigger mutations | `apiClient` calls, Zustand store writes (except auth), raw WebSocket |
| `features/*/api/` | TanStack Query `useQuery`/`useMutation`, call `apiClient` | Business decisions, UI state, non-query logic |
| `features/*/hooks/` | Encapsulate non-query logic, consume WebSocket events | API mutations, Zustand auth store writes |
| `features/*/schemas/` | Zod schemas only | Any logic or imports beyond zod |
| `features/*/stores/` | Zustand client-side state | Server/API data (use TanStack Query instead) |
| `shared/lib/` | Core singletons, env validation, HTTP/WS client config | Feature-specific logic, component imports |
| `shared/types/` | TypeScript interfaces and type aliases | Runtime logic, imports beyond type utilities |
| `shared/ui/` | shadcn/ui component wrappers only | Feature business logic |

---

## Core Domain Rules

### Entities

| Entity | Key Fields | Notes |
|---|---|---|
| `User` | `id`, `email` | Admin users only; stored in `useAuthStore` |
| `Match` | `id`, `sport`, `homeTeam`, `awayTeam`, `startTime`, `status`, `homeScore`, `awayScore` | Public-readable |
| `Commentary` | `id`, `matchId`, `minute`, `eventType`, `message`, `payload` | Pushed via WebSocket |

### Match Status Flow

```
SCHEDULED → LIVE → FINISHED
```

### API Response Convention

All responses use the unified `ApiResponse<TData, TMeta>` shape:

```typescript
{
  success: boolean;
  message: string;
  data: TData | null;
  meta: TMeta | null;
  error: { code: ErrorCode; details?: unknown } | null;
}
```

**Never** unwrap response data inline — use `response.data.data` via the typed `ApiResponse` generic.

### Error Handling Convention

- Extract error messages using `getErrorMessage()` from `src/shared/lib/errors.ts`
- Display user-facing errors via `<GlobalErrorNormalizer error={error} />`
- Never render raw `error.message` strings from unknown errors
- HTTP 401 triggers automatic token refresh via axios interceptor → redirect to `/login` on failure

### Auth Convention

- `accessToken` is stored in-memory in Zustand (persisted to `localStorage` via `zustand/persist`)
- Token refresh is handled automatically by the axios response interceptor
- Protected routes use `<ProtectedRoute />` which checks `useAuthStore`
- **Never** manually append `Authorization` headers in feature code

### WebSocket Event Types

| Event | Description |
|---|---|
| `welcome` | Connection established |
| `subscribed` | Server confirmed match subscription |
| `commentary.created` | New commentary pushed for a match |
| `match.updated` | Score/status update for a match |
| `error` | Server-side WS error |
| `connection.state` | Connection state changes (e.g. connected, reconnecting, etc.) |

### Route Map

| Path | Component | Auth Required |
|---|---|---|
| `/` | `MatchListPage` | No |
| `/matches/:id` | `MatchDetailPage` | No |
| `/login` | `LoginForm` | No |
| `/admin` | `DashboardPage` | Yes |
| `/admin/matches/create` | `CreateMatchPage` | Yes |
| `/admin/matches/:id/commentary` | `CreateCommentaryPage` | Yes |
| `/admin/api-keys` | `ApiKeysPage` | Yes |

---

## Security & Operations

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | REST API base URL (e.g., `http://localhost:8000/api/v1`) |
| `VITE_WS_URL` | WebSocket URL (e.g., `ws://localhost:8000/ws`) |

All env vars are validated at import time via `src/shared/lib/env.ts`. Adding a new var requires updating `env.ts`.

### Sensitive Files

- `.env`, `.env.production` → must be in `.gitignore` (already added)
- Never commit actual secrets; use `.env.example` as template

### Development Commands

```bash
# Install dependencies
bun install

# Start dev server (port 3000)
bun run dev
# or
npm run dev

# Type check
bun run typecheck

# Build for production
bun run build

# Preview production build
bun run preview
```

---

## AI Context Map

| File | Purpose |
|---|---|
| `.ai-context/agent-rules/agent-instructions.md` | How this agent should work in this repo |
| `.ai-context/agent-rules/instructions/features.instructions.md` | Rules for `src/features/` layer |
| `.ai-context/agent-rules/instructions/shared.instructions.md` | Rules for `src/shared/` layer |
| `.ai-context/agent-rules/instructions/app.instructions.md` | Rules for `src/app/` layer |
| `.ai-context/docs/architecture.md` | Tech stack, folder structure, coding standards |
| `.ai-context/docs/domain-rules.md` | Entities, status flows, API & error conventions |
| `.ai-context/docs/operations.md` | Security, env vars, dev commands |

---

## Performance & Accessibility Constraints (Vite SPA Profile)

Every code change must respect the following constraints derived from the `/senior-frontend` skill (Vite SPA profile):
- **Core Web Vitals**:
  - `lcp_ms_corporate_network_p75` ≤ 2500 (Largest Contentful Paint)
  - `inp_ms_p75` ≤ 200 (Interaction to Next Paint)
  - `cls_p75` ≤ 0.1 (Cumulative Layout Shift)
- **Bundle Size Budget**:
  - `initial_bundle_kb_gzip_max` = 200 (Initial JS Bundle size ≤ 200 KB)
  - `per_route_chunk_kb_gzip_max` = 80 (Per-route JS Bundle size ≤ 80 KB)
- **Lighthouse Floors**:
  - `lighthouse_perf_min` = 80
  - `lighthouse_a11y_min` = 95 (Adhering to WCAG 2.1 AA)
- **Code Coverage**:
  - `test_coverage_min` = 0.5 (Minimum 50% test coverage)
- **Anti-patterns to Avoid**:
  - `no-code-splitting` (kill) — Single bundle for a multi-route SPA is forbidden.
  - `context-as-global-state` (kill) — Do not use React Context for heavy global state (use Zustand).
- **Required CI Gates**:
  - `bundlewatch-initial-and-per-route`
  - `a11y-axe-checks`
  - `playwright-smoke-on-key-flows`
  - `typecheck-strict`

---

## Post-Change Protocols

To maintain codebase health and documentation consistency, all agents must perform the following two-step protocol after completing any code change:

### Step 1: Self-Review Against Rules
Before finishing a task, review all created or modified files to ensure they fully comply with:
- The **Critical Rules** (e.g., no hardcoded secrets, no raw `fetch`/`WebSocket` in features, proper Zustand vs. TanStack Query usage).
- The **Layer Boundaries** (verifying that feature and shared boundaries are not violated).
- **TypeScript Guidelines** (no implicit or explicit `any` without documented reason, proper type locations).

### Step 2: Documentation & AGENTS.md Sync
If your changes introduce, modify, or deprecate:
- Architectural patterns (e.g., new state management libraries, new layers).
- Global configurations or environment variables.
- Project conventions (e.g., folder structure, naming conventions).

You **MUST** immediately update this `AGENTS.md` file and any corresponding files in the `.ai-context/` folder to reflect the current state. Documentation and code must never drift.

---

## Definition of Done

A task is **complete** only when ALL of the following are true:

- [ ] TypeScript compiles with zero errors (`bun run typecheck`)
- [ ] No `any` types introduced without explicit `// NOTE: <reason>` justification comment
- [ ] No new `axios.create()` or `new WebSocket()` outside of `src/shared/lib/`
- [ ] No server data stored in Zustand
- [ ] Forms use React Hook Form + Zod; no manual `useState` for form fields
- [ ] Form inputs have `aria-invalid` + `aria-describedby` when showing validation errors
- [ ] Navigation actions use `<Link>` or `useNavigate` — not `onClick` on non-interactive elements
- [ ] WebSocket callbacks passed to `wsClient.subscribe()` are wrapped in `useCallback`
- [ ] New feature code lives under `src/features/<feature>/` with correct sub-layer placement
- [ ] New env vars are added to both `env.ts` and `.env.example`
- [ ] Error display uses `<GlobalErrorNormalizer>` or `sonner` toast, not raw `alert()` or `console.error`
- [ ] No hardcoded API URLs, port numbers, or secrets in source files
- [ ] Imports use the `@/` alias, never relative paths crossing layer boundaries (e.g., `../../shared/`)
- [ ] Query keys use `QueryKeys` factory — no inline key arrays
- [ ] Code review completed according to Post-Change Protocols (Step 1)
- [ ] Documentation and `AGENTS.md` updated and synchronized if architecture/patterns changed (Step 2)
