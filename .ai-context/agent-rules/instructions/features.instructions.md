---
applyTo: "src/features/**/*.{ts,tsx}"
---

# Features Layer Instructions

Rules for all code inside `src/features/`.

---

## Structure

Every feature **must** follow this folder layout:

```
src/features/<feature-name>/
├── api/          → TanStack Query hooks only
├── components/   → Feature-scoped React components
├── hooks/        → Non-query custom hooks
├── pages/        → Route-level page components
├── schemas/      → Zod schemas for forms
├── stores/       → Zustand stores (client state only)
└── types/        → Feature-local TypeScript types
```

Not all sub-folders are required. Only create what the feature needs.

---

## `api/` — Server State (TanStack Query)

**Allowed:**
- `useQuery` and `useMutation` hooks from `@tanstack/react-query`
- Calls to `apiClient` from `@/shared/lib/axios`
- Typed with `ApiResponse<T>` from `@/shared/types/api`
- Query key factories as exported constants

**Forbidden:**
- Business logic or data transformation beyond extracting `response.data.data`
- UI state, loading spinners logic, or toast calls
- Zustand store writes
- Direct `fetch()` or `axios.create()`

```typescript
// ✅ Correct
export function useMatches(filters: MatchFilters) {
  return useQuery({
    queryKey: ['matches', filters],
    queryFn: () =>
      apiClient.get<ApiResponse<Match[]>>('/matches', { params: filters })
        .then((r) => r.data),
  });
}

// ❌ Forbidden
export function useMatches() {
  const [data, setData] = useState([]); // use useQuery instead
}
```

---

## `components/` — Feature UI Components

**Allowed:**
- Consuming feature hooks and TanStack Query hooks from `./api/` (via `hooks/`)
- Rendering UI using `@/shared/ui/` primitives
- Calling mutations from `./hooks/` (useCreateMatch, etc.) on user events
- Reading from Zustand stores (read-only; auth store for permissions)
- Using CVA (`cva`) for local multi-variant styling

**Forbidden:**
- Direct `apiClient` calls
- `new WebSocket()` instantiation
- Writing to `useAuthStore` (except `clearAuth` on logout)
- Logic that belongs in hooks (complex event handling, data transforms)
- Inline `style={{}}` except for truly dynamic values

**Accessibility Requirements:**
- All `<button>` elements that are icon-only must have `aria-label`
- Form fields must use `<label htmlFor>`, `aria-invalid`, and `aria-describedby` when showing errors
- Navigation must use `<Link>` (React Router) or `<a href>`, not `<div onClick>`
- Loading states should use `aria-busy` or skeleton components, not empty divs
- Live score updates should be wrapped in `aria-live="polite"` region

---

## `pages/` — Route Pages

**Allowed:**
- Composing feature components into a page layout
- Reading route params via `useParams()`
- Page-level `<Suspense>` and React Error Boundaries
- Showing `<LoadingState />` / `<ErrorState />` for async boundaries
- Passing `retry={query.refetch}` to `<ErrorState />`

**Forbidden:**
- Direct API calls
- Form state management
- Business logic
- Sorting/filtering data (belongs in hooks or API functions)

**Loading/Error Pattern:**
```tsx
// ✅ Correct page loading/error pattern
export default function MatchListPage() {
  const { data, isLoading, isError, error, refetch } = useMatches();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={getErrorMessage(error)} retry={refetch} />;

  return <MatchGrid matches={data?.data ?? []} />;
}
```

---

## `hooks/` — Non-Query Custom Hooks

**Allowed:**
- Subscribing to `wsClient` events (from `@/shared/lib/websocket`)
- Encapsulating complex derived state
- Abstracting reusable event handler logic

**Forbidden:**
- TanStack Query calls (belongs in `api/`)
- Rendering JSX

```typescript
// ✅ Correct — WebSocket subscription hook
export function useMatchLiveEvents(matchId: number) {
  useEffect(() => {
    wsClient.connect();
    wsClient.subscribeMatch(matchId);
    const unsub = wsClient.subscribe((event) => { /* handle */ });
    return () => {
      wsClient.unsubscribeMatch(matchId);
      unsub();
    };
  }, [matchId]);
}
```

---

## `schemas/` — Zod Schemas

**Allowed:**
- `zod` imports only
- Schema definitions for forms in this feature

**Forbidden:**
- Any runtime logic
- Imports from other layers

---

## `stores/` — Zustand Stores (Client State)

**Allowed:**
- Client-side UI state (e.g., selected tab, modal open state)
- State that does NOT originate from the server

**Forbidden:**
- Caching server responses (use TanStack Query)
- `fetch` or `apiClient` calls inside store actions

---

## `types/` — Feature-Local Types

Use for types that are **only** needed within this feature. If a type is shared across two or more features, promote it to `src/shared/types/`.

---

## Barrel Exports

Every feature folder that has multiple exports should include an `index.ts` barrel:

```typescript
// features/matches/components/index.ts
export { MatchCard } from './MatchCard';
export { MatchStatusBadge } from './MatchStatusBadge';
export { ScoreBoard } from './ScoreBoard';
```

This enables clean single-line imports:
```typescript
// ✅ Clean
import { MatchCard, ScoreBoard } from '@/features/matches/components';

// ❌ Verbose
import { MatchCard } from '@/features/matches/components/MatchCard';
import { ScoreBoard } from '@/features/matches/components/ScoreBoard';
```

> Note: Apply barrel files to `components/`, `hooks/`, and `api/` folders. Avoid deep barrel nesting.
