# Sprint: Frontend Alignment to Senior-Frontend Standards

**Sprint Name:** `sprint/frontend-alignment-best-practice`
**Tanggal Dibuat:** 2026-05-31
**Durasi Estimasi:** 2–3 hari (solo dev)
**Berdasarkan:** Review dokumen `.ai-context/` vs standar `senior-frontend` skill

---

## Tujuan Sprint

Menyesuaikan kode frontend yang sudah ada dengan standar production-ready React berdasarkan hasil review dokumentasi. Tidak ada breaking change pada behavior/fitur — murni peningkatan kualitas kode, aksesibilitas, type-safety, dan maintainability.

---

## Assumptions & Verifiable Success Criteria (Karpathy Discipline)

Berdasarkan profil aplikasi **Vite SPA** (`vite-spa` dari `/senior-frontend` skill) yang dihasilkan secara deterministik oleh `scripts/frontend_decision_engine.py`, berikut adalah detail asumsi performa dan kriteria sukses terverifikasi yang wajib dipatuhi:

### 1. Key Assumptions
- **Primary User Device & Network**: Mobile-4G (atau corporate-network)
- **LCP Target**: 2500ms (p75)
- **SEO Dependency**: False (Auth-walled dashboard & realtime client)
- **WCAG Target + Named a11y Owner**: WCAG 2.1 AA (Owner: Frontend Dev Team)

### 2. Verifiable Success Criteria
- **Core Web Vitals**:
  - `lcp_ms_corporate_network_p75` = 2500
  - `inp_ms_p75` = 200
  - `cls_p75` = 0.1
- **Bundle Size Budget**:
  - `initial_bundle_kb_gzip_max` = 200 (Initial JS Bundle size ≤ 200 KB)
  - `per_route_chunk_kb_gzip_max` = 80 (Per-route JS Bundle size ≤ 80 KB)
- **Lighthouse Floors**:
  - `lighthouse_perf_min` = 80
  - `lighthouse_a11y_min` = 95 (Diselaraskan dengan a11y floor proyek)
- **Code Coverage**:
  - `test_coverage_min` = 0.5 (Minimal 50% test coverage)

### 3. Anti-patterns to Avoid (Strictly Enforced)
- **no-code-splitting** (kill) — single bundle for a multi-route SPA = unusable on slow networks.
- **ssr-on-spa-only-surface** (warn) — adds infra cost with no SEO benefit.
- **next-or-remix-for-pure-spa** (warn) — overkill; Vite is leaner.
- **redux-without-justification** (warn) — TanStack Query handles server state; Zustand handles UI state.
- **context-as-global-state** (kill) — re-renders cascade; use Zustand/Jotai.

### 4. CI Gates (Required)
- `bundlewatch-initial-and-per-route`
- `a11y-axe-checks`
- `playwright-smoke-on-key-flows`
- `typecheck-strict`

---

## Daftar Task

### 🔴 Prioritas 1 — Critical (wajib diselesaikan)

---

#### TASK-01: Extract WS logic dari `MatchDetailPage` ke feature hook

**Masalah:** `MatchDetailPage.tsx` mengandung langsung logika WebSocket subscribe/unsubscribe dan `setQueryData` di dalam page component. Ini melanggar aturan layer (page tidak boleh punya business logic).

**Target:** Ekstrak ke `src/features/matches/hooks/use-match-live-updates.ts`

**File Terdampak:**
- `src/features/matches/pages/MatchDetail.tsx` ← logic dihapus
- `src/features/matches/hooks/use-match-live-updates.ts` ← [NEW]

**Acceptance Criteria:**
- [ ] `MatchDetailPage` tidak impor `wsClient` langsung
- [ ] Hook `useMatchLiveUpdates(matchId)` mengelola connect/subscribe/setQueryData
- [ ] Callback WS dibungkus `useCallback` dengan deps `[matchId, queryClient]`
- [ ] Unsubscribe dilakukan sebelum disconnect (urutan: `unsub()` → `unsubscribeMatch()`)
- [ ] `bun run typecheck` zero errors

**Catatan Teknis:**
```typescript
// Pola yang benar (lihat domain-rules.md)
export function useMatchLiveUpdates(matchId: number) {
  const queryClient = useQueryClient();
  const handleEvent = useCallback((event: WebSocketEvent) => {
    // setQueryData logic di sini
  }, [matchId, queryClient]);

  useEffect(() => {
    wsClient.connect();
    wsClient.subscribeMatch(matchId);
    const unsub = wsClient.subscribe(handleEvent);
    return () => { unsub(); wsClient.unsubscribeMatch(matchId); };
  }, [matchId, handleEvent]);
}
```

---

#### TASK-02: Perbaiki aksesibilitas `MatchCard` — `onClick` pada `<Card>` (div)

**Masalah:** `MatchCard.tsx` menggunakan `onClick` pada komponen `<Card>` yang underlying-nya adalah `<div>`. Ini tidak accessible (tidak bisa diakses keyboard, tidak ada role).

**Target:** Ganti dengan `<Link>` dari React Router atau bungkus dalam `<article>` + `<Link>`.

**File Terdampak:**
- `src/features/matches/components/MatchCard.tsx`

**Acceptance Criteria:**
- [ ] Klik navigasi ke `/matches/:id` via `<Link>` atau `<a>` yang proper
- [ ] Komponen bisa diakses via Tab + Enter keyboard
- [ ] Tidak ada `onClick` pada non-interactive element
- [ ] Visual tetap sama (card style, hover effect)

**Catatan Teknis:**
```tsx
// Opsi A: Wrap seluruh card dengan Link
import { Link } from 'react-router-dom';

<Link to={`/matches/${match.id}`} className="block">
  <Card className="hover:border-primary/50 transition-colors">
    ...
  </Card>
</Link>
```

---

#### TASK-03: Tambah barrel exports `index.ts` di folder yang belum punya

**Masalah:** Import masih verbose dan antar-file (e.g., `import { MatchCard } from './MatchCard'`). Belum ada `index.ts` barrel untuk clean imports.

**File Terdampak (perlu ditambah `index.ts`):**
- `src/features/matches/components/index.ts` ← [NEW]
- `src/features/matches/hooks/index.ts` ← [NEW]
- `src/features/matches/api/index.ts` ← [NEW]
- `src/features/commentary/components/index.ts` ← [NEW]
- `src/shared/components/index.ts` ← [NEW]
- `src/shared/ui/index.ts` ← [NEW]

**Acceptance Criteria:**
- [ ] Semua barrel `index.ts` sudah ada di folder di atas
- [ ] Import dalam pages dan components bisa menggunakan path barrel
- [ ] Tidak ada re-export dari barrel ke barrel (max 1 level)

---

### 🟡 Prioritas 2 — Penting (selesaikan dalam sprint ini)

---

#### TASK-04: Tambah form field accessibility pattern pada `CreateMatchForm`

**Masalah:** `CreateMatchForm.tsx` menggunakan `<Input>` dan `<Label>` mentah tanpa `aria-invalid` dan `aria-describedby` saat ada error. Error message berupa `<p>` tanpa `role="alert"` dan tanpa id yang terhubung ke input.

**File Terdampak:**
- `src/features/matches/components/CreateMatchForm.tsx`

**Acceptance Criteria:**
- [ ] Setiap field yang error punya `aria-invalid="true"` pada `<Input>`
- [ ] Error message `<p>` punya unique `id` dan dihubungkan via `aria-describedby`
- [ ] Error message `<p>` punya `role="alert"` atau `aria-live="polite"`
- [ ] Submit button punya `aria-busy={mutation.isPending}`

**Contoh Pola:**
```tsx
<div className="space-y-2">
  <Label htmlFor="sport">Sport</Label>
  <Input
    id="sport"
    aria-invalid={!!errors.sport}
    aria-describedby={errors.sport ? 'sport-error' : undefined}
    {...register('sport')}
  />
  {errors.sport && (
    <p id="sport-error" role="alert" className="text-sm text-destructive">
      {errors.sport.message}
    </p>
  )}
</div>
```

---

#### TASK-05: Buat `useMatchDetail` page menggunakan hook `useMatchLiveUpdates`

**Catatan:** Bergantung pada TASK-01. Setelah TASK-01 selesai, update `MatchDetailPage` untuk menggunakan hook baru.

**File Terdampak:**
- `src/features/matches/pages/MatchDetail.tsx`

**Acceptance Criteria:**
- [ ] `MatchDetailPage` cukup panggil `useMatchLiveUpdates(matchId)` — tidak perlu tahu detail WS
- [ ] Sort commentary dipindah ke hook atau API fn, bukan di page
- [ ] Page hanya tersisa: data binding, loading/error state, JSX rendering

---

#### TASK-06: Perbaiki TypeScript — generalisasi `useMatches` filter parameter

**Masalah:** `useMatches(status?: string)` menerima `string` mentah dan melakukan cast `as MatchStatus`. Ini tidak type-safe.

**File Terdampak:**
- `src/features/matches/hooks/use-matches.ts`

**Acceptance Criteria:**
- [ ] Signature berubah menjadi `useMatches(status?: MatchStatus | 'all')`
- [ ] Cast `as MatchStatus` dihilangkan
- [ ] Logic filter tetap sama: `'all'` → `undefined` (tanpa filter)

```typescript
// Sebelum
export function useMatches(status?: string) {
  const filterStatus = status === 'all' ? undefined : (status as MatchStatus | undefined);
  // ...
}

// Sesudah
export function useMatches(status?: MatchStatus | 'all') {
  const filterStatus = status === 'all' ? undefined : status;
  // ...
}
```

---

#### TASK-07: Tambah `aria-live` region pada ScoreBoard untuk live updates

**Masalah:** Skor yang berubah via WebSocket tidak punya `aria-live` region. Screen reader tidak akan mengumumkan perubahan skor.

**File Terdampak:**
- `src/features/matches/components/ScoreBoard.tsx`

**Acceptance Criteria:**
- [ ] Area skor dibungkus `<div aria-live="polite" aria-atomic="true">`
- [ ] Teks yang berubah adalah skor, bukan seluruh komponen
- [ ] Tidak mengganggu visual layout

---

### 🟢 Prioritas 3 — Nice to Have (backlog jika waktu ada)

---

#### TASK-08: Tambah `index.ts` barrel untuk `src/shared/constants/`

**File Terdampak:**
- `src/shared/constants/index.ts` ← [NEW]

---

#### TASK-09: Skeleton loading untuk `CommentaryTimeline`

**Masalah:** `CommentaryTimeline` menerima `isLoading` prop tapi mungkin menampilkan spinner biasa. Skeleton lebih baik untuk live data.

**File Terdampak:**
- `src/features/commentary/components/CommentaryTimeline.tsx`
- `src/features/commentary/components/CommentaryItemSkeleton.tsx` ← [NEW]

**Acceptance Criteria:**
- [ ] Saat `isLoading=true`, tampilkan 3–5 skeleton item (`animate-pulse`)
- [ ] Skeleton memiliki struktur yang sama dengan item nyata

---

#### TASK-10: Tambah `discriminated union` untuk async state di shared types

**Tujuan:** Sediakan reusable `AsyncState<T>` type untuk komponen yang perlu represent loading/error/success secara type-safe.

**File Terdampak:**
- `src/shared/types/async-state.ts` ← [NEW]

```typescript
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: unknown };
```

---

## File / Folder Terdampak — Ringkasan

| File | Action | Task |
|---|---|---|
| `src/features/matches/pages/MatchDetail.tsx` | MODIFY | TASK-01, TASK-05 |
| `src/features/matches/hooks/use-match-live-updates.ts` | NEW | TASK-01 |
| `src/features/matches/components/MatchCard.tsx` | MODIFY | TASK-02 |
| `src/features/matches/components/CreateMatchForm.tsx` | MODIFY | TASK-04 |
| `src/features/matches/components/ScoreBoard.tsx` | MODIFY | TASK-07 |
| `src/features/matches/hooks/use-matches.ts` | MODIFY | TASK-06 |
| `src/features/matches/components/index.ts` | NEW | TASK-03 |
| `src/features/matches/hooks/index.ts` | NEW | TASK-03 |
| `src/features/matches/api/index.ts` | NEW | TASK-03 |
| `src/features/commentary/components/index.ts` | NEW | TASK-03 |
| `src/features/commentary/components/CommentaryTimeline.tsx` | MODIFY | TASK-09 |
| `src/features/commentary/components/CommentaryItemSkeleton.tsx` | NEW | TASK-09 |
| `src/shared/components/index.ts` | NEW | TASK-03 |
| `src/shared/ui/index.ts` | NEW | TASK-03 |
| `src/shared/constants/index.ts` | NEW | TASK-08 |
| `src/shared/types/async-state.ts` | NEW | TASK-10 |

---

## Acceptance Criteria Global

Sprint dianggap selesai jika:

- [ ] `bun run typecheck` → 0 errors
- [ ] Tidak ada `new WebSocket()` di luar `shared/lib/websocket.ts`
- [ ] Tidak ada `onClick` pada non-interactive element (`div`, `Card`, `article`)
- [ ] Semua WS callback dibungkus `useCallback`
- [ ] Semua error message punya `aria-describedby` matching
- [ ] Score live update punya `aria-live` region
- [ ] Barrel `index.ts` sudah ada di semua `components/`, `hooks/`, `api/` folder

---

## Urutan Pengerjaan yang Direkomendasikan

```
TASK-01 → TASK-05  (WS extraction + page cleanup, dependency chain)
    ↓
TASK-06             (Type-safe filter, low risk)
    ↓
TASK-02             (MatchCard accessibility)
    ↓
TASK-04             (Form accessibility)
    ↓
TASK-07             (ScoreBoard aria-live)
    ↓
TASK-03             (Barrel exports, bisa paralel dengan apapun)
    ↓
TASK-08 → TASK-09 → TASK-10  (Nice to have)
```

---

## Catatan Teknis Umum

1. **Jangan refactor dan tambah fitur baru di commit yang sama.** Satu commit per task.
2. **Verifikasi `bun run typecheck`** setelah setiap task sebelum lanjut ke task berikutnya.
3. **Jangan ubah behavior/UX** — sprint ini murni code quality, tidak ada fitur baru atau perubahan tampilan signifikan.
4. **TASK-01 dan TASK-05 adalah dependency** — selesaikan TASK-01 dulu sebelum TASK-05.
5. **Barrel exports (TASK-03)** bisa dikerjakan kapan saja secara paralel, tapi update semua import yang terdampak di commit yang sama.
