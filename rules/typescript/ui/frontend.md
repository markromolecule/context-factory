---
ruleId: cf-rule-ts-frontend-craftsmanship
name: frontend
description: Enforce styling guidelines for typography, color, spacing, layout, responsiveness, and motion to eliminate generic LLM styling and ensure premium craftsmanship.
scope: All frontend UI styling, typography, colors, layouts, and animations.
stack: typescript
appliesTo: ["src/**/components/**/*.tsx", "src/**/styles/**/*.css", "app/**/*.tsx", "app/**/*.css"]
layers: ["ui", "components"]
alwaysApply: false
---

# Frontend Styling and Craftsmanship

This rule defines the core guidelines for frontend styling. It replaces generic LLM styling clichés with a consistent, premium design system built on strict scales, semantic tokens, and purposeful motion.

## Anti-Patterns to Avoid

- [directive:ts.frontend.no-oversaturated-blue][mode:automated-blocking][verifier:linter] **Oversaturated blues** — no raw/default blue accents (`#0000ff`, untouched Tailwind `blue-500`); accents must come from the curated palette.
- [directive:ts.frontend.no-neon-button-glow][mode:automated-blocking][verifier:linter] **Neon button glows** — no bright drop-shadows or glow effects on interactive elements.
- [directive:ts.frontend.no-generic-template-cards][mode:advisory][verifier:none] **Generic template cards** — no unstyled default "card" boilerplate (white box, `rounded-lg`, `shadow-md`, nothing else distinguishing it).
- [directive:ts.frontend.no-decorative-animation][mode:advisory][verifier:none] **Decorative animation** — no looping, bouncing, or attention-seeking motion that isn't tied to a user action or state change.

## Typography

### Scale & Hierarchy
- [directive:ts.frontend.typographic-scale][mode:evidence-blocking][verifier:human-evidence] Use a strict typographic scale based on a major third (1.25) or minor third (1.20) for font sizes.
- [directive:ts.frontend.standard-heading-hierarchy][mode:evidence-blocking][verifier:human-evidence] Limit headings to standard levels; distinguish them clearly through size, weight, and tracking.

### Line Length & Line Height
- [directive:ts.frontend.body-copy-line-length][mode:advisory][verifier:none] Body copy: 60–75 characters per line (30–45ch for multi-column layouts).
- [directive:ts.frontend.line-height-discipline][mode:advisory][verifier:none] Line height — Headings: `1.1`–`1.25`. Body: `1.5`–`1.65`. Small text/buttons: `1.25`–`1.4`.

### Letter Spacing (Tracking)
- [directive:ts.frontend.tracking-discipline][mode:advisory][verifier:none] Large headlines (≥ 24px): reduce slightly, e.g. `-0.02em`. Small uppercase text (≤ 12px): increase slightly, e.g. `0.05em`–`0.1em`.

### Font Stack

| Role | Default Font Stack | Weights | Tracking / Leading | Constraints |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Headings** | System Sans, Inter, system-ui | 600, 700 | `-0.02em` / `1.2` | Never use thin/light weights for large headings. |
| **Body** | System Sans, -apple-system, BlinkMacSystemFont, Segoe UI | 400, 500 | `normal` / `1.6` | Keep line length readable (60–75ch). |
| **Code / Monospace** | SFMono-Regular, Consolas, Liberation Mono, Menlo | 400 | `normal` / `1.4` | Use for code blocks, logs, numeric data. |
| **Interactive / UI** | System Sans, Inter, system-ui | 500, 600 | `0.02em` / `1.25` | Keep text concise; capitalize consistently. |

- [directive:ts.frontend.system-font-stack][mode:evidence-blocking][verifier:human-evidence] Adhere to standardized system font stack and weight constraints.

## Color

### Palette
- [directive:ts.frontend.curated-palette][mode:evidence-blocking][verifier:human-evidence] Define a curated palette: one dominant neutral, one primary brand accent, and selective semantic colors (success, warning, error, info).
- [directive:ts.frontend.no-raw-css-colors][mode:automated-blocking][verifier:linter] Avoid raw CSS colors (e.g. `blue`, `#0000ff`).

### Token Layers
- **Primitive** — base colors mapped to raw color codes.
- **Semantic** — purpose-driven tokens (`color-bg-base`, `color-text-body`, `color-border-subtle`).
- **Component** — component-specific overrides using semantic tokens.
- [directive:ts.frontend.layered-color-tokens][mode:evidence-blocking][verifier:human-evidence] Organize colors into primitive, semantic, and component token layers.

### Contrast & Dark Mode
- [directive:ts.frontend.wcag-contrast-minimum][mode:automated-blocking][verifier:test] Minimum contrast: 4.5:1 for normal body text, 3:1 for large text (≥ 18pt / 24px) — WCAG AA.
- [directive:ts.frontend.css-variables-dark-mode][mode:evidence-blocking][verifier:human-evidence] Dark mode must use CSS variables; prefer deep dark grays/slates over pure black (`#000`) to avoid glare while preserving contrast.

### Status Indicators
- [directive:ts.frontend.no-color-alone-for-status][mode:automated-blocking][verifier:test] Never rely on color alone to indicate status — pair with text labels, icons, or patterns.

## Layout & Spacing

### Grid System
- [directive:ts.frontend.eight-px-grid][mode:evidence-blocking][verifier:human-evidence] Align all layouts to an 8px grid (4px sub-grid for tight spacing). Margins, paddings, gaps, and sizes must be multiples of 4px or 8px.

### Responsive Breakpoints
- **Mobile** (`< 640px`) — single column, full-width elements, tap targets ≥ 44×44px.
- **Tablet** (`640–1024px`) — multi-column where appropriate, adjusted margins.
- **Desktop** (`≥ 1024px`) — constrained max container width (typically 1200–1400px).
- [directive:ts.frontend.responsive-breakpoints][mode:evidence-blocking][verifier:human-evidence] Enforce responsive breakpoints with mobile-first base styles and tap target constraints.

### Layout Method
- [directive:ts.frontend.mobile-first-layout][mode:evidence-blocking][verifier:human-evidence] Design mobile-first: base styles for mobile, `min-width` media queries add complexity for larger screens. Use CSS Grid for overall page layout and multi-dimensional grids; use Flexbox for linear, one-dimensional alignment.

## Motion

### Purpose
- [directive:ts.frontend.purposeful-motion-only][mode:advisory][verifier:none] Use transitions/animation only to guide attention, establish spatial relationships, or confirm user actions. Avoid decorative or looping motion.

### Durations
- [directive:ts.frontend.bounded-animation-durations][mode:advisory][verifier:none] Simple hover/active states: `150–200ms` (ease-in-out or cubic-bezier). Dialogs/drawers opening: `250–350ms` (ease-out / deceleration curve). Complex screen transitions: `300–400ms`.

### Properties
- [directive:ts.frontend.performant-animation-properties][mode:automated-blocking][verifier:linter] Limit transitions to performant properties (`transform`, `opacity`). Avoid animating layout properties (`height`, `width`, `margin`, `top`) — they trigger reflows.

### Reduced Motion
- [directive:ts.frontend.respect-reduced-motion][mode:automated-blocking][verifier:test] Wrap all animations in `@media (prefers-reduced-motion: reduce)` to disable or simplify motion for users who request it.