---
title: Simplify Frontend Styling and Remove Taste Layer
type: decision
status: accepted
created: 2026-08-06
tags: [adr, frontend, taste, styling]
---

# 0007 — Simplify Frontend Styling and Remove Taste Layer

## Context

The `taste/` layer and related skills (`design-pattern`, `form-dialog`) and workflows (`frontend-ux-change`) introduced substantial complexity to the Context Factory. Managing separate design-taste maps, worksheets, and component contracts was overhead. Instead of separate complex modules, we need a single, clear, general frontend style rule and a simple playground where custom styling skills can be developed and refined.

## Options considered

1. Keep the `taste/` layer and simplify the worksheets. This does not address the core complexity of multiple folders and resolver rules.
2. Remove the design-taste layer entirely, replace design/styling workflows/skills with a single general styling rule (`@rules/frontend`), and introduce a playground directory (`skills/playground/`) for crafting custom styling skills.

## Decision

Adopt option 2. Delete the `taste/` directory and related maps. Delete the `design-pattern` and `form-dialog` skills and `frontend-ux-change` workflow. Create a general `@rules/frontend` rule in `rules/frontend/frontend.md` covering typography, color, spacing, layout, responsiveness, table of fonts, and motion. Create `skills/playground/` as a home for custom crafting skills.

## Consequences

- The context factory is simplified, reducing disk footprint and resolution overhead.
- Frontend UX change requests route to `feature-delivery`.
- Developers use `@rules/frontend` as the baseline styling guide and write custom playground skills to avoid generic LLM design output.
- `docs/decisions/0006-design-taste-layer.md` is superseded by this record.
