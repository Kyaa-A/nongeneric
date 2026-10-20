# Design System — NonGeneric (`knightvision-editorial-telemetry`)

## 1. Aesthetic World & Atmosphere
- **World ID**: `knightvision-editorial-telemetry`
- **Lineage**: *New In Chess* print monographs, Swiss Federal Railways (*Kursbuch*) exposed hairline grids, and live Stockfish 19 NNUE tactical evaluation overlays.
- **Atmosphere**: Warm archival paper ground contrasted with deep obsidian ink, exposed 1px structural hairlines, italic editorial serif emphasis, and tabular monospace telemetry bars in emerald (`1ST`) and amber (`2ND`).

## 2. OKLCH Color System
| Token | OKLCH Value | Role |
| :--- | :--- | :--- |
| `--ng-ground-primary` | `oklch(0.975 0.008 80)` | Primary warm archival paper canvas |
| `--ng-ground-elevated` | `oklch(0.992 0.004 80)` | Elevated instrument card surface |
| `--ng-ink-primary` | `oklch(0.16 0.01 75)` | Primary obsidian headline & body ink |
| `--ng-ink-secondary` | `oklch(0.36 0.015 75)` | Supporting prose & specification labels |
| `--ng-ink-muted` | `oklch(0.5 0.015 75)` | Muted metadata & inactive hints |
| `--ng-accent-emerald` | `oklch(0.56 0.16 148)` | Primary candidate / healthy telemetry signal |
| `--ng-accent-amber` | `oklch(0.66 0.16 70)` | Secondary candidate / warning telemetry signal |
| `--ng-border-hairline` | `oklch(0.86 0.012 80)` | Exposed 1px architectural hairline rule |

## 3. Tri-Voice Typography
- **Display & UI Voice**: `'Bricolage Grotesque'`, tight tracking (`-0.028em` on H1), `line-height: 1.06`, `text-wrap: balance`.
- **Editorial Emphasis Voice**: `'Newsreader'` italic (`font-style: italic; font-weight: 500`) for focal conceptual contrast within headlines.
- **Telemetry & Shortcut Voice**: `'JetBrains Mono'` with mandatory `font-variant-numeric: tabular-nums` for evaluation percentages, centipawn deltas, and keycap pills (`Q`, `E`, `Alt+A`).

## 4. GSAP Motion Grammar
- **Primary Ease**: `power3.out` (`cubic-bezier(0.22, 1, 0.36, 1)`).
- **Entrance**: Masked `SplitText` line rise (`yPercent: 108 -> 0`, `stagger: 0.065`) overlapped with `scaleX` candidate bar fills.
- **Accessibility**: `gsap.matchMedia()` + `@media (prefers-reduced-motion: reduce)` collapses all spatial travel into instant state transitions.
