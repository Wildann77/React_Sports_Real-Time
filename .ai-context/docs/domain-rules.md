# Domain Rules — Sports Realtime Dashboard (Client)

---

## Core Entities

### `User`

```typescript
type User = {
  id: number;
  email: string;
};
```

- Represents an **admin user** (viewers are anonymous)
- Stored in `useAuthStore` after successful login
- Persisted partially to `localStorage` via Zustand persist middleware

### `Match`

```typescript
type Match = {
  id: number;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;   // ISO 8601
  endTime: string;     // ISO 8601
  homeScore: number;
  awayScore: number;
  status: MatchStatus; // 'scheduled' | 'live' | 'finished'
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
```

### `Commentary`

```typescript
type Commentary = {
  id: number;
  matchId: number;
  minute: number;
  eventType: CommentaryEventType;
  message: string;
  payload: CommentaryPayload | null; // { homeScore?, awayScore?, ...extras }
  createdAt: string;
};
```

---

## Status Flows

### Match Status

```
SCHEDULED → LIVE → FINISHED
```

- `scheduled` — Match not yet started. Score 0-0.
- `live` — Match in progress. Score updated via `match.updated` WebSocket events.
- `finished` — Match ended. Score is final.

**Rule:** Always compare status using `MatchStatusEnum` constants, never raw strings.

```typescript
// ✅ Correct
import { MatchStatusEnum } from '@/shared/types/models';
if (match.status === MatchStatusEnum.LIVE) { ... }

// ❌ Forbidden
if (match.status === 'live') { ... }
```

### Commentary Event Types

| Enum Key | Value | Description |
|---|---|---|
| `GOAL` | `"goal"` | Goal scored. `payload` contains updated scores. |
| `YELLOW_CARD` | `"yellow-card"` | Yellow card issued. |
| `RED_CARD` | `"red-card"` | Red card issued. |
| `HALF_TIME` | `"half_time"` | Half-time whistle. |
| `FULL_TIME` | `"full_time"` | Full-time whistle. |
| `SUBSTITUTION` | `"substitution"` | Player substitution. |
| `INFO` | `"info"` | Generic commentary/info. |

---

## API Response Convention

All API responses use the `ApiResponse<TData, TMeta>` wrapper:

```typescript
type ApiResponse<TData = unknown, TMeta = unknown> = {
  success: boolean;
  message: string;       // Human-readable message from server
  data: TData | null;    // Actual payload
  meta: TMeta | null;    // Pagination or extra metadata
  error: ApiError | null;
};

type ApiError = {
  code: ErrorCode;       // Machine-readable error code
  details?: unknown;     // Optional validation details
};
```

### Error Codes

| Code | Meaning |
|---|---|
| `VALIDATION_ERROR` | Request body/params failed validation |
| `UNAUTHORIZED` | Missing or invalid token |
| `FORBIDDEN` | Authenticated but insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `SERVICE_UNAVAILABLE` | Backend service unavailable |
| `DATABASE_ERROR` | Backend DB error |
| `SECURITY_ERROR` | Security policy violation |
| `INTERNAL_SERVER_ERROR` | Backend internal server error |

### Accessing Response Data

```typescript
// In a TanStack Query hook
const { data } = useQuery({
  queryFn: () => apiClient.get<ApiResponse<Match[]>>('/matches').then(r => r.data),
});

// In component — data is ApiResponse<Match[]> | undefined
const matches = data?.data ?? [];      // actual array
const meta = data?.meta;               // pagination meta
const errorCode = data?.error?.code;   // error code if success=false
```

---

## Error Handling Convention

### In Components / Pages

```tsx
import { GlobalErrorNormalizer } from '@/shared/components/GlobalErrorNormalizer';

// For inline errors (e.g., after a failed mutation)
<GlobalErrorNormalizer error={mutationError} />
```

### In Hooks / Utilities

```typescript
import { getErrorMessage } from '@/shared/lib/errors';

const message = getErrorMessage(error, 'Default fallback message');
```

### For Transient Feedback (Success / Warning)

```typescript
import { toast } from 'sonner';

toast.success('Match created successfully');
toast.error('Failed to create match');
```

### Rules

- Never render raw `error.message` — use `getErrorMessage()` which handles unknown types safely
- Never use `window.alert()` or `console.error()` as the primary error UI
- 401 errors are handled globally by axios interceptor → no need to handle in feature code
- 403 errors should show a "Permission denied" message via `<GlobalErrorNormalizer>`

---

## WebSocket Events

| Event Type | Trigger | Data Shape |
|---|---|---|
| `welcome` | Connection opened | `{ type: 'welcome', data: string }` |
| `subscribed` | After `subscribe` message sent | `{ type: 'subscribed', matchId: number }` |
| `commentary.created` | New commentary added by admin | `{ type: 'commentary.created', matchId, data: Commentary }` |
| `match.updated` | Score or status change | `{ type: 'match.updated', matchId, data: { homeScore, awayScore, status } }` |
| `error` | Server-side WS error | `{ type: 'error', message: string }` |
| `connection.state` | Connection state changes | `{ type: 'connection.state', state: 'disconnected' \| 'connecting' \| 'connected' \| 'reconnecting' }` |

### WebSocket Usage in Feature Hooks

Stabilize the `onUpdate` callback with `useCallback` at the call site to prevent re-subscription on every render:

```typescript
import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsClient, WebSocketEvent } from '@/shared/lib/websocket';
import { QueryKeys } from '@/shared/constants/query-keys';
import { Match, Commentary } from '@/shared/types/models';

// ✅ Correct pattern — cache update, not refetch
export function useMatchLiveUpdates(matchId: number) {
  const queryClient = useQueryClient();

  const handleEvent = useCallback(
    (event: WebSocketEvent) => {
      if (!('matchId' in event) || event.matchId !== matchId) return;

      if (event.type === 'match.updated') {
        queryClient.setQueryData<Match | undefined>(
          QueryKeys.matchDetail(matchId),
          (current) => current ? { ...current, ...event.data } : current
        );
      }

      if (event.type === 'commentary.created') {
        queryClient.setQueryData<Commentary[]>(
          QueryKeys.matchCommentary(matchId),
          (current = []) =>
            current.some((c) => c.id === event.data.id)
              ? current
              : [...current, event.data].sort(
                  (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                )
        );
      }
    },
    [matchId, queryClient]
  );

  useEffect(() => {
    wsClient.connect();
    wsClient.subscribeMatch(matchId);
    const unsub = wsClient.subscribe(handleEvent);
    return () => {
      unsub();
      wsClient.unsubscribeMatch(matchId);
    };
  }, [matchId, handleEvent]);
}
```

**Rules:**
- Callback passed to `wsClient.subscribe()` must be stable — wrap in `useCallback`
- Prefer `setQueryData` (optimistic cache update) over `invalidateQueries` for real-time events to avoid flicker
- Use `invalidateQueries` only for list-level invalidation (e.g., after score update affects match list)

---

## Naming Conventions

| Concept | Convention | Example |
|---|---|---|
| React components | PascalCase | `MatchCard`, `LoginForm` |
| Pages | PascalCase | `MatchDetail`, `CreateMatch` |
| Hooks | camelCase with `use` prefix | `useMatchDetail`, `useAuthStore` |
| Zustand stores | kebab-case file, camelCase export | `auth-store.ts` → `useAuthStore` |
| Types / interfaces | PascalCase | `Match`, `ApiResponse` |
| Enum-like objects | PascalCase with `Enum` suffix | `MatchStatusEnum` |
| Enum values | SCREAMING_SNAKE_CASE | `MatchStatusEnum.LIVE` |
| Zod schemas | camelCase | `createMatchSchema` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RECONNECT_ATTEMPTS` |
| API query keys | use `QueryKeys` factory | `QueryKeys.matchDetail(id)` |
| Query key factory | object in `shared/constants/query-keys.ts` | `QueryKeys.matches`, `QueryKeys.matchesByFilter(filter)` |
| Barrel index file | `index.ts` re-exporting from a folder | `export { MatchCard } from './MatchCard'` |
