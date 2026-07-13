---
name: design-pattern
description: Design or review accessible, responsive web interfaces with coherent visual tokens, hierarchy, interaction states, dark mode, and reduced motion. Use for new pages, components, dashboards, landing pages, visual redesigns, or UI quality reviews in React, Next.js, Astro, or HTML/CSS projects.
---

# Design Interface Patterns

## Workflow

1. Inspect the product context, existing component system, framework, and accessibility baseline.
2. Identify the page's primary user goal and information hierarchy before styling.
3. Reuse established tokens/components. If none exist, apply the baseline in `references/visual-system.md`.
4. Design mobile-first structure, then expand at content-driven breakpoints.
5. Implement semantic landmarks, keyboard behavior, focus management, and complete states.
6. Verify at 375px and desktop widths, light/dark themes, keyboard-only input, and reduced motion.

## Decision rules

- Prefer one strong visual idea over many unrelated effects.
- Preserve product conventions unless the task explicitly requests a redesign.
- Keep body copy near 65–75 characters per line.
- Use color to reinforce hierarchy, never as the only status signal.
- Define loading, empty, error, disabled, hover, focus, and active states where applicable.
- Avoid decorative motion that obscures task completion or violates reduced-motion preferences.
- Do not add a UI library only to obtain one component.

Read `references/visual-system.md` when the project lacks a design system or when creating/reviewing tokens and component interaction details.
