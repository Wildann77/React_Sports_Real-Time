# Architecture — Sports Realtime Dashboard (Client)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | ^19.0.1 |
| Build Tool | Vite | ^6.2.3 |
| Language | TypeScript | ~5.8.2 |
| Styling | Tailwind CSS v4 | ^4.1.14 |
| Routing | React Router DOM | ^7.16.0 |
| Server State | TanStack Query (React Query) | ^5.100.14 |
| Client State | Zustand | ^5.0.14 |
| HTTP Client | Axios | ^1.16.1 |
| WebSocket | Native WebSocket API (custom `wsClient` singleton) | — |
| Forms | React Hook Form | ^7.76.1 |
| Validation | Zod | ^4.4.3 |
| UI Primitives | Radix UI / shadcn/ui | Various |
| Component Variants | class-variance-authority (CVA) | ^0.7.1 |
| Date Utilities | date-fns | ^4.4.0 |
| Icons | lucide-react | ^0.546.0 |
| Notifications | sonner | ^2.0.7 |
| Package Manager | Bun (primary) / npm (fallback) | — |
| Path Alias | `@/` → `src/` | vite.config.ts |

---

## Architecture Pattern

**Feature-based modular SPA** — not MVC, not DDD strict.

Each domain feature (`auth`, `matches`, `commentary`, `dashboard`) is self-contained under `src/features/<feature>/`. The `src/shared/` layer provides cross-cutting utilities. The `src/app/` layer bootstraps the application.

### Data Flow

```
User Interaction
    ↓
Page (src/features/*/pages/)          ← route-level container, Suspense/ErrorBoundary
    ↓
Feature Component (src/features/*/components/)
    ↓
TanStack Query Hook (src/features/*/api/)  ←──→  apiClient (src/shared/lib/axios.ts)
    ↓                                                       ↓
Zustand Store                            Go Backend REST API + WebSocket
(client state only)                                         ↑
    ↑                                      wsClient (src/shared/lib/websocket.ts)
Feature Hook (src/features/*/hooks/)    ─────────────────────┘
```

### Key Boundaries

- **Pages** never call `apiClient` directly — they compose components
- **Components** never import `apiClient` or instantiate `WebSocket`
- **API hooks** (`features/*/api/`) are pure TanStack Query wrappers
- **Shared lib** (`shared/lib/`) is the only place for singletons

---

## Folder Structure

```
client/
├── src/
│   ├── App.tsx                      ← Root component (RouterProvider wrapper)
│   ├── main.tsx                     ← Entry point
│   ├── index.css                    ← Global styles + Tailwind v4 base
│   ├── vite-env.d.ts
│   │
│   ├── app/                         ← App bootstrapping (NO business logic)
│   │   ├── layout.tsx               ← Root layout shell (Outlet + AppShell)
│   │   ├── protected-route.tsx      ← Auth guard (reads useAuthStore)
│   │   ├── providers.tsx            ← QueryClientProvider + Toaster wiring
│   │   └── router.tsx               ← createBrowserRouter definition
│   │
│   ├── features/                    ← Domain features (self-contained)
│   │   ├── auth/
│   │   │   ├── api/                 ← login, logout, getMe TanStack hooks
│   │   │   ├── components/          ← LoginForm
│   │   │   ├── hooks/               ← (non-query auth hooks)
│   │   │   ├── schemas/             ← loginSchema (Zod)
│   │   │   ├── stores/              ← auth-store.ts (Zustand + persist)
│   │   │   └── types/               ← AuthFormValues, etc.
│   │   │
│   │   ├── matches/
│   │   │   ├── api/                 ← matches.ts (fetch fns, no hooks)
│   │   │   ├── components/          ← MatchCard, MatchStatusBadge, CreateMatchForm, ScoreBoard
│   │   │   ├── hooks/               ← use-matches.ts (useQuery/useMutation wrappers)
│   │   │   ├── pages/               ← MatchList, MatchDetail, CreateMatch
│   │   │   ├── schemas/             ← match.schema.ts (Zod)
│   │   │   └── types/               ← GetMatchesParams, CreateMatchPayload
│   │   │
│   │   ├── commentary/
│   │   │   ├── api/                 ← commentary fetch fns
│   │   │   ├── components/          ← CommentaryTimeline, CommentaryItem
│   │   │   ├── hooks/               ← use-commentary.ts
│   │   │   └── pages/               ← CreateCommentary
│   │   │
│   │   └── dashboard/
│   │       └── pages/               ← Dashboard (admin overview)
│   │
│   └── shared/                      ← Cross-feature utilities
│       ├── components/              ← GlobalErrorNormalizer, AppShell, AdminShell,
│       │                               LoadingState, ErrorState, EmptyState, PageHeader
│       ├── constants/               ← query-keys.ts (QueryKeys object)
│       ├── hooks/                   ← Cross-feature hooks
│       ├── lib/                     ← axios.ts, websocket.ts, env.ts, errors.ts, query-client.ts
│       ├── types/                   ← api.ts (ApiResponse, ErrorCode), models.ts (entities)
│       ├── ui/                      ← shadcn/ui primitives (button, card, badge, input…)
│       └── utils/                   ← Pure utility functions
│
├── .ai-context/                     ← AI agent context docs
├── .agents/                         ← Agent skills
├── .env.example
├── .gitignore
├── AGENTS.md
├── components.json                  ← shadcn/ui config
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Coding Standards

### TypeScript

- Strict mode enabled (`tsconfig.json`)
- **No `any`** without a `// NOTE: <reason>` justification comment
- Prefer `type` over `interface` for object shapes; use `interface` only when extending
- Use `as const` for enum-like objects (e.g., `MatchStatusEnum`, `CommentaryEventTypeEnum`)
- Props type named `<ComponentName>Props`; extend `React.HTMLAttributes<TElement>` when wrapping native elements
- Use **discriminated unions** for loading/error/success state machines (not three separate booleans)
- Use **generic components** (`List<T>`) for reusable data-driven UI

### Component Design

- All components are **functional** — no class components
- Components stay under **150 lines** — extract sub-components when larger
- Props drilling > 2 levels → move state to Zustand or TanStack Query
- Prefer **named exports** for all components; default exports only for lazy-loaded pages
- Wrap native HTML elements to expose HTML attributes via `...props` spread
- Cards/buttons that act as links must use `<Link>` or `useNavigate`, not `onClick` on a `<div>`
- **Semantic HTML**: `<button>` for actions, `<a>` for navigation, `<main>`, `<nav>`, `<header>` for layout
- Icon-only buttons **must** have `aria-label`
- Form inputs **must** have associated `<label htmlFor>` and `aria-invalid` + `aria-describedby` when in error

### Styling

- Tailwind CSS v4 utility classes in JSX
- Use `cn()` from `@/shared/utils/` for conditional classes
- Use **CVA (`class-variance-authority`)** for components with multiple variants (Button, Badge, etc.)
- Design tokens via CSS custom properties in `index.css` — no magic hex values in component files
- No inline `style={{}}` except for truly dynamic values (e.g., `width: ${progress}%`)

### State Management Decision Tree

```
Is data from the server?
  YES → TanStack Query (useQuery / useMutation) in features/*/api/ or hooks/
  NO  → Is it shared across multiple components?
          YES → Zustand store (features/*/stores/ or shared if cross-feature)
          NO  → Local useState / useReducer in the component
```

### Query Key Convention

All query keys defined in `src/shared/constants/query-keys.ts` as a `QueryKeys` factory object.

```typescript
// ✅ Correct — use QueryKeys factory
queryKey: QueryKeys.matchDetail(id)

// ❌ Forbidden — inline key string
queryKey: ['matches', id]
```

### API Layer Convention

Feature `api/` files export **plain async functions** (not hooks). Hooks live in `hooks/` (for WebSocket / non-query logic) or directly in the TanStack Query hook in `api/` via a naming split:

```
features/matches/
  api/matches.ts         ← plain async functions: getMatches(), createMatch()
  hooks/use-matches.ts   ← TanStack Query hooks: useMatches(), useCreateMatch()
```

> This naming is already established in the codebase. Maintain it consistently.

### Imports Order

1. React and React ecosystem (`react`, `react-dom`, `react-router-dom`)
2. Third-party libraries (`@tanstack/react-query`, `zod`, `sonner`, `date-fns`)
3. `@/app/` imports
4. `@/features/` imports
5. `@/shared/` imports
6. Relative imports (same feature folder)

### Error & Loading Patterns

- **Full-page loading**: `<LoadingState />` from `@/shared/components/`
- **Full-page error**: `<ErrorState message={msg} retry={refetch} />` from `@/shared/components/`
- **Inline/form error**: `<GlobalErrorNormalizer error={error} />` from `@/shared/components/`
- **Transient feedback**: `toast.success()` / `toast.error()` from `sonner`
- Prefer **Suspense + ErrorBoundary** at page level for async boundaries in future refactors

### WebSocket Integration Pattern

Always via `wsClient` from `@/shared/lib/websocket`. Logic in feature `hooks/`, cache updates via `queryClient.setQueryData`:

```typescript
// Pattern: WS event → setQueryData (optimistic cache update), not refetch
queryClient.setQueryData<Match | undefined>(
  QueryKeys.matchDetail(matchId),
  (current) => current ? { ...current, ...event.data } : current
);
```
