# Worklog – 2025‑11‑05 Interest Growth Explorer

## Operational goal
Deliver a single-page, static-yet-interactive simulator so students and self-learners can contrast simple vs. compound growth with precise math, contextual education, and CSV exports. Priorities: mathematical accuracy and visual clarity first, then accessibility (WCAG 2.1 AA) and a performance budget of LCP ≤ 2 s on 4G.

## User inputs
- `principal` – decimal ≥ 0 (soft guidance only), formatted in USD/CRC. Default: 1,000.
- `ratePercent` – per-period percentage, float between −100 and 1000. Default: 8.
- `periods` – integer months between 0 and 480 (0‑40 years). Default: 120.
- `compoundFrequency` – reinvestment events per period (1‑12). Default: 4 (quarterly within monthly periods).
- `contribution` – optional deposit per period, decimal ≥ 0 up to 100,000. Default: 100.
- `contributionsEnabled` – toggle that reveals the contribution field (off by default for clarity).
- `currency` – USD or CRC, affects formatting only.
- `locale` – English (default) or Spanish.

### Validation notes
- Every numeric field is clamped to the ranges above; errors are surfaced inline with localized copy.
- Contributions are ignored unless the toggle is enabled (prevents surprise deposits).
- Negative rates are allowed. Chart rendering truncates visuals at zero while calculations retain raw values.

## Outputs & calculations
- `periodSeries`: periods 0…n with simple and compound totals, per-period contributions applied, and cumulative contributions.
- KPI summary: final balances, total interest (principal + contributions split), total contributions, compound advantage, break-even period, effective annualized rates for both regimes.
- CSV export uses the same series data to stay in sync with the UI.

### Formulas (canonical)
- Simple: `A = P * (1 + r * t)` with contributions modelled as an arithmetic series. Interest component `I = P * r * t`.
- Compound: `A = P * (1 + r/n)^(n*t)` and `I = P * [(1 + r/n)^(n*t) - 1]`. Contributions follow a geometric series aligned with the compounding cadence.
- Contributions are applied after interest each period (conservative assumption) so both regimes stay comparable.

## Assumptions
- Period unit = month. Reinforcement frequency is nested inside each month (e.g., `compoundFrequency = 4` = quarterly compounding throughout each monthly period).
- No taxes, fees, or inflation adjustments.
- Double-precision floats are sufficient; rounding to 2 decimals occurs at display time only.
- `prefers-reduced-motion` disables chart/panel animations.
- Preferences (theme, language, currency) persist via `localStorage` when available.

## Preconditions / postconditions
- **Pre**: Valid inputs, loaded dictionaries, theme CSS variables applied.  
- **Post**: `simulateInterest` recomputes normalized input + series + summary → `SimulationShell` propagates results to metrics, charts, tables, and export status.

## Invariants
- `periodSeries.length = periods + 1` (includes period 0).
- Simple/compound totals rendered to the user never drop below 0 (visual clamp), even if raw math is negative.
- Charts, tables, and CSV share one data source; there is no duplicated business logic.
- Both locales expose parallel keys in `frontend/lib/i18n/dictionaries.ts`.

## Covered edge cases
- `ratePercent = 0` → flat curves, zero interest.
- `periods = 0` → final = principal (+ contribution from period 0 if toggled, though UI keeps toggle off by default).
- `ratePercent < 0` → descending balances with clamped visuals.
- `contribution = 0` → series reduces to principal-only paths.
- `principal = 0` but contributions enabled → growth starts at period 1 when the first deposit occurs.
- `compoundFrequency = 1` → compound falls back to one reinvestment per period.

## Risks & mitigation
- **Bundle > 200 KB** → custom SVG charts (no charting libs) and deferred educational content keep JS budget low.
- **User misinterprets charts** → neutral copy, legal disclaimers, and new Learning Hub sections clarify limitations.
- **Accessibility regressions** → focus-visible styles, aria-live messages for exports, `prefers-reduced-motion` compliance tested manually.
- **Scrollbar jumpiness** → the Learning Hub now has a fixed-height inner scroll region so its track does not resize mid-scroll.

## Verification metrics
- Numerical cases mirrored in `frontend/tests/casos_matematicos/interest-calculator.test.ts` (10% example, zero rate, negative rate, contributions on/off).
- `pnpm --dir frontend test` + `pnpm --dir frontend type-check` must pass before exporting.
- Static export validated by `pnpm --dir frontend build` producing `frontend/out` without warnings.

## UX/UI decisions (current release)
- **Palette**: Dual theme. Default dark palette leans on purples/teals; light palette uses muted greens/greys. Theme variables live in `app/globals.css` (`[data-theme]` tokens).  
- **Floating controls**: Theme and language toggles follow the viewport (top-left) to stay accessible at any scroll depth.  
- **Hero adjustments**: Primary CTA removed to keep focus on simulation; headline relocated per user feedback.  
- **Summary cards**: Each card maintains its own horizontal scroll to prevent long numbers from overlapping neighbors.  
- **Learning Hub**: Height reduced by 50% with its own scroll container to shorten the main document.  
- **Exports**: Only CSV remains (PNG removed) to simplify UI.  
- **Charts**: Stroke width reduced to 2 px, horizontal overflow enabled, and a single top-aligned Y-axis label highlights the max value.

## Implementation snapshot
- `frontend/lib/interest-calculator.ts`: sanitizes/clamps inputs, computes canonical formulas, tracks contributions separately for summary KPIs.  
- `frontend/components/simulation/simulation-shell.tsx`: orchestrates form state, validation, results rendering, and export feedback.  
- `frontend/components/simulation/growth-charts.tsx`: responsive SVG charts with overflow guards, scroll wrappers, and accessible labels.  
- `frontend/components/ui/floating-controls.tsx`: sticky action cluster (theme + language) that reuses existing toggle handlers.  
- `frontend/components/simulation/export-controls.tsx`: CSV-only export button with aria-live feedback.  
- `frontend/tests/casos_matematicos/interest-calculator.test.ts`: canonical reference cases.

## Open items / backlog
1. Optional analytics integration (Plausible/Umami) guarded by a feature flag.  
2. Add component tests for the form (validation states) and export controls.  
3. Automated Lighthouse reports in CI to monitor performance budgets.  
4. Evaluate CMS-backed content for the Learning Hub if educators need to update copy frequently.
