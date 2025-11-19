# System Architecture (Static View)

## Runtime layers
- **Rendering (Next.js 14 App Router)**  
  - Static export via `next.config.mjs` (`output: "export"`) so every route is produced ahead of time inside `frontend/out`.  
  - TailwindCSS powers the design tokens defined in `app/globals.css` and referenced through utility classes.  
  - All data dependencies live in the repo (TS dictionaries, markdown content); there are no runtime fetches.  
  - Feature flags are injected through the public env var `NEXT_PUBLIC_FEATURE_FLAGS` and read on the client.
- **Execution environments**  
  - `pnpm --dir frontend dev` runs the dev server with HMR.  
  - `pnpm --dir frontend build` renders the static bundle that can be hosted on Vercel, Netlify, or any CDN.  
  - There is no backend or database: inputs stay client-side and only preferences hit `localStorage`.
- **Quality gates**  
  - ESLint, TypeScript, and Vitest guard regressions.  
  - Optional Justfile/VS Code tasks run lint → type-check → tests → build locally.  
  - (Pending) CI can reuse the same pnpm commands to validate pull requests.

## Core flows
1. **User simulation** → `SimulationForm` sanitizes values → `simulateInterest` returns sanitized inputs, the per-period series, and summary metrics → charts/tables/export panel consume the shared result.  
2. **Internationalization & theming** → Providers in `app/providers.tsx` set up React contexts; floating controls call the same hooks to toggle theme/language regardless of scroll position.  
3. **Educational content** → `EducationalContent` lazily reveals sections while retaining a fixed-height scroll container, ensuring the main document height stays predictable.  
4. **Export** → `ExportControls` generates CSV text via `generateSeriesCsv`, then triggers a client-side download (PNG export was removed for this release).

## Modules of interest
- `frontend/lib/interest-calculator.ts`: clamps inputs, applies canonical formulas (simple vs compound, including optional contributions), and exposes helper types for the charts and KPI cards.
- `frontend/components/simulation/growth-charts.tsx`: custom SVG renderer with reduced-motion fallbacks, horizontal overflow guards, and a single high-contrast Y-axis label.
- `frontend/components/ui/floating-controls.tsx`: sticky language/theme toggles anchored to the top-left corner, ensuring accessibility shortcuts remain visible while scrolling.
- `frontend/lib/i18n`: static dictionaries in English and Spanish plus context helpers to keep text in sync.
- `frontend/lib/exporters.ts`: CSV writer + text download helper used by the export panel and ready for future integrations (e.g., clipboard copy).

## Observability & metrics
- Core Web Vitals should be checked with Lighthouse/WebPageTest before new releases; the repo keeps the target budgets (LCP ≤ 2 s on 4G, JS payload ≤ 200 KB gzip).  
- Console logging is limited to development; production build emits no analytics or trackers by design.  
- If additional monitoring is needed, integrate a static analytics snippet behind a feature flag to preserve privacy guarantees.

## Future extensions
- Document ADRs for any data-source changes (e.g., wiring a CMS for the Learning Hub).  
- Add Playwright smoke tests once high-value flows (exporting CSV, toggling language, switching themes) become part of the release checklist.  
- Automate cache invalidation/Webhooks if the static export is deployed outside Vercel.
