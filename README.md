# Interest Growth Explorer

Static, bilingual Next.js 14 App Router experience that explains the difference between simple and compound growth. Everything is pre-rendered and exported to `frontend/out`, so the app can be hosted on Vercel’s free plan (or any static CDN) without runtime servers or external APIs.

## Highlights
- **User inputs**: initial capital, per-period return, number of periods (months), reinvestment frequency, optional contributions, currency (USD/CRC), and language (EN/ES). Form validation clamps every field to documented limits and announces errors via ARIA attributes.
- **Deterministic math engine**: `frontend/lib/interest-calculator.ts` applies canonical formulas for principal and contributions, serves the charts/tables/exporters, and is covered by Vitest cases under `frontend/tests/casos_matematicos`.
- **Accessible data viz**: SVG charts compare balances and show the compound advantage gap. Animations respect `prefers-reduced-motion`, and the table/export CSV provide a fallback for screen readers.
- **Educational content**: long-form explanations (FAQ, glossary, myths, performance targets) load in progressive batches with their own scroll container to keep the main page compact.
- **No trackers / no cookies**: only `localStorage` is used to remember theme, language, and currency preferences.

## Prerequisites
- Node.js ≥ 20.10 (enable with `corepack enable` if needed).
- pnpm ≥ 9.
- Optional: `just` for local task orchestration and Vercel CLI for `vercel deploy --prebuilt`.

## Quick start
```powershell
pnpm install
pnpm --dir frontend dev
# visit http://localhost:3000
```

If you need environment hints (all public), copy `.env.example` to `.env`. No secrets are required for production.

## Key scripts
| Task | Command |
| --- | --- |
| Local dev (HMR) | `pnpm --dir frontend dev` |
| Lint | `pnpm --dir frontend lint` |
| Type-check | `pnpm --dir frontend type-check` |
| Unit tests | `pnpm --dir frontend test` |
| Static export | `pnpm --dir frontend build` → outputs `frontend/out` |
| Full verification | `pnpm --dir frontend lint && pnpm --dir frontend type-check && pnpm --dir frontend test && pnpm --dir frontend build` (or `just verify`) |

All commands are run from the repo root unless stated otherwise.

## Development workflow
1. `pnpm --dir frontend dev`
2. Update form logic, charts, or content blocks. Hot reloading recalculates the simulation instantly.
3. Toggle theme/language via the floating controls; state persists across reloads.

### Built-in validation
- Numeric inputs follow the limits listed in `docs/worklog/2025-11-05-interest-comparison.md`.
- Each field exposes `aria-invalid`/`aria-describedby` bindings with localized helper text.
- Empty periods, rate = 0, or blocked inputs show contextual banners instead of rendering stale datasets.

## Build & deployment
```powershell
pnpm --dir frontend build
pnpm dlx serve frontend/out   # optional: preview static export locally
```

Vercel configuration:
- Install Command → `pnpm install`
- Build Command → `pnpm --dir frontend build`
- Output Directory → `frontend/out`

Any static host that serves `frontend/out` from the root will work.

## Project layout
```
frontend/
  app/             # App Router entry, layouts, providers
  components/      # Simulation form, charts, summary cards, floating controls, educational content
  lib/             # Interest calculator, exporters, formatters, i18n helpers, hooks
  tests/           # Vitest suites (math reference cases)
docs/
  architecture/    # System overview for the static build
  worklog/         # Domain assumptions, validation ranges, UX decisions
```

## Performance & accessibility targets
- **LCP** ≤ 2 seconds on mid-range mobile over 4G.
- **Initial JS** ≤ 200 KB gzip by using bespoke SVG charts.
- **Input/device support**: keyboard navigation, visible focus, aria-live feedback for exports, scroll containers with inertial physics disabled when `prefers-reduced-motion` is set.
- **Internationalization**: English is the default; Spanish mirrors every string to avoid mixed-language states.

## Export options
- **CSV**: `ExportControls` downloads a full period-by-period dataset with localized headers and currency formatting.
- The PNG export button was intentionally removed to keep the surface minimal for this release.

## Troubleshooting
- pnpm can’t be found → `corepack prepare pnpm@latest --activate` or install pnpm globally.
- Styles missing → confirm `tailwind.config.ts` `content` globs and `app/globals.css` imports.
- Charts look static → check OS/browser `prefers-reduced-motion` or verify that inputs are within range.
- Scroll area “jumps” → the Learning Hub section pre-measures its height; if you edited copy, keep the inner container with `overflow-y-auto` so the scrollbar has a fixed track.

## Future enhancements
1. Optional analytics with privacy-friendly tools (Plausible/Umami/Vercel Analytics) gated behind a feature flag.
2. Component-level tests (React Testing Library) for the form and export panel.
3. Automated Lighthouse run in CI to guard the performance budget.
4. Potential CMS wiring for the educational content if more locales are needed.

---

Maintained as a teaching tool: keep messaging neutral (no promises of returns) and avoid storing user data beyond preferences.
