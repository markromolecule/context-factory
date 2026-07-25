---
name: design-pattern
description: Define, document, apply, or review accessible visual design systems and responsive web interfaces, including personality, typography, color, spacing, layout, component states, imagery, iconography, motion, and design tokens. Use for visual-system worksheets, style guides, brand-to-interface translation, new pages or components, dashboards, landing pages, redesigns, and UI quality reviews in CSS, Tailwind, Figma, React, Next.js, Astro, or HTML projects.
---

# Design Interface Patterns

## Workflow

1. Inspect the product goal, audience, content, existing brand/system, implementation stack, reference interfaces, and accessibility baseline.
2. Choose the task mode: define a system, apply an established system, or review conformance.
3. Identify the primary user goal and information hierarchy before choosing visual treatments.
4. Reuse established tokens and components unless the user explicitly authorizes a system change.
5. When defining or materially extending a system, read `references/design-system-worksheet.md` and resolve its decisions. If inputs are missing, state reversible assumptions and leave brand-specific worksheet fields open.
6. When no system exists and a complete worksheet is unnecessary, read `references/visual-system.md` for safe baseline defaults.
7. Implement or specify mobile-first structure, semantic behavior, complete component states, dark mode where required, and reduced motion.
8. Verify visual consistency, responsive behavior, contrast, keyboard/focus behavior, content fit, and token reuse.

## Output contract

For a design-system definition, return or create:

- a completed or fillable worksheet with decisions, assumptions, and unresolved fields clearly distinguished;
- primitive, semantic, and component token layers with stable names;
- typography, color, spacing/layout, shape/elevation, imagery/iconography, motion, and voice rules;
- representative component state examples;
- stack-specific implementation mapping only for the user's stack, or stack-neutral CSS custom properties when none is known;
- accessibility and responsive verification criteria.

For application or review work, name the governing tokens and system rules, record justified exceptions, and do not redesign unrelated surfaces.

## Decision rules

- Prefer one strong visual idea over many unrelated effects.
- Translate personality words into observable choices; never use mood labels as sufficient specifications.
- Use reference brands or sites as directional evidence, not as assets to copy.
- Preserve product conventions unless the task explicitly requests a redesign.
- Keep body copy near 65–75 characters per line.
- Use color to reinforce hierarchy, never as the only status signal.
- Define loading, empty, error, disabled, hover, focus, and active states where applicable.
- Prefer semantic tokens in components; do not scatter raw colors, spacing values, or shadows through implementation.
- Keep token names role-based (`color-action-primary`) rather than appearance-based (`blue-500`) at the semantic layer.
- Avoid decorative motion that obscures task completion or violates reduced-motion preferences.
- Do not add a UI library only to obtain one component.
