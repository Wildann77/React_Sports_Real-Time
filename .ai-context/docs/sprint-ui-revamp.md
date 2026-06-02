# Sprint: UI/UX Revamp — Spotify-Inspired Dark-First Redesign

**Sprint Name:** `sprint/ui-ux-revamp`
**Tanggal Dibuat:** 2026-06-01
**Durasi Estimasi:** 4–5 hari (solo dev)
**Berdasarkan:** `AGENTS.md`, `DESIGN.md` (Spotify-inspired, dark-first), skill `frontend-design`, profil `senior-frontend / vite-spa`, dan inventaris kode di `src/`.

---

## Tujuan Sprint

Meningkatkan kualitas tampilan frontend dari baseline "fungsional tapi generik" menjadi **immersive, dark-first, dan berkarakter** dengan identitas visual Spotify-inspired. Tidak ada perubahan behavior/fitur — murni peningkatan visual, aksesibilitas, tipografi, dan konsistensi komponen.

---

## 1. Analisis Kondisi UI Saat Ini

### Stack & Token
- shadcn/ui (style: `new-york`, base color `slate`) dengan tema default biru/slate di `src/index.css`.
- Theme toggle ada (`use-theme.ts`) namun default mengikuti sistem; tidak ada brand identity yang menonjol.
- Tailwind v4 + CVA sudah terpasang; design tokens dipetakan via CSS variables (`--background`, `--primary`, dll.) — fondasi token bagus, tinggal **diisi dengan palette Spotify**.

### Layer & Komposisi
- `AppShell` (public) memiliki header sticky generik dengan **gradient `primary→orange-500`** pada wordmark — bertabrakan dengan arah brand `DESIGN.md` (hijau Spotify).
- `AdminShell` praktis kosong: hanya `<Outlet />` + bar mobile. Tidak ada sidebar, breadcrumb, atau navigasi admin yang konsisten.
- Page-level layout tidak punya skip-to-content, atmospheric backdrop, atau brand presence.

### Komponen Kunci
- `MatchCard` — kartu informatif tapi datar; tidak ada "hero zone", tipografi skor kecil, hover state minim.
- `ScoreBoard` — sudah punya `aria-live`, tapi tampilan flat (tanpa mood gradient/glow), team name dan score kompetisi tipografi.
- `MatchStatusBadge` — LIVE memakai `variant="destructive"` (merah). Bertabrakan dengan semantic `destructive = error`. Spotify-vibe: LIVE seharusnya hijau pulse.
- `MatchFilterTabs` — pakai radix Tabs default (pill abu-abu). Tidak menyertakan brand accent.
- `CommentaryTimeline` — list flat dengan auto-scroll-to-bottom; tidak ada timeline visual, ikon per event type, atau highlight item baru saat WS push.
- `CommentaryItem` — bulatan minute generik; warna seragam tanpa diferensiasi event (goal vs card vs info).
- `LoadingState` — spinner tunggal di tengah; tidak ada skeleton untuk list/grid; mengabaikan persepsi performa.
- `EmptyState` / `ErrorState` — generik, tanpa konteks per fitur.
- `LoginForm` — kartu kecil di tengah; tidak ada brand panel, headline, atau "mood".
- `Dashboard` — list rapi tapi tidak ada KPI strip, tidak ada "Live Now" rail, dan tidak menyorot match yang sedang berlangsung.
- `ApiKeysPage` — tabel HTML mentah dengan kontras rendah pada dark mode; checkbox di `CreateApiKeyDialog` masih `<input type="checkbox">` polos.
- `CreateMatchForm` / `CreateCommentaryForm` — fungsional dan a11y-aware, tapi tata letak monoton (semua dua kolom seragam), tidak ada section helper, CTA tidak tactile.
- WS connection state (`useWsStatus`) tersedia tapi **tidak pernah ditampilkan** di UI.

### Tipografi & Atmosfer
- Tidak ada font kustom; mengandalkan default browser. `DESIGN.md` mengarahkan Circular-like (display heavy, ls negatif). Project belum memuat font display.
- Tidak ada gradient/noise/grain backdrop untuk atmosfer (DESIGN.md: "soft radial gradients").

### A11y & Performance
- Form sudah menerapkan `aria-invalid` + `aria-describedby` di sebagian besar tempat (sesuai sprint sebelumnya), tapi:
  - Belum ada skip-to-content link.
  - `CreateApiKeyDialog` checkbox kustom belum punya focus ring konsisten.
  - Beberapa `aria-label` kurang (icon-only "Toggle theme" sudah ada — bagus).
  - Belum ada `prefers-reduced-motion` guard untuk pulse/scroll smooth.
- Bundle budget 200KB initial / 80KB per-route belum diukur; perubahan ini **harus tetap respect budget** (tanpa framer-motion, tanpa icon library tambahan).

---

## 2. Daftar Masalah UI/UX yang Perlu Diperbaiki

| # | Masalah | Area |
|---|---------|------|
| P-01 | Token warna belum mencerminkan brand Spotify (hijau `#1DB954`, near-black `#121212`, card `#181818`) | `src/index.css` |
| P-02 | Tidak ada font display ber-karakter; tipografi terasa generik | global |
| P-03 | Default theme tidak dark padahal `DESIGN.md` "strictly dark-first" | `use-theme.ts` |
| P-04 | Header logo memakai gradient `primary→orange` yang kontradiktif dengan brand | `AppShell.tsx` |
| P-05 | `AdminShell` tidak memiliki sidebar/nav tetap; admin nav menumpang di header public | `AdminShell.tsx` |
| P-06 | Status WebSocket tidak terlihat di UI | `AppShell` / `AdminShell` |
| P-07 | `MatchStatusBadge` LIVE pakai `destructive` (semantic salah) | `MatchStatusBadge.tsx` |
| P-08 | `MatchCard` datar: tidak ada hero, hover minimal, skor kecil | `MatchCard.tsx` |
| P-09 | `ScoreBoard` tanpa mood/gradient, kurang dramatic | `ScoreBoard.tsx` |
| P-10 | `CommentaryTimeline` tidak punya garis waktu, ikon, atau highlight event baru | `CommentaryTimeline.tsx`, `CommentaryItem.tsx` |
| P-11 | `LoginForm` minim brand presence | `LoginForm.tsx` |
| P-12 | `Dashboard` tidak punya KPI atau "Live Now" rail | `Dashboard.tsx` |
| P-13 | Tabel API keys tidak harmonis dengan dark theme + checkbox raw | `ApiKeysPage.tsx`, `CreateApiKeyDialog.tsx` |
| P-14 | Form (`CreateMatchForm`, `CreateCommentaryForm`) kurang section grouping & visual polish | Forms |
| P-15 | `LoadingState` tidak punya skeleton variants | `shared/components` |
| P-16 | `EmptyState` & `ErrorState` generik, tidak feature-aware | `shared/components` |
| P-17 | Filter Tabs di `MatchList` tidak match dengan brand pill style | `MatchFilterTabs.tsx` |
| P-18 | Tidak ada skip-to-content & atmospheric backdrop di shell | `AppShell.tsx` |
| P-19 | `MatchFilterTabs` LIVE tab tidak menampilkan jumlah live | `MatchFilterTabs.tsx` |
| P-20 | Tidak ada `prefers-reduced-motion` guard untuk pulse/auto-scroll | global |
| P-21 | `CommentaryTimeline` auto-scroll-to-bottom mengganggu (terutama saat user sedang scroll-up baca commentary lama) | `CommentaryTimeline.tsx` |
| P-22 | Belum ada favicon / meta theme color sesuai brand | `index.html` |
| P-23 | Mobile admin nav cuma top-bar, tidak ada drawer | `AdminShell.tsx` |
| P-24 | Tidak ada toast/notify visual style yang harmonis dengan dark Spotify (sonner default) | `App.tsx` |

---

## 3. Rencana Perubahan Per Halaman/Komponen

### 3.1 Foundation (Tema, Tipografi, Backdrop)

#### A. Refactor design tokens (`src/index.css`)
- Set `:root` ke palette **light Spotify-derived** (sekunder), `.dark` ke palette **Spotify near-black** (primer).
- Token utama (HSL):
  - `--background: 0 0% 7%` (#121212), foreground `0 0% 100%`
  - `--card: 0 0% 9%` (#181818), `--card-foreground: 0 0% 100%`
  - `--popover: 0 0% 11%`
  - `--primary: 142 76% 41%` (#1DB954), `--primary-foreground: 0 0% 7%`
  - `--secondary: 0 0% 16%` (#282828), `--secondary-foreground: 0 0% 100%`
  - `--muted: 0 0% 16%`, `--muted-foreground: 0 0% 70%` (#B3B3B3)
  - `--accent: 142 76% 41%`
  - `--destructive: 354 86% 56%` (#EF4444 deep red), `--destructive-foreground: 0 0% 100%`
  - `--border: 0 0% 16%`, `--input: 0 0% 22%`, `--ring: 142 76% 41%`
  - `--radius: 0.25rem` (default 4px), kartu pakai `--radius-lg` (8px)
- Tambah token brand auxiliary:
  - `--brand-glow: 142 76% 41% / 0.35` (untuk shadow hijau)
  - `--surface-elevated: 0 0% 11%` (popover, dialog)
  - `--success: 142 76% 41%`, `--warning: 38 92% 50%`, `--info: 217 91% 60%`
- Tambah `@layer base` untuk:
  - `body { font-feature-settings: 'ss01', 'cv11'; }`
  - `html { scroll-behavior: smooth; @media (prefers-reduced-motion: reduce) { scroll-behavior: auto; } }`
  - `*::-webkit-scrollbar` styling (minimal, dark).

#### B. Tipografi
- Tambah font display + body via `@import` di `index.css` atau `index.html` preconnect:
  - **Display**: Manrope (800/700/500) — geometric, bold, ls-negatif → mendekati Circular feel.
  - **Body**: Inter atau Manrope 400/500.
  - **Mono**: JetBrains Mono atau ui-monospace untuk tabular skor.
  - Gunakan fontsource self-hosted (`@fontsource/manrope/{400,500,700,800}.css`) agar tidak menabrak budget (per weight ±10KB woff2; total ±35KB).
  - Atau alternatif: pakai font CDN (Google Fonts) dengan `<link rel="preconnect" / "preload">` di `index.html` untuk cepat first paint.
- Tambah utilitas Tailwind via theme extension di `index.css` `@theme`:
  - `--font-display: 'Manrope', 'Helvetica Neue', sans-serif;`
  - `--font-mono: 'JetBrains Mono', ui-monospace;`
- Heading: gunakan `font-display tracking-[-0.04em] font-extrabold`.

#### C. Atmospheric backdrop
- Tambah file `src/shared/components/Backdrop.tsx` — radial green-glow gradient + noise SVG sangat tipis (±1KB inline).
- Render di `AppShell` sebagai layer absolute behind content.

#### D. Default Theme
- Update `use-theme.ts`:
  - Default theme = `'dark'` (sesuai `DESIGN.md`).
  - Tetap pertahankan toggle untuk yang ingin terang.
  - Tetap respect `localStorage`; abaikan sistem prefers untuk first load (Spotify dark-first).

**Acceptance**
- Buka aplikasi tanpa data tersimpan → langsung dark, hijau Spotify, font display ter-load.
- `bun run typecheck` zero errors.
- CLS ≤ 0.1 saat font swap (gunakan `font-display: swap` dan `size-adjust` fallback).

---

### 3.2 Shared Components — Refactor & Tambahan

| File | Action | Tujuan |
|------|--------|--------|
| `shared/components/Backdrop.tsx` | NEW | Radial gradient + grain decoratif |
| `shared/components/BrandLogo.tsx` | NEW | Wordmark + optional mark icon, prop `size` (`sm \| md \| lg`) |
| `shared/components/ConnectionStatus.tsx` | NEW | Pakai `useWsStatus`, tampilkan dot + label, `aria-live="polite"` |
| `shared/components/SkipToContent.tsx` | NEW | Skip link, visible on focus only |
| `shared/components/Skeleton.tsx` | NEW | Primitive skeleton box (`animate-pulse`, respect `prefers-reduced-motion`) |
| `shared/components/MatchCardSkeleton.tsx` | NEW | List skeleton selaras dengan `MatchCard` |
| `shared/components/TableRowSkeleton.tsx` | NEW | Untuk halaman API Keys |
| `shared/components/EmptyState.tsx` | MODIFY | Slot untuk `icon`, `action`, `tone` (info/warn/empty) |
| `shared/components/ErrorState.tsx` | MODIFY | Tone variants, primary-style retry, illustration slot |
| `shared/components/LoadingState.tsx` | MODIFY | Mode `spinner \| skeleton` (default spinner branded) |
| `shared/components/AppShell.tsx` | MODIFY | Brand logo, atmospheric backdrop, ConnectionStatus, skip-to-content, mobile menu |
| `shared/components/AdminShell.tsx` | REWRITE | Two-column layout: SidebarNav (desktop) + Drawer (mobile), TopBar dengan ConnectionStatus & user menu |
| `shared/components/AdminSidebar.tsx` | NEW | Items: Dashboard, Matches, API Keys, Logout (logout via mutation, bukan link) |
| `shared/components/PageHeader.tsx` | MODIFY | Tambah `breadcrumb`, `eyebrow` (kategori section) |
| `shared/components/StatCard.tsx` | NEW | KPI card untuk dashboard (icon, label, value, delta optional) |
| `shared/components/SectionHeader.tsx` | NEW | Heading section dengan eyebrow + helper text |

#### Catatan UI primitives (`shared/ui/`)
- Tambah varian baru di `Button` CVA:
  - Size `xl` (h-12, px-6, font-display, tracking-tight) — tactile Spotify "Play" feel.
  - Variant `success` = sama dengan default tapi pakai `--brand-glow` shadow ring untuk CTAs utama.
  - Variant `ghost-light` (untuk header).
- `Badge` CVA: tambah `variant="live"` (hijau + dot pulse), `variant="success"`, `variant="warning"`, `variant="info"`. Ukuran `size="sm" \| "md"`.
- `Card`: tambah optional `hover` prop (`true` → `hover:-translate-y-0.5 hover:bg-card/80 transition-all`).
- `Tabs`: re-style `TabsList` jadi pill rounded-full, indicator hijau aktif.
- `Input`, `Textarea`, `Select`: focus ring hijau (sudah otomatis via `--ring`).
- Tambah primitive `Switch` (radix-ui) — kebutuhan mendatang & menggantikan checkbox raw.
- Tambah primitive shadcn `Form` (`<Form />`, `<FormField />`, `<FormItem />`, `<FormLabel />`, `<FormControl />`, `<FormMessage />`) sesuai mandat di `agent-instructions.md` — *opsional di sprint ini, lihat catatan refactor di §5*.

---

### 3.3 Public — `MatchListPage` & Komponen

#### `MatchListPage`
- Tambah hero strip: judul besar (font-display 4xl/5xl), subtitle, KPI mini (live count, scheduled count, finished today) — angka diambil dari `useMatches('all', 100)` lalu di-derive dengan `useMemo`.
- Sticky filter bar: `MatchFilterTabs` + (right) sort dropdown (future) + connection indicator.
- Live section terpisah: jika ada match LIVE, tampilkan rail horizontal "Live Now" (cards lebih besar, pulse effect) di atas grid.
- Grid utama: 1/2/3 kolom dengan gap yang lebih lega (gap-5).
- Loading: pakai `<MatchCardSkeleton />` × 6.
- Empty: `EmptyState` dengan tone `empty`, action button "View All" (reset filter).
- "Load More": tetap, tapi style ulang dengan button outline branded.

#### `MatchCard` redesign
- Wrapper `<Link>` (sudah benar) tetap.
- Struktur baru:
  - **Top zone** (h-24): gradient backdrop dinamis berdasarkan sport (function `getSportGradient(sport)` — table mapping in `shared/utils/`).
    - Sport icon (lucide) di kiri, status badge di kanan.
    - Sport icon mapping: football=`Volleyball`, basketball=`CircleDashed`, tennis=`Circle`, default=`Trophy`.
  - **Content zone** (p-5):
    - Sport label tipis, ALL CAPS, ls-wide.
    - Tim home & away dengan `text-xl font-display font-bold truncate`.
    - Skor gunakan `font-mono tabular-nums text-3xl` di kanan.
    - Saat status LIVE → label minute/clock atau "LIVE" pulse di bawah skor.
  - **Footer**: `startTime - endTime` dengan icon `Clock`, mute color.
- Hover: `-translate-y-0.5`, `border-primary/40`, `shadow-[0_0_24px_-12px_hsl(var(--brand-glow))]`.
- Focus-visible: ring hijau 2px + offset 2.

#### `MatchStatusBadge` redesign
- LIVE → variant `live` (hijau, dot pulse). Hapus `destructive`.
- FINISHED → variant `secondary`.
- SCHEDULED → variant `outline` dengan icon `Calendar`.

#### `MatchFilterTabs` redesign
- Pill rounded-full, indikator aktif hijau dengan glow ring tipis.
- Tampilkan count per status (pass via prop `counts`).
- Saat tab "Live" memiliki ≥1 match, tampilkan dot pulse hijau di samping label.

**Acceptance**
- LiveNow rail muncul saat ada match LIVE, hilang otomatis saat tidak ada.
- Skeleton tampil <100ms; tidak ada CLS saat transition ke konten nyata.
- Card pressable via Tab + Enter; focus ring jelas.
- LIVE pulse hormati `prefers-reduced-motion`.

---

### 3.4 Public — `MatchDetailPage` & ScoreBoard / Commentary

#### `MatchDetailPage`
- Tambah breadcrumb di top: `Matches / {homeTeam} vs {awayTeam}`.
- Layout grid baru: ScoreBoard full width di atas, lalu 2-col (md+): kiri = Commentary timeline, kanan = "Match Info" panel (sport, kickoff, venue placeholder, metadata pretty-print).
- Tambah ConnectionStatus inline near commentary header.

#### `ScoreBoard` redesign
- Wrapper card relative, dengan radial gradient backdrop (hijau lembut → fade) di belakang skor.
- Layout:
  - Top: badge sport (mono), badge status (LIVE pulse jika live).
  - Center: 3-grid → `[homeTeam] [score panel] [awayTeam]`.
    - Tim name: `font-display text-4xl md:text-6xl tracking-[-0.04em] font-black`.
    - Score panel: skor `font-mono tabular-nums text-6xl md:text-8xl`, dipisah `:` typografi atau pemisah vertikal.
    - `aria-live="polite"` tetap di score region.
  - Bottom: kickoff ↔ end time (icon `Clock`), durasi (jika LIVE → live timer hh:mm).
- Live timer: hook `useLiveDuration(startTime, status)` → render `Xh Ym` dari `startTime` saat status=`LIVE`, recompute setiap menit.

#### `CommentaryTimeline` redesign
- Header: title + count + ConnectionStatus mini.
- Body: list kronologis (urutan terbaru di atas — ubah default sort).
  - Garis vertical timeline tipis di kiri (border-l) dengan dots berwarna per event.
  - Auto-scroll-to-bottom diganti: jika user near bottom (within 80px) → auto-stick; kalau tidak → tampilkan tombol floating "↓ New events" yang scroll on click.
  - Item baru via WS push diberi highlight ring hijau yang fade out 1.5s (CSS animation, respect reduced-motion).
- Skeleton pakai `<CommentaryItemSkeleton />` (existing).

#### `CommentaryItem` redesign
- Avatar bulat menampilkan `commentary.minute'` tetap, tapi warnanya berubah berdasarkan event:
  - GOAL → `bg-primary/15 border-primary text-primary`
  - YELLOW_CARD → `bg-yellow-500/10 border-yellow-500/40 text-yellow-500`
  - RED_CARD → `bg-destructive/10 border-destructive/40 text-destructive`
  - SUBSTITUTION → `bg-info/10 border-info/40 text-info`
  - HALF_TIME / FULL_TIME → `bg-muted border text-muted-foreground` + label
  - INFO → default current
- Tambah ikon kecil di sebelah event-type badge (function `getEventIcon`).
- Layout: avatar | (meta + message). Meta: badge event-type + timestamp relatif (`formatDistanceToNow`).

**Acceptance**
- ScoreBoard punya mood gradient & live timer aktif saat LIVE.
- Commentary baru via WS push memunculkan highlight + tombol "New events" jika user scroll up.
- Sort terbaru di atas, scroll behavior natural; reduced-motion mematikan smooth scroll & ring fade.

---

### 3.5 Public — `LoginForm` (Halaman /login)

#### Redesign
- Layout split (lg+): kiri = brand panel (gradient hijau→hitam, BrandLogo besar, headline "Real-time scores. Live commentary.", testimonial/feature bullets ringkas), kanan = form card.
- Mobile: stack — brand kompak di atas, form full-width.
- Form card:
  - Heading `font-display tracking-tight`.
  - Field email + password dengan helper text & ikon kiri (`Mail`, `Lock`).
  - Tombol submit `size="xl"` `variant="success"` rounded-full.
  - Footer link: "Bukan admin? Lihat skor publik" → `<Link to="/" />`.
- Background: Backdrop component aktif.

**Acceptance**
- Login mobile tampil stack, tidak ada horizontal scroll.
- Form A11y tetap intact (Field labels, aria-describedby, error toast).

---

### 3.6 Admin — Shell & Dashboard

#### `AdminShell` (rewrite)
- Desktop layout (`lg:grid lg:grid-cols-[260px_1fr]`):
  - Kiri: `<AdminSidebar />` fixed full-height, dark (#0c0c0c), nav items dengan ikon (Layout, Trophy, Key, LogOut).
  - Kanan: TopBar tipis (border-b) berisi: page title slot, search slot (future), ConnectionStatus, user menu (email + avatar circle, dropdown logout).
  - Konten utama: `<Outlet />` di dalam `<main id="main">`.
- Mobile (<lg):
  - TopBar dengan menu icon → buka Drawer (radix Dialog) berisi sidebar yang sama.
  - Konten full-width.

#### `Dashboard`
- Header: PageHeader dengan eyebrow "Overview", judul "Selamat datang kembali", deskripsi.
- KPI strip (4 cards, grid-cols-2 md:grid-cols-4):
  - Total Matches, Live Now (pulse hijau), Scheduled, Finished Today.
- Section "Live Now" (rail horizontal scroll-x) jika ada match live.
- Section "Recent Matches" — list ringkas (`MatchListItem` baru, kompak) dengan action "Add Commentary".
- "Quick Actions" card di kanan (grid lg:grid-cols-3 di section bawah): New Match, Manage API Keys, Logout All Devices (existing CTA dipindah ke sini).
- Empty state jika tidak ada match.

**Acceptance**
- Sidebar tetap visible & sticky, scroll konten hanya di main.
- KPI count akurat (derive dari `useMatches('all', N)` atau buat hook `useMatchKpis`).
- Quick actions dapat dipanggil via keyboard.

---

### 3.7 Admin — `CreateMatch` & `CreateCommentary`

#### `CreateMatchPage` & `CreateMatchForm`
- Layout multi-section card:
  - Section 1: "Match Info" (sport, homeTeam, awayTeam).
  - Section 2: "Schedule" (startTime, endTime).
  - Section 3: "Initial Score" (homeScore, awayScore).
  - Section 4: "Advanced (Metadata JSON)" (collapsible — `<details>` atau radix Collapsible — *future*; v1 cukup section terpisah).
- Sport input → tukar jadi `<Select>` dengan opsi populer (football, basketball, tennis, hockey, custom). Custom value dapat diketik (combobox future; v1 native select).
- Tombol submit `size="xl" variant="success"`, tombol Cancel `variant="ghost"`.
- Tampilkan `<GlobalErrorNormalizer error={mutation.error} />` di atas form bila mutation error (sekarang hanya toast).

#### `CreateCommentaryPage` & `CreateCommentaryForm`
- Header tampilkan ScoreBoard ringkas (mini, tanpa mood gradient) di atas form sebagai konteks → re-pakai `<ScoreBoardCompact />` (varian baru dari ScoreBoard).
- Form:
  - Section "Event": minute + eventType (eventType jadi grid pilihan visual: tombol 7-cell dengan ikon, pakai radix `RadioGroup` atau toggle group — *v1 cukup `<Select>` dengan ikon mapping*).
  - Section "Message": Textarea lebar, char count.
  - Section "Score Update (Optional)" tetap.
- Setelah sukses post: clear message, fokuskan kembali ke field minute, dan tampilkan toast hijau pulse.

**Acceptance**
- Form A11y tetap valid (`aria-invalid`, `aria-describedby`, `role="alert"`).
- `CreateCommentaryPage` menampilkan skor live (subscribe via existing `useMatchLiveUpdates`).
- Mutation error muncul inline + toast (tidak hanya toast).

---

### 3.8 Admin — `ApiKeysPage` & `CreateApiKeyDialog`

#### `ApiKeysPage`
- Replace `<table>` HTML mentah dengan komponen yang lebih dark-friendly:
  - Header row dengan border-b primary/10.
  - Body row hover background `bg-card/60`.
  - Action button "Revoke" jadi konfirmasi via radix `AlertDialog` (NEW primitive di `shared/ui/alert-dialog.tsx`) — gantikan `window.confirm`.
- Status pill column: `Active` (success) / `Expired` (destructive) / `Expires soon` (warning, jika <7 hari).
- Empty state dengan ikon Key besar di lingkaran hijau pulse, copy lebih friendly.

#### `CreateApiKeyDialog`
- Replace raw `<input type="checkbox">` dengan komponen `<ScopeToggle />` (NEW di `features/api-keys/components/`):
  - Card-like clickable: ikon, nama scope mono, deskripsi, indikator centang hijau saat selected.
  - Mendukung keyboard (`role="button"` atau pakai `<button type="button">`).
- Bagian "API Key revealed":
  - Token ditampilkan dalam blok pre besar dengan `font-mono`, copy button utama (size lg) di kanan.
  - Warning AlertDialog-style dengan border kuning + ikon `AlertTriangle`.

**Acceptance**
- `window.confirm` dihapus; dialog konfirmasi memakai radix `AlertDialog`.
- ScopeToggle bisa di-Tab + Space toggle.
- `useCreateApiKey` mutation behavior tidak berubah.

---

### 3.9 Toaster (`sonner`) Theming

- Update `<Toaster />` di `App.tsx`:
  - `theme="dark"`, `richColors={true}`, `position="top-right"`.
  - Custom `toastOptions` untuk class default agar selaras (`font-display`, `rounded-md`, border `--border`).
- Tidak perlu komponen baru, cukup props.

---

### 3.10 `index.html` — Brand & Performance

- Tambah `<link rel="icon" href="/favicon.svg">` (NEW asset SVG bola hijau di `public/`).
- Tambah `<meta name="theme-color" content="#121212">`.
- Tambah `<meta name="description" content="...">`.
- Preconnect/preload font (jika via CDN).
- Title default tetap "Sports Realtime Dashboard"; per-page bisa dilakukan via `<title>` update di tiap page (gunakan custom hook `useDocumentTitle` di `shared/hooks/`).

---

## 4. Prioritas Pengerjaan

| Prio | Task ID | Ringkasan |
|------|---------|-----------|
| **High** | UI-01 | Refactor design tokens (`index.css`) ke palette Spotify |
| **High** | UI-02 | Default theme = dark (`use-theme.ts`) |
| **High** | UI-03 | Load font display (Manrope/Inter Tight) + utilitas `font-display`/`font-mono` |
| **High** | UI-04 | Rewrite `AppShell` — backdrop, BrandLogo, ConnectionStatus, skip-to-content |
| **High** | UI-05 | Rewrite `AdminShell` + `AdminSidebar` (desktop+mobile drawer) |
| **High** | UI-06 | Refactor `MatchStatusBadge` (LIVE = success/live, bukan destructive) |
| **High** | UI-07 | Redesign `MatchCard` (hero zone, mono score, hover lift) |
| **High** | UI-08 | Redesign `ScoreBoard` (mood gradient, mega score, live timer) |
| **High** | UI-09 | Tambah primitive `Skeleton` + `MatchCardSkeleton` + integrate di `MatchListPage` |
| **High** | UI-10 | Tambah `ConnectionStatus` shared component |
| **Medium** | UI-11 | Redesign `MatchListPage` (KPI strip, Live Now rail) |
| **Medium** | UI-12 | Redesign `Dashboard` (KPI cards, Live rail, quick actions) |
| **Medium** | UI-13 | Redesign `CommentaryTimeline` (timeline, sort terbaru, highlight WS) |
| **Medium** | UI-14 | Redesign `CommentaryItem` (event-color avatar, ikon) |
| **Medium** | UI-15 | Redesign `LoginForm` (split brand panel) |
| **Medium** | UI-16 | Update `MatchFilterTabs` (pill style, counts, live dot) |
| **Medium** | UI-17 | Refactor `EmptyState` & `ErrorState` (slots, tones) |
| **Medium** | UI-18 | Update `LoadingState` (variants), `PageHeader` (eyebrow, breadcrumb) |
| **Medium** | UI-19 | Theme `<Toaster />` selaras Spotify |
| **Medium** | UI-20 | Update `index.html` (favicon, theme-color, meta description) |
| **Medium** | UI-21 | `CreateApiKeyDialog` — ScopeToggle (gantikan checkbox raw) + AlertDialog |
| **Medium** | UI-22 | `ApiKeysPage` — table dark-friendly + status pill |
| **Low** | UI-23 | Redesign `CreateMatchForm` (sectioned, sport select, inline error) |
| **Low** | UI-24 | Redesign `CreateCommentaryForm` (compact ScoreBoard context, eventType visual) |
| **Low** | UI-25 | Tambah `useDocumentTitle` + page-level title |
| **Low** | UI-26 | Tambah `useLiveDuration` hook (untuk ScoreBoard live timer) |
| **Low** | UI-27 | Tambah `useMatchKpis` (memo derive dari list) |
| **Low** | UI-28 | Migrasi forms ke shadcn `<Form />` primitives (mandat agent-instructions, dapat dipisah ke sprint sendiri — lihat §5) |

### Urutan Eksekusi yang Direkomendasikan

```
UI-01 → UI-02 → UI-03   (foundation)
UI-04 → UI-05           (shells)
UI-06 → UI-07 → UI-08   (core public components)
UI-09 → UI-10 → UI-11   (list page polish)
UI-12 → UI-13 → UI-14   (dashboard + commentary)
UI-15 → UI-16 → UI-17 → UI-18 → UI-19 → UI-20  (sisa shared & polish)
UI-21 → UI-22           (api keys)
UI-23 → UI-24 → UI-25 → UI-26 → UI-27   (forms & utilities)
UI-28                    (opsional sprint berikut)
```

---

## 5. Rekomendasi Struktur Komponen (Refactor)

### File baru

```
src/shared/components/
  Backdrop.tsx                      ← Atmospheric gradient + grain
  BrandLogo.tsx                     ← Wordmark + mark
  ConnectionStatus.tsx              ← WS state visual (uses useWsStatus)
  SkipToContent.tsx                 ← A11y skip link
  Skeleton.tsx                      ← Primitive
  MatchCardSkeleton.tsx             ← List loader
  TableRowSkeleton.tsx              ← For api keys table
  StatCard.tsx                      ← KPI tile
  SectionHeader.tsx                 ← Eyebrow + title
  AdminSidebar.tsx                  ← Admin nav (desktop+drawer)

src/shared/ui/
  alert-dialog.tsx                  ← Radix AlertDialog primitive
  switch.tsx                        ← Radix Switch primitive
  separator.tsx                     ← (optional, untuk sidebar dividers)

src/shared/hooks/
  use-document-title.ts
  use-live-duration.ts
  use-match-kpis.ts                 ← OR di features/matches/hooks (preferred — feature-scoped)

src/shared/utils/
  sport-meta.ts                     ← getSportIcon, getSportGradient
  event-meta.ts                     ← getEventIcon, getEventColor

src/features/matches/components/
  MatchCardSkeleton.tsx             ← OR di shared if reused; rekomendasi feature-scoped
  MatchListItem.tsx                 ← Compact list row (Dashboard)
  ScoreBoardCompact.tsx             ← Untuk CreateCommentaryPage header
  LiveNowRail.tsx                   ← Horizontal scroll-x rail
  MatchKpiStrip.tsx                 ← KPI strip untuk MatchList & Dashboard

src/features/commentary/components/
  CommentaryEventIcon.tsx           ← Single source of truth
  CommentaryTimelineEmpty.tsx       ← Feature-aware empty state

src/features/api-keys/components/
  ScopeToggle.tsx                   ← Replace raw checkbox
  ApiKeyStatusBadge.tsx             ← Active/Expired/Expires soon
  ApiKeyTable.tsx                   ← Pisah tabel dari Page
  RevealedKeyPanel.tsx              ← Pisah dari Dialog body

public/
  favicon.svg                       ← Simple branded mark
```

### File diubah (modify)

- `src/index.css` — token Spotify, font import, scroll/scrollbar styles.
- `src/index.html` — meta, favicon, preconnect.
- `src/App.tsx` — Toaster theming.
- `src/shared/hooks/use-theme.ts` — default dark.
- `src/shared/components/AppShell.tsx`, `AdminShell.tsx`, `EmptyState.tsx`, `ErrorState.tsx`, `LoadingState.tsx`, `PageHeader.tsx`, `index.ts`.
- `src/shared/ui/badge.tsx`, `button.tsx`, `card.tsx`, `tabs.tsx`, `index.ts` — variants tambahan.
- `src/features/matches/components/MatchCard.tsx`, `MatchStatusBadge.tsx`, `MatchFilterTabs.tsx`, `ScoreBoard.tsx`, `CreateMatchForm.tsx`, `index.ts`.
- `src/features/matches/pages/MatchList.tsx`, `MatchDetail.tsx`, `CreateMatch.tsx`.
- `src/features/commentary/components/CommentaryItem.tsx`, `CommentaryTimeline.tsx`, `CreateCommentaryForm.tsx`.
- `src/features/commentary/pages/CreateCommentary.tsx`.
- `src/features/auth/components/LoginForm.tsx`.
- `src/features/dashboard/pages/Dashboard.tsx`.
- `src/features/api-keys/pages/ApiKeysPage.tsx`, `components/CreateApiKeyDialog.tsx`.

### Catatan migrasi shadcn `<Form />` (UI-28, opsional)

Mandat di `agent-instructions.md` mengarahkan form pakai `<Form />`, `<FormField />`, `<FormItem />`, `<FormLabel />`, `<FormControl />`, `<FormMessage />`. Saat ini codebase belum memilikinya. Migrasinya menyentuh 4 form & menambah 1 file primitive. **Rekomendasi: dipisah ke sprint berikutnya** agar perubahan visual ini tidak ditumpuk dengan refactor pola form. Jika ingin dilakukan dalam sprint ini, eksekusi setelah UI-23/UI-24 dan tambahkan AC type-check.

---

## 6. Acceptance Criteria Global

Sprint dianggap selesai bila semua poin berikut tercapai:

### Kualitas Kode
- [ ] `bun run typecheck` → 0 errors.
- [ ] Tidak ada `any` baru tanpa `// NOTE: <reason>`.
- [ ] Tidak ada `axios.create()` baru di luar `shared/lib/`.
- [ ] Tidak ada `new WebSocket()` di luar `shared/lib/websocket.ts`.
- [ ] Tidak ada server data baru disimpan di Zustand.
- [ ] Semua import pakai alias `@/`.
- [ ] Semua query keys pakai `QueryKeys` factory.
- [ ] WS callback yang baru tetap dibungkus `useCallback`.
- [ ] Form baru/refactor tetap pakai RHF + Zod (tanpa `useState` manual untuk field).

### Visual & Brand
- [ ] Default load = dark theme dengan palette Spotify (hijau `#1DB954`, near-black `#121212`).
- [ ] Font display ter-load (Manrope atau setara) dan diaplikasikan ke heading + skor.
- [ ] Atmospheric backdrop muncul di public shell tanpa mengurangi keterbacaan.
- [ ] LIVE badge memakai pulse hijau (bukan destructive/merah).
- [ ] Score di `MatchCard` & `ScoreBoard` memakai `font-mono tabular-nums` dengan ukuran besar.
- [ ] AdminSidebar tampil sticky di lg+, drawer di mobile, fokus management benar (trap di drawer).
- [ ] ConnectionStatus terlihat di public dan admin shell.
- [ ] Toaster mengikuti tema gelap & accent hijau.

### A11y (target Lighthouse a11y ≥ 95, WCAG 2.1 AA)
- [ ] Skip-to-content link aktif via fokus.
- [ ] Setiap interactive non-button element punya role/label valid (sidebar items pakai `<a>`/`<Link>`).
- [ ] Form input tetap punya `aria-invalid`, `aria-describedby`, error punya `role="alert"`.
- [ ] Icon-only button punya `aria-label`.
- [ ] Pulse/auto-scroll disabled saat `prefers-reduced-motion: reduce`.
- [ ] Kontras teks ≥ 4.5:1 (verify `muted-foreground #B3B3B3` di atas `#181818` = 7.6:1 ✔).
- [ ] Drawer modal: fokus trap + ESC close.
- [ ] AlertDialog konfirmasi revoke API key fokus diawali ke "Cancel".

### Performance & Bundle
- [ ] Initial bundle ≤ 200KB gzip; per-route ≤ 80KB gzip (verifikasi via `vite build` & `bundlewatch` — jika belum terpasang, tambahkan task di backlog).
- [ ] Tidak menambah library berat (no framer-motion, no chart lib, no extra icon set).
- [ ] LCP target ≤ 2500ms p75 di corporate network.

### Behavior
- [ ] Navigasi tetap berfungsi seperti rute existing.
- [ ] Realtime via WS tetap bekerja (no regression di `useMatchLiveUpdates`).
- [ ] Auth flow & token refresh tidak tersentuh.
- [ ] Mutations (createMatch, createCommentary, createApiKey, deleteApiKey, login, logout, logoutAll) tetap fungsional.

---

## 7. Catatan Testing & Manual Review

### Otomatis
1. `bun run typecheck` setiap selesai 1 task.
2. `bun run build` di akhir setiap fase High/Medium untuk:
   - Verifikasi tree-shaking icons & font.
   - Cek total chunk size (manual hingga `bundlewatch` di-setup).
3. Jika `playwright` belum terpasang, dokumentasikan smoke-flow yang harus dites manual:
   - Buka `/`, ganti filter, scroll, klik card → `/matches/:id`.
   - Login → `/admin` → buat match → tambah commentary → cek live update.
   - `/admin/api-keys` → create → reveal → copy → revoke (AlertDialog).
   - Toggle theme; reload, pastikan tema persist.

### Manual A11y
1. Tab keyboard end-to-end pada setiap halaman (focus order, ring visible).
2. Test screen reader (NVDA atau VoiceOver) di:
   - ScoreBoard (live update diumumkan).
   - ConnectionStatus (state diumumkan saat berubah).
   - AlertDialog & Drawer (fokus trap).
3. Force `prefers-reduced-motion: reduce` lewat DevTools → pastikan pulse, ring fade, smooth scroll mati.
4. Cek kontras dengan axe DevTools / Lighthouse CI.
5. Coba viewport 360px, 768px, 1024px, 1440px — pastikan layout tidak overflow.

### Manual Visual
1. Bandingkan halaman dengan mood-board Spotify (gambar admin/dashboard) untuk konsistensi atmosfer.
2. Pastikan typografi heading (display) cukup tebal & ls-negatif, body tetap nyaman 14–15px.
3. Cek hover state semua card (lift + glow).
4. Pastikan LIVE pulse hanya muncul saat status `live`.

### Regression
1. Verifikasi WS reconnect skenario (backend mati 5 detik → kembali) — ConnectionStatus mengikuti.
2. Verifikasi token refresh saat 401 (axios interceptor) — tidak terpengaruh perubahan UI.
3. Verifikasi route lazy load (network tab → chunk per route).

---

## 8. Self-Review Terhadap `AGENTS.md`

| Aturan | Status di Plan |
|--------|----------------|
| Critical Rule #1–#7 (no secrets, apiClient, wsClient, TanStack/Zustand boundary, RHF+Zod, types lokasi) | ✅ Tidak diubah |
| Critical Rule #8 (feature self-contained) | ✅ Komponen baru ditempatkan sesuai feature/shared |
| Critical Rule #9 (no business logic in components) | ✅ Logic baru (live duration, kpi) di hooks |
| Critical Rule #10 (jangan ubah layer boundary tanpa update doc) | ⚠️ Ada penambahan UI primitives (`AlertDialog`, `Switch`) — sesuai pattern shadcn, tidak melanggar boundary; akan diupdate di `components.json` bila perlu |
| Critical Rule #11 (WS callback `useCallback`) | ✅ Tetap (hook existing tidak diubah substantif) |
| Critical Rule #12 (QueryKeys factory) | ✅ Hook baru pakai factory existing |
| Definition of Done — bullet-list | ✅ Semua dipetakan ke AC global |

### Update dokumentasi yang diperlukan setelah eksekusi

- `AGENTS.md` — tidak perlu update aturan baru; cukup update jika menambah primitive baru di Layer Rules Summary (catat: `shared/ui/` boleh berisi `alert-dialog.tsx`, `switch.tsx`, `separator.tsx`).
- `.ai-context/docs/architecture.md` — tambah catatan tentang `Backdrop`, `AdminSidebar`, dan sub-shell pattern di section "Folder Structure".
- `DESIGN.md` — tetap sumber truth; tidak perlu diubah, justru dikonfirmasi via implementasi.

---

## 9. Risiko & Mitigasi

| Risiko | Mitigasi |
|--------|----------|
| Bundle gzip melebihi 200KB karena font self-host + radix tambahan | Self-host hanya 4 weight Manrope (woff2), lazy-load weight 800 hanya di MatchDetail; radix `AlertDialog` & `Switch` < 4KB gzip masing-masing |
| CLS naik saat font swap | `font-display: swap` + `size-adjust` fallback; preload kritikal weight 400 & 700 |
| Auto-scroll commentary regresi UX | Implementasi "near-bottom detection" + tombol "New events"; tetap respect reduced-motion |
| AdminSidebar mobile drawer fokus trap salah | Pakai radix Dialog (sudah teruji), bukan implementasi manual |
| Pulse hijau LIVE memicu motion-sensitivity | Wrap `animate-pulse` dengan `motion-safe:` + `prefers-reduced-motion` global guard |
| Refactor `<table>` API Keys tanpa regresi sort/pagination | API Keys tidak punya pagination saat ini; cukup struktur ulang DOM tanpa ubah data flow |
| Default theme `dark` mengubah preferensi user yang sudah simpan `'light'` | Tetap baca `localStorage`; default `'dark'` hanya saat tidak ada nilai tersimpan |

---

## 10. Keputusan Desain (Confirmed)

### 1. Light Theme — **Dual Theme Support**
**Keputusan:** Buat biar bisa dua theme jangan dark only.

**Implementasi:**
- Default theme = `'dark'` saat first load (sesuai `DESIGN.md`).
- Tetap pertahankan toggle theme di header (`AppShell`).
- Respect `localStorage` — jika user pernah pilih light, simpan preferensi.
- Light theme palette: `--background: 0 0% 100%`, `--card: 0 0% 98%`, `--primary: 142 76% 41%` (hijau tetap), `--foreground: 0 0% 7%`.
- Dark theme palette: sesuai rencana (near-black + hijau Spotify).

**AC:**
- [ ] Toggle theme di header berfungsi (dark ↔ light).
- [ ] Preferensi tersimpan di `localStorage` dan di-restore saat reload.
- [ ] Kontras tetap ≥ 4.5:1 di kedua theme.
- [ ] Tidak ada hardcoded color — semua pakai CSS variables.

---

### 2. Font Loading — **Self-Host Kritikal Weight + Async Tambahan**
**Keputusan:** Sesuai rekomendasi — self-host kritikal weight, async untuk weight tambahan.

**Implementasi:**
- **Kritikal (preload)**: Manrope 400 (body) + 700 (heading) via `@fontsource/manrope`.
- **Async (lazy-load)**: Manrope 800 (display ultra-bold) — hanya di MatchDetail & ScoreBoard.
- **Mono**: JetBrains Mono 400 (system fallback jika tidak ter-load).
- Gunakan `font-display: swap` untuk mencegah FOUT (Flash of Unstyled Text).
- Total kritikal: ±20KB woff2; async: ±10KB.

**AC:**
- [ ] Kritikal font ter-load sebelum first paint (LCP ≤ 2500ms).
- [ ] CLS ≤ 0.1 saat font swap.
- [ ] Async font tidak memblok rendering.
- [ ] Bundle gzip tetap ≤ 200KB initial.

---

### 3. Migrasi shadcn `<Form />` (UI-28) — **Gabung dalam Sprint Ini**
**Keputusan:** Gabung aja (dalam sprint ini, bukan sprint terpisah).

**Implementasi:**
- Tambah primitive shadcn `<Form />`, `<FormField />`, `<FormItem />`, `<FormLabel />`, `<FormControl />`, `<FormMessage />` di `src/shared/ui/form.tsx`.
- Refactor 4 form sekaligus:
  - `CreateMatchForm.tsx`
  - `CreateCommentaryForm.tsx`
  - `LoginForm.tsx`
  - `CreateApiKeyDialog.tsx` (scope checkboxes → form fields)
- Eksekusi setelah UI-22 (API Keys table), sebelum UI-23.
- Tetap pakai RHF + Zod (tidak ada perubahan logic, hanya wrapper).

**AC:**
- [ ] Semua 4 form pakai `<Form />` wrapper.
- [ ] `aria-invalid`, `aria-describedby`, `role="alert"` tetap intact.
- [ ] `bun run typecheck` zero errors.
- [ ] Form behavior tidak berubah (submit, validation, error display).

---

### 4. `window.confirm` di Delete API Key — **Ganti ke AlertDialog (UI-21)**
**Keputusan:** Sesuai rekomendasi — ya, sekaligus bersama UI-21.

**Implementasi:**
- Tambah primitive radix `AlertDialog` di `src/shared/ui/alert-dialog.tsx`.
- Replace `window.confirm()` di `ApiKeysPage.tsx` dengan radix `AlertDialog`.
- Dialog title: "Revoke API Key?"
- Dialog description: "Are you sure you want to revoke '{keyName}'? This action cannot be undone."
- Buttons: "Cancel" (default focus), "Revoke" (destructive).
- Eksekusi bersama UI-21 (ScopeToggle).

**AC:**
- [ ] `window.confirm` dihapus dari codebase.
- [ ] AlertDialog muncul saat klik "Revoke".
- [ ] Fokus diawali ke "Cancel" button.
- [ ] ESC key menutup dialog (cancel).
- [ ] Revoke mutation hanya trigger saat klik "Revoke".

---

### 5. Brand Asset (Logo SVG) — **Generate Ikon Sederhana**
**Keputusan:** Kalau bisa generate coba saja.

**Implementasi:**
- Generate SVG sederhana: **lingkaran hijau Spotify (#1DB954) dengan monogram "SD"** (Sports Dashboard).
- Ukuran: 32×32px (favicon), scalable via `viewBox`.
- Simpan di `public/favicon.svg`.
- Gunakan di `index.html`: `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`.
- Fallback PNG 16×16 jika browser tidak support SVG favicon (opsional).

**SVG Template:**
```svg
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="15" fill="#1DB954"/>
  <text x="16" y="20" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#121212" text-anchor="middle">SD</text>
</svg>
```

**AC:**
- [ ] `public/favicon.svg` ada dan valid.
- [ ] `index.html` link ke favicon.
- [ ] Browser menampilkan favicon di tab.
- [ ] Favicon terlihat jelas di ukuran kecil (16×16, 32×32).

---

## 11. Updated Task List (dengan UI-28 & UI-21 Decisions)

| Prio | Task ID | Ringkasan | Catatan |
|------|---------|-----------|---------|
| **High** | UI-01 | Refactor design tokens (`index.css`) ke palette Spotify | Dual theme support |
| **High** | UI-02 | Default theme = dark, tetap pertahankan toggle | Dual theme |
| **High** | UI-03 | Load font display (Manrope kritikal + async) | Self-host + async |
| **High** | UI-04 | Rewrite `AppShell` — backdrop, BrandLogo, ConnectionStatus, skip-to-content | Favicon SVG |
| **High** | UI-05 | Rewrite `AdminShell` + `AdminSidebar` (desktop+mobile drawer) | — |
| **High** | UI-06 | Refactor `MatchStatusBadge` (LIVE = success/live, bukan destructive) | — |
| **High** | UI-07 | Redesign `MatchCard` (hero zone, mono score, hover lift) | — |
| **High** | UI-08 | Redesign `ScoreBoard` (mood gradient, mega score, live timer) | — |
| **High** | UI-09 | Tambah primitive `Skeleton` + `MatchCardSkeleton` + integrate di `MatchListPage` | — |
| **High** | UI-10 | Tambah `ConnectionStatus` shared component | — |
| **Medium** | UI-11 | Redesign `MatchListPage` (KPI strip, Live Now rail) | — |
| **Medium** | UI-12 | Redesign `Dashboard` (KPI cards, Live rail, quick actions) | — |
| **Medium** | UI-13 | Redesign `CommentaryTimeline` (timeline, sort terbaru, highlight WS) | — |
| **Medium** | UI-14 | Redesign `CommentaryItem` (event-color avatar, ikon) | — |
| **Medium** | UI-15 | Redesign `LoginForm` (split brand panel) | Akan refactor ke Form |
| **Medium** | UI-16 | Update `MatchFilterTabs` (pill style, counts, live dot) | — |
| **Medium** | UI-17 | Refactor `EmptyState` & `ErrorState` (slots, tones) | — |
| **Medium** | UI-18 | Update `LoadingState` (variants), `PageHeader` (eyebrow, breadcrumb) | — |
| **Medium** | UI-19 | Theme `<Toaster />` selaras Spotify | — |
| **Medium** | UI-20 | Update `index.html` (favicon, theme-color, meta description) | Favicon SVG |
| **Medium** | UI-21 | `CreateApiKeyDialog` — ScopeToggle + AlertDialog | AlertDialog confirmed |
| **Medium** | UI-22 | `ApiKeysPage` — table dark-friendly + status pill | — |
| **Medium** | UI-23 | Redesign `CreateMatchForm` (sectioned, sport select, inline error) | Akan refactor ke Form |
| **Medium** | UI-24 | Redesign `CreateCommentaryForm` (compact ScoreBoard context, eventType visual) | Akan refactor ke Form |
| **Medium** | **UI-28** | **Migrasi forms ke shadcn `<Form />` primitives** | **Gabung dalam sprint ini** |
| **Low** | UI-25 | Tambah `useDocumentTitle` + page-level title | — |
| **Low** | UI-26 | Tambah `useLiveDuration` hook (untuk ScoreBoard live timer) | — |
| **Low** | UI-27 | Tambah `useMatchKpis` (memo derive dari list) | — |

---

## 12. Updated Urutan Eksekusi

```
UI-01 → UI-02 → UI-03   (foundation + dual theme + font)
UI-04 → UI-05           (shells + favicon)
UI-06 → UI-07 → UI-08   (core public components)
UI-09 → UI-10 → UI-11   (list page polish)
UI-12 → UI-13 → UI-14   (dashboard + commentary)
UI-15 → UI-16 → UI-17 → UI-18 → UI-19 → UI-20  (sisa shared & polish)
UI-21 → UI-22           (api keys + AlertDialog)
UI-23 → UI-24 → UI-28   (forms refactor ke shadcn Form)
UI-25 → UI-26 → UI-27   (utilities)
```
