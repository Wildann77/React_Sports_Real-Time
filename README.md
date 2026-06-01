# Sports Realtime Dashboard

Frontend for the Sports Realtime Dashboard backend.

## Stack

- Vite
- React 19
- TypeScript
- React Router DOM
- Axios
- Bun
- @tanstack/react-query
- Zustand
- Tailwind CSS 4
- shadcn/ui primitives
- react-hook-form
- Zod
- Sonner

## Environment

Create these files locally:

- `.env`
- `.env.production`
- `.env.example`

Required values:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
```

Backend defaults:

- HTTP: `http://localhost:8000`
- REST prefix: `/api/v1`
- WebSocket: `ws://localhost:8000/ws`
- Frontend dev origin: `http://localhost:3000`

## Run With Bun

```bash
bun install
bun run dev
```

## Other Commands

```bash
bun run typecheck
bun run build
bun run preview
```

## Main Routes

- `/`
- `/matches/:id`
- `/login`
- `/admin`
- `/admin/matches/create`
- `/admin/matches/:id/commentary`

## Notes

- REST remains the source of truth.
- WebSocket is used only for realtime sync after initial REST fetches succeed.
- Refresh token is expected in an HTTP-only cookie and is never stored in client state.
- Browser requests use JWT access tokens for protected write routes.
