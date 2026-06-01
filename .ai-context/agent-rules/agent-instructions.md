# Agent Instructions — Sports Realtime Dashboard (Client)

> How AI agents should operate in this repository.

---

## Identity

You are working on **sports-realtime-dashboard**, a React 19 + Vite 6 SPA. The backend is written in Go and communicates via REST API and WebSocket. Your role is to add features, fix bugs, and refactor code while respecting the existing architecture.

---

## Identifying the Correct Layer

Before writing any code, determine which layer it belongs to:

1. **Is it a route-level container?** → `src/features/<feature>/pages/`
2. **Is it a reusable UI block for a single feature?** → `src/features/<feature>/components/`
3. **Is it a TanStack Query hook (server state)?** → `src/features/<feature>/api/`
4. **Is it a Zod schema for a form?** → `src/features/<feature>/schemas/`
5. **Is it client-only state (non-auth)?** → `src/features/<feature>/stores/`
6. **Is it a custom hook encapsulating non-query logic?** → `src/features/<feature>/hooks/`
7. **Is it shared across multiple features?** → `src/shared/`
8. **Is it a UI primitive (shadcn)?** → `src/shared/ui/`
9. **Is it app bootstrapping (router, providers)?** → `src/app/`

**When in doubt:** prefer feature-scoped placement. Promote to `shared/` only when a second feature needs the same code.

---

## Preferred Working Style

- **Type first.** Define or extend types in `src/shared/types/` before implementing.
- **Schema first for forms.** Write the Zod schema before the component.
- **Use existing utilities.** Check `src/shared/lib/` and `src/shared/utils/` before writing new helpers.
- **Use `@/` alias** for all imports. Never use relative paths that cross feature boundaries.
- **Use `cn()` from `@/shared/utils/`** for conditional Tailwind classes.
- **Use CVA** (`class-variance-authority`) for components with multiple visual variants.
- **Use `date-fns`** for date formatting. Never use `new Date().toLocaleDateString()` for display.
- **Use `sonner`** (via `toast`) for transient notifications (success, warning). Use `<GlobalErrorNormalizer>` for inline errors.
- **Use `QueryKeys` factory** for all query keys. Never write inline key arrays.
- **Use Barrel Exports (`index.ts`)** for feature modules to maintain clean, shallow imports.
- **Form A11y Pattern:** All forms must use `react-hook-form` with `Form`, `FormControl`, `FormField`, `FormLabel`, `FormMessage`, and `FormItem` components from the shadcn/ui library to ensure consistent aria-attributes and error handling.

---

## Mandatory Self-Check Before Marking a Task Done

Run through this checklist before finishing any task:

```
[ ] bun run typecheck → zero errors
[ ] No `any` used without a // NOTE: <reason> comment
[ ] No raw `fetch()` or `new WebSocket()` in feature code
[ ] No server state in Zustand stores
[ ] Forms: React Hook Form + Zod (no manual useState for fields)
[ ] Form inputs have associated <label htmlFor>, aria-invalid, aria-describedby on error
[ ] Interactive icon-only elements have aria-label
[ ] No <div onClick> used for navigation — use <Link> or useNavigate on <button>
[ ] New feature folder structure matches existing: api/, components/, hooks/, pages/, schemas/, types/
[ ] WS callbacks passed to wsClient.subscribe() wrapped in useCallback
[ ] setQueryData used for realtime updates, not invalidateQueries
[ ] New env vars → added to env.ts AND .env.example
[ ] Errors displayed via GlobalErrorNormalizer or sonner toast
[ ] No hardcoded URLs, ports, or tokens
[ ] All imports use @/ alias
[ ] Query keys use QueryKeys factory, not inline arrays
[ ] Component file names: PascalCase.tsx
[ ] Hook file names: use-kebab-case.ts
[ ] Type file names: kebab-case.ts
[ ] Store file names: kebab-case-store.ts
[ ] Code review completed against AGENTS.md rules & boundaries (Post-Change Step 1)
[ ] Updated documentation (AGENTS.md, .ai-context/) if architectural patterns or configs changed (Post-Change Step 2)
```

---

## File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| React components | `PascalCase.tsx` | `MatchCard.tsx` |
| Pages | `PascalCase.tsx` | `MatchDetail.tsx` |
| Hooks | `use-kebab-case.ts` | `use-match-detail.ts` |
| Stores | `kebab-case-store.ts` | `auth-store.ts` |
| API hooks | `kebab-case.ts` | `matches.ts` |
| Schemas | `kebab-case.ts` | `create-match.ts` |
| Types | `kebab-case.ts` | `models.ts` |
| Utilities | `kebab-case.ts` | `errors.ts` |

---

## What NOT to Do

- Do not generate `README.md`, `CHANGELOG.md`, or other documentation files unless explicitly asked.
- Do not modify `src/shared/lib/axios.ts` interceptor logic without understanding the full token refresh flow.
- Do not add new direct dependencies without checking if existing deps (e.g., `date-fns`, `clsx`, `lucide-react`) already cover the use case.
- Do not create new Zustand stores for server data — that is TanStack Query's responsibility.
- Do not use `localStorage` or `sessionStorage` directly — use Zustand persist middleware.
