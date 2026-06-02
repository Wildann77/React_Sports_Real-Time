---
applyTo: "src/app/**/*.{ts,tsx}"
---

# App Layer Instructions

Rules for all code inside `src/app/`.

---

## Purpose

`src/app/` is the **bootstrapping layer**. It wires together the application — router, providers, root layout, and authentication guard. It has no business logic and no feature-specific UI.

---

## Files & Responsibilities

| File | Responsibility |
|---|---|
| `router.tsx` | Defines all routes using `createBrowserRouter`. Imports page components from features. |
| `providers.tsx` | Wraps the app in `QueryClientProvider`, `RouterProvider`, and any other global providers. |
| `layout.tsx` | Root layout shell (e.g., `<Outlet />` wrapper, global navigation if any). |
| `protected-route.tsx` | Auth guard: checks `useAuthStore.isAuthenticated`. Redirects to `/login` if unauthenticated. |

---

## Rules

**Allowed:**
- Importing page-level components from `src/features/*/pages/`
- Wiring providers from `@tanstack/react-query`, `react-router-dom`
- Reading `useAuthStore` in `protected-route.tsx` for auth checks
- Global layout structure (header, footer shells)

**Forbidden:**
- Business logic of any kind
- Direct `apiClient` or `wsClient` calls
- Zustand store definitions
- Feature-specific UI components or hooks
- Adding new route patterns without updating `AGENTS.md` Route Map section

---

## Adding a New Route

1. Create the page component in `src/features/<feature>/pages/PageName.tsx`
2. Import it in `src/app/router.tsx`
3. Add the route entry inside `createBrowserRouter`
4. If it requires authentication, nest it under the `ProtectedRoute` element

```typescript
// ✅ Correct pattern in router.tsx
{
  path: 'admin',
  element: <ProtectedRoute />,
  children: [
    { path: 'new-feature', element: <NewFeaturePage /> },
  ],
}
```

---

## Route Map (Current)

| Path | Component | Auth Required |
|---|---|---|
| `/` | `MatchListPage` | No |
| `/matches/:id` | `MatchDetailPage` | No |
| `/login` | `LoginForm` | No |
| `/admin` | `DashboardPage` | Yes |
| `/admin/matches/create` | `CreateMatchPage` | Yes |
| `/admin/matches/:id/commentary` | `CreateCommentaryPage` | Yes |
