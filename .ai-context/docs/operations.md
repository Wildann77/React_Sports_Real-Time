# Operations — Sports Realtime Dashboard (Client)

---

## Security

### Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | REST API base URL | `http://localhost:8000/api/v1` |
| `VITE_WS_URL` | WebSocket endpoint URL | `ws://localhost:8000/ws` |

**Rules:**
- All env vars must be prefixed with `VITE_` to be exposed to the browser
- Access only via `src/shared/lib/env.ts` — never access `import.meta.env.VITE_*` directly
- `.env` and `.env.production` are in `.gitignore` — never commit them
- `.env.example` is the canonical template for required variables

### Authentication

- **Mechanism:** JWT Bearer Token
- **Storage:** `accessToken` stored in Zustand (persisted to `localStorage` as `auth-storage`)
- **Flow:**
  1. `POST /login` → receives `accessToken` (body) + sets `refreshToken` cookie (HttpOnly)
  2. Axios request interceptor attaches `Authorization: Bearer <token>` header
  3. On 401 response: axios interceptor calls `POST /refresh-token` (uses HttpOnly cookie)
  4. On refresh success: new `accessToken` stored, original request retried
  5. On refresh failure: `useAuthStore.clearAuth()` called, redirect to `/login`
- **Protected Routes:** `<ProtectedRoute />` checks `isAuthenticated` from `useAuthStore`

### Sensitive File Checklist

```
# Already in .gitignore
.env
.env.production
.env.local
node_modules/
dist/
```

---

## Development Commands

```bash
# Install dependencies (preferred: bun)
bun install

# Start dev server on port 3000 (all interfaces)
bun run dev
# or
npm run dev

# Type checking (no emit)
bun run typecheck
# or
npm run typecheck

# Production build
bun run build

# Preview production build locally
bun run preview
```

### Dev Server Config

- Port: **3000**
- Host: **0.0.0.0** (accessible from local network / Docker)
- HMR: Disabled when `DISABLE_HMR=true` (used during agent-assisted editing)

---

## Build & Deployment

```bash
# Build output: ./dist/
bun run build

# Preview the build
bun run preview
```

**Build tool:** Vite 6 with `@vitejs/plugin-react` and `@tailwindcss/vite`.

**Path alias resolution:** `@/` → `./src/` (configured in `vite.config.ts` and `tsconfig.json`).

---

## Adding a New Environment Variable

1. Add to `src/shared/lib/env.ts`:
   ```typescript
   export const env = {
     API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
     WS_URL: import.meta.env.VITE_WS_URL,
     NEW_VAR: import.meta.env.VITE_NEW_VAR, // add here
   };
   ```
2. Add to `.env.example`:
   ```
   VITE_NEW_VAR=example_value
   ```
3. Add to your local `.env` with the actual value.

---

## Adding a New shadcn/ui Component

shadcn/ui is configured via `components.json`. Add components using:

```bash
# Using the shadcn CLI (ensure you have the CLI available)
npx shadcn@latest add <component-name>
```

Components are placed in `src/shared/ui/`. Do not hand-write shadcn components.

---

## WebSocket Lifecycle

```
User navigates to MatchDetail page
    ↓
useMatchLiveUpdates hook mounts
    ↓
wsClient.connect() — idempotent, skips if already connected
wsClient.subscribeMatch(matchId) — sends subscribe message
    ↓
Component unmounts
    ↓
wsClient.unsubscribeMatch(matchId)
    ↓ (if no more subscriptions)
wsClient.disconnect()
```

**Reconnection:** Automatic, up to 5 attempts, with 1.5s × attempt backoff. Only reconnects if there are active subscriptions.

**Ping/Keepalive:** Sends `{ type: 'ping' }` every 30 seconds while connected.
